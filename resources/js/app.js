import './bootstrap';

// ==========================================
// 1. GLOBAL UI LOGIC (Sidebar & Layout)
// ==========================================

// Jadikan fungsi global (window) agar bisa dipanggil oleh atribut onclick di HTML
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

// ==========================================
// 2. REAL-TIME CLOCK LOGIC
// ==========================================
function updateClock() {
    const clockElement = document.getElementById('realtimeClock');
    if (!clockElement) return; // Keluar jika bukan di halaman yang ada jamnya

    const now = new Date();
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
    
    const dayName = days[now.getDay()];
    const date = String(now.getDate()).padStart(2, '0');
    const monthName = months[now.getMonth()];
    const year = now.getFullYear();
    
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    clockElement.innerHTML = `${dayName}, ${date} ${monthName} ${year} &nbsp;&bull;&nbsp; ${hours}:${minutes}:${seconds}`;
}

// Jalankan jam saat halaman dimuat
document.addEventListener("DOMContentLoaded", function() {
    if (document.getElementById('realtimeClock')) {
        setInterval(updateClock, 1000);
        updateClock();
    }
});


// ==========================================
// 3. CAMERA & INSPECTION LOGIC
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    const videoElement = document.getElementById('kameraDepan');
    
    // Pastikan skrip ini hanya jalan jika ada elemen kamera di halaman tersebut
    if (videoElement) {
        const canvasElement = document.getElementById('canvasHasil');
        const flashEffect = document.getElementById('flashEffect');
        const statusKamera = document.getElementById('statusKamera');
        
        const btnScan = document.getElementById('btnScan');
        const btnRetake = document.getElementById('btnRetake');
        const btnSubmit = document.getElementById('btnSubmit');

        let isPhotoTaken = false;

        // Inisialisasi Kamera
        navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } } 
        })
        .then(stream => videoElement.srcObject = stream)
        .catch(error => {
            console.error("Kamera gagal:", error);
            alert("Gagal mengakses kamera perangkat.");
        });

        // Fungsi Jepret
        function takeSnapshot() {
            if (isPhotoTaken) return;
            
            canvasElement.width = videoElement.videoWidth;
            canvasElement.height = videoElement.videoHeight;
            const context = canvasElement.getContext('2d');
            context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

            flashEffect.classList.remove('opacity-0');
            setTimeout(() => flashEffect.classList.add('opacity-0'), 150);

            videoElement.classList.add('hidden');
            canvasElement.classList.remove('hidden');

            statusKamera.innerHTML = '<span class="material-symbols-outlined text-[14px]">image</span> CAPTURED';
            statusKamera.className = 'flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/20 backdrop-blur-md rounded-full text-indigo-400 text-xs font-semibold tracking-wide border border-indigo-500/30 transition-colors';

            btnScan.classList.add('hidden');
            btnRetake.classList.remove('hidden');
            btnSubmit.classList.remove('hidden');

            isPhotoTaken = true;
        }

        // Fungsi Foto Ulang
        function retakeSnapshot() {
            canvasElement.classList.add('hidden');
            videoElement.classList.remove('hidden');

            statusKamera.innerHTML = '<span class="material-symbols-outlined text-[14px]">check_circle</span> READY';
            statusKamera.className = 'flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 backdrop-blur-md rounded-full text-emerald-400 text-xs font-semibold tracking-wide border border-emerald-500/30 transition-colors';

            btnScan.classList.remove('hidden');
            btnRetake.classList.add('hidden');
            btnSubmit.classList.add('hidden');

            isPhotoTaken = false;
        }

        // Bind Event Listeners
        if (btnScan) btnScan.addEventListener('click', takeSnapshot);
        if (btnRetake) btnRetake.addEventListener('click', retakeSnapshot);

        document.addEventListener('keydown', function(event) {
            if (event.code === 'Space' && event.target.tagName !== 'INPUT') {
                event.preventDefault();
                if (!isPhotoTaken) takeSnapshot();
            }
        });
    }
});

// ==========================================
// 4. DYNAMIC DROPDOWN LOGIC & SUBMIT ACTION
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    const inputModel = document.getElementById('inputModel');
    const inputPart = document.getElementById('inputPart');
    const partList = document.getElementById('partList');
    
    const btnMuatPart = document.getElementById('btnMuatPart'); // Tangkap tombol
    const topbarTitle = document.getElementById('topbarTitle'); 

    if (inputModel && inputPart) {
        
        // 1. Logika saat Model dipilih (Sama seperti sebelumnya, hanya Fetch Part)
        inputModel.addEventListener('change', function() {
            const selectedOption = document.querySelector(`#modelList option[value="${this.value}"]`);
            
            if (selectedOption) {
                const modelId = selectedOption.getAttribute('data-id');
                
                inputPart.disabled = false;
                inputPart.placeholder = "Memuat data part...";
                inputPart.value = "";
                partList.innerHTML = ""; 

                fetch(`/api/parts/${modelId}`)
                    .then(response => response.json())
                    .then(data => {
                        inputPart.placeholder = "Ketik atau Pilih Part No / Nama Part...";
                        data.forEach(part => {
                            const option = document.createElement('option');
                            option.value = `${part.part_no} | ${part.part_name}`;
                            partList.appendChild(option);
                        });
                    })
                    .catch(error => {
                        console.error('Error fetching parts:', error);
                        inputPart.placeholder = "Gagal memuat part!";
                    });
            } else {
                inputPart.disabled = true;
                inputPart.placeholder = "Pilih Model terlebih dahulu...";
                inputPart.value = "";
                partList.innerHTML = "";
            }
        });

        // 2. Logika Utama Saat Dieksekusi (Diklik atau Enter)
        function prosesMuatPart() {
            const modelVal = inputModel.value;
            const partVal = inputPart.value;

            // Validasi: Pastikan Model dan Part sudah terisi
            if (modelVal && partVal && inputPart.disabled === false) {
                
                // Kunci teks ke Topbar
                if (topbarTitle) {
                    topbarTitle.innerHTML = `<span class="text-slate-400 font-medium text-lg">${modelVal}</span> <span class="mx-1.5 text-slate-300">/</span> <span>${partVal}</span>`;
                }

                // Bersihkan kolom pencarian agar rapi kembali
                inputModel.value = "";
                inputPart.value = "";
                inputPart.disabled = true;
                inputPart.placeholder = "Pilih Model terlebih dahulu...";
                partList.innerHTML = "";
                
            } else {
                // Beri peringatan jika user iseng memencet tombol saat data kosong
                alert("Silakan pilih Model dan Part dengan lengkap terlebih dahulu!");
            }
        }

        // Panggil fungsi saat tombol diklik
        if (btnMuatPart) {
            btnMuatPart.addEventListener('click', prosesMuatPart);
        }

        // Panggil fungsi saat user menekan 'Enter' di kolom Part
        inputPart.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault(); // Mencegah halaman ke-refresh otomatis
                prosesMuatPart();
            }
        });
    }
});