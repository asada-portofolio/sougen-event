# Design System — Reality Project Organizer (RPO)

> Desain sistem ini diadaptasi dari filosofi desain Spotify ("Content-first darkness") dan disesuaikan dengan identitas visual RPO yang geometris, berani, dan berfokus pada kultur pop/event.

## 1. Visual Theme & Atmosphere

Antarmuka web RPO dirancang sebagai platform *immersive* bernuansa gelap yang membungkus pengunjung dalam suasana ala panggung acara (`#121212`, `#1A1A1A`, `#242424`). Dalam palet gelap ini, foto dokumentasi event, poster, dan profil *talent* menjadi sumber warna utama. Filosofi desainnya adalah **"geometric stage darkness"** — UI mundur ke belakang layar layaknya bayangan, membiarkan konten event bersinar. Setiap permukaan menggunakan variasi warna *charcoal/navy* gelap, menciptakan lingkungan teater di mana satu-satunya warna UI yang mencolok adalah **RPO Red (`#fe0000`)** yang ikonik.

Tipografi menggunakan kombinasi **Poppins** (untuk *heading* yang membulat geometris, menggemakan lengkungan pada huruf 'R' dan 'P' di logo) dan **Inter** (untuk keterbacaan antarmuka yang optimal). Sistem tipografinya padat dan fungsional: 700 (bold) untuk penekanan/judul, 600 (semibold) untuk sub-judul, dan 400 (regular) untuk teks tubuh.

Hal yang membedakan RPO dari referensi Spotify adalah **geometrinya**. Jika Spotify identik dengan bentuk kapsul/pil (membulat penuh), RPO mengambil inspirasi dari potongan segitiga tajam pada huruf 'R' di logonya. Komponen UI menggunakan **sudut yang tajam atau sangat minimal** (radius 0px hingga 4px). Tombol utama berbentuk blok solid, menciptakan kesan premium, tegas, dan modern ala *event organizer* profesional.

**Karakteristik Kunci:**
- Tema gelap *immersive* (`#121212`–`#242424`) — UI menghilang di balik konten foto event.
- **RPO Red (`#fe0000`)** sebagai aksen *brand* tunggal — tidak pernah sekadar dekoratif, selalu fungsional (untuk interaksi atau CTA utama).
- Keluarga font Poppins & Inter.
- Elemen UI tajam/geometris (radius 0px–4px) — mewakili potongan logo RPO.
- Label tombol *uppercase* dengan *letter-spacing* lebar (1.2px–1.5px) untuk kesan profesional.
- *Shadow* berat pada elemen melayang/elevated (`rgba(0,0,0,0.6) 0px 8px 24px`).
- Gambar/Poster event sebagai sumber warna utama — UI itu sendiri bersifat akromatik.

---

## 2. Color Palette & Roles

### Primary Brand
- **RPO Red** (`#fe0000`): Aksen *brand* utama — tombol aksi (CTA), status "AKTIF", *hover states*.
- **Near Black** (`#121212`): Permukaan *background* paling dalam (halaman utama).
- **Dark Surface** (`#1A1A1A`): *Cards*, *containers*, panel navigasi, permukaan *elevated*.
- **Mid Dark** (`#242424`): *Background* tombol sekunder, permukaan interaktif.

### Text
- **White** (`#ffffff`): `--text-base`, teks utama, judul.
- **Silver** (`#b3b3b3`): Teks sekunder, label redup, navigasi tidak aktif.
- **Near White** (`#cbcbcb`): Teks sekunder yang sedikit lebih terang.

### Semantic
- **Negative/Danger** (`#EF4444`): `--text-negative`, *error states*, tombol hapus di Admin.
- **Warning** (`#F59E0B`): `--text-warning`, *warning states*.
- **Success** (`#10B981`): `--text-success`, *success toast*, badge "SELESAI".

### Surface & Border
- **Border Gray** (`#333333`): Border untuk kartu/elemen di atas warna gelap.
- **Light Border** (`#4d4d4d`): Border untuk input dan tombol *outline*.
- **Separator** (`#2A2A2A`): Garis pembatas (divider).

---

## 3. Typography Rules

### Font Families
- **Title / Heading**: `Poppins`, *fallbacks*: `sans-serif`.
- **UI / Body**: `Inter`, *fallbacks*: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`.

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|------|--------|-------------|----------------|-------|
| Hero Title | Poppins | 48px–64px | 800 | 1.10 (tight) | -0.02em | Sangat besar untuk *Hero Event* |
| Section Title | Poppins | 24px (1.50rem) | 700 | 1.20 | normal | Judul antar section (*LineUp*, *Gallery*) |
| Feature Heading | Poppins | 18px (1.13rem) | 600 | 1.30 (tight) | normal | Judul pada *Card* |
| Body Bold | Inter | 16px (1.00rem) | 600 | 1.50 | normal | Teks yang ditekankan |
| Body | Inter | 16px (1.00rem) | 400 | 1.50 | normal | Teks paragraf standar |
| Button Uppercase | Inter | 14px (0.88rem) | 600 | 1.00 (tight) | 1.5px | `text-transform: uppercase` |
| Button | Inter | 14px (0.88rem) | 600 | normal | 0.14px | Tombol standar |
| Nav Link Bold | Inter | 14px (0.88rem) | 600 | normal | normal | Link Navigasi Aktif |
| Nav Link | Inter | 14px (0.88rem) | 400 | normal | normal | Link Navigasi Inaktif |
| Caption Bold | Inter | 12px (0.75rem) | 600 | 1.50 | normal | Metadata tebal (Tanggal Event) |
| Caption | Inter | 12px (0.75rem) | 400 | normal | normal | Metadata standar |
| Badge | Inter | 11px (0.68rem) | 600 | 1.33 | 0.5px | `text-transform: uppercase` |

### Principles
- **Ketegasan Bobot (Weight)**: Teks mayoritas menggunakan bobot 400 (regular) dan 600/700 (bold). Kontras hierarki dibangun dari ketebalan, bukan sekadar perbedaan ukuran yang ekstrem.
- **Labeling Sistematis**: Label tombol selalu *uppercase* dengan *letter-spacing* (1.2px–1.5px) untuk memisahkan "suara antarmuka" dari "suara konten".

---

## 4. Component Stylings

### Buttons

**Primary Block Button** (Identitas RPO)
- Background: `#fe0000` (RPO Red)
- Text: `#ffffff`
- Padding: 12px 24px
- Radius: 2px (Sangat tajam, hampir kotak)
- Transisi: *Hover* meredup ke `#CC0000`, klik menekan/mengecil 0.95x (*scale-95*).
- Use: CTA Utama, Pendaftaran, Simpan Form.

**Dark Block Button**
- Background: `#242424`
- Text: `#ffffff`
- Radius: 2px
- Use: Tombol sekunder, navigasi filter.

**Outlined Block**
- Background: *transparent*
- Text: `#ffffff`
- Border: `1px solid #4d4d4d`
- Radius: 2px
- Hover: Border berubah menjadi `#fe0000`.
- Use: Aksi sekunder, lihat detail.

### Cards & Containers
- Background: `#1A1A1A`
- Radius: 4px (Sedikit melunak dibanding tombol, namun tetap tegas).
- Border: *Tidak ada border terlihat secara default*, bergantung pada bayangan dan perbedaan *shade* background.
- Hover (Interactive Card): *Lift up* (translasi Y -4px) dan *Shadow* menebal.

### Inputs (Contact Form & Admin)
- Background: `#1A1A1A` (Lebih gelap dari area sekitarnya).
- Teks: `#ffffff`
- Radius: 4px
- Border: `1px solid #333333`
- Padding: 12px 16px
- Focus: Border berubah menjadi `#fe0000` + cincin *outline* merah tipis.

### Navigation (Navbar / Bottom Nav)
- Background: `#121212` dengan *opacity* 90% + *Backdrop blur* 10px (Kesan modern bergaya *glass* namun tetap dominan gelap).
- Teks aktif: `#ffffff` (Bobot 600).
- Teks inaktif: `#b3b3b3` (Bobot 400).
- Indikator Aktif: Garis bawah/atas tipis berwarna `#fe0000` setebal 2px (Tajam).

---

## 5. Layout Principles

### Spacing System (Kelipatan 4px)
- Base unit: 4px
- Scale: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, 96px.

### Grid & Container
- *Max-width* *container* publik: 1200px (Terpusat/Centered).
- Gap standar antar *Card* (LineUp / Gallery): 16px (Mobile) / 24px (Desktop).
- Ruang antar bagian (*Section whitespace*): 64px (Mobile) / 96px (Desktop) — Memberikan "nafas" antar-konten.

### Border Radius Scale (Geometric Focus)
- Sharp (0px): *Hero edges*, *Full-width banners*.
- Minimal (2px): Tombol, Input *field*, Badge.
- Standard (4px): *Cards*, *Dropdown menus*, *Modals*.
- *Tidak ada penggunaan radius bulat/pill (500px) seperti Spotify, demi menjaga konsistensi dengan kekakuan geometris logo RPO.*

---

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Base (Level 0) | `#121212` background | *Background* halaman utama |
| Surface (Level 1) | `#1A1A1A` background | *Cards*, *Sidebar*, *Containers* |
| Elevated (Level 2) | `rgba(0,0,0,0.4) 0px 4px 12px` | *Navbar sticky*, *Bottom Nav* |
| Dialog (Level 3) | `rgba(0,0,0,0.6) 0px 8px 24px` | *Modals*, *Dropdowns*, *Lightbox* |

**Shadow Philosophy**: RPO menggunakan *shadow* yang cukup pekat dan gelap (opacity 0.4–0.6) pada latar gelap. Ini bertujuan memisahkan elemen melayang dari *background* tanpa harus merusak harmoni warna dengan garis tepi (border) yang terlalu terang.

---

## 7. Do's and Don'ts

### Do
- **Gunakan Latar Gelap** (`#121212`–`#242424`) untuk menciptakan kedalaman panggung.
- **Gunakan RPO Red** (`#fe0000`) HANYA untuk elemen fungsional (*active states*, tombol utama, peringatan penting).
- **Gunakan Sudut Tajam** (0px–4px) untuk semua elemen antarmuka guna meniru logo RPO.
- **Gunakan Huruf Kapital** dengan spasi renggang untuk label sistem (Tombol, Badge, Label Kecil).
- **Biarkan Gambar Berbicara**: Pastikan foto *event* dan *poster* menjadi sumber warna yang dominan; jangan biarkan elemen UI bersaing mencuri perhatian.

### Don't
- **Jangan Gunakan Radius Pil/Bulat** (500px / 9999px / 50%) untuk tombol atau kartu; ini akan mematahkan identitas geometris RPO.
- **Jangan Gunakan Merah Sebagai Background Penuh** pada *Card* (kecuali Banner "Event Aktif"); ini terlalu menyilaukan dan mengalahkan foto.
- **Jangan Tambahkan Warna Brand Lain** — Merah, Hitam, Abu-abu, Putih adalah palet final.
- **Jangan Gunakan Shadow Tipis** pada mode gelap; bayangan tidak akan terlihat, gunakan opasitas minimal 0.4.

---

## 8. Mini Design-System Khusus Admin Panel

Karena admin panel diperuntukkan untuk beban kerja administratif (CRUD panjang, input data), tema gelap dapat menyebabkan mata cepat lelah. Oleh karena itu, Admin Panel menggunakan **Tema Terang (Light Mode)** yang bersih, membedakannya secara visual dari halaman publik.

### Palet Warna Admin
- **Background Utama**: `#F8F9FA` (Abu-abu sangat terang, mengurangi silau putih bersih).
- **Surface / Card**: `#FFFFFF` (Putih murni untuk kontras area konten).
- **Teks Utama**: `#1A1A2E` (Navy gelap/Hitam lembut, lebih nyaman dari pure black).
- **Teks Sekunder**: `#6B7280` (Abu-abu netral untuk label dan placeholder).
- **Aksen / Border**: `#E5E7EB` (Border tipis pemisah antar elemen).
- **Brand Accent**: `#FE0000` (RPO Red, digunakan SANGAT minimal hanya untuk Indikator Navigasi Aktif dan Tombol Aksi Utama).

### Layout & Spacing Admin
- **Radius**: Sama dengan publik (4px) untuk menjaga konsistensi bentuk *brand*.
- **Shadow**: Sangat tipis (`0 1px 2px rgba(0,0,0,0.05)`) — tidak ada *heavy shadow* seperti di halaman publik.
- **Tabel / List**: Hindari garis batas yang berlebihan, gunakan perbedaan *background* halus (`#F3F4F6`) pada *hover* baris.

---

## 9. Agent Prompt Guide (Referensi Developer)

### Tabel Token Tailwind Kustom (Wajib Dipatuhi)
Konfigurasi `tailwind.config.ts` harus memetakan variabel kustom berikut agar tidak bergantung pada kelas bawaan Tailwind yang hex-nya meleset:

| Kelas Tailwind | Properti CSS | Kode Hex Final | Penggunaan |
|----------------|--------------|----------------|------------|
| `bg-rpo-black` | `background` | `#121212`      | Background utama Publik |
| `bg-rpo-surface` | `background`| `#1A1A1A`      | Background Card Publik |
| `bg-rpo-red`   | `background` | `#fe0000`      | Brand Accent utama |
| `text-rpo-red` | `color`      | `#fe0000`      | Teks Brand Accent |
| `border-rpo-gray`| `border-color`| `#333333`     | Border Publik |
| `bg-admin-base`| `background` | `#F8F9FA`      | Background utama Admin |
| `bg-admin-surface`| `background`| `#FFFFFF`    | Background Card Admin |
| `text-admin-dark`| `color`    | `#1A1A2E`      | Teks Utama Admin |

### Example Component Prompts (Tailwind)
- **Tombol Utama Publik**: `bg-rpo-red text-white px-6 py-3 rounded-sm font-inter font-semibold uppercase tracking-wider hover:brightness-90 transition-all`
- **Kartu Gelap Publik**: `bg-rpo-surface rounded overflow-hidden shadow-lg shadow-black/40 hover:-translate-y-1 transition-transform`
- **Card Admin**: `bg-admin-surface border border-gray-200 rounded p-6 shadow-sm`
- **Teks Judul Besar**: `font-poppins font-bold text-4xl text-white tracking-tight`
- **Teks Sekunder**: `font-inter font-normal text-sm text-[#b3b3b3]`
