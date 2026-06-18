<?php

use Illuminate\Support\Facades\Route;

// Halaman Default (Operator Inspeksi)
Route::get('/', function () {
    return view('operator');
});

// Halaman Dashboard Analytics
Route::get('/dashboard', function () {
    return view('dashboard');
});

// Halaman Kelola Part Admin
Route::get('/admin', function () {
    return view('admin');
});