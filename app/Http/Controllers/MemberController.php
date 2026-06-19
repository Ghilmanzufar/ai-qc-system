<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ProductModel;
use App\Models\Part;
use Illuminate\Support\Facades\Storage; // Tambahkan ini
use Illuminate\Support\Str;             // Tambahkan ini

class MemberController extends Controller
{
    // Menampilkan halaman member dan membawa daftar Model
    public function index() {
        $models = ProductModel::all();
        // Arahkan ke file member.blade.php
        return view('member', compact('models')); 
    }

    // API untuk mengambil daftar Part
    public function getParts($modelId) {
        $parts = Part::where('product_model_id', $modelId)->get();
        return response()->json($parts);
    }

    // Fungsi Menerima Gambar & Simulasi AI
    public function analyze(Request $request) {
        // 1. Validasi paket yang dikirim Javascript
        $request->validate([
            'image' => 'required|string',
            'model' => 'required|string',
            'part' => 'required|string',
        ]);

        // Nanti di sinilah kita simpan gambar ke Storage dan mengirimkannya ke Python (YOLOv8)
        // ...

        // 2. Simulasi Proses AI (Jeda 1.5 detik agar seolah-olah AI sedang berpikir)
        usleep(1500000); 

        // 3. Simulasi Hasil (80% kemungkinan PASS, 20% kemungkinan NG)
        $hasilAI = rand(1, 100) <= 80 ? 'PASS' : 'NG';

        // 4. Balas pesan ke Javascript
        return response()->json([
            'status' => 'success',
            'message' => 'Gambar berhasil dianalisis',
            'result' => $hasilAI,
            'part_inspected' => $request->part
        ]);
    }


    public function analyze(Request $request) {
        $request->validate([
            'image' => 'required|string',
            'model' => 'required|string',
            'part' => 'required|string',
        ]);

        // 1. Proses Konversi Base64 ke File Gambar
        $imageData = $request->input('image');
        $image = str_replace('data:image/jpeg;base64,', '', $imageData);
        $image = base64_decode($image);

        // 2. Buat nama file unik: "part-name_timestamp_random.jpg"
        $fileName = Str::slug($request->part) . '_' . time() . '_' . Str::random(5) . '.jpg';
        $filePath = 'inspections/' . $fileName;

        // 3. Simpan ke storage/app/public/inspections/
        Storage::disk('public')->put($filePath, $image);

        // 4. Simulasi proses AI (Simulasi AI sedang bekerja)
        usleep(1500000); 
        $hasilAI = rand(1, 100) <= 80 ? 'PASS' : 'NG';

        // 5. Kirim respon
        return response()->json([
            'status' => 'success',
            'message' => 'Gambar berhasil disimpan dan dianalisis',
            'result' => $hasilAI,
            'file_url' => Storage::url($filePath) // URL untuk menampilkan gambar nanti
        ]);
    }
}