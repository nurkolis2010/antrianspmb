// GANTI DENGAN URL DEPLOY GOOGLE APPS SCRIPT ANDA
const GAS_URL = 'https://script.google.com/macros/s/AKfycbwPCdCnhshiFTy-pcAO2a3b1xTaQb8CiZQ8kiR1pzpb-uquAcGMWEvwwR8kDjonaDCI/exec';

function ambilAntrian() {
    const nama = document.getElementById('namaSiswa').value;
    const noHp = document.getElementById('noHp').value;
    const btnAmbil = document.getElementById('btnAmbil');

    // Validasi sederhana
    if (nama.trim() === "" || noHp.trim() === "") {
        alert("Harap isi Nama dan Nomor HP!");
        return;
    }

    // Ubah teks tombol menjadi loading
    btnAmbil.innerText = "Memproses...";
    btnAmbil.disabled = true;

    // Data yang dikirim ke backend GAS
    const payload = {
        action: "tambahAntrian",
        namaSiswa: nama,
        noHpSiswa: noHp
    };

    fetch(GAS_URL, {
        method: 'POST',
        headers: {
            // Memanipulasi header agar tidak memicu CORS Preflight Error
            'Content-Type': 'text/plain;charset=utf-8', 
        },
        body: JSON.stringify(payload),
        redirect: 'follow' // Wajib agar bisa mengikuti redirect dari server Google
    })
    .then(response => response.json())
    .then(data => {
        // Menyembunyikan form input
        document.getElementById('namaSiswa').style.display = 'none';
        document.getElementById('noHp').style.display = 'none';
        btnAmbil.style.display = 'none';

        // Menampilkan hasil antrian
        document.getElementById('hasilAntrian').style.display = 'block';
        document.getElementById('nomorCetak').innerText = data.nomorAntrian; // Respons dari GAS
        document.getElementById('infoLoket').innerText = "Silakan tunggu panggilan di ruang tunggu.";
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Terjadi kesalahan jaringan. Coba lagi.");
        btnAmbil.innerText = "AMBIL ANTRIAN";
        btnAmbil.disabled = false;
    });
}
