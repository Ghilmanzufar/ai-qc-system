@extends('layouts.app')

@section('title', 'Operator Workspace - AI QC')

@section('content')
<!-- Container Utama: Dibatasi lebarnya agar tidak terlalu melar di monitor ultra-wide -->
<div class="flex flex-col h-full max-w-7xl mx-auto w-full gap-5">

    <!-- 1. Header / Control Panel (Sleek & Minimalist) -->
    <div class="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200 p-4 flex flex-col md:flex-row justify-between items-center gap-4 transition-all">
        
        <!-- Left: Status Info -->
        <div class="flex items-center gap-3 w-full md:w-auto">
            <div class="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full text-sm font-medium text-slate-600">
                <span class="material-symbols-outlined text-[18px]">schedule</span>
                Shift Pagi
            </div>
            <!-- Nama operator dibuat dinamis (Contoh) -->
            <div class="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full text-sm font-medium text-emerald-700 border border-emerald-100">
                <span class="relative flex h-2.5 w-2.5">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                Ghilman (Active)
            </div>
        </div>

        <!-- Right: Modern Selectors -->
        <div class="flex flex-col sm:flex-row w-full md:w-auto gap-3">
            <select class="bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all cursor-pointer w-full sm:w-auto">
                <option>Model: Alpha X1</option>
                <option>Model: Beta V2</option>
            </select>
            <select class="bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all cursor-pointer w-full sm:w-auto">
                <option>Part: Housing Block</option>
                <option>Part: Core Cylinder</option>
            </select>
        </div>
    </div>

    <!-- 2. Camera Section (Grid Responsif) -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 flex-1 min-h-[400px]">
        
        <!-- Camera 1 (Main/Depan) -->
        <div class="relative bg-black rounded-3xl overflow-hidden shadow-md border border-slate-200/50 flex flex-col group">
            <!-- Video Stream -->
            <video id="kameraDepan" class="absolute inset-0 w-full h-full object-cover" autoplay playsinline></video>
            
            <!-- Top Overlay Glassmorphism -->
            <div class="absolute top-0 inset-x-0 p-4 bg-gradient-to-b from-black/60 to-transparent flex justify-between items-start z-10 pointer-events-none">
                <div class="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-white text-xs font-semibold tracking-wide border border-white/20">
                    <span class="material-symbols-outlined text-[16px]">videocam</span>
                    CAM A: FRONT
                </div>
                <div class="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 backdrop-blur-md rounded-full text-emerald-400 text-xs font-semibold tracking-wide border border-emerald-500/30">
                    <span class="material-symbols-outlined text-[14px]">check_circle</span>
                    READY
                </div>
            </div>

            <!-- Minimalist Center Focus (Hanya muncul saat di-hover) -->
            <div class="absolute inset-0 flex items-center justify-center pointer-events-none z-10 opacity-30 group-hover:opacity-100 transition-opacity duration-300">
                <div class="w-16 h-16 border-[1.5px] border-white/50 rounded-full flex items-center justify-center">
                    <div class="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
            </div>
        </div>

        <!-- Camera 2 (Secondary/Belakang) -->
        <div class="relative bg-slate-900 rounded-3xl overflow-hidden shadow-md border border-slate-200/50 flex flex-col items-center justify-center">
             <!-- Top Overlay -->
             <div class="absolute top-0 inset-x-0 p-4 flex justify-between items-start z-10 pointer-events-none">
                <div class="flex items-center gap-2 px-3 py-1.5 bg-white/5 backdrop-blur-md rounded-full text-white/60 text-xs font-semibold tracking-wide border border-white/10">
                    <span class="material-symbols-outlined text-[16px]">videocam</span>
                    CAM B: BACK
                </div>
            </div>

            <!-- Placeholder Waiting -->
            <div class="flex flex-col items-center text-slate-500 gap-3 animate-pulse">
                <span class="material-symbols-outlined text-5xl opacity-40">linked_camera</span>
                <p class="text-xs font-medium tracking-widest uppercase">Waiting for connection</p>
            </div>
        </div>
    </div>

    <!-- 3. Action / Footer Area (Floating Card modern) -->
    <div class="bg-white rounded-3xl shadow-sm border border-slate-200 p-5 sm:p-6 flex flex-col md:flex-row justify-between items-center gap-6 mt-auto">
        
        <!-- Output Stats -->
        <div class="flex items-center gap-6 w-full md:w-auto justify-center md:justify-start">
            <div class="text-center md:text-left">
                <p class="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Today's Output</p>
                <div class="flex items-end gap-1.5 justify-center md:justify-start">
                    <span class="text-3xl font-black text-slate-800 leading-none">148</span>
                    <span class="text-xs font-bold text-emerald-500 mb-1">PASS</span>
                </div>
            </div>
            <div class="w-px h-10 bg-slate-200"></div>
            <div class="text-center md:text-left">
                <p class="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Defect</p>
                <div class="flex items-end gap-1.5 justify-center md:justify-start">
                    <span class="text-3xl font-black text-slate-800 leading-none">2</span>
                    <span class="text-xs font-bold text-red-500 mb-1">NG</span>
                </div>
            </div>
        </div>

        <!-- Primary Action Button (Modern Gradient/Shadow) -->
        <button id="btnScan" class="w-full md:w-auto overflow-hidden rounded-2xl bg-indigo-600 px-8 py-3.5 text-white shadow-[0_8px_30px_rgb(79,70,229,0.3)] transition-all hover:bg-indigo-500 hover:-translate-y-1 hover:shadow-[0_10px_40px_rgb(79,70,229,0.4)] active:translate-y-0 active:scale-95 flex items-center justify-center gap-3">
            <span class="material-symbols-outlined text-[28px]">center_focus_strong</span>
            <div class="flex flex-col items-start text-left">
                <span class="text-base font-bold tracking-wide">SCAN PART</span>
                <span class="text-[10px] font-medium text-indigo-200 uppercase tracking-wider">Tekan SPASI untuk foto</span>
            </div>
        </button>
    </div>

</div>

<!-- Canvas Tersembunyi untuk Proses Jepret -->
<canvas id="canvasHasil" class="hidden"></canvas>
@endsection

@push('scripts')
<script>
    document.addEventListener("DOMContentLoaded", function() {
        const videoElement = document.getElementById('kameraDepan');

        // Menyalakan Kamera
        navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } } 
        })
        .then(stream => videoElement.srcObject = stream)
        .catch(error => {
            console.error("Kamera gagal:", error);
            alert("Gagal mengakses kamera perangkat.");
        });
    });
</script>
@endpush