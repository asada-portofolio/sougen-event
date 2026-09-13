# Heuristic Evaluation — Bagian 02: Halaman Home (Mobile View)
>
> Sumber: hasil penilaian evaluator terhadap website Sougen. Diterjemahkan dari kalimat evaluator menjadi instruksi perbaikan yang rinci untuk developer / AI coding agent.

## Legenda Skala Penilaian

- **Severity (S):** S1 = kosmetik/tidak berdampak · S2 = ringan/prioritas rendah · S3 = besar/prioritas tinggi · S4 = catastrophe/wajib fix sebelum rilis
- **Ease to Fix (E):** E1 = mudah · E2 = effort sedang · E3 = effort tinggi · E4 = effort ekstrem

---

## [x] 2.1 — Kesalahan pada Nama Brand ⚠️

**Lokasi:** Card informasi event, Hero Section (mobile) · **Rating: S4 + E1** (catastrophe tapi gampang diperbaiki → **wajib diperbaiki paling pertama**)

- **Masalah:** Pada card informasi event yang muncul di hero section mobile, nama organizer yang tertampil adalah **"REALITY PROJECT ORGANIZER"** — padahal brand yang benar seharusnya **Sougen Creative**.
- **Kemungkinan penyebab:** Ini terlihat seperti teks placeholder/dummy dari referensi atau proyek lain yang belum sempat diganti dengan nama brand yang benar (kemungkinan tertinggal dari template/boilerplate saat development).
- **Dampak:** Ini bukan sekadar salah ketik biasa — nama organizer yang salah tampil di elemen paling menonjol dari halaman utama bisa langsung membuat calon pengunjung/peserta ragu terhadap keaslian dan profesionalitas event tersebut. Ini alasan kenapa ratingnya **S4** (usability catastrophe) meski secara teknis perbaikannya sangat mudah (E1).
- **Instruksi perbaikan:**
  - Cari string `"REALITY PROJECT"` / `"Reality"` di komponen card hero section mobile, ganti dengan nama brand resmi ("Sougen Creative" — sesuaikan dengan penulisan resmi yang dipakai).
  - Lakukan pengecekan menyeluruh (search seluruh codebase) untuk memastikan tidak ada instance nama salah ini muncul di komponen atau halaman lain.

---

## [x] 2.2 — Redundansi Informasi antara Latar Hero dan Card Utama

**Lokasi:** Hero Section (mobile) · **Rating: S3 + E3**

- **Masalah:** Konsep desain hero section menggunakan gambar latar custom yang mengikuti tema tiap event, dan gambar latar tersebut sudah memuat judul event secara visual di dalam gambar itu sendiri (contoh: teks "Joyful Spring" sudah tercetak di poster latar). Namun di atasnya masih ada card overlay yang **mengulang** informasi judul event yang sama ("JOYFULL SPRING") sebagai teks komponen terpisah.
- **Dampak:** Duplikasi ini membuat teks judul event di dalam card jadi tidak relevan/mubazir, karena informasi yang sama sudah tersampaikan lewat gambar latar.
- **Instruksi perbaikan** — pilih salah satu pendekatan:
  - **Opsi A:** Jadikan gambar latar murni elemen visual/mood saja (tanpa judul event "dibakar" ke dalam gambar), sehingga card jadi satu-satunya sumber teks informasi (judul, tanggal, lokasi).
  - **Opsi B:** Jika gambar latar tiap event memang didesain manual dan sudah memuat judul, maka card informasi cukup menampilkan detail pendukung saja (tanggal, lokasi, tombol CTA) tanpa mengulang judul event.
- **Catatan effort:** Perbaikan ini butuh koordinasi ulang antara tim desain aset (pembuat gambar tema event) dan struktur komponen — makanya effort-nya dinilai tinggi (E3), bukan sekadar perubahan kode.

---

## [x] 2.3 — Aksen Warna: Ketergantungan pada Warna Biru di Desain Latar Custom

**Lokasi:** Hero Section (mobile) · **Rating: S2 + E2**

- **Masalah:** Karena latar hero section adalah gambar custom yang didesain mengikuti tema tiap event, ada ketergantungan implisit bahwa desain latar tersebut harus turut menyertakan aksen warna biru (warna utama UI/brand) — supaya tidak berbenturan dengan elemen UI lain (card, tombol) yang berwarna biru.
- **Dampak:** Jika ke depannya desainer/EO membuat gambar tema event baru tanpa menyertakan aksen biru, kombinasi warna latar dan UI berisiko terlihat tidak serasi/berantakan.
- **Instruksi perbaikan** — pilih salah satu:
  - Buat panduan desain (design guideline) untuk aset gambar tema event yang mensyaratkan penyertaan aksen warna brand secara konsisten, ATAU
  - Buat elemen UI (card, tombol) yang warnanya bisa disesuaikan/di-override per tema event, sehingga tidak selalu terikat pada satu warna aksen biru yang statis.
- **Catatan:** Akar masalah ini **sama persis** dengan temuan 2.1.1 / 2.1.2 / 2.2.1 / 2.2.2 di dokumen Halaman Home (Desktop View) — sistem warna yang belum adaptif terhadap tema event. Sebaiknya digabung jadi satu inisiatif perbaikan, bukan dikerjakan terpisah per platform.

---

## [x] 2.8 — Masalah dari Desktop yang Juga Muncul di Mobile

"**Rating: S3 + E2**
> ⚠️ **Catatan penomoran:** Di gambar, poin ini dilabeli **"1.4"** — tapi nomor 1.4 sudah dipakai untuk temuan berbeda di dokumen Navigasi (Desktop View) ("Terlalu banyak ruang kosong" pada side menu). Ini kemungkinan typo penomoran dari evaluator. Saya beri nomor sementara **2.8** di sini; mohon dikonfirmasi ke dokumen asli sebelum diteruskan ke AI agent.

- **Masalah:** Evaluator mencatat bahwa beberapa temuan yang sudah dilaporkan di tampilan desktop juga muncul di tampilan mobile ini, yaitu:
  - **2.4** — Penempatan Teks Lokasi (kurang konteks)
  - **2.5** — Isi Rundown (lebar kotak & kebingungan Day 1 vs Day 2 saat scroll)
  - **2.6** — Gambar di Section Program tidak tampil sempurna
  - **2.7** — Informasi Deskripsi Program terlalu panjang
- **Instruksi perbaikan:** Terapkan solusi yang sama seperti yang sudah dirumuskan untuk 2.4, 2.5, 2.6, dan 2.7 di dokumen "Halaman Home (Desktop View)", disesuaikan dengan konteks layout mobile (lebar kolom, ukuran font, area tap, dsb). Lihat dokumen `HE-02-HomePage-Desktop.md` untuk detail instruksi masing-masing.

---

## Ringkasan Prioritas Pengerjaan (berdasarkan S + E)

| Urutan | Poin | Alasan |
| --- | --- | --- |
| 1 | 2.1 | S4 — catastrophe, wajib diperbaiki duluan meski effort-nya kecil (E1) |
| 2 | 2.8 | S3 + E2 — dampak besar, sudah ada solusinya dari dokumen desktop |
| 3 | 2.2 | S3 + E3 — dampak besar, effort tinggi, perlu koordinasi desain |
| 4 | 2.3 | S2 + E2 — ringan, sebaiknya digabung dengan perbaikan warna adaptif di dokumen Desktop |

"*(Tabel ini hanya peta prioritas; isi detail tiap temuan tetap dalam format bulletan sesuai permintaanmu.)*
