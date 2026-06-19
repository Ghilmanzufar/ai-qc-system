// ==========================================
// camera.js - Mengurus Webcam dan Kirim ke AI
// ==========================================

window.isPhotoTaken = false;

window.startCamera = function() {
    const videoElement = document.getElementById('kameraDepan');
    const offlineOverlay = document.getElementById('offlineOverlay'); 
    
    if (!videoElement) return;

    if (offlineOverlay) {
        offlineOverlay.classList.add('hidden');
        offlineOverlay.classList.remove('flex');
    }

    if (videoElement.srcObject) return; 

    navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } } 
    })
    .then(stream => {
        videoElement.srcObject = stream;
        
        const statusKamera = document.getElementById('statusKamera');
        if(statusKamera) {
            statusKamera.innerHTML = '<span class="material-symbols-outlined text-[14px]">check_circle</span> READY';
            statusKamera.className = 'flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 backdrop-blur-md rounded-full text-emerald-400 text-xs font-semibold tracking-wide border border-emerald-500/30 transition-colors';
        }

        // UBAH TOMBOL TOPBAR JADI MERAH (E-STOP) KARENA MESIN NYALA
        if (window.updateTopbarPowerButton) window.updateTopbarPowerButton(true);
    })
    .catch(error => {
        console.error("Kamera gagal:", error);
        window.showAlert("Kamera Gagal", "Browser tidak bisa mengakses kamera perangkat Anda.", "error");
        
        if (offlineOverlay) {
            offlineOverlay.classList.remove('hidden');
            offlineOverlay.classList.add('flex');
        }

        // UBAH TOMBOL TOPBAR JADI HIJAU KARENA KAMERA GAGAL NYALA
        if (window.updateTopbarPowerButton) window.updateTopbarPowerButton(false);
    });
};

window.stopCamera = function() {
    const videoElement = document.getElementById('kameraDepan');
    const offlineOverlay = document.getElementById('offlineOverlay'); 

    if (videoElement && videoElement.srcObject) {
        videoElement.srcObject.getTracks().forEach(track => track.stop());
        videoElement.srcObject = null;
    }

    const canvasElement = document.getElementById('canvasHasil');
    if(canvasElement) canvasElement.classList.add('hidden');
    if(videoElement) videoElement.classList.remove('hidden');

    const btnScan = document.getElementById('btnScan');
    const btnRetake = document.getElementById('btnRetake');
    const btnSubmit = document.getElementById('btnSubmit');
    const statusKamera = document.getElementById('statusKamera');

    if(btnScan) btnScan.classList.remove('hidden');
    if(btnRetake) btnRetake.classList.add('hidden');
    if(btnSubmit) btnSubmit.classList.add('hidden');

    if(statusKamera) {
        statusKamera.innerHTML = '<span class="material-symbols-outlined text-[14px]">videocam_off</span> OFFLINE';
        statusKamera.className = 'flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 backdrop-blur-md rounded-full text-red-400 text-xs font-semibold tracking-wide border border-red-500/30 transition-colors';
    }

    if (offlineOverlay) {
        offlineOverlay.classList.remove('hidden');
        offlineOverlay.classList.add('flex');
    }

    // UBAH TOMBOL TOPBAR JADI HIJAU (START SYSTEM) KARENA MESIN MATI
    if (window.updateTopbarPowerButton) window.updateTopbarPowerButton(false);

    window.isPhotoTaken = false;
};

document.addEventListener("DOMContentLoaded", function() {
    const videoElement = document.getElementById('kameraDepan');
    if (videoElement) {
        window.startCamera(); 

        const canvasElement = document.getElementById('canvasHasil');
        const flashEffect = document.getElementById('flashEffect');
        const statusKamera = document.getElementById('statusKamera');
        
        const btnScan = document.getElementById('btnScan');
        const btnRetake = document.getElementById('btnRetake');
        const btnSubmit = document.getElementById('btnSubmit');
        const btnPowerOn = document.getElementById('btnPowerOn'); 

        // Fungsi Tombol Hidupkan Mesin di Layar Offline
        if (btnPowerOn) {
            btnPowerOn.addEventListener('click', function() {
                window.startCamera();
                window.showAlert("Mesin Dihidupkan", "Sistem kamera berhasil dinyalakan. Silakan muat Part untuk mulai inspeksi.", "success");
            });
        }

        function takeSnapshot() {
            if (window.isPhotoTaken) return;
            
            if (!videoElement.srcObject) {
                window.showAlert("Kamera Offline", "Kamera sedang dimatikan. Silakan klik tombol 'Start' di atas atau 'HIDUPKAN MESIN' terlebih dahulu.", "error");
                return;
            }

            if (!window.activeInspection.part) {
                window.showAlert("Aksi Ditolak!", "Silakan pilih dan Muat Part terlebih dahulu di layar atas sebelum melakukan scan.", "error");
                return;
            }
            
            canvasElement.width = videoElement.videoWidth;
            canvasElement.height = videoElement.videoHeight;
            const context = canvasElement.getContext('2d');
            context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

            flashEffect.classList.remove('opacity-0');
            setTimeout(() => flashEffect.classList.add('opacity-0'), 150);

            videoElement.classList.add('hidden');
            canvasElement.classList.remove('hidden');

            statusKamera.innerHTML = '<span class="material-symbols-outlined text-[14px]">image</span> CAPTURED';
            statusKamera.className = 'flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/20 backdrop-blur-md rounded-full text-indigo-400 text-xs font-semibold tracking-wide border border-indigo-500/30 transition-colors';

            btnScan.classList.add('hidden');
            btnRetake.classList.remove('hidden');
            btnSubmit.classList.remove('hidden');
            window.isPhotoTaken = true;
        }

        function retakeSnapshot() {
            canvasElement.classList.add('hidden');
            videoElement.classList.remove('hidden');

            statusKamera.innerHTML = '<span class="material-symbols-outlined text-[14px]">check_circle</span> READY';
            statusKamera.className = 'flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 backdrop-blur-md rounded-full text-emerald-400 text-xs font-semibold tracking-wide border border-emerald-500/30 transition-colors';

            btnScan.classList.remove('hidden');
            btnRetake.classList.add('hidden');
            btnSubmit.classList.add('hidden');
            window.isPhotoTaken = false;
        }

        if (btnScan) btnScan.addEventListener('click', takeSnapshot);
        if (btnRetake) btnRetake.addEventListener('click', retakeSnapshot);

        document.addEventListener('keydown', function(event) {
            const overlayAlert = document.getElementById('customAlertOverlay');
            const overlayConfirm = document.getElementById('customConfirmOverlay');
            
            const isAlertOpen = overlayAlert && !overlayAlert.classList.contains('hidden');
            const isConfirmOpen = overlayConfirm && !overlayConfirm.classList.contains('hidden');

            if (event.code === 'Space' && event.target.tagName !== 'INPUT' && !isAlertOpen && !isConfirmOpen) {
                event.preventDefault();
                if (!window.isPhotoTaken) takeSnapshot();
            }
        });

        if (btnSubmit) {
            btnSubmit.addEventListener('click', function() {
                const imageData = canvasElement.toDataURL('image/jpeg', 0.8);
                const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

                const originalHtml = btnSubmit.innerHTML;
                btnSubmit.innerHTML = `<span class="material-symbols-outlined animate-spin text-[28px]">autorenew</span> <div class="flex flex-col items-start text-left"><span class="text-base font-bold tracking-wide">MENGANALISIS...</span><span class="text-[10px] font-medium text-emerald-100 uppercase tracking-wider">Menunggu Server AI</span></div>`;
                btnSubmit.disabled = true;
                btnRetake.disabled = true;

                fetch('/api/analyze', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken
                    },
                    body: JSON.stringify({
                        image: imageData,
                        model: window.activeInspection.model,
                        part: window.activeInspection.part
                    })
                })
                .then(response => response.json())
                .then(data => {
                    const isPass = data.result === 'PASS';
                    window.showAlert("Hasil Analisis Selesai", `Sistem AI memutuskan bahwa Part ini: ${data.result}`, isPass ? 'success' : 'error');

                    btnSubmit.innerHTML = originalHtml;
                    btnSubmit.disabled = false;
                    btnRetake.disabled = false;
                })
                .catch(error => {
                    console.error('Error:', error);
                    window.showAlert("Gagal Tersambung", "Tidak dapat menghubungi Server AI. Periksa koneksi jaringan Anda.", "error");
                    btnSubmit.innerHTML = originalHtml;
                    btnSubmit.disabled = false;
                    btnRetake.disabled = false;
                });
            });
        }
    }
});