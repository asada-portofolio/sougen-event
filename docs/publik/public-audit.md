# Dokumentasi Design System — Halaman Publik RPO
## 1. Audit Kondisi Saat Ini (Public Audit)

Dokumen ini membedah kondisi riil UI dan tata letak halaman publik website RPO pada saat ini (sebelum redesign).

### Daftar Halaman Publik & Layout Saat Ini

1. **Beranda (`Home.tsx`)**
   - **Hero Section**: Judul besar, subtitle, dan tombol CTA "Jelajahi Event Kami".
   - **About Section**: Penjelasan singkat RPO.
   - **Featured Events Section**: Menampilkan event-event teratas dalam bentuk kartu.
   - **Featured Communities Section**: Menampilkan logo-logo atau kartu komunitas.

2. **Tentang Kami (`AboutUs.tsx`)**
   - Berisi informasi filosofi, visi-misi RPO. 
   - Terdapat bagian Sejarah dan Daftar Tim/Crew RPO.

3. **Komunitas (`Community.tsx`)**
   - Daftar seluruh komunitas yang tergabung di RPO. Ditampilkan dalam bentuk *grid* logo atau kartu nama komunitas.

4. **Event (`EventList.tsx` & `EventDetail.tsx`)**
   - `EventList.tsx`: Menampilkan seluruh event baik yang aktif maupun yang sudah lampau.
   - `EventDetail.tsx`: Memiliki banner/poster event, deskripsi, daftar program, *line-up* talent, dan galeri dokumentasi event terkait.

5. **Program (`Programs.tsx`)**
   - Menampilkan daftar program inisiatif/unggulan RPO yang berdiri sendiri (di luar event).

6. **Talent/Line Up (`LineUp.tsx`)**
   - Halaman khusus untuk menampilkan portofolio para *talent*, musisi, band, atau pengisi acara.

7. **Galeri (`GalleryOverview.tsx` & `GalleryDetail.tsx`)**
   - Menampilkan album foto dokumentasi kegiatan RPO.

8. **Hubungi Kami (`Contact.tsx`)**
   - Terdiri dari informasi kontak (alamat, email) dan sebuah *form* kontak dengan field Nama, Email, dan Pesan.

9. **FAQ (`FAQ.tsx`)**
   - Daftar pertanyaan umum yang ditampilkan menggunakan komponen Akordion (Buka/Tutup).

10. **Kebijakan & Privasi (`Policies.tsx`)**
    - Halaman teks statis berisi *Terms of Service* dan *Privacy Policy*.

---

### Inventaris Komponen UI (Reusable)

Berikut adalah komponen UI yang secara konsisten dipakai berulang di berbagai halaman publik beserta lokasinya di *codebase*:

- **Navbar Utama** (`src/components/public/Navbar.tsx`)
- **Footer** (`src/components/public/Footer.tsx`)
- **Bottom Navigation (Mobile)** (`src/components/public/BottomNav.tsx`)
- **Side Menu (Drawer)** (`src/components/public/SideMenu.tsx`)
- **Button / Tombol** (`src/components/ui/Button.tsx`)
- **Input Text** (`src/components/ui/Input.tsx`)
- **Textarea** (`src/components/ui/Textarea.tsx`)
- **Accordion / Dropdown Teks** (`src/components/ui/Accordion.tsx`)
- **Badge / Label** (`src/components/ui/Badge.tsx`)
- **Skeleton Loading** (`src/components/ui/Skeleton.tsx` & `ImageWithSkeleton.tsx`)

---

### Identifikasi Elemen "Generik / AI-Made" (Prioritas Perbaikan)

Kondisi visual saat ini sangat fungsional namun secara estetika terasa kaku (seperti *template* admin/bootstrap bawaan). Berikut adalah temuan spesifik:

1. **Warna Dominan Terlalu Datar (Flat):**
   - Pemilihan warna latar belakang hitam (`#121212`) dikombinasikan dengan panel abu-abu (`#1A1A1A`) terasa sangat monoton. Belum ada gradasi (gradient), *glassmorphism*, atau pencahayaan (*glow effect*) yang membuat website panggung hiburan/event tampak hidup.
   
2. **Ketiadaan Hierarki Tipografi yang Dramatis:**
   - Heading (H1, H2) dan paragraf masih menggunakan ukuran standar. Font `Poppins` dan `Inter` tersedia, namun belum dimaksimalkan penggunaannya (misal: H1 yang *bold*, besar, dengan jarak *letter-spacing* yang *tight* belum diterapkan). Tipografi saat ini tidak memunculkan kesan "Wow".

3. **Bentuk (Shape) Kotak Kaku:**
   - Mayoritas kartu (card), tombol, dan input menggunakan *border-radius* 4px (`rounded-DEFAULT`). Tampilan ini lebih cocok untuk _dashboard_ SaaS bisnis daripada website Event/Komunitas yang biasanya lebih ekspresif (menggunakan radius yang lebih membulat atau sebaliknya bentuk geometris *edgy* yang tajam).

4. **Kekurangan *Micro-Animations* & *Hover Effects*:**
   - Interaksi pengguna (hover pada card event, hover pada tombol) masih sangat mendasar (hanya perubahan opasitas atau warna sedikit). Belum ada animasi *scale up*, *translate*, atau efek dinamis lainnya saat *scroll*.

5. **Proporsi Spacing (Ruang Kosong):**
   - Padding antar *section* terasa standar dan tidak memberikan ruang bernapas yang lega (*breathing room*). Tidak ada perbedaan visual yang mencolok saat beralih dari satu *section* ke *section* lain di Beranda.

*Catatan: Segala inkonsistensi ini sengaja dibiarkan dan dikumpulkan di dokumen ini tanpa diubah pada kode.*
