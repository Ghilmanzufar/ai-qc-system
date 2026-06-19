// ==========================================
// ui.js - Mengurus Tampilan Global (Sidebar, Jam, Alert)
// ==========================================

window.toggleSidebar = function() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (!sidebar || !overlay) return;

    sidebar.classList.toggle('-translate-x-full');
    if (sidebar.classList.contains('-translate-x-full')) {
        overlay.classList.add('opacity-0');
        setTimeout(() => overlay.classList.add('hidden'), 300);
    } else {
        overlay.classList.remove('hidden');
        setTimeout(() => overlay.classList.remove('opacity-0'), 10);
    }
};

window.showAlert = function(title, message, type = 'error') {
    const overlay = document.getElementById('customAlertOverlay');
    const card = document.getElementById('customAlertCard');
    const alertTitle = document.getElementById('alertTitle');
    const alertMessage = document.getElementById('alertMessage');
    const alertIconBg = document.getElementById('alertIconBg');
    const alertIcon = document.getElementById('alertIcon');
    const alertBtn = document.getElementById('alertBtn');

    if (!overlay) return;

    alertTitle.innerText = title;
    alertMessage.innerText = message;
    alertIconBg.className = "w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-inner";
    alertBtn.className = "w-full py-4 rounded-xl font-bold text-white transition-all active:scale-95 shadow-lg tracking-widest text-sm";

    if (type === 'error') {
        alertIconBg.classList.add('bg-red-50');
        alertIcon.className = "material-symbols-outlined text-red-500 text-[52px]";
        alertIcon.innerText = "warning";
        alertBtn.classList.add('bg-red-500', 'hover:bg-red-400', 'shadow-red-500/30');
    } else {
        alertIconBg.classList.add('bg-emerald-50');
        alertIcon.className = "material-symbols-outlined text-emerald-500 text-[52px]";
        alertIcon.innerText = "check_circle";
        alertBtn.classList.add('bg-emerald-500', 'hover:bg-emerald-400', 'shadow-emerald-500/30');
    }

    overlay.classList.remove('hidden');
    overlay.classList.add('flex');
    setTimeout(() => {
        overlay.classList.remove('opacity-0');
        card.classList.remove('scale-95', 'translate-y-4');
        card.classList.add('scale-100', 'translate-y-0');
    }, 10);
};

window.closeAlert = function() {
    const overlay = document.getElementById('customAlertOverlay');
    const card = document.getElementById('customAlertCard');
    if (!overlay) return;

    overlay.classList.add('opacity-0');
    card.classList.remove('scale-100', 'translate-y-0');
    card.classList.add('scale-95', 'translate-y-4');
    setTimeout(() => {
        overlay.classList.add('hidden');
        overlay.classList.remove('flex');
    }, 300);
};

window.showConfirm = function(title, message, onConfirmCallback) {
    const overlay = document.getElementById('customConfirmOverlay');
    const card = document.getElementById('customConfirmCard');
    const btnYes = document.getElementById('confirmBtnYes');
    
    if (!overlay) return;

    document.getElementById('confirmTitle').innerText = title;
    document.getElementById('confirmMessage').innerText = message;
    
    const newBtnYes = btnYes.cloneNode(true);
    btnYes.parentNode.replaceChild(newBtnYes, btnYes);
    
    newBtnYes.addEventListener('click', function() {
        window.closeConfirm();
        if (typeof onConfirmCallback === 'function') onConfirmCallback();
    });

    overlay.classList.remove('hidden');
    overlay.classList.add('flex');
    setTimeout(() => {
        overlay.classList.remove('opacity-0');
        card.classList.remove('scale-95', 'translate-y-4');
        card.classList.add('scale-100', 'translate-y-0');
    }, 10);
};

window.closeConfirm = function() {
    const overlay = document.getElementById('customConfirmOverlay');
    const card = document.getElementById('customConfirmCard');
    if (!overlay) return;

    overlay.classList.add('opacity-0');
    card.classList.remove('scale-100', 'translate-y-0');
    card.classList.add('scale-95', 'translate-y-4');
    setTimeout(() => {
        overlay.classList.add('hidden');
        overlay.classList.remove('flex');
    }, 300);
};

// ==========================================
// FUNGSI SAKTI: UBAH WARNA TOMBOL TOPBAR
// ==========================================
window.updateTopbarPowerButton = function(isOnline) {
    const btnEstop = document.getElementById('btnEstop');
    if (!btnEstop) return;

    if (isOnline) {
        // Jika mesin nyala, tombol jadi Merah (E-Stop)
        btnEstop.className = "h-11 px-4 sm:px-5 rounded-xl font-bold bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 transition-colors shadow-sm flex items-center gap-2 text-sm";
        btnEstop.innerHTML = `<span class="material-symbols-outlined text-[18px] material-symbols-filled">warning</span> <span class="hidden lg:inline">E-Stop</span>`;
    } else {
        // Jika mesin mati, tombol jadi Hijau (Start System)
        btnEstop.className = "h-11 px-4 sm:px-5 rounded-xl font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100 transition-colors shadow-sm flex items-center gap-2 text-sm";
        btnEstop.innerHTML = `<span class="material-symbols-outlined text-[18px] material-symbols-filled">power</span> <span class="hidden lg:inline">Start</span>`;
    }
};

// Event Listener Tombol Power/E-Stop di Topbar
document.addEventListener("DOMContentLoaded", function() {
    const btnEstop = document.getElementById('btnEstop');
    if (btnEstop) {
        btnEstop.addEventListener('click', function() {
            // Cek apakah kamera saat ini sedang nyala atau mati
            const videoElement = document.getElementById('kameraDepan');
            const isOnline = videoElement && videoElement.srcObject !== null;

            if (isOnline) {
                // Mesin sedang nyala -> Tampilkan Konfirmasi Stop
                window.showConfirm(
                    "Hentikan Inspeksi?", 
                    "Tindakan ini akan mematikan kamera dan menghapus Part yang sedang aktif. Lanjutkan?", 
                    function() {
                        if (window.stopCamera) window.stopCamera();
                        if (window.resetInspection) window.resetInspection();
                        window.showAlert("Sistem Dihentikan", "Kamera dan sesi inspeksi telah dihentikan secara manual.", "success");
                    }
                );
            } else {
                // Mesin sedang mati -> Langsung hidupkan mesin
                if (window.startCamera) window.startCamera();
                window.showAlert("Mesin Dihidupkan", "Sistem kamera berhasil dinyalakan. Silakan muat Part untuk mulai inspeksi.", "success");
            }
        });
    }
});

// Real-Time Clock
function updateClock() {
    const clockElement = document.getElementById('realtimeClock');
    if (!clockElement) return; 

    const now = new Date();
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
    
    clockElement.innerHTML = `${days[now.getDay()]}, ${String(now.getDate()).padStart(2, '0')} ${months[now.getMonth()]} ${now.getFullYear()} &nbsp;&bull;&nbsp; ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
}

document.addEventListener("DOMContentLoaded", function() {
    if (document.getElementById('realtimeClock')) {
        setInterval(updateClock, 1000);
        updateClock();
    }
});