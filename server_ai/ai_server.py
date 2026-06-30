from flask import Flask, request, jsonify
from ultralytics import YOLO
from PIL import Image
import os
import io
import base64
import pathlib

# [PENTING] Workaround untuk Windows jika model ditraining di Linux/Google Colab
if os.name == 'nt':
    pathlib.PosixPath = pathlib.WindowsPath

app = Flask(__name__)

# Dictionary untuk menyimpan model yang sudah di-load agar tidak meload ulang terus menerus
loaded_models = {}

# Dapatkan path dinamis agar tidak hardcode C:/xampp/...
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
LARAVEL_MODELS_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "storage", "app", "public", "models"))

def get_model(model_filename):
    if not model_filename:
        model_filename = "best.pt" # Fallback ke best.pt
        
    if model_filename in loaded_models:
        return loaded_models[model_filename]
        
    # Coba cari di folder Laravel storage terlebih dahulu, jika tidak ada cari di lokal
    model_path = os.path.join(LARAVEL_MODELS_DIR, model_filename)
    if not os.path.exists(model_path):
        model_path = model_filename # Cari di folder server_ai_qc (lokal)
        
    print(f"Memuat model {model_filename} dari {model_path}... Mohon tunggu...")
    try:
        model = YOLO(model_path)
        loaded_models[model_filename] = model
        print(f"Model {model_filename} berhasil dimuat!")
        return model
    except Exception as e:
        print(f"Error memuat model {model_filename}: {e}")
        return None


@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Cek apakah request berupa JSON (dari Laravel Http::post)
        if request.is_json:
            data = request.json
            image_path = data.get('image_path')
            model_file = data.get('model_file', 'best.pt')
        else:
            return jsonify({"status": "error", "message": "Request harus berupa JSON dengan image_path"}), 400

        if not image_path or not os.path.exists(image_path):
            return jsonify({"status": "error", "message": f"Gambar tidak ditemukan di path: {image_path}"}), 400
            
        # 1. Buka gambar dari path lokal yang dikirim Laravel
        image = Image.open(image_path)
        
        # 2. Dapatkan model yang sesuai
        model = get_model(model_file)
        if not model:
             return jsonify({"status": "error", "message": f"Gagal memuat model: {model_file}"}), 500
             
        # 3. Proses Inferensi (Deteksi) menggunakan YOLOv8
        results = model.predict(image, conf=0.5)
        
        # 4. Buat gambar beranotasi (bounding box)
        annotated_img = results[0].plot() # numpy array (BGR format dari cv2)
        annotated_img_rgb = annotated_img[..., ::-1] # Convert BGR to RGB
        
        # Convert ke base64
        pil_img = Image.fromarray(annotated_img_rgb)
        buffered = io.BytesIO()
        pil_img.save(buffered, format="JPEG", quality=85)
        encoded_img = base64.b64encode(buffered.getvalue()).decode("utf-8")
        base64_string = f"data:image/jpeg;base64,{encoded_img}"
        
        # 5. Logika Keputusan: Menghitung berapa banyak objek (bounding boxes) yang ditemukan
        jumlah_objek = len(results[0].boxes)
        
        # Hitung jumlah masing-masing kelas
        detail_kelas = {}
        if results[0].boxes is not None and len(results[0].boxes) > 0:
            for box in results[0].boxes:
                # Dapatkan nama kelas dari model
                kelas_id = int(box.cls[0])
                nama_kelas = results[0].names[kelas_id]
                if nama_kelas in detail_kelas:
                    detail_kelas[nama_kelas] += 1
                else:
                    detail_kelas[nama_kelas] = 1
        
        # Buat pesan detail
        if detail_kelas:
            pesan_detail = []
            for kelas, jumlah in detail_kelas.items():
                pesan_detail.append(f"{jumlah} {kelas}")
            pesan = ", ".join(pesan_detail)
        else:
            pesan = "Tidak ada objek terdeteksi"
        
        # Logika: Jika tepat 3 objek terdeteksi → OK (PASS), selain itu → REJECT
        hasil_akhir = "OK" if jumlah_objek == 3 else "REJECT"

        # 6. Kirim balasan ke Laravel
        return jsonify({
            "status": "success",
            "result": hasil_akhir,
            "details": pesan,
            "object_count": jumlah_objek,
            "class_details": detail_kelas,
            "annotated_image": base64_string
        })
        
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    # Jalankan server di port 5000
    print("=======================================")
    print("SERVER AI QC AKTIF DAN MENUNGGU REQUEST...")
    print("=======================================")
    app.run(host='0.0.0.0', port=5000)