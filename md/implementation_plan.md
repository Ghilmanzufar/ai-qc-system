# Rombak Total Sistem AI QC: Laravel + React (Inertia)

Dokumen ini adalah rancangan arsitektur dan langkah-langkah implementasi untuk merombak total sistem *PEC* berbasis AI. Sistem ini akan menggabungkan keandalan **Laravel** sebagai *core server*, interaktivitas **React.js** via **Inertia.js** untuk antarmuka pengguna, dan **Python** sebagai *Inference Engine* AI.

Fokus utama pembaruan ini adalah menciptakan antarmuka yang **Premium, Clean (Light Mode), dan Ramah Pengguna Segala Usia (User-Friendly untuk Operator Senior)**, serta menyempurnakan alur komunikasi antara Frontend, Backend, dan AI.

---

## ⚠️ User Review Required

Silakan tinjau bagian ini. Jika Anda setuju dengan semua poin di bawah, silakan setujui (*Approve*) rencana ini:

1.  **Jawaban untuk Komunikasi AI:** Saya sangat merekomendasikan alur: **Frontend (React) -> Backend (Laravel) -> AI (Python)**. 
    *   *Alasannya:* Seperti yang Anda sebutkan, fungsi server (Laravel) adalah untuk menyimpan bukti. Jika React langsung menembak ke Python, Laravel tidak akan tahu jika ada inspeksi yang terjadi. Dengan alur React -> Laravel -> Python, Laravel bisa menyimpan gambar tersebut ke dalam sistem terlebih dahulu, mencatat riwayat ke database, memanggil Python untuk mendapatkan hasil AI, lalu membubuhkan "Stempel Digital", dan mengembalikan hasilnya ke React. Ini adalah arsitektur yang paling aman dan rapi.
2.  **Keputusan Alur Inspeksi (Satu per Satu):** Kita akan menggunakan alur "Foto Depan -> Analisis -> Foto Belakang -> Analisis". Memberikan jeda antar sisi akan mencegah operator bingung jika terjadi *error* hanya di satu sisi. Jika "Depan" sudah NG (No Good), operator bisa langsung memisahkan barang tanpa perlu memfoto "Belakang" (menghemat waktu).
3.  **UI/UX Accessibility:** Kita tidak akan menggunakan desain teks kecil atau tombol kecil. Tombol *Capture*, *Retake*, dan hasil NG/PASS akan dibuat sangat besar dengan warna kontras (Hijau Terang untuk PASS, Merah Menyala untuk NG, plus animasi peringatan berkedip).

---

## ❓ Open Questions

Tidak ada pertanyaan besar yang tersisa, namun mohon konfirmasi satu hal kecil ini saat eksekusi nanti:
*   *Stempel Perusahaan:* Apakah Anda memiliki logo perusahaan berupa gambar PNG transparan yang siap digunakan sebagai *watermark/stempel* foto bukti inspeksi? Jika belum, kita bisa menggunakan stempel berbasis teks CSS/Canvas terlebih dahulu.

---

## 🛠️ Proposed Changes

### 1. Persiapan Infrastruktur & Tech Stack
Kita akan mengonfigurasi Laravel untuk bekerja harmonis dengan ekosistem React modern.

#### [MODIFY] `composer.json` & `package.json`
*   Menambahkan `inertiajs/inertia-laravel` ke Laravel.
*   Menambahkan `@inertiajs/react`, `react`, `react-dom`, dan `tailwindcss` ke frontend.
*   Menyiapkan Tailwind CSS dengan konfigurasi *Light Theme* yang bersih (putih, abu-abu muda, shadow lembut).

#### [NEW] `resources/js/app.jsx`
*   File *entry-point* utama React yang akan mem-*booting* Inertia.js.

---

### 2. Database Schema & Models
Menyesuaikan tabel agar mendukung 3 Role pengguna dan pemetaan Model AI.

#### [MODIFY] Migration `users` table
*   Menambahkan kolom `role` (enum: `'operator'`, `'supervisor'`, `'admin'`).

#### [MODIFY] Migration `parts` table
*   Menambahkan kolom `ai_model_file` (string) untuk menyimpan nama file `.pt` (misal: `yolo_tutup_botol_v1.pt`). Nantinya, saat user memilih Part, Laravel tahu file mana yang harus dikirim ke Python.

#### [MODIFY] Migration `inspections` table
*   Memastikan struktur siap menerima bukti foto (`front_image_path`, `back_image_path`) dan metrik lainnya.

---

### 3. Logika Backend & Integrasi AI (Laravel & Python)
Menulis ulang *Controller* untuk melayani React dan berkomunikasi dengan Python.

#### [MODIFY] `app/Http/Controllers/InspectionController.php`
*   Membuat method `analyze(Request $request)`:
    1. Menerima gambar base64/file dari React.
    2. Menyimpan gambar asli sementara ke folder `storage/app/public/inspections`.
    3. Mengecek `part_id` untuk mengetahui `ai_model_file` apa yang harus digunakan.
    4. Melakukan HTTP POST request ke server Python (`http://localhost:5000/predict`) dengan mengirim path gambar dan nama model AI.
    5. Menerima respons (PASS/NG) dan *bounding box* dari Python.
    6. Meng-*overlay* / membubuhkan stempel digital (Watermark "PASS / NG") ke atas gambar menggunakan *library image intervention* di PHP.
    7. Menyimpan gambar final, mencatat log di DB, dan mengembalikan JSON sukses ke React.

---

### 4. Frontend & User Interface (React.js)
Membuat halaman UI yang *Premium* namun sangat mudah digunakan (Aksesibilitas Tinggi).

#### [NEW] `resources/js/Pages/Operator/Inspection.jsx`
*   Halaman utama untuk Operator.
*   Layout terbagi 2: Kiri untuk Video Kamera (besar), Kanan untuk Panel Kontrol.
*   **Fitur:** Dropdown Model & Part (teks besar), Tombol "📷 Ambil Foto Depan" (tombol raksasa).

#### [NEW] `resources/js/Components/CameraScanner.jsx`
*   Komponen *Webcam* yang otomatis mengaktifkan kamera. Terdapat fungsi *Retake* yang mudah dijangkau.

#### [NEW] `resources/js/Components/ResultNotification.jsx`
*   Komponen Animasi. Jika "NG", layar akan menampilkan peringatan merah berkedip (seperti lampu alarm) beserta efek suara *(opsional)*. Jika "OK", muncul centang hijau besar yang menenangkan.

#### [NEW] `resources/js/Pages/Dashboard/Supervisor.jsx`
*   Halaman khusus *Supervisor/Admin*.
*   Berisi grafik jumlah barang diinspeksi (Pie Chart PASS vs NG).
*   Fitur filter berdasarkan tanggal dan tombol **"Export Laporan (Excel/PDF)"**.

---

## 🧪 Verification Plan

1.  **Autentikasi & Role:** Memastikan Operator tidak bisa mengakses Dashboard, dan Supervisor bisa melihat semua data.
2.  **Pemilihan Model AI Otomatis:** Memastikan saat memilih part "A", file `best.pt` yang dikirim ke Python benar-benar milik part "A", bukan "B".
3.  **Alur Kamera (Retake & Capture):** Menguji resolusi kamera di browser, memastikan operator bisa melakukan *Retake* tanpa bug *freeze* pada video stream.
4.  **Akurasi Flow Penyimpanan:** Memastikan ketika barang divonis NG, data NG dan foto stempelnya tetap masuk ke tabel `inspections` dengan benar.
5.  **UI/UX Contrast Test:** Memastikan UI bisa terbaca dengan jelas dari jarak 1 meter (skenario nyata operator pabrik melihat ke layar monitor).
