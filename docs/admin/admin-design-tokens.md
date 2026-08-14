# Dokumentasi Design System — Halaman Admin RPO
## 2. Token Visual (Admin Design Tokens)

Dokumen ini memetakan seluruh aset dan nilai visual (token) yang secara teknis digunakan di dalam aplikasi *frontend* area Administrator (CMS) saat ini, berdasarkan konfigurasi TailwindCSS.

### 2.1. Warna (Color Palette)

Berbeda dengan tema publik yang gelap (*dark mode*), area admin menggunakan tema terang yang netral.

**Warna Dasar (Admin Theme)**
- `admin-base` : `#F8F9FA` (Digunakan sebagai warna *background* halaman utama/lapisan paling bawah yang memberikan kontras tipis dengan panel putih).
- `admin-surface` : `#FFFFFF` (Digunakan untuk kartu panel, form, tabel, dan wadah putih solid).
- `admin-dark` : `#1A1A2E` (Digunakan untuk teks utama, _heading_, atau elemen navigasi *Sidebar* gelap jika ada).
- `admin-secondary` : `#6B7280` (Warna teks sekunder, ikon inaktif, placeholder, atau deksripsi sub-judul, *equivalent to Gray-500*).
- `admin-border` : `#E5E7EB` (Warna garis pemisah antar kolom tabel, batas form, atau panel pembatas, *equivalent to Gray-200*).

**Warna Semantik (Status Admin)**
Diambil dari warna semantik global (Public):
- `rpo-negative` : `#EF4444` (Warna tombol "Hapus", *badge* status tidak aktif, pesan error).
- `rpo-warning` : `#F59E0B` (Warna tombol "Edit" di beberapa tempat atau status *pending*).
- `rpo-success` : `#10B981` (Warna tombol "Simpan", konfirmasi sukses, atau *badge* event aktif).

---

### 2.2. Tipografi (Typography)

Sama dengan publik, konfigurasi Font menggunakan tumpukan (*stack*) yang sudah didefinisikan.

- **Primary Font**: `Poppins`, `sans-serif` (Umumnya dipakai untuk *Header/Title* Halaman Dasbor).
- **Secondary/Body Font**: `Inter`, `system-ui`, `-apple-system`, `sans-serif` (Dipakai secara masif untuk isi tabel data, form label, dan isi artikel *Rich Text Editor*).

**Skala Ukuran yang Sering Digunakan**
- Judul Halaman : `text-2xl` atau `text-3xl` dengan beban `font-bold` atau `font-semibold`.
- Teks Tabel/Form : Mayoritas menggunakan `text-sm` (14px) untuk memadatkan data, dan `text-base` (16px) untuk input.
- Teks Label/Caption : `text-xs` (12px) digunakan untuk notasi kecil atau penanda *badge* status.

---

### 2.3. Spacing, Grid & Breakpoint

- **Satuan Spacing**: Kelipatan 4px Tailwind (contoh: `p-6` = 24px untuk padding panel, `gap-4` = 16px untuk jarak antar kartu/input).
- **Struktur Layout**: Umumnya menggunakan kombinasi *Flexbox* (Sidebar di kiri, konten utama memanjang di kanan untuk Desktop) atau *Grid* (misal kartu statistik di dasbor `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`).
- **Responsivitas**: Sidebar akan menghilang (disembunyikan) pada *breakpoint* di bawah Tablet, dan navigasi digantikan oleh `AdminBottomNav.tsx` untuk layar ponsel.

---

### 2.4. Bentuk (Shape) & Elevasi (Shadow)

Desain admin saat ini berusaha terlihat bersih (clean) namun cenderung datar (flat).

- **Border Radius**:
  - `rounded-md` atau `rounded-lg` : (Nilai aslinya di konfigurasi saat ini sama-sama 4px). Sebagian besar kartu form dan kotak tabel menggunakan kelengkungan ini.
  - `rounded-full` : Digunakan untuk avatar profil pengguna atau *badge* status.

- **Elevasi / Bayangan (Box Shadow)**:
  - `shadow-admin` : `0 1px 2px rgba(0,0,0,0.05)` (Bayangan super tipis yang menempel pada *card* putih di atas *background* abu-abu terang).
  - Bayangan tebal (seperti `shadow-dialog`) hanya muncul saat ada panel Modal aksi Hapus yang melayang.

---

### 2.5. Gaya Ikon & Gambar

- **Ikon**: Mengandalkan pustaka `lucide-react` (ikon *Dashboard*, *Users*, *Image*, *Trash*, *Edit*). Gaya *outline* 24px/20px konstan.
- **Gambar/Media**: *Preview* unggahan foto (misal poster Event) biasanya dibingkai dalam kotak `aspect-video` atau *square* dengan properti `object-cover` untuk memastikan rasio gambar tidak terdistorsi di dalam form admin.
