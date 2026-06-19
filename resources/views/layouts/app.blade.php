<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'AI QC System')</title>
    
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&display=swap" rel="stylesheet"/>
    
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    
    <style>
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .material-symbols-filled { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
    </style>
</head>
<body class="bg-slate-50 text-slate-900 font-sans h-screen w-screen overflow-hidden flex selection:bg-indigo-100 selection:text-indigo-900">

    <!-- Overlay Gelap (Sekarang aktif di semua ukuran layar) -->
    <div id="sidebarOverlay" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 hidden transition-opacity duration-300 opacity-0" onclick="toggleSidebar()"></div>

    <!-- Panggil Komponen Sidebar -->
    @include('components.sidebar')

    <!-- HAPUS lg:ml-[280px] dan ganti dengan ml-0 agar layar Fullscreen penuh -->
    <div id="mainContent" class="flex-1 flex flex-col h-screen relative bg-slate-50 transition-all duration-300 w-full overflow-hidden ml-0">
        
        @include('components.topbar')

        <main class="flex-1 flex flex-col p-4 sm:p-6 gap-6 overflow-y-auto">
            @yield('content')
        </main>

    </div>
</body>
</html>