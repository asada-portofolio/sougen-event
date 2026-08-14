# Dokumentasi Design System — Halaman Publik RPO
## 2. Token Visual (Public Design Tokens)

Dokumen ini memetakan seluruh aset dan nilai visual (token) yang secara teknis digunakan di dalam aplikasi *frontend* RPO saat ini, berdasarkan konfigurasi TailwindCSS dan gaya dominan di komponen.

### 2.1. Warna (Color Palette)

Aplikasi saat ini membagi warnanya ke dalam beberapa kategori. Warna merek (brand) RPO utama adalah dominasi hitam, abu-abu gelap, dan merah.

**Warna Dasar (Public Theme)**
- `rpo-black` : `#121212` (Background utama website)
- `rpo-surface` : `#1A1A1A` (Warna panel/card/elemen overlay)
- `rpo-mid-dark` : `#242424` (Warna permukaan alternatif / hover)
- `rpo-red` : `#fe0000` (Warna aksen/utama merek RPO, *Crimson/Sakura*)
- `rpo-gray` : `#333333` (Warna garis batas / *border* gelap)
- `rpo-light-border` : `#4d4d4d` (Warna garis batas lebih terang)
- `rpo-separator` : `#2A2A2A` (Garis pemisah ringan)

**Warna Teks (Typography Colors)**
- `rpo-white` : `#ffffff` (Teks utama, judul)
- `rpo-near-white` : `#cbcbcb` (Teks sekunder yang lebih terang)
- `rpo-silver` : `#b3b3b3` (Teks paragraf, deksripsi, label sekunder)

**Warna Semantik (Status)**
- `rpo-negative` : `#EF4444` (Error, hapus, peringatan kritis)
- `rpo-warning` : `#F59E0B` (Peringatan, *pending*)
- `rpo-success` : `#10B981` (Sukses, simpan, valid)

---

### 2.2. Tipografi (Typography)

Terdapat dua keluarga huruf (*font family*) yang dikonfigurasi, namun hierarkinya belum dieksplorasi secara maksimal.

- **Primary Font**: `Poppins`, `sans-serif` (Umumnya dipakai untuk *Heading* dan elemen yang butuh penekanan).
- **Secondary/Body Font**: `Inter`, `system-ui`, `-apple-system`, `sans-serif` (Dipakai untuk teks panjang, paragraf, data tabular).

**Skala Ukuran (Bawaan Tailwind)**
- Heading 1 (H1) : Mayoritas menggunakan teks bawaan Tailwind (seperti `text-4xl` / `36px`).
- Heading 2 (H2) : Biasanya `text-2xl` atau `text-3xl`.
- Body Text : `text-base` (16px) atau `text-sm` (14px).
- *Font-weight* : Mayoritas menggunakan `font-bold` (700) untuk judul dan `font-normal` (400) untuk teks. Belum ada penggunaan ekstensif dari beban lain seperti `Light` (300) atau `Black` (900).

---

### 2.3. Spacing, Grid & Breakpoint

Sistem *layouting* murni bersandar pada skala *spacing* bawaan TailwindCSS yang berbasis 4px (0.25rem).

- **Satuan Spacing**: Kelipatan 4px (contoh: `p-4` = 16px, `gap-8` = 32px, `mb-12` = 48px).
- **Grid System**: Menggunakan Tailwind Grid (`grid-cols-1`, `md:grid-cols-2`, `lg:grid-cols-4`).
- **Breakpoint Responsif (Bawaan Tailwind)**:
  - `sm` : 640px (Mobile landscape)
  - `md` : 768px (Tablet)
  - `lg` : 1024px (Laptop)
  - `xl` : 1280px (Desktop / Layar besar)

---

### 2.4. Bentuk (Shape) & Elevasi (Shadow)

Sistem bentuk didominasi oleh sudut yang kaku/sedikit membulat.

- **Border Radius**:
  - `rounded-none` : 0px
  - `rounded-sm` : 2px
  - `rounded` / `rounded-DEFAULT` : 4px (Paling sering digunakan untuk tombol dan *card*).
  - `rounded-md` : 4px (Bernilai sama dengan DEFAULT).
  - `rounded-lg` : 4px (Masih bernilai 4px, ini sebuah inkonsistensi/keunikan di file konfigurasi saat ini).
  - `rounded-full` : 9999px (Biasanya untuk avatar profil).

- **Elevasi / Bayangan (Box Shadow)**:
  - `shadow-elevated` : `rgba(0,0,0,0.4) 0px 4px 12px` (Digunakan untuk kartu melayang).
  - `shadow-dialog` : `rgba(0,0,0,0.6) 0px 8px 24px` (Digunakan untuk modal/pop-up).

---

### 2.5. Gaya Ikon & Gambar (Imagery)

- **Ikon**: Diambil dari pustaka `lucide-react` (seperti *ChevronDown*, *Menu*, *Mail*). Gaya ikonnya adalah garis luar (outline) tipis dan bersih, tidak *filled*.
- **Gambar/Fotografi**: Gambar (cover event, dokumentasi galeri) dieksekusi dengan perlakuan *object-cover*, seringkali ditempatkan ke dalam kontainer ber-*border-radius* 4px (`rounded`). Beberapa gambar memiliki efek `skeleton` saat proses pemuatan lambat.
