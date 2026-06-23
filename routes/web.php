<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\InspectionController;

// ==========================================
// AUTH ROUTES (Guest Only)
// ==========================================
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
});

Route::post('/logout', [AuthController::class, 'logout'])->name('logout')->middleware('auth');

// ==========================================
// REDIRECT ROOT BERDASARKAN ROLE
// ==========================================
Route::get('/', function () {
    $user = auth()->user();
    if (!$user) return redirect()->route('login');

    return match ($user->role) {
        'admin' => redirect()->route('admin.dashboard'),
        'supervisor' => redirect()->route('supervisor.dashboard'),
        'operator' => redirect()->route('operator.scanner'),
        default => redirect()->route('login'),
    };
})->middleware('auth');

// ==========================================
// ADMIN ROUTES
// ==========================================
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'adminDashboard'])->name('dashboard');

    // User Management
    Route::get('/users', [AdminController::class, 'users'])->name('users');
    Route::post('/users', [AdminController::class, 'storeUser'])->name('users.store');
    Route::put('/users/{user}', [AdminController::class, 'updateUser'])->name('users.update');
    Route::delete('/users/{user}', [AdminController::class, 'deleteUser'])->name('users.delete');

    // Product & Part Management
    Route::get('/products', [AdminController::class, 'products'])->name('products');
    Route::post('/models', [AdminController::class, 'storeModel'])->name('models.store');
    Route::delete('/models/{productModel}', [AdminController::class, 'deleteModel'])->name('models.delete');
    Route::post('/parts', [AdminController::class, 'storePart'])->name('parts.store');
    Route::put('/parts/{part}', [AdminController::class, 'updatePart'])->name('parts.update');
    Route::delete('/parts/{part}', [AdminController::class, 'deletePart'])->name('parts.delete');
});

// ==========================================
// SUPERVISOR ROUTES
// ==========================================
Route::middleware(['auth', 'role:supervisor,admin'])->prefix('supervisor')->name('supervisor.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'supervisorDashboard'])->name('dashboard');
    Route::get('/live-stats', [DashboardController::class, 'liveStats'])->name('live-stats');
});

// ==========================================
// OPERATOR ROUTES
// ==========================================
Route::middleware(['auth', 'role:operator,admin'])->prefix('operator')->name('operator.')->group(function () {
    Route::get('/scanner', [InspectionController::class, 'scanner'])->name('scanner');
    Route::post('/analyze', [InspectionController::class, 'analyze'])->name('analyze');
    Route::get('/history', [InspectionController::class, 'todayHistory'])->name('history');
});