# Checklist Halaman & Fitur Admin Panel — RPO Website

Dokumen ini adalah daftar lengkap yang mencatat seluruh halaman (rute) beserta fitur-fitur aktif yang telah dibuat dan berfungsi di dalam antarmuka panel admin website RPO.

**Status:**
- `[ ]` Belum dimulai
- `[/]` Sedang dikerjakan
- `[x]` Selesai (Aktif & Berfungsi)

## Section 1 — Autentikasi & Dashboard

1. `[x]` **Login Admin (`/admin/login`)**
   - Halaman gerbang masuk khusus bagi administrator.
   - Form autentikasi (email & password) yang terhubung ke backend.
2. `[x]` **Dashboard Utama (`/admin`)**
   - Halaman pendaratan *(landing page)* panel admin setelah berhasil login.
   - Menampilkan menu pintasan dan statistik/ringkasan data *(overview)*.

## Section 2 — Manajemen Event Utama

1. `[x]` **Daftar Event (`/admin/event`)**
   - Menampilkan tabel/grid daftar seluruh data event.
   - Tombol "Tambah Event Baru" untuk membuat draf event.
   - Aksi baris tabel: Edit (menuju form detail) dan Hapus.
2. `[x]` **Form Kelola Detail Event (`/admin/event/:id`)**
   - Form kompleks menggunakan sistem *multi-tab* untuk mengelola event secara komprehensif.
   - **Tab Pengaturan Utama**: Judul, tema, tipe poster/hero (Template/Image), dan toggle status hero banner aktif.
   - **Tab Hari & Rundown**: Menambah hari pelaksanaan (Event Day), lokasi, dan jadwal rundown acara per hari secara terurut.
   - **Tab Program Acara**: Menentukan jenis-jenis kegiatan/program yang ada di event ini beserta tautan formulir pendaftaran eksternal (link form/tiket per program).
   - **Tab Line-Up (Guest/Talent)**: Mengelola siapa saja guest star atau performer yang mengisi event tersebut.
   - **Tab Dokumentasi (Gallery)**: Mengunggah/menautkan foto-foto galeri yang akan ditampilkan secara spesifik di halaman event tersebut.
   - **Tab Pengaturan Lanjutan**: Tautan eksternal untuk Google Drive dokumentasi foto resolusi tinggi / keperluan internal.

## Section 3 — Manajemen Katalog & Entitas Dasar

1. `[x]` **Daftar Line-Up/Talent (`/admin/talent`)**
   - Menampilkan tabel seluruh data talent/guest yang terdaftar di basis data RPO.
2. `[x]` **Form Kelola Talent (`/admin/talent/:id`)**
   - Form untuk mengatur nama, profesi/peran (role), foto profil, dan biografi singkat.
   - Manajemen tautan kontak dan media sosial (Instagram, dll).
3. `[x]` **Daftar Komunitas (`/admin/community`)**
   - Menampilkan tabel seluruh data entitas komunitas kolaborator.
4. `[x]` **Form Kelola Komunitas (`/admin/community/:id`)**
   - Form untuk mengatur nama komunitas, unggah logo, dan deskripsi singkat.
5. `[x]` **Daftar Program/Activity (`/admin/programs`)**
   - Menampilkan tabel jenis-jenis katalog kegiatan/lomba (misalnya: Cosplay Competition, Talkshow, dll).
6. `[x]` **Form Kelola Program (`/admin/programs/:id`)**
   - Form master data untuk mengatur nama program, gambar banner/ikon acara, dan penjelasan aturan program.

## Section 4 — Manajemen Konten CMS (Content Management System)

1. `[x]` **Kelola FAQ (`/admin/faq`)**
   - Tabel daftar *Frequently Asked Questions* (Pertanyaan Umum).
   - Form (inline modal atau halaman) untuk menambah pasangan *Question* dan *Answer*.
2. `[x]` **Kelola Kebijakan & Aturan (`/admin/safety`)**
   - Tabel daftar / editor teks berisi kebijakan keselamatan dan tata tertib acara.
3. `[x]` **Kelola Pesan & Kontak (`/admin/kontak`)**
   - **Info Kontak**: Mengatur informasi saluran resmi (Email, WhatsApp, link media sosial).
   - **Pesan Masuk**: Fitur khusus untuk menerima dan membaca pesan *(inquiries)* dari publik yang dikirim melalui formulir kontak.
4. `[x]` **Kelola Tentang Kami (`/admin/about`)**
   - Form panjang untuk mengatur Visi, Misi, profil perusahaan, sejarah tim, serta pengelolaan anggota tim RPO internal (struktur panitia).

## Section 5 — Pengaturan Sistem

1. `[x]` **Pengaturan Website (`/admin/pengaturan`)**
   - Form pengaturan properti situs yang sifatnya global (*Site Settings*).
   - Pengaturan judul website, logo, dan meta deskripsi.
   - Konfigurasi tampilan halaman utama saat sistem dalam status "standby" (tidak ada event besar yang sedang di-*highlight*).
