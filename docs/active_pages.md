# Daftar Halaman Aktif (Active Pages)

Dokumen ini berisi daftar seluruh halaman (rute) yang telah dibuat dan aktif di dalam proyek RPO Website sejauh ini, baik untuk antarmuka publik maupun panel admin.

## 1. Halaman Publik (Public UI)

Halaman-halaman berikut dapat diakses oleh pengunjung umum (publik):

- **Beranda (Home)**
  - Path: `/`
  - Deskripsi: Halaman utama yang menampilkan *hero banner*, sekilas event, *line-up* tamu, dll.
- **Arsip Event (Event List)**
  - Path: `/event`
  - Deskripsi: Menampilkan grid daftar seluruh event (yang aktif maupun lampau).
- **Detail Event (Event Detail)**
  - Path: `/event/:slug`
  - Deskripsi: Halaman dinamis untuk melihat detail spesifik dari sebuah event (Rundown, Program, Guest/Performer, Dokumentasi, dll).
- **Line-Up (Talents)**
  - Path: `/lineup`
  - Deskripsi: Halaman yang menampilkan seluruh data talent/guest yang pernah dan akan tampil.
- **Komunitas (Community)**
  - Path: `/community`
  - Deskripsi: Halaman katalog yang menampilkan daftar komunitas pendukung dan partisipan.
- **Program (Programs)**
  - Path: `/programs`
  - Deskripsi: Katalog deskriptif tentang jenis-jenis program/kompetisi yang diadakan oleh RPO.
- **Galeri Foto (Gallery Overview)**
  - Path: `/gallery`
  - Deskripsi: Menampilkan daftar album dokumentasi (berdasarkan event lampau).
- **Detail Galeri (Gallery Detail)**
  - Path: `/gallery/:slug`
  - Deskripsi: Halaman dinamis untuk melihat kumpulan foto lengkap dari sebuah album event spesifik.
- **FAQ (Frequently Asked Questions)**
  - Path: `/faq`
  - Deskripsi: Halaman yang berisi daftar pertanyaan yang sering diajukan beserta jawabannya.
- **Safety / Kebijakan (Policies)**
  - Path: `/safety`
  - Deskripsi: Halaman informasi mengenai kebijakan dan aturan keselamatan (tautannya di navigasi telah disembunyikan berdasarkan penyesuaian terakhir, namun rutenya masih aktif).
- **Kontak (Contact)**
  - Path: `/contact`
  - Deskripsi: Halaman untuk menghubungi panitia, melihat saluran komunikasi, dan form pesan.
- **Tentang Kami (About Us)**
  - Path: `/about`
  - Deskripsi: Halaman profil cerita, visi, misi, dan anggota tim RPO.

## 2. Halaman Admin (Admin Panel)

Halaman-halaman berikut bersifat privat dan dilindungi oleh *authentication* (hanya dapat diakses setelah login):

- **Login Admin**
  - Path: `/admin/login`
  - Deskripsi: Halaman gerbang masuk khusus bagi administrator.
- **Dashboard Admin**
  - Path: `/admin`
  - Deskripsi: Beranda panel admin, memuat statistik atau ringkasan umum.
- **Kelola Event (Event List)**
  - Path: `/admin/event`
  - Deskripsi: Tabel daftar event untuk diatur statusnya.
- **Form Kelola Event (Event Detail/Form)**
  - Path: `/admin/event/:id`
  - Deskripsi: Halaman form kompleks multi-tab untuk mengedit informasi, hari, rundown, program acara (dengan pendaftaran), guest, dan gallery dari suatu event.
- **Kelola Talent / Line-Up**
  - Path: `/admin/talent`
  - Deskripsi: Tabel daftar data talent/guest.
- **Form Kelola Talent**
  - Path: `/admin/talent/:id`
  - Deskripsi: Halaman untuk menambah atau mengubah data talent.
- **Kelola Komunitas**
  - Path: `/admin/community`
  - Deskripsi: Tabel daftar data komunitas pendukung.
- **Form Kelola Komunitas**
  - Path: `/admin/community/:id`
  - Deskripsi: Halaman untuk menambah atau mengubah data komunitas.
- **Kelola Program**
  - Path: `/admin/programs`
  - Deskripsi: Tabel daftar jenis-jenis program acara.
- **Form Kelola Program**
  - Path: `/admin/programs/:id`
  - Deskripsi: Halaman untuk menambah atau mengubah data program acara.
- **Kelola FAQ**
  - Path: `/admin/faq`
  - Deskripsi: Halaman manajemen *Frequently Asked Questions*.
- **Kelola Safety / Kebijakan**
  - Path: `/admin/safety`
  - Deskripsi: Halaman manajemen aturan dan kebijakan acara.
- **Kelola Kontak & Pesan Masuk**
  - Path: `/admin/kontak`
  - Deskripsi: Halaman manajemen informasi saluran kontak sekaligus tempat membaca pesan dari pengunjung.
- **Kelola About Us**
  - Path: `/admin/about`
  - Deskripsi: Halaman manajemen profil tim, cerita, serta visi-misi RPO.
- **Pengaturan Umum (Site Settings)**
  - Path: `/admin/pengaturan`
  - Deskripsi: Halaman pengaturan global website (Logo, Hero fallback, Meta descriptions).
