# Strategi Demonstrasi "Real AI" Tanpa Data Asli Pabrik

Dokumen ini memuat panduan eksekusi untuk mendemokan aplikasi *Camera Inspection* menggunakan **model AI (YOLO) sungguhan dan sistem integrasi riil**, meskipun dataset asli dari lingkungan pabrik belum dikumpulkan.

## Pilihan Skenario Demo

### 1. Pilihan Terbaik: Menggunakan Roboflow Universe 🌟
Ini adalah opsi paling direkomendasikan karena merepresentasikan kasus industri (*Quality Control*) secara nyata dan meyakinkan audiens.

* **Platform:** [Roboflow Universe](https://universe.roboflow.com/)
* **Kelebihan:** Ribuan proyek dataset *open-source* tentang cacat pabrik siap pakai (misal: inspeksi lensa, baut, *PCB defect*, pil obat).
* **Alur Eksekusi:**
  1. Cari dataset yang relevan (misal: *"manufacturing defect"* atau *"lens scratch"*).
  2. Pilih proyek yang sudah dilatih oleh pembuat aslinya dan memiliki file **`best.pt`** siap unduh.
  3. Unduh file `best.pt` tersebut dan masukkan ke server AI Python (FastAPI) Anda.
  4. Unduh 5-10 contoh gambar dari Roboflow (campuran *OK* dan *NG*).
  5. **Saat Demo:** Buka gambar-gambar tersebut di layar HP/kertas dan sorot ke webcam laptop Anda, atau buat fitur *Upload Image* sementara di aplikasi web Laravel. Sistem AI akan mendeteksi cacat sesuai model pinjaman tersebut secara *real-time*.

### 2. Pilihan Tercepat: Model Pre-Trained YOLO (COCO)
Pilihan ini difokuskan hanya untuk **membuktikan bahwa koneksi Web dan AI Server berfungsi** tanpa mempedulikan jenis cacat.

* **Platform:** Bawaan library Ultralytics (YOLOv8/YOLOv11)
* **Kelebihan:** Sangat cepat, model sudah tersedia otomatis (`yolov8n.pt`), dan sangat responsif.
* **Alur Eksekusi:**
  1. Gunakan file `yolov8n.pt` murni tanpa di-*training* ulang.
  2. Model ini bisa mengenali 80 objek umum (botol, ponsel, cangkir, dll).
  3. **Saat Demo:** Tunjukkan sebuah botol minum ke webcam laptop. Aplikasi AI akan langsung menandainya sebagai *"bottle - 98%"* dan Laravel akan menyimpannya ke *database*.
  4. **Pernyataan Demo:** *"Ini membuktikan infrastruktur kita sudah stabil. Jika mesin dipasang di lini produksi nanti, kita cukup mengganti file `yolov8n.pt` ini dengan file `lensa_defect.pt` yang kita latih dengan data sendiri."*

### 3. Pilihan Paling Mentah: Kaggle
Jika tidak menemukan file `best.pt` di Roboflow Universe dan ingin hasil yang lebih spesifik industri.

* **Platform:** [Kaggle](https://www.kaggle.com/)
* **Kelebihan:** Dataset berkualitas tinggi berskala riset (misal: *"Casting Product Defect"*).
* **Alur Eksekusi:**
  1. Unduh dataset gambar dari Kaggle.
  2. Unggah ke Google Colab dan lakukan proses *training* YOLO secara mandiri sampai menghasilkan `best.pt`.
  3. Terapkan cara demo seperti pada langkah Roboflow Universe.

---

> [!TIP]
> **Rekomendasi Utama**  
> Gabungkan kekuatan **Roboflow Universe** dengan fitur **Webcam di Aplikasi Scanner** Laravel Anda. Mendemokan deteksi *"NG"* atau *"OK"* secara langsung melalui sorotan kamera laptop akan memberikan kesan "WOW" (*Wow Factor*) yang tinggi kepada manajemen.
