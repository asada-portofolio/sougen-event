# Heuristic Evaluation — Bagian 03: Halaman Event (Desktop & Mobile)
>
> Sumber: hasil penilaian evaluator terhadap website Sougen. Diterjemahkan dari kalimat evaluator menjadi instruksi perbaikan yang rinci untuk developer / AI coding agent.
> Catatan: berbeda dari dua halaman sebelumnya, evaluator menggabungkan temuan desktop & mobile jadi satu laporan untuk halaman ini.

## Legenda Skala Penilaian

- **Severity (S):** S1 = kosmetik/tidak berdampak · S2 = ringan/prioritas rendah · S3 = besar/prioritas tinggi · S4 = catastrophe/wajib fix sebelum rilis
- **Ease to Fix (E):** E1 = mudah · E2 = effort sedang · E3 = effort tinggi · E4 = effort ekstrem

---

## [x] 3.1 — Ukuran Gambar Cover Event Terlalu Panjang

**Lokasi:** Event Archive Section (berlaku desktop & mobile) · **Rating: S3 + E2**

- **Status:** Selesai direvisi (Menerapkan Konsep 2 Landscape Grid 16:9 yang ringkas, controls bar dengan search bar outline glow & filter pills rapi, serta pengetatan jarak judul dan metadata).
- **Masalah:** Ukuran gambar cover pada card event di halaman Event Archive terlalu panjang (tinggi), sehingga bagian deskripsi teks (judul, tanggal, lokasi) di bawahnya tidak bisa tampil utuh — informasi terpotong karena kehabisan ruang vertikal dalam card.
- **Detail tambahan:** Masalah ini lebih parah di tampilan mobile — card jadi terlihat sangat panjang/tidak proporsional. Dampak jangka panjangnya lebih serius: kalau daftar arsip event sudah banyak (event-event dari tahun-tahun sebelumnya), pengguna harus scroll sangat panjang untuk mencari event lawas, karena tiap card memakan ruang vertikal berlebih — proses pencarian/scanning jadi sangat melelahkan.
- **Dampak:** Bukan cuma soal estetika — ini juga masalah fungsional untuk skenario "arsip" jangka panjang. Semakin banyak data historis yang terkumpul, semakin buruk pengalaman pencariannya.
- **Instruksi perbaikan:**
  - Kecilkan rasio tinggi gambar cover — terapkan aspect-ratio tetap yang lebih pendek (misalnya 16:9 atau 4:3) dengan `object-fit: cover`, supaya card jadi lebih ringkas dan konsisten ukurannya.
  - Pastikan area deskripsi (judul, tanggal, lokasi) punya ruang tetap yang cukup dan tidak terpotong, apa pun rasio gambar covernya.
  - Untuk skenario arsip dengan banyak entri, pertimbangkan desain list yang lebih compact (thumbnail kecil + teks di sampingnya) sebagai alternatif dari card besar bergaya "poster", khususnya untuk filter "Selesai"/event lama.

---

## [x] 3.2 — Overlay Warna Hitam pada Hero Section

**Lokasi:** Hero Section halaman Event (berlaku desktop & mobile) · **Rating: S1 + E1** (kosmetik, prioritas rendah)

- **Masalah:** Overlay warna hitam yang diterapkan di atas gambar latar hero section memberi kesan "kotor"/berantakan secara visual.
- **Detail tambahan (trade-off yang diakui evaluator sendiri):** Di sisi lain, overlay ini juga membantu membuat informasi teks hero section (judul, tanggal, lokasi, tombol CTA) jadi lebih menonjol dan mudah dibaca di atas gambar latar yang ramai.
- **Dampak:** Minimal dari sisi usability (S1) — murni catatan estetika, karena fungsi overlay untuk readability sudah tercapai.
- **Instruksi perbaikan:** Ganti overlay hitam solid/flat dengan pendekatan yang lebih halus secara visual tapi tetap menjaga kontras teks, misalnya:
  - **Gradient overlay** — gelap di bagian bawah (tempat teks berada), transparan di bagian atas gambar, alih-alih overlay hitam merata di seluruh gambar.
  - Atau overlay dengan opacity lebih rendah, dikombinasikan dengan `text-shadow` / `backdrop-blur` khusus pada teks saja.
- **Catatan:** Ini murni peningkatan kualitas visual (nice-to-have), bukan perbaikan wajib — bisa dikerjakan kapan saja tanpa risiko mengganggu fungsi.

---

## Ringkasan Prioritas Pengerjaan (berdasarkan S + E)

| Urutan | Poin | Alasan |
| --- | --- | --- |
| 1 | 3.1 | S3 + E2 — dampak besar (fungsional untuk arsip jangka panjang), effort sedang |
| 2 | 3.2 | S1 + E1 — kosmetik, bisa dikerjakan belakangan |

*(Tabel ini hanya peta prioritas; isi detail tiap temuan tetap dalam format bulletan sesuai permintaanmu.)*
