<!-- HAPUS lg:translate-x-0 dan lg:shadow-none DI SINI -->
<nav id="sidebar" class="bg-white w-[280px] h-full fixed left-0 top-0 flex flex-col border-r border-slate-200 z-50 transition-transform duration-300 ease-in-out -translate-x-full shadow-2xl">
    
    <div class="h-20 flex items-center justify-between px-6 border-b border-slate-100 shrink-0">
        <div>
            <h1 class="text-xl font-black text-slate-800 tracking-tight">PlantFloor<span class="text-indigo-600">.</span></h1>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Area Bekasi</p>
        </div>
        <!-- HAPUS lg:hidden DI SINI -->
        <button onclick="toggleSidebar()" class="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-500 hover:bg-slate-200 transition-colors">
            <span class="material-symbols-outlined text-[20px]">close</span>
        </button>
    </div>

    <div class="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
        <p class="px-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Workspace</p>
        
        <a href="/" class="{{ request()->is('/') ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-100/50' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700' }} h-12 rounded-xl flex items-center px-4 gap-3 w-full text-left font-bold transition-all">
            <span class="material-symbols-outlined {{ request()->is('/') ? 'text-indigo-600 material-symbols-filled' : '' }}" style="font-size: 22px;">biotech</span>
            <span class="text-sm">Inspection</span>
        </a>
        
        <a href="/dashboard" class="{{ request()->is('dashboard') ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-100/50' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700' }} h-12 rounded-xl flex items-center px-4 gap-3 w-full text-left font-bold transition-all">
            <span class="material-symbols-outlined {{ request()->is('dashboard') ? 'text-indigo-600 material-symbols-filled' : '' }}" style="font-size: 22px;">dashboard</span>
            <span class="text-sm">Dashboard</span>
        </a>

        <p class="px-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 mt-6">Settings</p>

        <a href="/admin" class="{{ request()->is('admin') ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-100/50' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700' }} h-12 rounded-xl flex items-center px-4 gap-3 w-full text-left font-bold transition-all">
            <span class="material-symbols-outlined {{ request()->is('admin') ? 'text-indigo-600 material-symbols-filled' : '' }}" style="font-size: 22px;">settings_suggest</span>
            <span class="text-sm">Part Manager</span>
        </a>
    </div>

    <div class="border-t border-slate-100 p-4 shrink-0">
        <div class="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-200">
            <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-sm flex items-center justify-center text-white font-black text-sm">
                GZ
            </div>
            <div class="flex flex-col">
                <span class="text-sm font-bold text-slate-800">Ghilman Z.</span>
                <span class="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Operator</span>
            </div>
        </div>
    </div>
</nav>