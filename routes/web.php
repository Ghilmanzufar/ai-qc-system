<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MemberController; // Sudah diganti

// Halaman Utama pakai MemberController
Route::get('/', [MemberController::class, 'index']);

// Endpoint API untuk Fetch JS
Route::get('/api/parts/{modelId}', [MemberController::class, 'getParts']);

// Endpoint API untuk Menerima Foto dan Menganalisis AI
Route::post('/api/analyze', [MemberController::class, 'analyze']);

// Halaman Dashboard Analytics
Route::get('/dashboard', function () {
    return view('dashboard');
});

// Halaman Kelola Part Admin
Route::get('/admin', function () {
    return view('admin');
});