# Heuristic Evaluation — Bagian 01: Navigasi (Mobile View)
>
> Sumber: hasil penilaian evaluator terhadap website Sougen versi mobile. Diterjemahkan dari kalimat evaluator menjadi instruksi perbaikan yang rinci untuk developer / AI coding agent.

## Legenda Skala Penilaian

- **Severity (S):** S1 = kosmetik/tidak berdampak · S2 = ringan/prioritas rendah · S3 = besar/prioritas tinggi · S4 = catastrophe/wajib fix sebelum rilis
- **Ease to Fix (E):** E1 = mudah · E2 = effort sedang · E3 = effort tinggi · E4 = effort ekstrem

---

## [x] 1.1 — Penempatan Icon Hamburger Menu

**Lokasi:** Navigation Bar (mobile) · **Rating: S2 + E1** (quick win)

- **Masalah:** Sama seperti temuan di versi desktop — ikon hamburger menu sulit di-spot posisinya saat halaman baru dimuat.
- **Detail tambahan:** Ikon ini baru terlihat jelas/mudah dinotice **setelah** pengguna melakukan scroll dan navbar berubah warna (kontrasnya baru cukup di kondisi itu).
- **Dampak:** Di kondisi awal (sebelum scroll), affordance ikon lemah — sama seperti masalah di desktop, fungsi side menu berisiko tidak ditemukan pengguna baru.
- **Instruksi perbaikan:** Terapkan kontras/visibilitas ikon hamburger yang cukup **sejak state awal** (sebelum di-scroll), jangan hanya mengandalkan perubahan warna navbar saat scroll untuk membuatnya terlihat.

---

## [x] 1.2 — Ukuran Navbar

**Lokasi:** Navigation Bar (mobile) · **Rating: S1 + E1** (kosmetik, prioritas paling rendah)

- **Masalah:** Ukuran lebar/tinggi navbar dirasa lumayan besar dibanding website lain sejenis yang menerapkan pola serupa.
- **Dampak:** Minimal — murni catatan estetika, tidak mengganggu fungsi atau usability secara langsung (makanya S1, bukan S2+).
- **Instruksi perbaikan:** Pertimbangkan mengecilkan padding/tinggi navbar agar lebih proporsional dengan layar mobile. Prioritas rendah, bisa dikerjakan belakangan atau digabung saat ada perubahan style lain.

---

## [x] 1.3 — Ukuran Teks Menu di Sidebar Terlalu Besar

**Lokasi:** Navigation Side Menu (mobile) · **Rating: S3 + E1** (masalah besar, gampang diperbaiki → **top priority quick win**)

- **Masalah:** Ukuran font pada daftar menu di sidebar kiri terlalu besar, sehingga label menu yang teksnya panjang (contoh: "Community") terlihat **terpotong** dan tidak terbaca penuh.
- **Dampak:** Pengguna tidak bisa membaca nama menu secara utuh — berpotensi salah paham atau ragu menu tersebut mengarah ke mana.
- **Instruksi perbaikan:** Kecilkan ukuran font label menu, atau terapkan penyesuaian otomatis (responsive font-size / text-wrap ke baris kedua) khusus untuk label yang panjang, supaya tidak terpotong di lebar container yang tersedia.

---

## [x] 1.4 — Terlalu Banyak Ruang Kosong pada Side Menu

**Lokasi:** Navigation Side Menu (mobile) · **Rating: S2 + E2**

- **Masalah:** Side menu muncul menutupi seluruh layar (full-screen overlay), tapi isinya tidak memenuhi seluruh area sehingga menyisakan banyak ruang kosong di bagian bawah — kesannya jadi "kosong"/kurang terisi.
- **Dampak yang lebih penting dari evaluator:** Karena tampilannya seperti menutupi seluruh layar mirip halaman baru, pengguna cenderung refleks menekan tombol **back bawaan HP** untuk keluar — bukan tombol close (X) yang sudah disediakan. Ini berisiko membuat pengguna keluar dari website sepenuhnya, bukan sekadar menutup side menu.
- **Instruksi perbaikan:**
  - Kurangi kesan "ruang kosong" — pertimbangkan side menu tidak full-screen, atau susun ulang isi menu agar terdistribusi lebih proporsional terhadap tinggi layar.
  - Buat tombol close (X) lebih menonjol secara visual agar jadi pilihan pertama yang natural untuk pengguna.
  - Pertimbangkan intercept tombol back HP (browser history state) supaya back button menutup side menu dulu, bukan langsung keluar dari website.

---

## [x] 1.5.1 — Bottom Navbar Terlalu Besar

**Lokasi:** Navigation Bottom Navbar (mobile) · **Rating: S2 + E1** (quick win)

- **Masalah:** Ukuran dan lebar bottom navbar dirasa lumayan besar, mengurangi kenyamanan saat scrolling — terutama di halaman yang kontennya sedikit.
- **Dampak:** Ruang layar efektif untuk konten berkurang signifikan; terasa "berat"/dominan khususnya di halaman pendek.
- **Instruksi perbaikan:** Kecilkan tinggi/padding bottom navbar agar proporsinya lebih seimbang dengan ukuran layar mobile, terutama untuk halaman dengan konten minim.

---

## [x] 1.5.2 — Bottom Navbar Ikut Bergeser saat Scroll Cepat

**Lokasi:** Navigation Bottom Navbar (mobile) · **Rating: S2 + E2**

- **Masalah:** Pada kondisi tertentu, saat pengguna melakukan scroll ke atas dengan cepat, bottom navbar ikut bergeser naik sedikit dari posisi seharusnya (tidak diam sempurna).
- **Dampak:** Pengalaman scrolling terasa kurang mulus karena elemen UI yang seharusnya fixed/diam malah ikut bergerak mengikuti momentum scroll.
- **Instruksi perbaikan:** Periksa implementasi posisi bottom navbar — pastikan benar-benar `position: fixed` (atau setara) tanpa transform/animasi tambahan yang ter-trigger oleh momentum scroll, agar tetap diam sempurna di posisi bawah layar.

---

## [x] 1.5.3 — Bottom Navbar Tersembunyi di Awal Halaman Dimuat

**Lokasi:** Navigation Bottom Navbar (mobile) · **Rating: S3 + E2**
> ⚠️ Catatan penomoran: di daftar teks evaluator, poin ini juga tertulis "1.5.2" (duplikat dengan poin di atas). Berdasarkan marker di gambar (ada 3 marker: 1.5.1, 1.5.2, 1.5.3), kemungkinan ini typo dan seharusnya **1.5.3**. Mohon dikonfirmasi ke dokumen asli evaluator.

- **Masalah:** Bottom navbar dirancang untuk tersembunyi saat halaman baru saja dimuat (sebelum ada scroll).
- **Detail tambahan:** Evaluator sebenarnya menyukai konsep visualnya, **namun** ini merepotkan pengguna yang berada di posisi awal halaman (top of page) dan ingin segera berpindah ke halaman lain — mereka harus scroll ke bawah dulu untuk memunculkan kembali navbar sebelum bisa memakainya.
- **Dampak:** Menambah friksi/langkah ekstra untuk aksi navigasi yang seharusnya instan.
- **Instruksi perbaikan:** Pertimbangkan menampilkan bottom navbar sejak awal load halaman (tidak disembunyikan di posisi scroll paling atas), atau sediakan versi minimal/collapsed yang tetap bisa diakses tanpa perlu scroll dulu.

---

## [x] 1.6 — Bottom Navbar Tetap Muncul di Atas Keyboard (Halaman Kontak)

**Lokasi:** Navigation Pengisian Data — halaman Contact (mobile) · **Rating: S3 + E2**

- **Masalah:** Di halaman kontak, ketika pengguna mengisi form pesan dan keyboard virtual muncul, bottom navbar tetap tampil dan menutupi bagian atas keyboard.
- **Dampak:** Area kolom untuk mengetik pesan jadi sedikit terhalang/tertutup oleh bottom navbar, membuat pengalaman mengetik jadi kurang nyaman (ruang kerja terasa lebih sempit dari seharusnya).
- **Instruksi perbaikan:** Sembunyikan bottom navbar secara otomatis saat keyboard virtual aktif / input field sedang fokus (deteksi lewat viewport resize atau focus event pada elemen form), lalu munculkan kembali setelah keyboard ditutup atau field kehilangan fokus.

---

## Ringkasan Prioritas Pengerjaan (berdasarkan S + E)

| Urutan | Poin | Alasan |
| --- | --- | --- |
| 1 | 1.3 | S3 + E1 — dampak besar, paling gampang dikerjakan → quick win prioritas utama |
| 2 | 1.5.3 & 1.6 | S3 + E2 — dampak besar, effort sedang |
| 3 | 1.1 & 1.5.1 | S2 + E1 — ringan dan mudah, quick win |
| 4 | 1.4 & 1.5.2 | S2 + E2 — ringan, effort sedang |
| 5 | 1.2 | S1 + E1 — kosmetik, prioritas paling akhir |

"*(Tabel ini hanya peta prioritas; isi detail tiap temuan tetap dalam format bulletan sesuai permintaanmu.)*"
