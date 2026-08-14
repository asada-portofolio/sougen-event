# Product Requirement Document (PRD) — Website Reality Project Organizer (RPO)

## 1. Ringkasan Produk
Website resmi untuk Reality Project Organizer (RPO), sebuah Event Organizer budaya pop Jepang di Makassar. Proyek ini merupakan objek studi kasus skripsi menggunakan kerangka **ISO 9241-210 (2019) / Human-Centered Design (UCD)**. Website ini berfungsi ganda: sebagai portal informasi interaktif bagi pengunjung publik dan sebagai sistem manajemen konten (CMS) internal bagi pengelola RPO.

## 2. Tujuan dan Batasan Sistem
- **Tujuan**: Menghadirkan portal terpusat untuk jadwal event, portofolio talent/komunitas, arsip kegiatan (galeri), pedoman kebijakan event, serta mempermudah komunikasi antara audiens dan pihak RPO.
- **Batasan Eksplisit**:
  - **Tanpa Login Publik**: Tidak ada sistem registrasi/autentikasi untuk pengunjung.
  - **Tanpa Transaksi Internal**: Tidak ada sistem pembayaran atau ticketing di dalam website. Pendaftaran diarahkan ke tautan eksternal (misal: Google Form, platform tiket lain).
  - **Single Admin**: Hanya terdapat 1 (satu) jenis akun Admin dengan akses penuh untuk mengelola seluruh CMS. Tidak ada role bertingkat.
  - **Manajemen Aset Terpusat**: Kontribusi foto dari pihak eksternal (misal: fotografer lapangan) dilakukan secara manual (via chat ke admin), dan admin yang akan mengunggahnya ke dalam sistem.

## 3. Kebutuhan Non-Fungsional (Berlaku Global)
- **SEO Friendly**: Wajib diimplementasikan pada seluruh halaman publik untuk kemudahan pencarian Google (mencakup kustomisasi `<title>`, `<meta description>`, Open Graph tags, Semantic HTML, atribut Alt pada gambar, URL *slug* yang deskriptif, Sitemap, Canonical URL, dan *Structured Data* JSON-LD untuk halaman Event dan Kontak).
- **Performa & Media**: 
  - *Lazy loading* gambar.
  - *Skeleton loading* sebagai pengganti *spinner* kosong.
  - Otomasi pemrosesan gambar di *backend*: kompresi dan konversi otomatis ke format **WebP**, menghasilkan dua versi (resolusi penuh untuk *lightbox* dan *thumbnail* untuk grid) guna mencegah *layout shift* (dengan menyimpan dimensi panjang/lebar asli di database).
- **Desain & UX**: 
  - Mengikuti identitas visual RPO: Merah (`#fe0000`) dan Putih, dengan gaya geometris minimalis modern.
  - Penggunaan ikon SVG (contoh: Lucide React) — menghindari penggunaan emoji *AI-slop*.
  - *Responsif* secara mulus di semua perangkat (Mobile, Tablet, Desktop).

---

## 4. Struktur Halaman Publik (8 Halaman)

Sistem terdiri dari 7 halaman navigasi utama dan 1 halaman akses terbatas (About Us).

### 4.1 Home
- **Fungsi**: Pintu masuk utama yang merangkum aktivitas terkini.
- **Fitur Utama**:
  - **Hero**: 2 varian tampilan (Bawaan/Default vs. Event Aktif berupa kartu tiket).
  - **Animation Text**: Mengikuti varian Hero.
  - **Guest & LineUp**: Menampilkan *Talent* yang difilter spesifik hanya untuk event yang sedang aktif. Jika tidak ada event aktif/data kosong, section ini disembunyikan.
  - **Program/Rundown**: Menyesuaikan dengan event aktif.
- **UX Khusus**: Menggunakan *Bottom Navigation Bar* di tampilan Mobile (berbeda dengan halaman lain yang menggunakan Footer).

### 4.2 Event
- **Fungsi**: Direktori arsip seluruh event dan informasi detail per event.
- **Bagian 1: Event List (Arsip)**
  - *Highlight Banner*: Menampilkan *full-width banner* di posisi teratas jika ada event dengan toggle "Aktif".
  - *Grid Arsip*: Menampilkan daftar event dalam rasio potret, diurutkan dari yang terbaru (reverse chronological), lengkap dengan pagination.
- **Bagian 2: Event Detail (`/event/:slug`)**
  - *Hero Section*: Mendukung 2 mode yang dipilih admin (Template Otomatis atau Poster Kustom unggahan manual).
  - *Informasi Inti*: Info tanggal & lokasi dinamis (mendukung event multi-hari/multi-venue).
  - *Section Terkait*: Guest, LineUp, Program (katalog kegiatan), dan Rundown (jadwal per jam per hari).
  - *Varian Terbaru*: Menampilkan tombol eksternal "Pendaftaran".
  - *Varian Lampau*: Menampilkan tombol pintas ke "Gallery" dan "Google Drive".
  - *UX Khusus*: Menggunakan *Bottom Navigation Bar* di tampilan Mobile.

### 4.3 LineUp
- **Fungsi**: Katalog permanen seluruh pihak (Guest dan Performer) yang pernah tampil.
- **Fitur Utama**:
  - Menampilkan seluruh `Talent` (tanpa filter per event) secara akumulatif.
  - Tampilan grid (2 kolom mobile, 4 kolom desktop) dengan pagination.

### 4.4 Community
- **Fungsi**: Arsip portofolio kemitraan komunitas.
- **Fitur Utama**:
  - Kartu padat informasi: Logo, nama, deskripsi, tahun kerja sama, link media sosial.
  - *Strip* Mini Foto: Cuplikan dokumentasi.
  - *Modal Gallery (Lightbox)*: Terbuka saat foto ditekan, dapat di-geser (*swipe*) untuk melihat momen kebersamaan spesifik dengan komunitas tersebut.

### 4.5 Programs/Activity
- **Fungsi**: Katalog jenis kegiatan *evergreen* RPO (contoh: Lomba Cosplay, Workshop).
- **Fitur Utama**:
  - Struktur identik dengan halaman Community (Grid, strip foto, Modal Gallery).
  - **Tombol "Aturan Main"**: Modal khusus (*independent*) berisi panduan, syarat, dan ketentuan berformat *Rich Text*.

### 4.6 Resource (Kumpulan Halaman Independen)
Bukan sebuah halaman tunggal, melainkan *dropdown* navigasi yang menaungi 3 halaman:
1. **Gallery**
   - Arsip resmi dokumentasi foto per Event.
   - 2 Tingkat navigasi: *Overview* (Grid album) → *Detail Album* (Route terpisah).
   - Tampilan *Masonry Layout* untuk mempertahankan rasio asli gambar, dengan tombol "Muat Lebih Banyak" dan *Fullscreen Lightbox*.
2. **FAQ**
   - Kumpulan tanya-jawab umum.
   - Menggunakan *Accordion Eksklusif* (hanya 1 jawaban terbuka dalam satu waktu).
   - Dilengkapi *Search Bar* (client-side) dan Kotak Kontak Bantuan di bagian bawah.
3. **Kebijakan dan Keamanan**
   - Terbagi menjadi: "Aturan Pengunjung" (Format daftar/checklist) dan "Prosedur Darurat" (Format *Accordion*).
   - Menampilkan Kotak Kontak Bantuan yang memprioritaskan kontak berstatus Darurat.

### 4.7 Contact
- **Fungsi**: Portal komunikasi audiens ke RPO.
- **Fitur Utama**:
  - Daftar Kanal Komunikasi Instan (WhatsApp, Email, IG, dsb. dikelola CMS).
  - Formulir Kirim Pesan (Nama, Email, WA, Pesan).
- **Keamanan & UX**:
  - Validasi *inline* dan respon formulir *Single Page Application* (SPA) tanpa memuat ulang halaman.
  - Mekanisme Anti-Spam: *Honeypot Field* dan *Rate Limiting* di sisi *Backend*.

### 4.8 About Us
- **Fungsi**: Identitas, sejarah, dan struktur tim.
- **Akses**: Hanya dapat diakses melalui *Side Menu* dan *Footer* (Tidak ada di Navbar Desktop).
- **Fitur Utama**:
  - Cerita Kami & Visi Misi.
  - Statistik Pencapaian (Dihitung otomatis secara agregat dari database: total event, komunitas, dsb).
  - Profil Tim Internal RPO.

---

## 5. Sistem Navigasi Publik
Sistem navigasi dirancang menggunakan dua komponen terpisah secara fungsional:
- **Navbar Desktop (Menu Tengah)**: Menggunakan pola *hide active link* (halaman yang sedang dibuka disembunyikan dari menu). Memuat dropdown Resource.
- **Side Menu (Kanan & Kiri)**: Tersedia di semua perangkat via ikon *hamburger*.
  - *Sisi Kanan*: Navigasi statis ke 7 halaman utama + About Us (tidak menyembunyikan halaman aktif).
  - *Sisi Kiri*: Jalan pintas langsung (*shortcut*) ke submenu Resource dan aksi kontak.

---

## 6. Kebutuhan Sistem Admin (CMS)

### 6.1 Filosofi dan UX Global
- **Pendekatan Desain**: Terinspirasi dari struktur WordPress dan estetika Vercel Dashboard. Palet warna netral (`#F8F9FA`, `#ffffff`) dengan aksen merah minimal untuk membedakannya dari tema gelap halaman publik.
- **Device-Agnostic**: Layout responsif penuh. Mobile menggunakan *Bottom Navigation Bar* dan *Bottom Sheet* untuk perpindahan modul.
- **UX Forgiving**: Konfirmasi bertingkat untuk aksi destruktif (mulai dari *Toast* yang bisa di-cancel hingga kewajiban mengetik manual nama entitas untuk penghapusan event).
- **Pendekatan Realistis**: Mengingat batasan waktu proyek skripsi, fitur UX kompleks seperti *Live Preview*, *Auto-save draft*, dan *Command Palette* ditiadakan. Fokus pada antarmuka *CRUD* yang bersih, stabil, dan fungsional.

### 6.2 Modul Pengelolaan
1. **Dashboard**: Ringkasan statistik, peringatan status event aktif, dan log aktivitas terbaru.
2. **Event**: Modul kompleks berbasis tab (Info Dasar, Hero, Talent, Program, Rundown Timeline, Gallery, Pengaturan).
3. **Talent**: Pengelolaan *guest* dan *performer* dengan *Photo Grid View*.
4. **Community**: Profil komunitas dan pengelolaan *batch-upload* strip foto.
5. **Programs**: Katalog kegiatan dengan *Rich Text Editor* (contoh: Tiptap) untuk menyusun "Aturan Main".
6. **Gallery**: Terintegrasi di dalam tab pengelolaan Event (tidak terpisah agar alur kerja efisien).
7. **FAQ**: Pengelolaan tanya-jawab dengan pratinjau *accordion* langsung & *drag-and-drop*.
8. **Kebijakan & Keamanan**: Edit *inline* untuk aturan pengunjung, dan manajemen prosedur darurat.
9. **Kontak**: Manajemen kanal media sosial (termasuk toggle kontak darurat) dan *Inbox* pesan masuk pengunjung bergaya email.
10. **About Us**: Pengaturan *singleton* untuk sejarah organisasi dan manajemen grid Tim Internal.
11. **Pengaturan**: Pengaturan *footer* dan metadata global.
