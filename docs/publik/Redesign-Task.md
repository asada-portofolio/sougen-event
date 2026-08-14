# Redesign Task & Guideline — RPO Public Website

Dokumen ini adalah panduan lengkap dan checklist eksekusi untuk proses redesign antarmuka (UI/UX) halaman publik website RPO. Urutan pengerjaan mengikuti dependensi teknis.

**Status:**
- `[ ]` Belum dimulai
- `[/]` Sedang dikerjakan
- `[x]` Selesai

---

## PANDUAN DESAIN (GUIDELINES)

**Tema Utama:** "Light Editorial + Crimson Poster Blocking"
- **Vibe:** Anime City × Japanese Event Poster × Editorial Magazine × Modern Web UI.
- **Eksplisit Bukan:** Kawaii/Pastel, Cyberpunk/Neon, atau Full Dark-Theme.
- **Warna Dasar:**
  - Background halaman/section konten mayoritas **terang** (`bg-white` / `bg-[#FAFAFA]`).
  - **Hero Section** (Home) dan **Footer** menggunakan background **gelap/sinematik** (`bg-rpo-black` / `#121212`). Footer menjadi "bookend" penutup.
  - Aksen utama: **Crimson Red** (`rpo-red`: `#fe0000`). Digunakan secara *solid blocking* (bukan efek glow/neon/blur), seperti pada border card, kicker/label teks (banner), dan aksen garis.
  - Teks konten panjang di atas bg terang: `text-rpo-black/70`.
- **Tipografi:**
  - Heading utama (H1) besar, kapital, tebal (Poppins Black 900).
  - Label Kicker (misal "FOR THIS EVENT", "OUR GUEST"): menggunakan block merah solid dengan teks putih, kapital, huruf kecil yang ditebalkan (mirip editorial poster).
- **Komponen & Bentuk (Shapes):**
  - **Card Orang (Guest/Talent):** Radius rounded (`rounded-xl`), border tebal merah (`border-2 border-rpo-red`).
  - **Card Komunitas:** Border netral tipis abu-abu (hover baru merah).
  - **Card Program:** Tanpa border tebal, cukup underline crimson pada judul.
  - **Activity/Filmstrip Carousel:** Layout horizontal scroll dengan rasio gambar potret, overlay gradasi hitam dari bawah untuk teks/caption.
  - **Form (Input/Textarea):** Light mode (`bg-white`, border abu-abu, focus merah).
- **Interaktivitas & Efek:**
  - Transisi Navbar: Transparan dengan teks putih (overlay hero) di awal, berubah perlahan menjadi `bg-white/95 backdrop-blur-sm` dengan teks hitam saat di-scroll.

---

## FASE 1 — Pembaruan Design System & Token

- [x] Update `tailwind.config.ts`: Konfirmasi token warna `rpo-red` (#fe0000), `rpo-black` (#121212), `rpo-surface` (#1A1A1A). Pastikan font `poppins` dan `inter` teraplikasi dengan varian ketebalan yang tepat (sampai 900 untuk Black).
- [x] Update `index.css`: Penyesuaian global style background body agar menggunakan warna default yang terang (kecuali ditimpa di Hero/Footer).
- [x] Pembuatan utilitas gradient: Pastikan class utility Tailwind sanggup membuat gradasi sinematik untuk hero & filmstrip (`from-black/40`, `from-black/80`).

## FASE 2 — Redesign Komponen Primitif & Layout Global

- [x] Update `Button.tsx`: Ubah varian primary menjadi hitam solid (`bg-black text-white hover:bg-rpo-red rounded-full`). Ubah varian sekunder/outline (`border-2 border-black hover:invert rounded-full`).
- [x] Update `Input.tsx` dan `Textarea.tsx`: Implementasi light-mode style (bg putih, border hitam/10, focus ring `rpo-red/20`, text rpo-black).
- [x] Buat/Update `SectionHeader.tsx`: Implementasi elemen visual Label Kicker (Solid Red) dan Judul besar dengan underline merah pendek.
- [x] Update `Navbar.tsx`: Terapkan state deteksi scroll (mengubah styling transparan ke putih).
- [x] Update `Footer.tsx`: Terapkan tema gelap, dan aksen `border-t-4 border-rpo-red`.
- [x] Update `BottomNav.tsx` & `SideMenu.tsx`: Terapkan tema terang, berikan aksen aktif warna merah di ikon/border kiri.

## FASE 3 — Implementasi Komponen Kompleks

- [x] Buat `GuestCard.tsx` / Update `TalentCard.tsx`: Terapkan bentuk berbingkai merah (`border-2 border-rpo-red rounded-xl`).
- [x] Buat komponen baru `FilmstripCarousel.tsx`: Digunakan untuk "Our Activity". Dukung drag-to-scroll / button panah kecil hitam, format gambar potret, gradient overlay.

## FASE 4 — Redesign Halaman Home (`/`)

- [x] Update `HeroSection`: Atur tinggi/gambar hero dengan gradient sinematik, ubah judul hero agar menonjol. Tambahkan **Crimson Solid Banner** "UPCOMING EVENT".
- [x] Update `GuestSection`: Terapkan layout kicker editorial dan mapping `GuestCard` yang sudah dibuat di Fase 3.
- [x] Update `Our Activity`: Terapkan komponen `FilmstripCarousel`.
- [x] Pastikan padding/margin antar section konsisten dengan background putih.

## FASE 5 — Redesign Halaman Publik Lainnya

- [x] **About Us (`/about`)**: Terapkan header banner crimson. Styling Visi-Misi dengan angka kicker besar merah, Sejarah dengan timeline merah, dan Crew menggunakan `GuestCard`.
- [x] **Events List (`/events`)**: Styling pill-filter. Kartu event dengan border merah.
- [x] **Event Detail (`/events/:slug`)**: Refactor layout ke background terang. Terapkan filmstrip line-up talent jika memungkinkan.
- [x] **Community (`/community`)**: Card dengan border abu-abu netral, hover effect.
- [x] **Programs (`/programs`)**: Tampilan elegan dengan underline crimson di judul.
- [x] **Gallery (`/gallery`)**: Penyesuaian grid rapat tanpa border merah, fokus konten visual.
- [x] **Contact (`/contact`)**: Split layout form light-mode, aksen ikon di atas lingkaran merah muda (`bg-rpo-red/10`).
- [x] **FAQ & Policies (`/faq`, `/policies`)**: Penyesuaian nomor urut jadi kicker kecil merah (FAQ). Layout membaca ergonomis (`max-w-[70ch]`).

## FASE 6 — Finalisasi & Quality Assurance

- [x] Responsivitas: Cek ketepatan tata letak di ukuran Mobile, Tablet, dan Desktop.
- [x] Fungsionalitas: Pastikan link, routing, modal gambar, dan form submit tetap berjalan normal (State & API flow tidak berubah).
- [x] Pembersihan Kode: Hapus class warna dark-mode lama yang tersisa (`text-rpo-silver` jika tidak relevan lagi, ganti ke `text-rpo-black/70`).
