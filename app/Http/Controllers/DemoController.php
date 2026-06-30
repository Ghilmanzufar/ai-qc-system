<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;

class DemoController extends Controller
{
    /**
     * Menampilkan halaman upload demo.
     */
    public function index()
    {
        return Inertia::render('Demo/Index');
    }

    /**
     * Menerima upload gambar dan mengirimkannya ke AI Server.
     */
    public function analyze(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg|max:5120', // Maksimal 5MB
        ]);

        try {
            // 1. Simpan gambar yang diupload ke storage lokal
            $imageFile = $request->file('image');
            $imageName = 'demo/' . Str::uuid() . '.' . $imageFile->getClientOriginalExtension();
            $storagePath = storage_path('app/public/' . $imageName);
            
            // Pastikan folder demo ada
            if (!file_exists(dirname($storagePath))) {
                mkdir(dirname($storagePath), 0755, true);
            }
            
            // Pindahkan file ke storage
            move_uploaded_file($imageFile->getRealPath(), $storagePath);

            // 2. Siapkan parameter untuk AI Server
            $aiServerUrl = config('services.ai_server.url', env('AI_SERVER_URL', 'http://127.0.0.1:8001'));
            $modelFile = 'best.pt'; // Model default untuk demo

            // 3. Kirim request ke AI Server (Python)
            $response = Http::timeout(30)->post($aiServerUrl . '/predict', [
                'image_path' => $storagePath,
                'model_file' => $modelFile,
            ]);

            // 4. Tangani respons dari AI Server
            if ($response->successful()) {
                $result = $response->json();
                
                // Tambahkan URL gambar untuk ditampilkan di frontend
                $result['image_url'] = asset('storage/' . $imageName);
                
                return response()->json([
                    'success' => true,
                    'data' => $result
                ]);
            } else {
                Log::error('AI Server Demo Error', ['status' => $response->status(), 'body' => $response->body()]);
                return response()->json([
                    'success' => false,
                    'message' => 'AI Server mengembalikan error: ' . $response->body(),
                ], 502);
            }

        } catch (\Exception $e) {
            Log::error('AI Server Demo Exception', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghubungi AI Server. Pastikan uvicorn sudah berjalan.',
                'error_detail' => $e->getMessage()
            ], 503);
        }
    }
}
