<header class="bg-white/80 backdrop-blur-md h-20 flex justify-between items-center w-full px-4 sm:px-8 z-30 shrink-0 border-b border-slate-200 sticky top-0">
    
    <div class="flex items-center gap-4">
        <button onclick="toggleSidebar()" class="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 transition-colors active:scale-95">
            <span class="material-symbols-outlined">menu</span>
        </button>
        
        <div class="hidden sm:flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200 shrink-0">
                <span class="material-symbols-outlined text-white" style="font-size: 24px;">precision_manufacturing</span>
            </div>
            <div id="topbarTitle" class="text-xl font-black text-slate-800 tracking-tight truncate max-w-[200px] md:max-w-[400px]">
                AI QC System
            </div>
        </div>
    </div>
    
    <div class="flex items-center gap-3 sm:gap-4">
        
        <div class="hidden md:flex items-center gap-2 px-4 h-11 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-sm font-bold shadow-sm">
            <span class="material-symbols-outlined text-[18px] text-indigo-500">calendar_clock</span>
            <span id="realtimeClock" class="tracking-wide">Memuat waktu...</span>
        </div>

        <button class="relative w-11 h-11 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 transition-all active:scale-95 shadow-sm">
            <span class="material-symbols-outlined text-[20px]">notifications</span>
            <span class="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
        </button>
        
        <button id="btnEstop" class="h-11 px-4 sm:px-5 rounded-xl font-bold bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 transition-colors shadow-sm flex items-center gap-2 text-sm">
            <span class="material-symbols-outlined text-[18px] material-symbols-filled">warning</span> <span class="hidden lg:inline">E-Stop</span>
        </button>
    </div>
</header>