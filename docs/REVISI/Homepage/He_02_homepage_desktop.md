# Heuristic Evaluation — Bagian 02: Halaman Home (Desktop View)
>
> Sumber: hasil penilaian evaluator terhadap website Sougen. Diterjemahkan dari kalimat evaluator menjadi instruksi perbaikan yang rinci untuk developer / AI coding agent.

## Legenda Skala Penilaian

- **Severity (S):** S1 = kosmetik/tidak berdampak · S2 = ringan/prioritas rendah · S3 = besar/prioritas tinggi · S4 = catastrophe/wajib fix sebelum rilis
- **Ease to Fix (E):** E1 = mudah · E2 = effort sedang · E3 = effort tinggi · E4 = effort ekstrem

---

## Hero Section

### [x] 2.1.1 — Warna Teks Brand

**Rating: S3 + E2**

- **Masalah:** Ukuran teks nama brand ("Sougen Creative Management") di hero section terlalu kecil, dan warnanya menyatu dengan aset latar belakang hero — sangat sulit dibaca.
- **Detail tambahan:** Karena background hero section berubah-ubah mengikuti tema event yang sedang berjalan, masalah ini akan makin parah jika tema event mendatang punya warna latar dominan gelap — teks brand berisiko nyaris tak terlihat sama sekali.
- **Dampak:** Identitas brand tidak cukup terlihat di titik paling penting (hero section halaman utama).
- **Instruksi perbaikan:** Naikkan ukuran font dan terapkan warna/kontras yang tetap kuat di berbagai kemungkinan warna latar (jangan warna statis) — misalnya warna solid dengan outline/shadow, atau background chip kecil di belakang teks brand.

### [x] 2.1.2 — Warna Teks Tema Event

**Rating: S3 + E2**

- **Masalah:** Sama seperti 2.1.1 — teks tema event ("Spring Event") kurang kontras dan sulit dibaca.
- **Detail tambahan:**
  - Ada masalah konteks tambahan: pengguna kebingungan saat pertama kali membaca teks ini karena tidak tahu maksud/fungsi teks tersebut (apakah nama sub-event, kategori, badge, dll).
  - Warna biru statis pada teks ini berisiko merusak mood visual keseluruhan jika event mendatang bertema gelap (Halloween) atau cerah (Summer).
- **Dampak:** Selain isu keterbacaan, ada risiko inkonsistensi kesan visual antar tema event, ditambah kebingungan makna bagi pengunjung baru.
- **Instruksi perbaikan:**
  - Perbaiki kontras warna (sama seperti 2.1.1).
  - Tambahkan penanda konteks yang lebih jelas pada label ini (misalnya styling khas badge/kategori, bukan sekadar teks polos).
  - Buat warna teks ini dinamis mengikuti palet tema event aktif, bukan warna biru yang di-hardcode.

### [x] 2.1.3 — Warna Teks Judul Event

**Rating: S2 + E1** (quick win)

- **Masalah:** Masalah serupa 2.1.1 dan 2.1.2 (warna kurang adaptif terhadap tema), namun teks judul ("Joyfull Spring") masih cukup mudah dibaca berkat outline pada teksnya.
- **Detail tambahan:** Warna tetap monoton di biru, berpotensi jadi masalah jika EO mengadopsi tema event yang berbeda di masa depan.
- **Instruksi perbaikan:** Jadikan warna teks judul event dinamis/dapat dikonfigurasi per tema event, sambil mempertahankan outline yang sudah cukup membantu keterbacaan.

### [x] 2.2.1 — Tanggal Event

**Rating: S3 + E1** (quick win prioritas tinggi)

- **Masalah:** Warna ikon kalender sangat sulit dinotice, dan warna teks tanggal terlalu redup sehingga sulit terlihat.
- **Detail tambahan:** Posisi dan ukuran elemen ini juga dinilai buruk, memperparah masalah keterlihatannya.
- **Dampak:** Informasi krusial (tanggal event) berisiko tidak tertangkap pengguna di hero section.
- **Instruksi perbaikan:** Naikkan kontras warna ikon dan teks terhadap background, perbesar ukurannya, dan evaluasi ulang posisinya agar lebih menonjol.

### [x] 2.2.2 — Lokasi Event

**Rating: S3 + E1**

- **Masalah:** Persis sama dengan 2.2.1 — warna ikon dan teks lokasi kurang kontras/redup, posisi dan ukuran kurang optimal.
- **Instruksi perbaikan:** Terapkan perbaikan yang sama seperti 2.2.1 — idealnya tanggal dan lokasi diperbaiki bersamaan karena satu jenis komponen visual yang sama.

### [x] 2.3 — Jarak Antara Objek Terlalu Jauh (Hero Section)

**Rating: S2 + E1**

- **Masalah:** Jarak antar konten di hero section (misalnya antara info tanggal/lokasi dan tombol "Detail Event") cukup jauh, menyisakan banyak ruang kosong.
- ⚠️ **Catatan referensi silang:** Evaluator menulis "masalah yang sama dengan poin 1.4.1" — tapi berdasarkan isi laporan Navigasi Desktop sebelumnya, deskripsi ini justru lebih cocok dengan poin **1.4.2** ("Jarak antara objek terlalu jauh" pada carousel line-up), bukan 1.4.1 (yang soal bug drag slide). Kemungkinan salah ketik nomor dari evaluator — mohon dikonfirmasi ke dokumen asli.
- **Instruksi perbaikan:** Kurangi jarak/spacing antar elemen di hero section ke ukuran lebih proporsional, konsisten dengan pendekatan perbaikan di poin 1.4.2.

---

## Rundown Section

### [x] 2.4 — Penempatan Teks Lokasi

**Rating: S2 + E2**

- **Masalah:** Info lokasi hanya menampilkan nama lokasi saja (tanpa detail tambahan), dinilai membingungkan pengguna.
- **Detail tambahan:** Evaluator mengakui pendekatan ini terlihat minimalis secara visual, tapi trade-off-nya minim konteks bagi pengguna yang butuh info lebih lengkap.
- **Instruksi perbaikan:** Tambahkan konteks tambahan pada info lokasi (misalnya alamat lengkap, atau jadikan elemen ini clickable menuju Google Maps/detail lokasi) tanpa mengorbankan kesan minimalis — misalnya lewat tooltip atau link.

### [x] 2.5 — Isi Rundown (Lebar Kotak & Navigasi Antar Hari)

**Rating: S3 + E2**

- **Masalah:** Lebar kotak per item rundown dinilai terlalu besar.
- **Detail tambahan (inti masalah):** Jika dalam satu hari ada banyak acara (contoh: Day 2), pengguna harus scroll jauh ke bawah untuk melihat sisa acara — dan ini berisiko membuat pengguna bingung membedakan acara Day 1 vs Day 2, terutama setelah kehilangan referensi visual header "Day 1"/"Day 2" di bagian atas.
- **Dampak:** Pengguna bisa salah mengasosiasikan acara dengan hari yang salah.
- **Instruksi perbaikan:**
  - Kecilkan lebar/padding tiap kotak rundown.
  - Tambahkan indikator hari yang tetap terlihat saat scroll (sticky label "Day 1"/"Day 2"), atau batasi tinggi tiap kolom dengan scroll internal per kolom (bukan scroll halaman penuh) supaya konteks hari tidak hilang.

---

## Rundown Section — Program

### [x] 2.6 — Gambar di Section Program Tidak Tampil Sempurna

**Rating: S3 + E1** (quick win prioritas tinggi)

- **Masalah:** Beberapa gambar di section program (contoh: gambar "Coswalk Competition") tidak tampil dengan baik — hanya setengah gambar saja yang muncul.
- **Dampak:** Konten visual terlihat rusak/tidak profesional.
- **Instruksi perbaikan:** Periksa properti CSS gambar pada card program (kemungkinan masalah `object-fit`, `aspect-ratio`, atau ukuran container yang tidak sesuai rasio gambar asli). Pastikan gambar selalu ter-crop/scale dengan benar — `object-fit: cover` dengan container beraspek rasio tetap biasanya jadi solusi.

### [x] 2.7 — Informasi Deskripsi Program Terlalu Panjang

**Rating: S1 + E1**

- **Masalah:** Teks deskripsi yang tampil di section program dinilai terlalu panjang.
- **Detail tambahan:** Evaluator berargumen pengguna umumnya tidak ingin membuang waktu membaca deskripsi panjang, kecuali mereka benar-benar tertarik untuk tahu lebih detail.
- **Dampak:** Minimal dari sisi usability (S1) — lebih ke preferensi konten, tidak menghalangi fungsi.
- **Instruksi perbaikan:** Potong deskripsi jadi ringkasan singkat (1–2 baris) di card, dengan opsi "Baca selengkapnya" / modal detail untuk pengguna yang ingin info lebih lanjut.

---

## Ringkasan Prioritas Pengerjaan (berdasarkan S + E)

| Urutan | Poin | Alasan |
| --- | --- | --- |
| 1 | 2.2.1, 2.2.2, 2.6 | S3 + E1 — dampak besar, paling gampang dikerjakan → quick win prioritas utama |
| 2 | 2.1.1, 2.1.2, 2.5 | S3 + E2 — dampak besar, effort sedang |
| 3 | 2.1.3, 2.3 | S2 + E1 — ringan dan mudah, quick win |
| 4 | 2.4 | S2 + E2 |
| 5 | 2.7 | S1 + E1 — kosmetik, prioritas paling akhir |

"*(Tabel ini hanya peta prioritas; isi detail tiap temuan tetap dalam format bulletan sesuai permintaanmu.)*"
