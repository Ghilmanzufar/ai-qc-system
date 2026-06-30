<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\InspectionController;
use App\Http\Controllers\AnnouncementController;

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
        'member' => redirect()->route('operator.dashboard'),
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

    // Announcements Management
    Route::get('/announcements', [AnnouncementController::class, 'index'])->name('announcements.index');
    Route::post('/announcements', [AnnouncementController::class, 'store'])->name('announcements.store');
    Route::delete('/announcements/{id}', [AnnouncementController::class, 'destroy'])->name('announcements.destroy');
});

// ==========================================
// SUPERVISOR ROUTES
// ==========================================
Route::middleware(['auth', 'role:supervisor,admin'])->prefix('supervisor')->name('supervisor.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'supervisorDashboard'])->name('dashboard');
    Route::get('/live-stats', [DashboardController::class, 'liveStats'])->name('live-stats');
});

// ==========================================
// MEMBER ROUTES
// ==========================================
Route::middleware(['auth', 'role:member,admin'])->prefix('member')->name('operator.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'operatorDashboard'])->name('dashboard');
    Route::get('/setup', [InspectionController::class, 'setup'])->name('setup');
    Route::get('/scanner', [InspectionController::class, 'scanner'])->name('scanner');
    Route::post('/analyze', [InspectionController::class, 'analyze'])->name('analyze');
    Route::get('/history', [InspectionController::class, 'history'])->name('history');

    // Announcement routes
    Route::get('/announcements/active', [AnnouncementController::class, 'active'])->name('announcements.active');
    Route::post('/announcements/{id}/read', [AnnouncementController::class, 'markRead'])->name('announcements.read');
});

// ==========================================
// DEMO ROUTES (Temporary)
// ==========================================
Route::get('/demo', [\App\Http\Controllers\DemoController::class, 'index'])->name('demo.index');
Route::post('/demo/analyze', [\App\Http\Controllers\DemoController::class, 'analyze'])->name('demo.analyze');