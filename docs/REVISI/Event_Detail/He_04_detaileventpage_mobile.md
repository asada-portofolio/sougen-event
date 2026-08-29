# Heuristic Evaluation — Bagian 04: Halaman Detail Event (Mobile View)
>
> Sumber: hasil penilaian evaluator terhadap website Sougen. Diterjemahkan dari kalimat evaluator menjadi instruksi perbaikan yang rinci untuk developer / AI coding agent.

## Legenda Skala Penilaian

- **Severity (S):** S1 = kosmetik/tidak berdampak · S2 = ringan/prioritas rendah · S3 = besar/prioritas tinggi · S4 = catastrophe/wajib fix sebelum rilis
- **Ease to Fix (E):** E1 = mudah · E2 = effort sedang · E3 = effort tinggi · E4 = effort ekstrem

---

## [x] 4.1 — Perulangan Informasi Tanggal dan Lokasi (Mobile)

**Lokasi:** Hero Section, Halaman Detail Event (mobile) · **Rating: S2 + E1**

- **Masalah:** Identik dengan temuan **4.1 versi Desktop** — duplikasi info tanggal & lokasi antara hero section dan blok Day1/Day2 + Lokasi Event tepat di bawahnya.
- **Instruksi perbaikan:** Terapkan solusi yang sama seperti dirumuskan di dokumen `HE-04-DetailEventPage-Desktop.md`, poin 4.1 — perbaikan di level komponen akan otomatis berlaku untuk mobile juga jika komponennya sama.

---

## [x] 4.2 — Padding Antar Section Terlalu Lebar (Mobile)

**Lokasi:** Antar section Halaman Detail Event (mobile) · **Rating: S2 + E1**

- **Masalah:** Identik dengan temuan **4.2 versi Desktop** — padding antar section terlalu lebar, menciptakan ruang kosong berlebih.
- **Instruksi perbaikan:** Terapkan solusi yang sama seperti dirumuskan di dokumen `HE-04-DetailEventPage-Desktop.md`, poin 4.2.

---

## [x] 4.3 — Masalah pada Section Program (Mobile)

**Lokasi:** Programs Section, Halaman Detail Event (mobile) · **Rating: S3 + E1** (quick win prioritas tinggi)

- **Masalah:** Masalah yang sama dengan **2.6** dan **2.7** (Halaman Home) — sudah muncul juga di **4.3 versi Desktop** — kini terverifikasi muncul lagi di versi mobile halaman ini.
- 💡 **Catatan untuk AI agent:** Bug ini sekarang tercatat di **3 lokasi berbeda** (Home Desktop, Detail Event Desktop, Detail Event Mobile), dan kemungkinan besar juga ada di Home Mobile (lihat poin 2.8 di `HE-02-HomePage-Mobile.md`). Ini memperkuat kesimpulan bahwa section Program adalah **komponen shared** — perbaiki satu kali di level komponen, bukan berulang per halaman/platform.
- **Instruksi perbaikan:** Terapkan solusi yang sama seperti dirumuskan untuk 2.6 dan 2.7 di dokumen `HE-02-HomePage-Desktop.md`.

---

## [x] 4.4 — Gambar Cover Talent/Performer Terpotong (Mobile) 🆕

**Lokasi:** Daftar Performer/Talent (contoh: card "Aidoru Tamio", "Endi") · **Rating: S3 + E2**
> Ini temuan baru yang khusus muncul di versi mobile, bukan pengulangan dari temuan sebelumnya.

- **Konteks positif dari evaluator:** Evaluator mengapresiasi bahwa layout mobile untuk bagian ini didesain ulang secara khusus (bukan sekadar reflow dari desktop) — ini dinilai sebagai langkah desain yang bagus.
- **Masalah teknisnya:** Meski konsep desainnya bagus, gambar cover/foto talent jadi **terpotong** karena rasio (aspect ratio) container gambar di layout mobile berbeda dengan rasio asli foto yang disiapkan/di-upload.
- **Dampak:** Foto wajah/pose talent — elemen visual penting untuk daya tarik performer — jadi terpotong tidak pas, mengurangi kualitas presentasi.
- **Instruksi perbaikan** — pilih salah satu atau kombinasikan:
  - Sesuaikan container gambar card performer di mobile agar rasionya cocok dengan rasio aset foto yang disediakan.
  - Standarkan rasio foto talent sejak proses pengelolaan aset (misalnya wajibkan rasio 1:1 atau 16:9 untuk foto cover performer), lalu terapkan `object-fit: cover` dengan `object-position` yang diatur eksplisit (misalnya `top` atau `center top`) supaya bagian wajah/fokus utama tidak ikut terpotong.
  - Pertimbangkan menambahkan preview/crop tool di panel admin saat meng-upload foto performer, supaya admin bisa memastikan area penting foto tidak terpotong sebelum publish.

---

## Ringkasan Prioritas Pengerjaan (berdasarkan S + E)

| Urutan | Poin | Alasan |
| --- | --- | --- |
| 1 | 4.3 | S3 + E1 — dampak besar, gampang dikerjakan, solusi sudah ada dari dokumen Home |
| 2 | 4.4 | S3 + E2 — dampak besar, effort sedang, temuan baru khusus mobile |
| 3 | 4.1 & 4.2 | S2 + E1 — ringan dan mudah, solusi sudah ada dari dokumen Desktop |

"*(Tabel ini hanya peta prioritas; isi detail tiap temuan tetap dalam format bulletan sesuai permintaanmu.)*
