// GANTI DENGAN URL DEPLOY GOOGLE APPS SCRIPT ANDA
const GAS_URL = 'https://script.google.com/macros/s/AKfycbwPCdCnhshiFTy-pcAO2a3b1xTaQb8CiZQ8kiR1pzpb-uquAcGMWEvwwR8kDjonaDCI/exec';

// Fungsi untuk mengambil data terbaru dari Google Sheets
function fetchDataAntrian() {
    fetch(GAS_URL + '?action=getAntrian')
        .then(response => response.json())
        .then(data => {
            // Filter data berdasarkan status
            let antrianMenunggu = data.filter(item => item.status === 'menunggu');
            let antrianDilewati = data.filter(item => item.status === 'dilewati');

            // 1. Update Layar Utama (Ambil urutan pertama dari yang 'menunggu')
            if (antrianMenunggu.length > 0) {
                let aktif = antrianMenunggu[0];
                document.getElementById('nomorSaatIni').innerText = aktif.nomorAntrian;
                document.getElementById('namaSaatIni').innerText = aktif.nama;
                document.getElementById('idAntrianAktif').value = aktif.id;
            } else {
                document.getElementById('nomorSaatIni').innerText = "Kosong";
                document.getElementById('namaSaatIni').innerText = "Belum ada antrian";
                document.getElementById('idAntrianAktif').value = "";
            }

            // 2. Update Sidebar Kiri (Daftar Lewati)
            let listHTML = '';
            antrianDilewati.forEach(item => {
                listHTML += `<li>
                    <b>${item.nama}</b><br>
                    Nomor: ${item.nomorAntrian} <br>
                    HP: ${item.noHp}
                </li>`;
            });
            
            if(listHTML === '') {
                listHTML = '<li style="border-left:none; text-align:center; background:none;">Tidak ada antrian dilewati</li>';
            }
            
            document.getElementById('listDilewati').innerHTML = listHTML;
        })
        .catch(error => console.error('Gagal mengambil data:', error));
}

// Fungsi mengeksekusi tombol "Selesai" atau "Lewati"
function updateStatus(statusAksi) {
    let idAktif = document.getElementById('idAntrianAktif').value;
    
    if (!idAktif) {
        alert("Tidak ada antrian yang sedang diproses saat ini!");
        return;
    }

    // Menonaktifkan tombol sementara agar tidak diklik dua kali
    let btnHijau = document.querySelector('.btn-hijau');
    let btnKuning = document.querySelector('.btn-kuning');
    btnHijau.disabled = true;
    btnKuning.disabled = true;

    // Mengirim data update ke GAS
    fetch(GAS_URL, {
        method: 'POST',
        body: JSON.stringify({
            action: "updateStatus",
            idAntrian: idAktif,
            status: statusAksi
        })
    })
    .then(response => response.json())
    .then(result => {
        if(result.result === "success") {
            // Panggil antrian berikutnya secara instan
            fetchDataAntrian(); 
        }
    })
    .catch(error => alert('Gagal mengupdate status!'))
    .finally(() => {
        // Mengaktifkan kembali tombol
        btnHijau.disabled = false;
        btnKuning.disabled = false;
    });
}

// Jalankan fetch pertama kali web dibuka
fetchDataAntrian();

// Auto-refresh data secara background setiap 3 detik
setInterval(fetchDataAntrian, 3000);
