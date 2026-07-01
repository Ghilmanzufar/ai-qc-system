export const warpImage = async (capturedDataUrl, masterImageUrl) => {
    return new Promise((resolve, reject) => {
        if (typeof cv === 'undefined') {
            reject(new Error("OpenCV.js belum diload"));
            return;
        }

        const imgMaster = new Image();
        const imgCaptured = new Image();
        
        let masterLoaded = false;
        let capturedLoaded = false;

        // Fungsi untuk membuat topeng (masking) yang hanya membungkus part (benda hitam).
        // Ini memastikan titik fitur di lantai ubin / meja terabaikan.
        const createObjectMask = (srcGray) => {
            let mask = new cv.Mat.zeros(srcGray.rows, srcGray.cols, cv.CV_8UC1);
            let thresh = new cv.Mat();
            // Thresholding untuk mengubah benda gelap (part) jadi putih, background terang jadi hitam
            cv.threshold(srcGray, thresh, 0, 255, cv.THRESH_BINARY_INV + cv.THRESH_OTSU);
            
            // Opsional: bersihkan titik-titik noise kecil (Erode/Dilate)
            let M = cv.Mat.ones(5, 5, cv.CV_8U);
            cv.morphologyEx(thresh, thresh, cv.MORPH_CLOSE, M);
            cv.morphologyEx(thresh, thresh, cv.MORPH_OPEN, M);
            M.delete();

            let contours = new cv.MatVector();
            let hierarchy = new cv.Mat();
            cv.findContours(thresh, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
            
            let maxArea = 0;
            let maxContourIdx = -1;
            for (let i = 0; i < contours.size(); ++i) {
                let area = cv.contourArea(contours.get(i));
                if (area > maxArea) {
                    maxArea = area;
                    maxContourIdx = i;
                }
            }
            
            // Jika kontur terbesar (diasumsikan part) ditemukan, lukis ke mask
            if (maxContourIdx !== -1 && maxArea > 1000) {
                let color = new cv.Scalar(255);
                cv.drawContours(mask, contours, maxContourIdx, color, -1, cv.LINE_8, hierarchy, 0);
            } else {
                // Fallback: anggap seluruh gambar valid jika kontur tidak jelas
                mask.setTo(new cv.Scalar(255));
            }
            
            thresh.delete();
            contours.delete();
            hierarchy.delete();
            
            return mask;
        };

        const processImages = () => {
            if (!masterLoaded || !capturedLoaded) return;
            
            let srcMat = null;
            let masterMat = null;
            let srcGray = null;
            let masterGray = null;
            let orb = null;
            let keypoints1 = null;
            let keypoints2 = null;
            let descriptors1 = null;
            let descriptors2 = null;
            let bf = null;
            let matches = null;
            let goodMatches = null;
            let srcPtsMat = null;
            let dstPtsMat = null;
            let homography = null;
            let warpedMat = null;
            
            try {
                // 1. Read images to cv.Mat
                srcMat = cv.imread(imgCaptured);
                masterMat = cv.imread(imgMaster);

                // 2. Convert to grayscale
                srcGray = new cv.Mat();
                masterGray = new cv.Mat();
                cv.cvtColor(srcMat, srcGray, cv.COLOR_RGBA2GRAY);
                cv.cvtColor(masterMat, masterGray, cv.COLOR_RGBA2GRAY);

                // 2.5 Buat Mask (Hanya area objek saja)
                let srcMask = createObjectMask(srcGray);
                let masterMask = createObjectMask(masterGray);
                
                // 3. Detect features (ORB) dengan parameter lebih agresif (1000 features)
                orb = new cv.ORB(1000);
                keypoints1 = new cv.KeyPointVector();
                keypoints2 = new cv.KeyPointVector();
                descriptors1 = new cv.Mat();
                descriptors2 = new cv.Mat();
                
                // Masukkan mask ke parameter kedua, agar ORB buta terhadap background!
                orb.detectAndCompute(srcGray, srcMask, keypoints1, descriptors1);
                orb.detectAndCompute(masterGray, masterMask, keypoints2, descriptors2);

                // Hapus memori mask
                srcMask.delete();
                masterMask.delete();

                if (keypoints1.size() === 0 || keypoints2.size() === 0) {
                    throw new Error("Tidak menemukan fitur pada gambar.");
                }

                // 4. Match features
                bf = new cv.BFMatcher(cv.NORM_HAMMING, true);
                matches = new cv.DMatchVector();
                bf.match(descriptors1, descriptors2, matches);

                // 5. Filter good matches
                let matchesArray = [];
                for (let i = 0; i < matches.size(); i++) {
                    // Hanya ambil match dengan jarak Hamming yang cukup baik (< 60)
                    if (matches.get(i).distance < 60) {
                        matchesArray.push(matches.get(i));
                    }
                }
                
                // Sort by distance
                matchesArray.sort((a, b) => a.distance - b.distance);
                
                // Keep top matches, max 100
                const numGoodMatches = Math.min(matchesArray.length, 100);
                
                // Jika titik cocok terlalu sedikit, anggap objek berbeda atau tidak dikenali
                if (numGoodMatches < 15) {
                    throw new Error("Pencocokan terlalu sedikit, objek mungkin berbeda. Fallback ke gambar asli.");
                }

                goodMatches = matchesArray.slice(0, numGoodMatches);

                // 6. Extract point coordinates
                let srcPoints = [];
                let dstPoints = [];
                for (let i = 0; i < goodMatches.length; i++) {
                    srcPoints.push(keypoints1.get(goodMatches[i].queryIdx).pt.x, keypoints1.get(goodMatches[i].queryIdx).pt.y);
                    dstPoints.push(keypoints2.get(goodMatches[i].trainIdx).pt.x, keypoints2.get(goodMatches[i].trainIdx).pt.y);
                }

                srcPtsMat = cv.matFromArray(goodMatches.length, 1, cv.CV_32FC2, srcPoints);
                dstPtsMat = cv.matFromArray(goodMatches.length, 1, cv.CV_32FC2, dstPoints);

                // 7. Find Homography dengan RANSAC threshold yang lebih ketat (3.0 pixels)
                homography = cv.findHomography(srcPtsMat, dstPtsMat, cv.RANSAC, 3.0);
                if (homography.empty()) {
                    throw new Error("Gagal menghitung matriks Homography.");
                }

                // VALIDASI HOMOGRAPHY
                // Cek determinan dari matriks 2x2 rotasi/skala untuk menghindari gambar "gepeng" atau "terbalik"
                // homography format: 3x3 double matrix (CV_64F)
                const h00 = homography.doubleAt(0, 0);
                const h01 = homography.doubleAt(0, 1);
                const h10 = homography.doubleAt(1, 0);
                const h11 = homography.doubleAt(1, 1);
                
                const det = (h00 * h11) - (h01 * h10);
                
                // Jika determinan negatif (terbalik) atau terlalu kecil/besar (distorsi ekstrem)
                if (det < 0.2 || det > 5.0) {
                    throw new Error(`Distorsi ekstrem terdeteksi (Det: ${det.toFixed(2)}). Objek mungkin sangat berbeda letaknya. Fallback ke gambar asli.`);
                }

                // 8. Warp Perspective
                warpedMat = new cv.Mat();
                const dsize = new cv.Size(masterMat.cols, masterMat.rows);
                cv.warpPerspective(srcMat, warpedMat, homography, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());

                // 9. Convert warped Mat back to DataURL
                const canvas = document.createElement('canvas');
                cv.imshow(canvas, warpedMat);
                const warpedDataUrl = canvas.toDataURL('image/jpeg', 0.9);

                resolve(warpedDataUrl);
            } catch (err) {
                console.warn("Warping failed:", err);
                // Kembalikan gambar asli jika gagal warp (fallback sesuai request user)
                resolve(capturedDataUrl);
            } finally {
                // Memory cleanup (sangat penting di WebAssembly/OpenCV)
                if (srcMat) srcMat.delete();
                if (masterMat) masterMat.delete();
                if (srcGray) srcGray.delete();
                if (masterGray) masterGray.delete();
                if (orb) orb.delete();
                if (keypoints1) keypoints1.delete();
                if (keypoints2) keypoints2.delete();
                if (descriptors1) descriptors1.delete();
                if (descriptors2) descriptors2.delete();
                if (bf) bf.delete();
                if (matches) matches.delete();
                if (srcPtsMat) srcPtsMat.delete();
                if (dstPtsMat) dstPtsMat.delete();
                if (homography) homography.delete();
                if (warpedMat) warpedMat.delete();
            }
        };

        imgMaster.onload = () => { masterLoaded = true; processImages(); };
        imgMaster.onerror = () => {
            console.warn("Gagal memuat master image, skipping warp.");
            resolve(capturedDataUrl); // fallback
        };
        
        imgCaptured.onload = () => { capturedLoaded = true; processImages(); };
        imgCaptured.onerror = () => reject(new Error("Gagal memuat captured image"));

        imgMaster.src = masterImageUrl;
        imgCaptured.src = capturedDataUrl;
    });
};
