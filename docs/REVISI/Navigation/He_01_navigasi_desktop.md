# Heuristic Evaluation — Bagian 01: Navigasi (Desktop View)
>
> Sumber: hasil penilaian evaluator terhadap website Sougen. Diterjemahkan dari kalimat evaluator menjadi instruksi perbaikan yang rinci untuk developer / AI coding agent.

## Legenda Skala Penilaian

- **Severity (S)** — seberapa parah dampaknya ke pengguna
  - S1 = Masalah kosmetik, tidak berdampak ke usability
  - S2 = Masalah usability ringan, prioritas perbaikan rendah
  - S3 = Masalah usability besar, prioritas perbaikan tinggi
  - S4 = Usability catastrophe, **wajib** diperbaiki sebelum rilis
- **Ease to Fix (E)** — seberapa besar effort dev/desain yang dibutuhkan
  - E1 = Mudah, tidak butuh banyak effort dev/desain
  - E2 = Effort sedang, butuh beberapa dev/desain
  - E3 = Effort tinggi, butuh banyak dev/desain
  - E4 = Effort ekstrem, butuh dev/desain dalam jumlah sangat besar

---

## [x] 1.1 — Warna Teks Menu Aktif

**Lokasi:** Navigation Bar · **Rating: S2 + E1** (masalah ringan, gampang diperbaiki → quick win)

- **Masalah:** Warna teks menu yang menandakan halaman sedang aktif memiliki kontras rendah terhadap latar belakangnya. Warna aksen biru yang dipakai untuk indikator "aktif" secara visual menyatu dengan background di belakangnya.
- **Kondisi spesifik yang memperparah:**
  - Di halaman Home dan Event, background-nya adalah gambar poster event — jika poster tersebut punya area berwarna putih atau biru, teks menu aktif akan makin sulit terbaca.
  - Di halaman-halaman lain (selain Home & Event), warna latar hero section adalah biru gelap solid, sehingga warna teks aktif (biru) langsung tenggelam ke warna latar tersebut.
- **Dampak ke pengguna:** Pengguna kehilangan orientasi — sulit mengenali halaman mana yang sedang mereka buka dari tampilan menu.
- **Instruksi perbaikan:** Naikkan kontras warna/style indikator menu aktif agar tetap terbaca di atas semua kemungkinan latar (baik gambar poster maupun latar biru gelap solid). Misalnya: tambahkan background pill/highlight solid di belakang teks aktif, bukan hanya mengandalkan perubahan warna teks.

---

## [x] 1.2 — Penempatan Icon Hamburger Menu

**Lokasi:** Navigation Bar (pojok kanan) · **Rating: S3 + E2** (masalah besar, effort sedang → prioritas tinggi)

- **Masalah:** Posisi ikon hamburger menu sulit ditemukan saat halaman baru dimuat. Pengguna butuh sekitar 15 detik untuk sadar bahwa ikon itu ada dan berfungsi sebagai pembuka side menu.
- **Penyebab tambahan:** Tidak ada label teks atau tooltip yang menjelaskan fungsi ikon tersebut.
- **Dampak ke pengguna:** Fitur side menu berisiko tidak pernah ditemukan/dipakai karena affordance-nya lemah.
- **Instruksi perbaikan:** Perjelas visibilitas ikon (ukuran, kontras warna, mungkin posisi) dan tambahkan label singkat di sebelah ikon (misalnya teks "Menu") supaya fungsinya langsung dikenali tanpa trial-and-error.

---

## [x] 1.3 — Jarak ke Sub Menu Terlalu Jauh

**Lokasi:** Dropdown submenu "Resources" (Gallery, FAQ) · **Rating: S3 + E1** (masalah besar, tapi gampang diperbaiki → **top priority quick win**)

- **Masalah:** Jarak pergerakan kursor dari menu utama ("Resources") ke item submenu (dropdown "Gallery", "FAQ") terlalu jauh, sehingga submenu jadi jarang dilirik/dipakai pengguna.
- **Detail tambahan:** Gap antar item di dalam dropdown itu sendiri juga kecil, membuat target klik terasa sempit dan merepotkan untuk ditekan dengan presisi.
- **Dampak ke pengguna:** Item menu penting (Gallery, FAQ) berpotensi tidak pernah dijangkau pengguna.
- **Instruksi perbaikan:** Perpendek jarak vertikal antara trigger menu dan dropdown-nya, dan perbesar hit area (area yang bisa diklik) tiap item submenu.

---

## [x] 1.4.1 — Bug Fungsi Slide Line-up

**Lokasi:** Navigasi Slide (carousel card performer) · **Rating: S4 + E3** (usability catastrophe, effort tinggi → **prioritas tertinggi**, ini bug fungsional bukan sekadar isu tampilan)

- **Masalah:** Saat pengguna tidak sengaja menekan/drag salah satu card line-up untuk mencoba geser slide, yang terjadi bukan slide berpindah — melainkan **gambar di dalam card tersebut ikut ter-drag**.
- **Bug kritis:** Setelah gambar ter-drag, elemen tersebut seolah "menempel" di kursor pengguna dan tidak lepas, sampai pengguna melakukan scroll halaman atau keluar dari halaman tersebut.
- **Dampak ke pengguna:** Ini bug UX yang sangat mengganggu, berpotensi membuat pengguna enggan kembali mengunjungi situs.
- **Instruksi perbaikan:**
  - Nonaktifkan native browser drag pada elemen `<img>` di dalam card (mis. `draggable="false"`, atau atur `pointer-events`/`user-select` agar tidak konflik dengan gesture slider).
  - Pastikan interaksi drag-to-slide pada carousel tidak bentrok dengan elemen anak (gambar) di dalamnya — idealnya gunakan library slider yang menangani drag secara terisolasi dari konten (contoh: Swiper, Embla), atau tangani event drag secara eksplisit dengan `preventDefault()`.
  - Tambahkan mekanisme reset otomatis kalau sampai terjadi state "stuck", tanpa mengandalkan user harus scroll/keluar halaman.

---

## [x] 1.4.2 — Jarak Antar Card Line-up Terlalu Jauh

**Lokasi:** Navigasi Slide (carousel card performer) · **Rating: S2 + E1** (masalah ringan, gampang diperbaiki → quick win)

- **Masalah:** Jarak antar card line-up cukup jauh, menyisakan banyak ruang kosong di antara card.
- **Catatan evaluator:** Jarak besar sebenarnya bisa jadi hal baik (memberi ruang bernapas antar objek), tapi kalau berlebihan justru membuat mata pengguna lebih cepat lelah saat melakukan scanning karena harus bergerak lebih jauh antar elemen.
- **Masalah tambahan (serupa 1.3):** Jarak antara tombol navigasi slide (panah prev/next) dan card juga terlalu jauh.
- **Instruksi perbaikan:** Kurangi jarak antar card ke ukuran yang lebih proporsional, dan dekatkan tombol navigasi slide ke area card.

---

## [x] 1.5.1 — Duplikasi Fungsi Side Menu

**Lokasi:** Navigation Side Menu · **Rating: S2 + E2** (masalah ringan, effort sedang)

- **Masalah:** Terjadi duplikasi/pengulangan fungsi dan komponen antara navbar utama dan side menu — semua shortcut menu yang sudah ada di navbar atas (Home, Event, Community, About, Resources, Contact) ditampilkan ulang persis sama di side menu.
- **Dampak ke pengguna:** Membingungkan karena ada dua tempat berbeda dengan isi menu yang identik.
- **Catatan evaluator (poin penting):** Duplikasi ini secara tidak langsung membuat fungsi shortcut navbar utama jadi mubazir — karena secara logika, side menu tidak memberi nilai tambah apa pun kalau isinya cuma mengulang yang sudah ada.
- **Instruksi perbaikan:** Bedakan isi/fungsi side menu dari navbar utama — misalnya side menu difokuskan untuk kategori tambahan saja (Resources, kontak, sosial media), bukan mengulang menu utama yang sudah ada di navbar.

---

## [x] 1.5.2 — Scroll Position Tidak Reset saat Pindah Halaman

**Lokasi:** Navigation Side Menu (perpindahan antar halaman) · **Rating: S3 + E1** (masalah besar, gampang diperbaiki → **top priority quick win**)

- **Masalah:** Saat pengguna berpindah dari satu halaman ke halaman lain (contoh: dari Home ke About), dalam kondisi posisi scroll di halaman Home berada di ujung/bawah halaman — halaman baru (About) **tidak** dimuat mulai dari atas (top), melainkan langsung menampilkan posisi scroll yang sama seperti di halaman sebelumnya.
- **Dampak ke pengguna:** Pengguna berisiko kehilangan informasi penting di bagian atas halaman baru (hero section, judul, dsb.) dan harus melakukan scroll manual ke atas lagi setiap kali berpindah halaman.
- **Instruksi perbaikan:** Terapkan reset scroll position ke atas (`window.scrollTo(0, 0)` atau setara) setiap kali terjadi perpindahan route/halaman — khususnya penting kalau pakai client-side routing seperti React Router (bisa pakai komponen `ScrollToTop` yang di-trigger tiap perubahan route).

---

## ⚠️ Catatan yang Perlu Kamu Cek Ulang

Di gambar ada dua marker angka — **1.5** (menunjuk ke item "Home" yang sedang aktif di side menu) dan **1.6** (menunjuk ke icon close/X di side menu) — tapi saya tidak menemukan paragraf penjelasan tertulis khusus untuk keduanya di crop gambar yang kamu kirim. Kemungkinan:

1. Keduanya memang bagian dari narasi 1.5.1/1.5.2 (jadi bukan poin terpisah), atau
2. Ada teks penjelasan yang terpotong saat screenshot/crop.

Coba cek ulang dokumen aslinya — kalau ternyata ada penjelasan tersendiri untuk 1.5 dan 1.6, kirimkan ke saya biar saya tambahkan ke daftar ini.

---

## Ringkasan Prioritas Pengerjaan (berdasarkan S + E)

| Urutan | Poin | Alasan |
| --- | --- | --- |
| 1 | 1.4.1 | S4 — catastrophe, harus diperbaiki sebelum rilis meski effort tinggi (E3) |
| 2 | 1.3 & 1.5.2 | S3 + E1 — dampak besar tapi cepat dikerjakan, quick win prioritas tinggi |
| 3 | 1.2 | S3 + E2 — dampak besar, effort sedang |
| 4 | 1.5.1 | S2 + E2 |
| 5 | 1.1 & 1.4.2 | S2 + E1 — ringan dan mudah, bisa disisipkan kapan saja |

"*(Catatan: tabel ringkasan ini saya sertakan hanya sebagai peta prioritas, bukan pengganti isi bulletan di atas — sesuai permintaanmu, isi detail tiap temuan tetap dalam format bulletan.)*"
