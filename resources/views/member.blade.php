@extends('layouts.app')

@section('title', 'Member Workspace - AI QC')

@section('content')

<div id="customAlertOverlay" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] hidden items-center justify-center opacity-0 transition-opacity duration-300">
    <div id="customAlertCard" class="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full mx-4 transform scale-95 translate-y-4 transition-all duration-300 flex flex-col items-center text-center">
        <div id="alertIconBg" class="w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <span id="alertIcon" class="material-symbols-outlined text-[52px]">warning</span>
        </div>
        <h3 id="alertTitle" class="text-2xl font-black text-slate-800 mb-2 tracking-tight">Peringatan!</h3>
        <p id="alertMessage" class="text-sm text-slate-500 font-medium mb-8 leading-relaxed">Pesan notifikasi di sini...</p>
        <button onclick="closeAlert()" id="alertBtn" class="w-full py-4 rounded-xl font-bold text-white transition-all active:scale-95 shadow-md tracking-widest text-sm">
            MENGERTI
        </button>
    </div>
</div>

<div id="customConfirmOverlay" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] hidden items-center justify-center opacity-0 transition-opacity duration-300">
    <div id="customConfirmCard" class="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full mx-4 transform scale-95 translate-y-4 transition-all duration-300 flex flex-col items-center text-center">
        <div class="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center mb-6 shadow-inner">
            <span class="material-symbols-outlined text-red-500 text-[52px]">stop_circle</span>
        </div>
        <h3 id="confirmTitle" class="text-2xl font-black text-slate-800 mb-2 tracking-tight">Konfirmasi</h3>
        <p id="confirmMessage" class="text-sm text-slate-500 font-medium mb-8 leading-relaxed">Pesan konfirmasi di sini...</p>
        <div class="flex w-full gap-3">
            <button onclick="closeConfirm()" class="w-1/2 py-3.5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all active:scale-95 text-sm tracking-widest">
                BATAL
            </button>
            <button id="confirmBtnYes" class="w-1/2 py-3.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-500 shadow-lg shadow-red-500/30 transition-all active:scale-95 text-sm tracking-widest">
                YA, STOP
            </button>
        </div>
    </div>
</div>

<div class="flex flex-col h-full w-full gap-4 lg:gap-5">

    <div class="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200 p-4 flex flex-col md:flex-row items-center gap-4 transition-all shrink-0">
        
        <div class="relative w-full md:w-1/3">
            <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">category</span>
            <input id="inputModel" list="modelList" type="text" placeholder="Ketik atau Pilih Model..." class="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:text-slate-400">
            <datalist id="modelList">
                @foreach($models as $model)
                    <option data-id="{{ $model->id }}" value="{{ $model->name }}"></option>
                @endforeach
            </datalist>
        </div>

        <div class="relative w-full md:flex-1">
            <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">extension</span>
            <input id="inputPart" list="partList" type="text" placeholder="Pilih Model terlebih dahulu..." disabled class="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:text-slate-400 disabled:bg-slate-200 disabled:cursor-not-allowed">
            <datalist id="partList">
                </datalist>
        </div>

        <button id="btnMuatPart" class="w-full md:w-auto px-6 py-3 bg-slate-800 hover:bg-slate-700 active:scale-95 text-white text-sm font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 shrink-0">
            <span class="material-symbols-outlined text-[20px]">manage_search</span>
            Muat Part
        </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5 flex-1 min-h-[500px]">
        
        <div class="relative bg-black rounded-3xl overflow-hidden shadow-md border border-slate-200/50 flex flex-col group">
            <video id="kameraDepan" class="absolute inset-0 w-full h-full object-cover z-0" autoplay playsinline></video>
            
            <canvas id="canvasHasil" class="absolute inset-0 w-full h-full object-cover z-10 hidden"></canvas>
            
            <div id="offlineOverlay" class="absolute inset-0 bg-slate-900 z-40 hidden flex-col items-center justify-center">
                <div class="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-4 shadow-inner border border-slate-700">
                    <span class="material-symbols-outlined text-red-500 text-[40px]">power_off</span>
                </div>
                <h3 class="text-white text-lg font-black tracking-widest uppercase mb-1">Mesin Offline</h3>
                <p class="text-slate-400 text-xs font-medium mb-6">Kamera dan sistem inspeksi telah dihentikan</p>
                <button id="btnPowerOn" class="px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-white shadow-[0_5px_20px_rgb(16,185,129,0.3)] hover:-translate-y-1 rounded-xl font-bold flex items-center gap-3 transition-all active:scale-95">
                    <span class="material-symbols-outlined text-[20px]">power</span>
                    <span class="tracking-wide">HIDUPKAN MESIN</span>
                </button>
            </div>

            <div id="flashEffect" class="absolute inset-0 bg-white z-20 opacity-0 pointer-events-none transition-opacity duration-75"></div>
            
            <div class="absolute top-0 inset-x-0 p-4 bg-gradient-to-b from-black/60 to-transparent flex justify-between items-start z-30 pointer-events-none">
                <div class="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-white text-xs font-semibold tracking-wide border border-white/20">
                    <span class="material-symbols-outlined text-[16px]">videocam</span>
                    CAM A: FRONT
                </div>
                <div id="statusKamera" class="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 backdrop-blur-md rounded-full text-emerald-400 text-xs font-semibold tracking-wide border border-emerald-500/30 transition-colors">
                    <span class="material-symbols-outlined text-[14px]">check_circle</span>
                    READY
                </div>
            </div>

            <div class="absolute inset-0 flex items-center justify-center pointer-events-none z-30 opacity-30 group-hover:opacity-100 transition-opacity duration-300">
                <div class="w-16 h-16 border-[1.5px] border-white/50 rounded-full flex items-center justify-center">
                    <div class="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
            </div>
        </div>

        <div class="relative bg-slate-900 rounded-3xl overflow-hidden shadow-md border border-slate-200/50 flex flex-col items-center justify-center">
             <div class="absolute top-0 inset-x-0 p-4 flex justify-between items-start z-10 pointer-events-none">
                <div class="flex items-center gap-2 px-3 py-1.5 bg-white/5 backdrop-blur-md rounded-full text-white/60 text-xs font-semibold tracking-wide border border-white/10">
                    <span class="material-symbols-outlined text-[16px]">videocam</span>
                    CAM B: BACK
                </div>
            </div>
            <div class="flex flex-col items-center text-slate-500 gap-3 animate-pulse">
                <span class="material-symbols-outlined text-5xl opacity-40">linked_camera</span>
                <p class="text-xs font-medium tracking-widest uppercase">Waiting for connection</p>
            </div>
        </div>
    </div>

    <div class="bg-white rounded-3xl shadow-sm border border-slate-200 p-5 shrink-0 flex flex-col md:flex-row justify-between items-center gap-6 mt-auto">
        
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

        <div class="flex items-center gap-3 w-full md:w-auto">
            
            <button id="btnRetake" class="hidden w-full md:w-auto overflow-hidden rounded-2xl bg-slate-100 border border-slate-300 px-6 py-3.5 text-slate-600 transition-all hover:bg-slate-200 hover:text-slate-800 active:scale-95 flex items-center justify-center gap-2">
                <span class="material-symbols-outlined text-[24px]">refresh</span>
                <span class="text-sm font-bold tracking-wide">RETAKE</span>
            </button>

            <button id="btnSubmit" class="hidden w-full md:w-auto overflow-hidden rounded-2xl bg-emerald-500 px-8 py-3.5 text-white shadow-[0_8px_30px_rgb(16,185,129,0.3)] transition-all hover:bg-emerald-400 hover:-translate-y-1 hover:shadow-[0_10px_40px_rgb(16,185,129,0.4)] active:translate-y-0 active:scale-95 flex items-center justify-center gap-3">
                <span class="material-symbols-outlined text-[28px]">memory</span>
                <div class="flex flex-col items-start text-left">
                    <span class="text-base font-bold tracking-wide">ANALYZE AI</span>
                    <span class="text-[10px] font-medium text-emerald-100 uppercase tracking-wider">Kirim & Periksa</span>
                </div>
            </button>

            <button id="btnScan" class="w-full md:w-auto overflow-hidden rounded-2xl bg-indigo-600 px-8 py-3.5 text-white shadow-[0_8px_30px_rgb(79,70,229,0.3)] transition-all hover:bg-indigo-500 hover:-translate-y-1 hover:shadow-[0_10px_40px_rgb(79,70,229,0.4)] active:translate-y-0 active:scale-95 flex items-center justify-center gap-3">
                <span class="material-symbols-outlined text-[28px]">center_focus_strong</span>
                <div class="flex flex-col items-start text-left">
                    <span class="text-base font-bold tracking-wide">SCAN PART</span>
                    <span class="text-[10px] font-medium text-indigo-200 uppercase tracking-wider">Tekan SPASI untuk foto</span>
                </div>
            </button>

        </div>
    </div>
</div>
@endsection