# Heuristic Evaluation — Bagian 05: Halaman Admin (Desktop View)
>
> Sumber: hasil penilaian evaluator terhadap website Sougen. Diterjemahkan dari kalimat evaluator menjadi instruksi perbaikan yang rinci untuk developer / AI coding agent.
> ⚠️ Bagian ini berbeda dari sebelumnya — banyak temuan di sini adalah **bug fungsional nyata** (fitur tidak bekerja sama sekali), bukan sekadar masalah UX/tampilan. Prioritaskan sesuai itu.

## Legenda Skala Penilaian

- **Severity (S):** S1 = kosmetik/tidak berdampak · S2 = ringan/prioritas rendah · S3 = besar/prioritas tinggi · S4 = catastrophe/wajib fix sebelum rilis
- **Ease to Fix (E):** E1 = mudah · E2 = effort sedang · E3 = effort tinggi · E4 = effort ekstrem

---

## [x] 5.1 — Indikator "Data Belum Lengkap" Muncul Padahal Data Sudah Lengkap (Kemungkinan Bug)

**Lokasi:** Event Section — card event "Joyfull Spring" · **Rating: S3 + E2**

- **Masalah:** Evaluator sudah memeriksa seluruh data event "Joyful Spring" dan meyakini semua bagian sudah terisi dengan baik, namun badge "DATA BELUM LENGKAP" tetap muncul di card event tersebut.
- **Dampak:** Berpotensi bug pada logika validasi kelengkapan data — admin jadi ragu apakah event benar-benar siap dipublikasikan, atau ada field tersembunyi yang belum terisi tanpa pemberitahuan jelas.
- **Instruksi perbaikan:**
  - Audit ulang logika/kondisi yang menentukan status "data belum lengkap" — pastikan seluruh field yang dicek benar-benar sudah divalidasi ulang (re-check) setelah admin mengisi data.
  - Idealnya, tampilkan detail spesifik field mana yang masih kosong (misalnya lewat tooltip atau checklist), bukan sekadar badge generik tanpa keterangan.

---

## [x] 5.2 — Navigasi Penambahan Talent yang Membingungkan

**Lokasi:** Talent in Event Section · **Rating: S3 + E3**

- **Masalah:**
  - Talent di panel pemilihan ("Cari talent...") sulit dikenali hanya dari foto profil kecil dengan posisi nama yang kurang jelas.
  - Admin **tidak bisa menambahkan talent baru** secara langsung dari halaman ini — talent yang bisa dipilih terbatas pada yang sudah tersedia di modul lain (Master Data Talent).
- **Dampak:**
  - Admin berisiko salah pilih talent karena sulit membedakan satu dengan lainnya.
  - Alur kerja tidak efisien — admin harus berpindah halaman/modul hanya untuk menambah talent baru, padahal kebutuhan ini sangat mungkin muncul saat sedang mengelola sebuah event.
- **Instruksi perbaikan:**
  - Perbesar ukuran foto profil pada list talent dan perjelas kontras/posisi nama (foto lebih besar, nama dengan font lebih tegas di bawahnya).
  - Tambahkan opsi "Tambah Talent Baru" langsung dari panel ini (misalnya tombol yang membuka modal tambah talent cepat), tanpa harus keluar dari halaman kelola event.

---

## [x] 5.3 — Navigasi Penambahan Program yang Membingungkan

**Lokasi:** Program in Event Section · **Rating: S3 + E3**

- **Masalah:** Persis sama dengan **5.2**, kali ini terjadi pada panel pemilihan program (bukan talent).
- **Instruksi perbaikan:** Terapkan solusi yang sama seperti 5.2. Karena pola UI-nya identik dengan panel Talent, sebaiknya kedua panel ini (Talent & Program) dibangun dari **satu komponen shared** — perbaikan cukup dilakukan sekali di komponen tersebut.

---

## [x] 5.4.1 — Fungsi Tombol "Tambah Hari" Dipertanyakan & Berpotensi Error

**Lokasi:** Rundown in Event Section — "Jadwal & Rundown" · **Rating: S3 + E2**

- **Masalah:**
  - Evaluator mempertanyakan kegunaan tombol "Tambah Hari" jika penambahan hari seharusnya sudah bisa dilakukan lewat rentang tanggal di section "Info Dasar" event.
  - Setelah menambahkan hari baru lewat tombol ini, opsi memilih hari-hari yang sudah ada sebelumnya masih tetap muncul — berpotensi menyebabkan duplikasi hari atau state yang salah.
  - Ketika admin mengubah rentang tanggal event secara manual di section "Info Dasar", jumlah hari di section "Jadwal & Rundown" **tidak ikut bertambah otomatis** — kedua bagian ini tidak sinkron.
- **Dampak:** Ada dua sumber data "hari event" yang berbeda (Info Dasar vs Rundown manual) yang tidak saling sinkron — berisiko data tidak konsisten dan membingungkan admin.
- **Instruksi perbaikan:**
  - Jadikan tanggal di section Rundown otomatis mengikuti rentang tanggal di section Info Dasar (hitung otomatis dari `tanggal_mulai` ke `tanggal_selesai`), sehingga tombol "Tambah Hari" manual tidak lagi diperlukan untuk kasus umum.
  - Jika tombol "Tambah Hari" tetap dipertahankan untuk kasus khusus (event dengan hari tidak berurutan), pastikan tidak bisa memilih/menambahkan hari yang sudah ada, dan sinkronkan dua arah antara Info Dasar dan Rundown.

---

## [x] 5.4.2 — Tombol Hapus Hari Tidak Berfungsi (Bug Kritis) 🔴

**Lokasi:** Rundown in Event Section · **Rating: S4 + E2**

- **Masalah:** Admin tidak bisa menghapus hari yang sudah ditambahkan manual lewat tombol "Tambah Hari".
- **Detail tambahan:** Masalah yang sama juga berlaku untuk hari/jadwal yang sudah ada sejak event pertama kali dibuat — bukan cuma hari tambahan manual. Fungsi hapus hari **tidak berfungsi sama sekali**.
- **Dampak:** Bug fungsional serius — admin tidak punya cara mengoreksi kesalahan input jadwal, berisiko data event jadi kacau tanpa jalan keluar selain intervensi teknis langsung ke database.
- **Instruksi perbaikan:**
  - Perbaiki handler/endpoint untuk fungsi hapus hari — pastikan tombol delete (icon tempat sampah) di baris hari benar-benar terhubung ke fungsi backend yang menghapus data hari beserta seluruh item rundown di dalamnya (sertakan dialog konfirmasi karena ini aksi destruktif).
  - Uji untuk dua skenario: (a) hari yang ditambahkan manual, dan (b) hari yang sudah ada sejak event dibuat — pastikan keduanya bisa dihapus.

---

## [x] 5.5 — Navigasi Penambahan Jadwal (Input Waktu) Merepotkan

**Lokasi:** Modal "Tambah Rundown" — input Waktu Mulai/Waktu Selesai · **Rating: S2 + E2**

- **Masalah:** Admin harus scroll/klik roda angka jam dan menit satu-satu (time picker wheel) untuk mengisi waktu tiap acara.
- **Dampak:** Sangat merepotkan untuk event dengan banyak item jadwal, karena proses input waktu jadi lambat dan berulang-ulang.
- **Instruksi perbaikan:** Ganti/tambahkan cara input yang lebih cepat:
  - Native time input HTML (`<input type="time">`) yang bisa diketik langsung, atau
  - Time picker dengan opsi ketik manual, dengan wheel tetap tersedia sebagai alternatif visual.

---

## [x] 5.6 — Preview Gambar Tidak Muncul Setelah Upload (Bug)

**Lokasi:** Image in Event Section — Gallery · **Rating: S3 + E2**

- **Masalah:** Setelah admin menambahkan gambar di section galeri, gambar yang di-upload **tidak menampilkan preview sama sekali**.
- **Dampak:** Admin tidak bisa memastikan gambar yang di-upload sudah benar (foto tepat, orientasi benar) sebelum disimpan — risiko kesalahan upload baru diketahui setelah dicek ulang di halaman publik.
- **Instruksi perbaikan:** Implementasikan preview thumbnail segera setelah file dipilih (local preview via `URL.createObjectURL()` sebelum upload selesai), dan/atau tampilkan hasil dari server setelah upload berhasil.

---

## [x] 5.7 — Fungsi "Override Peran" Talent Tidak Berfungsi (Bug Kritis) 🔴

**Lokasi:** Talent in Event Section — "Talent Terpilih", field "Override Peran (Opsional)" · **Rating: S4 + E2**
> ⚠️ **Catatan penomoran:** Di daftar teks evaluator, temuan ini tertulis sebagai **"5.6"** (duplikat dengan poin Preview Image di atas). Berdasarkan marker di gambar yang menunjuk ke field "Override Peran", nomor yang benar seharusnya **5.7**. Mohon dikonfirmasi ke dokumen asli evaluator.

- **Masalah:** Fitur ini seharusnya memungkinkan admin mengubah peran seorang talent secara paksa khusus untuk event tertentu (misalnya talent yang biasanya "Performer" di-override jadi "MC" khusus event ini). Namun setelah evaluator mengubah peran salah satu talent menjadi "MC" lewat field ini, halaman publik tetap menampilkan peran lama, yaitu "Performer".
- **Dampak:** Fitur ini **tidak bekerja sama sekali** — input admin tidak berdampak apa pun ke tampilan publik, gagal memenuhi tujuannya.
- **Instruksi perbaikan:**
  - Telusuri alur data dari input "Override Peran" di admin sampai ke komponen yang menampilkan peran talent di halaman publik — pastikan nilai override benar-benar tersimpan ke database (bukan hanya di state lokal form), dan pastikan komponen publik membaca dari field override ini, bukan dari field peran default/global talent.
  - Tambahkan test end-to-end: ubah override peran di admin → simpan → verifikasi halaman publik menampilkan peran yang sudah di-override.

---

## Ringkasan Prioritas Pengerjaan (berdasarkan S + E)

| Urutan | Poin | Alasan |
| --- | --- | --- |
| 1 | **5.4.2 & 5.7** | S4 — bug kritis, fitur benar-benar tidak berfungsi, wajib diperbaiki sebelum rilis |
| 2 | 5.1, 5.4.1, 5.6 | S3 + E2 — dampak besar/indikasi bug, effort sedang |
| 3 | 5.2 & 5.3 | S3 + E3 — dampak besar, tapi effort tinggi (redesain panel pemilihan) |
| 4 | 5.5 | S2 + E2 — ringan, soal efisiensi kerja admin |

**Catatan penting:** Berbeda dari halaman-halaman sebelumnya yang mayoritas soal tampilan/UX, di halaman Admin ini **4 dari 8 temuan (5.1, 5.4.1, 5.4.2, 5.6, 5.7) mengindikasikan bug fungsional**, bukan sekadar preferensi desain. Sebaiknya AI agent-mu melakukan debugging/pengecekan kode terlebih dahulu untuk kelima poin ini sebelum masuk ke perbaikan UI biasa.

"*(Tabel ini hanya peta prioritas; isi detail tiap temuan tetap dalam format bulletan sesuai permintaanmu.)*
