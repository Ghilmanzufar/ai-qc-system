<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ProductModel;
use App\Models\Part;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Http; // Wajib ditambahkan untuk memanggil API Python

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

    // Fungsi untuk Menerima Gambar & Mengirim ke Python AI
    public function analyze(Request $request) {
        // Validasi paket dari Javascript
        $request->validate([
            'image' => 'required|string',
            'model' => 'required|string',
            'part' => 'required|string',
        ]);

        // 1. Simpan Gambar ke Storage Laravel
        $imageData = $request->input('image');
        $image = str_replace('data:image/jpeg;base64,', '', $imageData);
        $image = base64_decode($image);

        $fileName = Str::slug($request->part) . '_' . time() . '_' . Str::random(5) . '.jpg';
        $filePath = 'inspections/' . $fileName;

        Storage::disk('public')->put($filePath, $image);

        // 2. Ambil rute asli (Absolute Path) dari gambar di laptopmu
        $absolutePath = storage_path('app/public/' . $filePath);

        // 3. Tembak gambar tersebut ke Server AI (Python di port 5000)
        try {
            $response = Http::timeout(15)->attach(
                'image', file_get_contents($absolutePath), $fileName
            )->post('http://127.0.0.1:5000/predict');

            // 4. Tangkap balasan dari Python
            if ($response->successful()) {
                $hasilAI = $response->json()['result']; // 'PASS' atau 'NG'
                $pesanAI = $response->json()['details']; // Pesan detail dari Python
            } else {
                $hasilAI = 'ERROR';
                $pesanAI = 'Gagal memproses di server AI (Kode: ' . $response->status() . ').';
            }
        } catch (\Exception $e) {
            $hasilAI = 'ERROR';
            $pesanAI = 'Server AI mati atau tidak bisa dihubungi. Pastikan python ai_server.py menyala.';
        }

        // 5. Kirim hasilnya ke Javascript / Layar Member
        return response()->json([
            'status' => 'success',
            'message' => $pesanAI,
            'result' => $hasilAI,
            'file_url' => Storage::url($filePath)
        ]);
    }
}