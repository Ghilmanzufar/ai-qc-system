<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OperatorController; 

// Halaman Utama sekarang dilayani oleh OperatorController
Route::get('/', [OperatorController::class, 'index']);

// Jalur API untuk diambil oleh Javascript secara diam-diam (Fetch)
Route::get('/api/parts/{modelId}', [OperatorController::class, 'getParts']);

// Halaman Dashboard Analytics
Route::get('/dashboard', function () {
    return view('dashboard');
});

// Halaman Kelola Part Admin
Route::get('/admin', function () {
    return view('admin');
});