<?php

namespace App\Http\Controllers;

use App\Models\Inspection;
use App\Models\Part;
use App\Models\ProductModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;

class InspectionController extends Controller
{
    /**
     * Tampilkan halaman Setup untuk memilih Part.
     */
    public function setup()
    {
        $models = ProductModel::with('parts')->get();

        return Inertia::render('Operator/Setup', [
            'productModels' => $models,
        ]);
    }

    /**
     * Tampilkan halaman Scanner untuk Operator.
     */
    public function scanner(Request $request)
    {
        if (!$request->has('part_id')) {
            return redirect()->route('operator.setup');
        }

        $part = Part::with('productModel')->findOrFail($request->part_id);

        // Hitung statistik harian operator ini
        $todayCount = Inspection::where('user_id', Auth::id())
            ->whereDate('created_at', today())
            ->count();

        $todayOk = Inspection::where('user_id', Auth::id())
            ->whereDate('created_at', today())
            ->where('final_decision', 'PASS')
            ->count();

        $todayNg = Inspection::where('user_id', Auth::id())
            ->whereDate('created_at', today())
            ->where('final_decision', 'NG')
            ->count();

        return Inertia::render('Operator/Scanner', [
            'part' => $part,
            'dailyStats' => [
                'total' => $todayCount,
                'ok' => $todayOk,
                'ng' => $todayNg,
            ],
        ]);
    }

    /**
     * Terima foto dari operator, kirim ke Python AI, simpan hasilnya.
     */
    public function analyze(Request $request)
    {
        $request->validate([
            'part_id' => 'required|exists:parts,id',
            'image' => 'required|string', // base64 encoded image
            'side' => 'required|in:front,back',
        ]);

        $part = Part::findOrFail($request->part_id);
        $aiModelFile = $part->ai_model_file;

        // Decode base64 image dan simpan ke storage
        $imageData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $request->image));
        $imageName = 'inspections/' . Str::uuid() . '.jpg';
        $storagePath = storage_path('app/public/' . $imageName);

        // Pastikan direktori ada
        if (!file_exists(dirname($storagePath))) {
            mkdir(dirname($storagePath), 0755, true);
        }
        file_put_contents($storagePath, $imageData);

        // Kirim ke Python AI Server
        $aiServerUrl = config('services.ai_server.url', env('AI_SERVER_URL', 'http://127.0.0.1:5000'));

        try {
            $response = Http::timeout(30)->post($aiServerUrl . '/predict', [
                'image_path' => $storagePath,
                'model_file' => $aiModelFile,
            ]);

            if ($response->successful()) {
                $result = $response->json();
                // Map status dari AI server ke nilai yang diterima database (OK/NG)
                $aiResult = $result['result'] ?? 'NG'; 
                $status = in_array(strtoupper($aiResult), ['OK', 'PASS', 'SUCCESS']) ? 'OK' : 'NG';
                $objectCount = $result['object_count'] ?? 0;
                $details = $result['details'] ?? null;
                $confidence = $result['confidence'] ?? 0;
                $annotatedImage = $result['annotated_image'] ?? null;
            } else {
                Log::error('AI Server returned error', ['status' => $response->status(), 'body' => $response->body()]);
                return response()->json([
                    'success' => false,
                    'message' => 'AI Server mengembalikan error. Silakan hubungi IT.',
                ], 502);
            }
        } catch (\Exception $e) {
            Log::error('AI Server tidak bisa dihubungi', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Koneksi ke AI Server gagal. Pastikan server Python berjalan.',
                'ai_offline' => true,
            ], 503);
        }

        // Tentukan kolom yang akan diupdate berdasarkan sisi (front/back)
        $imageColumn = $request->side === 'front' ? 'front_image_path' : 'back_image_path';
        $statusColumn = $request->side === 'front' ? 'front_status' : 'back_status';

        // Buat atau update inspection record
        $inspection = Inspection::create([
            'inspection_code' => 'INS-' . strtoupper(Str::random(8)),
            'part_id' => $part->id,
            'user_id' => Auth::id(),
            $statusColumn => $status,
            'final_decision' => in_array($status, ['OK', 'PASS', 'SUCCESS']) ? 'PASS' : 'NG',
            'defect_type' => $details, // simpan detail (e.g. Mendeteksi 5 objek)
            $imageColumn => 'storage/' . $imageName,
        ]);

        return response()->json([
            'success' => true,
            'status' => $status,
            'defect_type' => $details,
            'object_count' => $objectCount,
            'class_details' => $response->json('class_details'),
            'confidence' => $confidence,
            'inspection_id' => $inspection->id,
            'annotated_image' => $annotatedImage,
        ]);
    }

    /**
     * Ambil riwayat inspeksi hari ini untuk operator.
     */
    public function history()
    {
        $inspections = Inspection::with(['part.productModel'])
            ->where('user_id', Auth::id())
            ->whereDate('created_at', today())
            ->latest()
            ->get();

        return Inertia::render('Operator/History', [
            'inspections' => $inspections,
        ]);
    }
}
