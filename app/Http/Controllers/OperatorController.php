<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ProductModel;
use App\Models\Part;

class OperatorController extends Controller
{
    // Tugas 1: Menampilkan halaman operator dan membawa daftar Model
    public function index() {
        $models = ProductModel::all();
        return view('operator', compact('models'));
    }

    // Tugas 2: API rahasia untuk mengambil daftar Part berdasarkan ID Model
    public function getParts($modelId) {
        $parts = Part::where('product_model_id', $modelId)->get();
        return response()->json($parts);
    }
}