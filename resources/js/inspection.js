// ==========================================
// inspection.js - Mengurus Data Part yang Sedang Aktif
// ==========================================

window.activeInspection = {
    model: null,
    part: null
};

// FUNGSI RESET (Dipanggil saat E-Stop)
window.resetInspection = function() {
    window.activeInspection.model = null;
    window.activeInspection.part = null;
    
    const inputModel = document.getElementById('inputModel');
    const inputPart = document.getElementById('inputPart');
    const partList = document.getElementById('partList');
    const topbarTitle = document.getElementById('topbarTitle');
    
    if(inputModel) inputModel.value = "";
    if(inputPart) {
        inputPart.value = "";
        inputPart.disabled = true;
        inputPart.placeholder = "Pilih Model terlebih dahulu...";
    }
    if(partList) partList.innerHTML = "";
    if(topbarTitle) topbarTitle.innerHTML = "AI Packing System";
};

document.addEventListener("DOMContentLoaded", function() {
    const inputModel = document.getElementById('inputModel');
    const inputPart = document.getElementById('inputPart');
    const partList = document.getElementById('partList');
    const btnMuatPart = document.getElementById('btnMuatPart'); 
    const topbarTitle = document.getElementById('topbarTitle'); 

    if (inputModel && inputPart) {
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
                    .catch(error => console.error('Error fetching parts:', error));
            } else {
                inputPart.disabled = true;
                inputPart.placeholder = "Pilih Model terlebih dahulu...";
                inputPart.value = "";
                partList.innerHTML = "";
            }
        });

        function prosesMuatPart() {
            const modelVal = inputModel.value;
            const partVal = inputPart.value;

            if (modelVal && partVal && inputPart.disabled === false) {
                window.activeInspection.model = modelVal;
                window.activeInspection.part = partVal;

                if (topbarTitle) {
                    topbarTitle.innerHTML = `<span class="text-slate-400 font-medium text-lg">${modelVal}</span> <span class="mx-1.5 text-slate-300">/</span> <span>${partVal}</span>`;
                }

                inputModel.value = "";
                inputPart.value = "";
                inputPart.disabled = true;
                inputPart.placeholder = "Pilih Model terlebih dahulu...";
                partList.innerHTML = "";
                
                window.showAlert("Berhasil Dimuat", "Part telah dikunci. Silakan tekan SPASI untuk mulai menjepret kamera.", "success");
                
                // NYALAKAN KAMERA JIKA SEBELUMNYA DIMATIKAN
                if (window.startCamera) window.startCamera();
            } else {
                window.showAlert("Data Tidak Lengkap", "Silakan pilih Model dan Part dengan lengkap terlebih dahulu sebelum menekan tombol Muat!", "error");
            }
        }

        if (btnMuatPart) btnMuatPart.addEventListener('click', prosesMuatPart);
        inputPart.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault(); 
                prosesMuatPart();
            }
        });
    }
});