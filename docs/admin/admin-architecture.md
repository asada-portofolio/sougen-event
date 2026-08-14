# Dokumentasi Design System — Halaman Admin RPO
## 3. Aturan Arsitektur Produk (Admin Architecture)

Dokumen ini memetakan alur kerja administratif (UX), peta struktur navigasi panel kontrol, interaksi aksi utama (CTA), serta struktur komponen modular pada sisi Administrator RPO.

### 3.1. Peta Navigasi Halaman (Sitemap Admin)

Struktur rute (*routing*) aplikasi *dashboard* berada di balik rute pelindung (`/admin/*`) yang diatur oleh `ProtectedRoute.tsx`:

- **`/admin/login`** (Pintu Masuk / Autentikasi)
- **`/admin`** (Beranda Dasbor / Ringkasan Utama)
- **Modul Utama**
  - **`/admin/events`** (Daftar Event)
    - Tautan ke `/admin/events/new` atau `/admin/events/:id` (Editor Event Kompleks).
  - **`/admin/programs`** (Daftar Program)
    - Modal/Halaman untuk form Tambah/Edit Program.
  - **`/admin/talents`** (Daftar Line-up Talent)
    - Modal/Halaman untuk form Tambah/Edit Talent.
  - **`/admin/communities`** (Daftar Komunitas)
    - Form pengelolaan identitas komunitas.
- **Konten Statis Publik**
  - **`/admin/about`** (Editor profil Tentang Kami).
  - **`/admin/faq`** (Editor poin-poin *Frequently Asked Questions*).
  - **`/admin/kebijakan`** (Editor dokumen statis *Terms & Conditions*).
- **Interaksi Pengunjung**
  - **`/admin/kontak`** (Daftar pesan/inbox dari pengunjung website).
- **Pengaturan**
  - **`/admin/settings`** (Konfigurasi akun/profil sistem).

Peta navigasi ini secara konstan dapat diakses lewat **Sidebar (Desktop)** di sisi kiri dan **Bottom Navigation (Mobile)** di sisi bawah layar genggam. Terdapat file data sentral `src/components/admin/adminNavData.ts` yang menampung daftar ikon, label teks, dan URL rute untuk dirender secara dinamis.

---

### 3.2. Pemetaan Tombol & CTA Penting

Berbeda dengan publik, CTA di admin bersifat interaktif untuk pengolahan basis data (CRUD).

1. **Tombol "Tambah Baru" (Create)**
   - **Lokasi**: Biasa terletak di pojok kanan atas tabel daftar (misal: "Tambah Event", "Tambah Program").
   - **Fungsi**: Membuka rute form kosong (`/new`) atau sebuah komponen *Modal* untuk membuat *record* basis data baru.
   - **Status Visual**: Sangat boleh direvisi (misalnya menggunakan skema warna yang lebih mencolok, dipadukan ikon "+" yang jelas).

2. **Tombol "Simpan" / "Update" (Submit)**
   - **Lokasi**: Di ujung bawah setiap *Form* pendaftaran/edit.
   - **Fungsi**: Mengirim beban data (Payload) ke *Backend/API*. Umumnya disertai indikator memuat (loading spinner).
   - **Status Visual**: Boleh direvisi bentuk dan penempatan indikator *loading*-nya.

3. **Tombol Aksi Baris (Edit & Hapus / Delete)**
   - **Lokasi**: Di ujung kanan setiap baris (*row*) tabel data.
   - **Fungsi**: "Edit" melompat ke form data terkait. "Hapus" selalu memicu jendela peringatan konfirmasi (*confirmation modal*) untuk mencegah penghapusan tidak sengaja.
   - **Status Visual**: Saat ini sebagian besar menggunakan warna kuning/biru untuk Edit, dan merah untuk Hapus. *Sangat boleh direvisi* (misal diubah ke menu *dropdown / kebab menu* agar menghemat ruang tabel).

4. **Toggle Switch (Status Aktif)**
   - **Fungsi**: Mengubah secara langsung (live-update) visibilitas sebuah konten (misal Event mana yang sedang berlangsung).
   - **Status Visual**: Boleh didesain ulang agar lebih intuitif layaknya *switch* sistem operasi iOS/Android.

---

### 3.3. Struktur Komponen Reusable (Sistem CMS)

Sistem admin dikembangkan dengan konsep perakitan blok komponen (modular):

- **Kerangka Dashboard Utama (Scaffolding)**:
  Sistem selalu merender `AdminSidebar` (menu utama) dan `AdminHeader` (bilah atas berisi info user/logout) dengan area tengah sebagai tempat injeksi halaman spesifik (`<Outlet />` pada React Router).
- **Tab Layout (Khusus Editor Kompleks)**:
  Di dalam `AdminEventDetail.tsx`, karena besarnya data satu event, layar dibagi menggunakan komponen penyortir Tabular (Tab Informasi, Tab Visual, Tab Program, dll) agar admin tidak kelelahan *scrolling*.
- **Rich Text Editor**:
  Untuk komponen seperti Sejarah (About) atau Kebijakan, digunakan pustaka WYSIWYG editor eksternal yang dibungkus dalam komponen pembantu khusus.

---

### 3.4. Batasan Teknis (Tech-Stack & Integrasi Data)

Sama halnya dengan halaman publik, perombakan desain di Panel Admin terikat pada tumpukan teknologi berikut:

1. **Vite + React + Tailwind CSS**: Semua UI dikendalikan mutlak dengan *utility-first CSS*.
2. **Data-Fetching Reaktif**: Halaman-halaman admin sangat bergantung pada integrasi API langsung ke peladen (Node.js/Prisma).
   - Ini berarti saat AI merancang ulang tampilan *Table* atau *Card Data*, struktur logika (variabel `map` iterasi dari array *database*) **tidak boleh terganggu atau terhapus**. Redesign hanya boleh mengganti pembungkus HTML (*div/span/class*), bukan memutus jalur datanya.
3. **Formulir Terkontrol (Controlled Forms)**: Mayoritas *form* dikelola statusnya di tingkat lokal komponen. Komponen UI `Input` dan `Textarea` kustom di folder `ui` wajib dipergunakan dan hanya dimodifikasi interior gayanya.
