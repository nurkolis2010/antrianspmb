// Ganti dengan URL Web App Google Apps Script yang sudah di-deploy
const GAS_URL = 'https://script.google.com/macros/s/AKfycbxxx_URL_ANDA_DISINI_xxx/exec';

// Fungsi untuk mengambil data terbaru dari Google Sheets
function fetchDataAntrian() {
    fetch(GAS_URL + '?action=getAntrian')
        .then(response => response.json())
        .then(data => {
            // Logika memisahkan data antrian "menunggu" dan "dilewati"
            let antrianMenunggu = data.filter(item => item.status === 'menunggu');
            let antrianDilewati = data.filter(item => item.status === 'dilewati');

            // 1. Update Layar Utama (Ambil urutan paling atas)
            if (antrianMenunggu.length > 0) {
                let aktif = antrianMenunggu[0];
                document.getElementById('nomorSaatIni').innerText = aktif.nomorAntrian;
                document.getElementById('namaSaatIni').innerText = aktif.nama;
                document.getElementById('idAntrianAktif').value = aktif.id;
            } else {
                document.getElementById('nomorSaatIni').innerText = "Kosong";
                document.getElementById('namaSaatIni').innerText = "-";
                document.getElementById('idAntrianAktif').value = "";
            }

            // 2. Update Sidebar Kiri (List Dilewati)
            let listHTML = '';
            antrianDilewati.forEach(item => {
                listHTML += `<li><b>${item.nama}</b><br>${item.nomorAntrian} - ${item.noHp}</li>`;
            });
            document.getElementById('listDilewati').innerHTML = listHTML;
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Fungsi mengeksekusi tombol "Selesai" atau "Lewati"
function updateStatus(statusAksi) {
    let idAktif = document.getElementById('idAntrianAktif').value;
    
    if (!idAktif) {
        alert("Tidak ada antrian yang sedang diproses!");
        return;
    }

    // Mengirim data POST ke Google Script
    fetch(GAS_URL, {
        method: 'POST',
        body: JSON.stringify({
            idAntrian: idAktif,
            status: statusAksi
        })
    })
    .then(response => response.json())
    .then(result => {
        if(result.result === "success") {
            // Segera panggil antrian berikutnya tanpa menunggu 3 detik
            fetchDataAntrian(); 
        }
    });
}

// Jalankan fetch pertama kali web dibuka
fetchDataAntrian();

// Auto-refresh data secara *background* setiap 3 detik
setInterval(fetchDataAntrian, 3000);
