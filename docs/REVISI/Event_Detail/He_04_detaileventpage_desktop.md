# Heuristic Evaluation — Bagian 04: Halaman Detail Event (Desktop View)
>
> Sumber: hasil penilaian evaluator terhadap website Sougen. Diterjemahkan dari kalimat evaluator menjadi instruksi perbaikan yang rinci untuk developer / AI coding agent.

## Legenda Skala Penilaian

- **Severity (S):** S1 = kosmetik/tidak berdampak · S2 = ringan/prioritas rendah · S3 = besar/prioritas tinggi · S4 = catastrophe/wajib fix sebelum rilis
- **Ease to Fix (E):** E1 = mudah · E2 = effort sedang · E3 = effort tinggi · E4 = effort ekstrem

---

## [x] 4.1 — Perulangan Informasi Tanggal dan Lokasi

**Lokasi:** Hero Section, Halaman Detail Event · **Rating: S2 + E1** (quick win)

- **Masalah:** Di bagian hero section, tanggal dan nama lokasi event sudah ditampilkan (di bawah judul "Joyfull Spring"). Namun tepat setelah hero section, ada lagi blok informasi terpisah (card "Day 1"/"Day 2" dan card "Lokasi Event") yang menampilkan ulang informasi tanggal dan lokasi yang **sama persis**.
- **Dampak:** Duplikasi informasi yang tidak perlu — membuang ruang halaman dan berpotensi membingungkan pengguna karena info yang sama muncul dua kali tanpa nilai tambah.
- **Instruksi perbaikan** — pilih salah satu:
  - **Opsi A:** Hero section cukup menampilkan ringkasan singkat (judul + satu baris tanggal-lokasi), sementara blok Day1/Day2 & Lokasi Event di bawahnya menjadi sumber detail utama — bisa diperkaya dengan info tambahan (jam per hari, alamat lengkap) supaya benar-benar memberi nilai tambah, bukan sekadar duplikasi.
  - **Opsi B:** Gabungkan kedua blok jadi satu komponen info terpadu, tidak dipisah dan diulang.

---

## [x] 4.2 — Padding Antar Section Terlalu Lebar

**Lokasi:** Antar section Halaman Detail Event (khususnya area setelah blok Lokasi Event, sebelum Programs Section) · **Rating: S2 + E1** (quick win)

- **Masalah:** Padding/jarak antar section di halaman ini terlalu lebar, menciptakan banyak ruang kosong yang tidak perlu dan membuat halaman terasa lebih panjang dari yang seharusnya.
- **Instruksi perbaikan:** Kurangi padding vertikal antar section ke ukuran yang lebih proporsional, dan pastikan konsisten dengan spacing di halaman-halaman lain di website.

---

## [x] 4.3 — Masalah pada Section Program (Berulang dari Halaman Home)

**Lokasi:** Programs Section, Halaman Detail Event · **Rating: S3 + E1** (quick win prioritas tinggi)

- **Masalah:** Masalah yang **sama persis** dengan temuan **2.6** (gambar di section program tidak tampil sempurna — hanya setengah gambar yang muncul) dan **2.7** (deskripsi program terlalu panjang) dari Halaman Home, kembali terjadi di halaman ini.
- **Instruksi perbaikan:** Terapkan perbaikan yang sama seperti dirumuskan untuk 2.6 dan 2.7 di dokumen `HE-02-HomePage-Desktop.md`.
- 💡 **Catatan penting untuk AI agent:** Karena bug ini muncul identik di dua halaman berbeda (Home & Detail Event), kemungkinan besar section Program adalah **komponen yang di-reuse** di kedua halaman. Sebaiknya perbaikan dilakukan di level komponen shared tersebut, bukan diperbaiki terpisah per halaman — supaya satu kali fix otomatis berlaku di semua tempat komponen ini dipakai.

---

## [x] 4.4 — Masalah pada Section Rundown (Berulang dari Halaman Home)

**Lokasi:** Rundown Section, Halaman Detail Event · **Rating: S3 + E2**

- **Masalah:** Masalah yang **sama persis** dengan temuan **2.5** (lebar kotak rundown terlalu besar & kebingungan membedakan Day 1 vs Day 2 saat scroll panjang) dari Halaman Home, kembali terjadi di halaman ini.
- **Instruksi perbaikan:** Terapkan perbaikan yang sama seperti dirumuskan untuk 2.5 di dokumen `HE-02-HomePage-Desktop.md`.
- 💡 **Catatan penting untuk AI agent:** Sama seperti 4.3 — ini indikasi kuat bahwa section Rundown juga merupakan komponen shared antara Home dan Detail Event. Perbaiki di level komponen, bukan per halaman.

---

## Ringkasan Prioritas Pengerjaan (berdasarkan S + E)

| Urutan | Poin | Alasan |
| --- | --- | --- |
| 1 | 4.3 | S3 + E1 — dampak besar, gampang dikerjakan, sudah ada solusinya dari dokumen Home |
| 2 | 4.4 | S3 + E2 — dampak besar, effort sedang, sudah ada solusinya dari dokumen Home |
| 3 | 4.1 & 4.2 | S2 + E1 — ringan dan mudah, quick win |

**Catatan lintas dokumen:** 4.3 dan 4.4 tidak perlu dikerjakan sebagai tiket baru — cukup pastikan perbaikan 2.5, 2.6, 2.7 (dokumen Home) diterapkan di level komponen shared, dan efeknya akan otomatis menyelesaikan 4.3 & 4.4 di halaman ini juga.

"*(Tabel ini hanya peta prioritas; isi detail tiap temuan tetap dalam format bulletan sesuai permintaanmu.)*
