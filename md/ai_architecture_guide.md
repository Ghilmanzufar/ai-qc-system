# Panduan Arsitektur Integrasi AI & Web QC (Laravel + FastAPI + YOLO)

Dokumen ini berisi rangkuman arsitektur terbaik untuk sistem *Camera Inspection* AI (Quality Control) berbasis YOLO dan Laravel, berdasarkan standar industri.

## 1. Pembuatan & Ekspor Model AI

Alur kerja menggunakan Roboflow untuk anotasi dan Ultralytics (YOLO) untuk *training* sudah merupakan standar industri (Best Practice).

### Ekspor Model (ONNX dan TensorRT Engine)
Menjalankan file `.pt` murni secara *real-time* dapat memakan memori besar dan kurang optimal. Solusinya adalah mengekspor model ke format `.onnx` atau `.engine`.

Ini dapat dilakukan di Google Colab maupun di komputer lokal (Miniconda):

```python
from ultralytics import YOLO

# Load model best.pt yang baru saja di-training
model = YOLO('runs/detect/train/weights/best.pt')

# 1. Ekspor ke ONNX (Aman & Kompatibel)
# Bisa jalan di CPU & GPU merk apapun. Sangat direkomendasikan untuk awal.
model.export(format='onnx')

# 2. Ekspor ke TensorRT Engine (Paling Cepat)
# WARNING: Sangat spesifik pada Hardware/GPU saat di-ekspor.
model.export(format='engine')
```

> [!WARNING]
> **Peringatan TensorRT (`.engine`)**  
> Jangan mengekspor ke format `.engine` di Google Colab jika komputer pabrik menggunakan jenis GPU yang berbeda (misal Colab menggunakan Nvidia T4, sedangkan pabrik menggunakan RTX 3060).  
> **Solusi:** Unduh file `best.pt` dari Colab, dan lakukan proses *export engine* **langsung di komputer pabrik**.

## 2. Arsitektur Komunikasi Laravel <-> AI Server

Gunakan konsep **Microservices** dengan memisahkan Web Server dan AI Server. Python (FastAPI) akan bertindak sebagai *Microservice* AI yang berdiri sendiri, dan Laravel bertindak sebagai aplikasi utama.

### Menggunakan Pendekatan "Shared Storage"
Karena Laravel (Web) dan FastAPI (AI) berjalan di satu mesin (komputer pabrik yang sama), pendekatan *Shared Storage* adalah yang paling efisien karena **tidak perlu mengirim data gambar berukuran besar melalui jaringan/HTTP**.

**Alur Kerja:**
1. **Laravel Menyimpan Foto:**
   Kamera menangkap gambar, dikirim ke Laravel, lalu Laravel menyimpannya secara lokal.
   *Contoh Path:* `C:\xampp\htdocs\ai-qc-system\storage\app\public\inspections\part_123.jpg`

2. **Laravel Mengirim "Teks URL/Path" ke FastAPI:**
   Laravel melakukan *request* API ke server FastAPI dan hanya mengirim *path* file-nya saja.
   ```json
   {
       "image_path": "C:\\xampp\\htdocs\\ai-qc-system\\storage\\app\\public\\inspections\\part_123.jpg",
       "part_number": "A-001"
   }
   ```

3. **FastAPI Membaca Foto & Menganalisis:**
   Python membaca langsung gambar tersebut dari SSD/Hardisk menggunakan OpenCV, dan memasukkannya ke model YOLO.
   ```python
   import cv2
   
   image = cv2.imread(request.image_path)
   hasil_deteksi = model(image)
   ```

4. **FastAPI Mengembalikan Hasil Deteksi:**
   FastAPI merespons Laravel dengan hasil deteksi berukuran kecil (dalam hitungan milidetik).
   ```json
   {
       "status": "NG",
       "confidence": 98.5,
       "defect_type": "Goresan",
       "coordinates": [150, 200, 300, 400]
   }
   ```

5. **Finalisasi di Laravel:** 
   Laravel mencatat hasil deteksi (`status: NG`) ke database dan memperbarui antarmuka pengguna/ *dashboard*.

> [!TIP]
> **Skala Lanjut (Deployment)**  
> Jika aplikasi ini akan dipasang di berbagai pabrik, pastikan Anda menggunakan **Docker** untuk membungkus Laravel dan FastAPI, sehingga instalasi di komputer baru menjadi sangat mudah tanpa perlu repot mengatur versi PHP dan Python.
