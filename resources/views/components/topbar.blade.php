<header class="bg-white/80 backdrop-blur-md h-20 flex justify-between items-center w-full px-4 sm:px-8 z-30 shrink-0 border-b border-slate-200 sticky top-0">
    
    <div class="flex items-center gap-4">
        <!-- HAPUS lg:hidden DI SINI -->
        <button onclick="toggleSidebar()" class="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 transition-colors active:scale-95">
            <span class="material-symbols-outlined">menu</span>
        </button>
        
        <div class="hidden sm:flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                <span class="material-symbols-outlined text-white" style="font-size: 24px;">precision_manufacturing</span>
            </div>
            <div class="text-xl font-black text-slate-800 tracking-tight">AI QC System</div>
        </div>
    </div>
    
    <div class="flex items-center gap-2 sm:gap-4">
        <button class="hidden sm:flex h-11 px-4 rounded-xl font-bold text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-all items-center gap-2 text-sm">
            <span class="material-symbols-outlined text-[18px]">swap_horiz</span> <span>Change Part</span>
        </button>
        
        <button class="h-11 px-4 sm:px-5 rounded-xl font-bold bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 transition-colors shadow-sm flex items-center gap-2 text-sm">
            <span class="material-symbols-outlined text-[18px] material-symbols-filled">warning</span> <span class="hidden md:inline">E-Stop</span>
        </button>
    </div>
</header>