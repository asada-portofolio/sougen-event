# Dokumentasi Design System — Halaman Admin RPO
## 1. Audit Kondisi Saat Ini (Admin Audit)

Dokumen ini membedah kondisi riil UI dan tata letak area *dashboard* administratif (CMS) website RPO pada saat ini.

### Daftar Halaman Admin & Layout Saat Ini

1. **Autentikasi (`AdminLogin.tsx`)**
   - Halaman login tunggal dengan form input email dan kata sandi, serta logo/judul sederhana.

2. **Beranda Dashboard (`AdminDashboard.tsx`)**
   - Ringkasan statistik (jumlah event, pesan kontak belum dibaca, program).
   - Aktivitas terbaru atau daftar event aktif.

3. **Manajemen Event (`AdminEventList.tsx`, `AdminEventDetail.tsx`)**
   - **List**: Tabel atau grid berisi daftar seluruh event yang dapat ditambah/edit/hapus. Terdapat label status aktif/non-aktif.
   - **Detail/Form**: Halaman kompleks menggunakan struktur *Tab* (Informasi Umum, Visual/Poster, Program, Talent, Galeri) untuk mengelola satu entitas event utuh.

4. **Manajemen Program (`AdminProgramList.tsx`, `AdminProgramForm.tsx`)**
   - **List**: Daftar program-program unggulan di luar event.
   - **Form**: Input teks deskripsi, cover image, dan galeri program. (Diurutkan secara alfabetis berdasarkan alfabet A-Z).

5. **Manajemen Talent (`AdminTalentList.tsx`, `AdminTalentForm.tsx`)**
   - **List**: Tabel/grid talent yang terdaftar.
   - **Form**: Mengelola foto profil, nama panggung, deskripsi, sosial media.

6. **Manajemen Komunitas (`AdminCommunityList.tsx`, `AdminCommunityForm.tsx`)**
   - Mengelola daftar entitas komunitas RPO (Nama, logo, visi, dan dokumentasi terkait).

7. **Konten Publik & Statis**
   - **Tentang Kami (`AdminAbout.tsx`)**: Mengatur teks filosofi, sejarah, dan susunan anggota tim.
   - **Tanya Jawab (`AdminFAQ.tsx`)**: Menambah, mengedit, dan menghapus item Akordion FAQ.
   - **Pesan Kontak (`AdminKontak.tsx`)**: *Inbox* untuk melihat pesan masuk dari pengunjung web.
   - **Kebijakan & Privasi (`AdminKebijakan.tsx`)**: Editor teks panjang untuk Syarat dan Ketentuan.

8. **Pengaturan (`AdminSettings.tsx`)**
   - Ganti password, pengaturan SEO dasar (jika ada), atau profil admin.

---

### Inventaris Komponen UI (Reusable)

Berikut adalah komponen UI yang secara konsisten dipakai berulang di area Admin beserta lokasinya di *codebase*:

- **Sidebar Menu** (`src/components/admin/AdminSidebar.tsx`)
- **Top Header** (`src/components/admin/AdminHeader.tsx`)
- **Bottom Navigation (Mobile Admin)** (`src/components/admin/AdminBottomNav.tsx`)
- **Action Sheet / Drawer** (`src/components/admin/AdminContentSheet.tsx`): Sering digunakan untuk panel konfirmasi hapus atau aksi sekunder.
- **Rich Text Editor** (`src/components/admin/RichTextEditor.tsx`): Komponen penyunting teks WYSIWYG untuk deskripsi panjang.
- Menggunakan komponen dari `src/components/ui/` yang sama dengan halaman publik (Button, Input, Textarea, Toast, Badge, Modal).

---

### Identifikasi Elemen "Generik / AI-Made" (Prioritas Perbaikan)

Berbeda dengan halaman publik yang menggunakan tema gelap, panel Admin menggunakan tema terang yang sangat standar. Berikut temuannya:

1. **Skema Warna Dasbor yang Terlalu Konvensional (Bosan):**
   - Kombinasi abu-abu terang (`#F8F9FA`), putih murni (`#FFFFFF`), dan biru keabu-abuan (`#6B7280`) sangat mirip dengan *template open-source* gratisan. Terlihat fungsional, tapi kurang memberikan nuansa "Premium CMS".
   - *Active state* (kondisi menu terpilih) pada *Sidebar* terkadang kurang kontras atau terasa kaku.

2. **Kepadatan Informasi (Information Density) yang Kurang Optimal:**
   - Tabel atau daftar kartu *item* terkadang mengambil *spacing* (ruang) yang terlalu besar sehingga admin harus melakukan banyak proses gulir (*scroll*) untuk melihat sekumpulan data.
   - Label status (aktif/non-aktif) desainnya terlalu dasar, kurang menonjol layaknya *badge modern* di SaaS kelas atas.

3. **Struktur Form yang Linier dan Kaku:**
   - *Form* panjang (seperti form input Talent atau Komunitas) masih di-susun secara lurus ke bawah tanpa pemisahan kolom visual (misal kolom kiri untuk input, kolom kanan untuk preview foto/dokumen) secara responsif, membuat halamannya terasa statis.

4. **Ketiadaan Transisi Layar / Animasi Mikro:**
   - Perpindahan antar rute admin (misal dari List ke Detail Form) terjadi begitu saja tanpa ada sedikit efek *fade* atau *slide-in*, membuat pengalaman berpindah menu terasa sangat tradisional.

*Catatan: Segala inkonsistensi ini sengaja dibiarkan dan dikumpulkan di dokumen ini tanpa diubah pada kode.*
