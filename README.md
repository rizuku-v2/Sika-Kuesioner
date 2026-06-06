# MySika Kuesioner Otomatis

> Ekstensi Chrome tidak resmi untuk membantu mahasiswa Unindra mengisi kuesioner **EDOM** (Evaluasi Dosen oleh Mahasiswa) dan **Kuesioner Layanan** di portal SIKA dengan lebih cepat dan efisien.

![Tangkapan Layar Ekstensi](https://files.catbox.moe/sa7jfy.jpg)

---

## 🛡️ Keamanan Terjamin

> **100% Bersih & Aman**

Ekstensi ini **tidak mengandung virus, malware, spyware, atau kode berbahaya lainnya**. Cara kerjanya murni berbasis injeksi skrip ke halaman SIKA yang sudah Anda buka sendiri — tidak ada data yang dikirim ke server eksternal, tidak ada informasi login yang dikumpulkan, dan tidak ada aktivitas jaringan di luar domain SIKA Unindra.

---

## ✨ Fitur Utama

| Fitur | Keterangan |
|---|---|
| **Otomatisasi Penuh** | Mengisi semua pertanyaan pilihan ganda dalam hitungan detik |
| **Penilaian Fleksibel** | Pilih mode: Sangat Baik, Baik, atau Acak |
| **Komentar Otomatis** | Kolom kritik & saran terisi secara otomatis |
| **Konfirmasi Otomatis** | Melewati popup "Apakah Anda yakin?" tanpa intervensi manual |
| **Animasi Scrolling** | Umpan balik visual saat proses pengisian berjalan |
| **Antarmuka Modern** | Desain bersih, intuitif, dan ringan |

### Mode Penilaian
- 🟢 **Sangat Baik** — Semua jawaban diisi dengan nilai tertinggi
- 🔵 **Baik** — Semua jawaban diisi dengan nilai kedua tertinggi
- 🔀 **Acak** — Kombinasi "Sangat Baik" dan "Baik" secara acak untuk tampilan lebih natural

---

## 📁 Struktur File

```
mysika-kuesioner/
│
├── manifest.json           # Konfigurasi ekstensi Chrome (nama, versi, izin)
├── popup.html              # Tampilan antarmuka popup ekstensi
├── popup.css               # Styling antarmuka popup
├── popup.js                # Logika tombol dan komunikasi dengan content script
│
├── content/
│   ├── edom.js             # Skrip otomasi untuk halaman Kuesioner EDOM
│   └── layanan.js          # Skrip otomasi untuk halaman Kuesioner Layanan
│
├── icons/
│   ├── icon16.png          # Ikon ekstensi 16×16
│   ├── icon48.png          # Ikon ekstensi 48×48
│   └── icon128.png         # Ikon ekstensi 128×128
│
└── README.md               # Dokumentasi ini
```

---

## 🔧 Cara Kerja

Ekstensi ini bekerja dalam tiga lapisan:

### 1. Popup (`popup.html` + `popup.js`)
Saat ikon ekstensi diklik, Chrome menampilkan popup kecil berisi pilihan mode penilaian dan dua tombol aksi. Ketika tombol ditekan, `popup.js` mengirim pesan (`chrome.tabs.sendMessage`) ke tab aktif yang sedang membuka halaman SIKA.

### 2. Content Script (`content/edom.js` / `content/layanan.js`)
Script menerima pesan dari popup dan langsung beroperasi di DOM halaman SIKA:
1. **Deteksi Formulir** — Memindai semua elemen `<input type="radio">` atau `<select>` dalam halaman kuesioner.
2. **Pemilihan Jawaban** — Berdasarkan mode yang dipilih (Sangat Baik / Baik / Acak), script memilih opsi yang sesuai pada setiap pertanyaan.
3. **Pengisian Komentar** — Mengisi textarea kritik & saran dengan teks default.
4. **Scrolling Animasi** — Men-scroll halaman secara bertahap agar pengisian terlihat natural.
5. **Submit Otomatis** — Mencari tombol submit, mengkliknya, lalu menangani dialog konfirmasi yang muncul.

### 3. Manifest (`manifest.json`)
Mendefinisikan izin yang dibutuhkan:
- `activeTab` — Akses ke tab yang sedang aktif saja (tidak semua tab)
- `scripting` — Untuk menyuntikkan content script ke halaman
- `host_permissions` — Dibatasi hanya untuk domain SIKA Unindra

> **Tidak ada izin `storage`, `cookies`, atau akses internet ke domain lain.**

---

## 🚀 Instalasi

Karena ekstensi ini tidak dipublikasikan di Chrome Web Store, instalasi dilakukan secara manual dalam mode Developer:

1. **Unduh Repositori**
   Klik tombol hijau **`<> Code`** → **Download ZIP**

2. **Ekstrak File ZIP**
   Ekstrak ke dalam sebuah folder, misalnya `mysika-kuesioner/`

3. **Buka Halaman Ekstensi Chrome**
   Ketik `chrome://extensions` di address bar → tekan **Enter**

4. **Aktifkan Developer Mode**
   Aktifkan saklar **"Developer mode"** di pojok kanan atas

5. **Muat Ekstensi**
   Klik **"Load unpacked"** → pilih folder hasil ekstrak

6. **Selesai!**
   Ikon MySika akan muncul di toolbar Chrome. Sematkan ikon dengan mengklik ikon puzzle 🧩 → klik pin di sebelah MySika

---

## 📖 Cara Penggunaan

1. Login ke portal **SIKA Unindra** di browser Chrome
2. Buka halaman **Kuesioner EDOM** atau **Kuesioner Layanan**
3. Klik ikon **MySika** di toolbar Chrome
4. Pilih **mode penilaian** yang diinginkan:
   - Sangat Baik / Baik / Acak
5. Klik tombol **"Isi Kuesioner EDOM"** atau **"Isi Kuesioner Layanan"**
6. Formulir akan terisi dan tersimpan secara otomatis — tidak perlu intervensi apapun

> 💡 **Tips:** Gunakan mode **Acak** agar pola jawaban terlihat lebih manusiawi dan bervariasi.

---

## 🗺️ Roadmap

Fitur-fitur berikut sedang dalam pertimbangan pengembangan. Fitur yang bertanda **`[Lokal]`** dapat diimplementasikan sepenuhnya tanpa server eksternal dan berjalan di sisi klien.

| Status | Fitur | Keterangan |
|---|---|---|
| 🔄 | **Auto-update System** `[Lokal]` | Ekstensi memeriksa versi terbaru dari repositori GitHub dan memberi tahu pengguna jika ada pembaruan |
| 📊 | **Statistics Dashboard** `[Lokal]` | Menampilkan rekap berapa kuesioner yang sudah diisi, kapan terakhir diisi, dan distribusi penilaian yang digunakan |
| 🎨 | **Multiple Themes** `[Lokal]` | Pilihan tema tampilan popup: Light, Dark, dan System (mengikuti preferensi OS) |
| 📱 | **Mobile Version Support** `[Lokal]` | Deteksi dan penyesuaian skrip otomasi untuk tampilan mobile/responsif portal SIKA |
| 🔔 | **Advanced Notification System** `[Lokal]` | Notifikasi browser native saat proses selesai, gagal, atau ada kuesioner baru yang tersedia di portal |
| 🌐 | **Multi-language Support** `[Lokal]` | Antarmuka popup tersedia dalam Bahasa Indonesia dan English |
| 📈 | **Progress Analytics** `[Lokal]` | Tampilan visual (grafik/chart) kemajuan pengisian kuesioner per semester, disimpan di `localStorage` browser |

> Semua fitur roadmap di atas dirancang untuk berjalan **100% lokal** di browser pengguna tanpa memerlukan koneksi ke server eksternal manapun.

---

## ⚠️ Disclaimer

Aplikasi ini adalah alat bantu **tidak resmi** dan **tidak berafiliasi** dengan Universitas Indraprasta PGRI (Unindra) maupun sistem SIKA. Penggunaan ekstensi ini sepenuhnya merupakan tanggung jawab pengguna. Pengembang tidak bertanggung jawab atas konsekuensi apapun yang timbul dari penggunaan alat ini.

---

## 📄 Lisensi

Didistribusikan di bawah lisensi **MIT**. Bebas digunakan, dimodifikasi, dan didistribusikan ulang dengan tetap mencantumkan atribusi.