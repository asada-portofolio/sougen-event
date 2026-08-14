# RPO Public Website — Redesign Brief
**Untuk digunakan sebagai konteks di Antigravity (atau agent coding lain) bersama `taste-skill` (`design-taste-frontend` / `redesign-existing-projects`)**

> ⚠️ **Instruksi untuk AI Agent:** Brief ini berisi arah desain yang **sudah dikunci dan disetujui manusia** melalui proses diskusi & referensi visual. Jangan menyimpulkan ulang arah desain dari nol. Gunakan `taste-skill` untuk *eksekusi teknis* (menerjemahkan keputusan di bawah ini jadi kode Tailwind yang rapi, konsisten, dan idiomatik) — bukan untuk *menentukan ulang* arah stylistik. Jika ada bagian yang ambigu/tidak tercakup di sini, tanyakan ke user sebelum berasumsi.

---

## 1. Ringkasan Proyek

- **Nama produk**: Reality Project Organizer (RPO) — event organizer budaya pop Jepang (jejepangan) di Makassar.
- **Scope**: Redesign UI/UX **halaman publik** saja (bukan admin panel).
- **Tech stack** (wajib dipatuhi, tidak berubah):
  - React (Vite)
  - TailwindCSS — utility classes only, hindari CSS/SASS/styled-components terpisah kecuali sangat terpaksa
  - Ikon: `lucide-react` — gaya outline tipis
  - State: React hooks lokal (tidak ada state management library baru)
- **Sifat perubahan**: Murni visual/presentasional. Semua rute, fungsi CTA, dan alur data (state, API call, form submission) yang ada saat ini **wajib tetap berjalan sama persis**.

---

## 2. Arah Desain Terkunci: "Light Editorial + Crimson Poster Blocking"

Kombinasi referensi yang diminta: **Anime City × Japanese Event Poster × Editorial Magazine × Modern Web UI**.

**Eksplisit BUKAN:**
- ❌ Kawaii (pastel, bubble font, maskot lucu)
- ❌ Cyberpunk (neon pelangi, glitch, matrix-rain)
- ❌ Dark-theme penuh di semua section (versi awal yang diusulkan, sudah di-revisi)

**Referensi visual yang jadi acuan utama**: dua screenshot desain yang dikirim user (`Group_62_2x.webp` — desktop, `Group_67.webp` — mobile), menampilkan Hero cityscape anime bergaya sinematik dengan banner crimson solid "UPCOMING EVENT", card guest berbingkai merah, dan filmstrip carousel "Our Activity". **Lampirkan kedua gambar ini sebagai referensi visual saat briefing agent/skill.**

**Prinsip inti:**
- Section **konten** (semua halaman kecuali Hero) pakai **latar terang** (`bg-white` / `bg-[#FAFAFA]`), bukan `bg-rpo-black` seperti sistem lama.
- **Hero** (di Home) tetap gelap/sinematik — satu-satunya area dark utama di halaman.
- **Footer** dibuat dark lagi sebagai "bookend" — membingkai konten terang di antara dua area gelap (Hero di atas, Footer di bawah).
- Warna merah brand (`rpo-red`) dipakai sebagai **blocking solid** (banner, kicker label, border card), bukan sebagai glow/gradient.
- Kesan "premium/dramatis" dicapai lewat tipografi besar + blocking warna disiplin, **bukan** lewat efek glow/blur/gradient gelap.

---

## 3. Batasan Wajib (dari Aturan Arsitektur)

- Sitemap tidak berubah: `/`, `/about`, `/events` (+`/event/:slug`), `/programs`, `/talents`, `/gallery` (+`/gallery/:id`), `/community`, `/contact`, `/faq`, `/policies`.
- Komponen global tetap ada dan berfungsi sama: `Navbar.tsx`, `Footer.tsx`, `BottomNav.tsx`, `SideMenu.tsx`, `Button.tsx`, `Input.tsx`, `Textarea.tsx`, `Accordion.tsx`, `Badge.tsx`, `Skeleton.tsx`/`ImageWithSkeleton.tsx`, `SEO.tsx`.
- CTA "Jelajahi Event Kami" tetap navigasi ke `/events` — visual boleh berubah total, fungsi tidak.
- Tombol filter/tab boleh diubah jadi pill/segmented control.
- Form Contact tetap POST ke endpoint yang sama — hanya visual & loading state yang boleh berubah.

---

## 4. Sistem Warna

**Base lama (tetap ada di token, dipakai ulang secara selektif):**
| Token | Value | Peran baru |
|---|---|---|
| `rpo-black` | `#121212` | Hero, Footer, teks di atas bg terang |
| `rpo-surface` | `#1A1A1A` | Panel dalam area dark saja (Hero/Footer) |
| `rpo-red` | `#fe0000` | Warna aksen utama — solid block, border, kicker |
| `rpo-success` | `#10B981` | Badge verified (ikon centang) |

**Baru / perlu ditambahkan:**
- `bg-white` atau `#FAFAFA` — bg default section konten (ganti `rpo-black` sebagai bg utama non-Hero).
- Teks body di atas bg terang: `text-rpo-black/70` (varian baru; `rpo-silver` yang lama didesain untuk dark bg).
- Overlay Hero: `bg-gradient-to-b from-black/40 to-transparent` di atas gambar cityscape (untuk keterbacaan navbar/teks).

---

## 5. Tipografi

- **H1 Hero / heading section besar**: `text-4xl md:text-5xl font-black uppercase` (Poppins Black 900), warna `text-rpo-red` di atas bg putih, atau `text-white` di atas Hero gelap. Tambah underline tebal pendek: `border-b-4 border-rpo-red w-16`.
- **Kicker label** (di atas heading section, mis. "FOR THIS EVENT"): solid-block, bukan outline — `bg-rpo-red text-white text-xs uppercase tracking-wide px-3 py-1 inline-block`.
- **Angka besar sebagai kicker** (dipakai di Visi-Misi About Us, nomor urut FAQ): `text-rpo-red font-black text-4xl` (About) / `text-sm mr-3` (FAQ) — jadi benang merah visual lintas halaman.
- **Body/paragraf panjang**: `max-w-[65ch] leading-relaxed text-rpo-black/70`.

---

## 6. Shape & Border — Aturan Diferensiasi Card

Prinsip: **radius & border berbeda berdasarkan jenis konten**, supaya tidak semua kotak terlihat sama (kelemahan versi lama).

| Jenis konten | Style | Contoh halaman |
|---|---|---|
| Card "orang" (guest, talent, crew) | `border-2 border-rpo-red rounded-xl` | Home (Our Guest), About (Tim/Crew) |
| Card event/tiket | `border-2 border-rpo-red rounded-xl overflow-hidden` + badge status pojok | Events |
| Card komunitas (logo pihak lain) | **Netral**, `border border-rpo-black/10 rounded-xl`, hover `border-rpo-red` | Community |
| Card program | Tanpa border tebal, cukup underline crimson di judul | Programs |
| Foto galeri | `rounded-lg`, tanpa border merah — foto jadi fokus | Gallery |
| Tombol primary | Pill hitam solid `rounded-full bg-black text-white`, hover `bg-rpo-red` | Global |
| Tombol secondary | `rounded-full border-2 border-black`, hover invert | Global |

---

## 7. Komponen Global

- **Navbar**: transparan+overlay gelap di atas Hero (teks putih) → transisi jadi `bg-white/95 backdrop-blur-sm shadow-sm` saat scroll (teks jadi `rpo-black`). *Butuh scroll-state hook, murni presentasional.*
- **Footer**: dark (`bg-rpo-black text-rpo-near-white`), aksen `border-t-4 border-rpo-red`.
- **BottomNav**: `bg-white border-t border-rpo-black/10`, ikon aktif `text-rpo-red`.
- **SideMenu**: `bg-white`, item `border-l-4 border-transparent hover:border-rpo-red`.
- **Input/Textarea**: flip ke light-mode — `bg-white border-2 border-rpo-black/10 rounded-lg focus:border-rpo-red focus:ring-2 focus:ring-rpo-red/20`.
- **Filmstrip carousel** (komponen baru, dipakai di ≥2 tempat): scroll-x, gambar rasio potret, overlay gradient bawah untuk caption (`bg-gradient-to-t from-black/80 to-transparent`), tombol panah bulat hitam kecil di pojok kanan-bawah section. Dipakai di: Home (Our Activity), EventDetail (line-up talent).
- **Badge verified**: ikon `BadgeCheck`/`CheckCircle2` dari lucide-react, `text-rpo-success`.

---

## 8. Breakdown Per Halaman (ringkas — detail penuh tersedia jika dibutuhkan)

- **Home**: Hero dark+glow judul, banner crimson divider, Our Guest (card border-merah), Our Activity (filmstrip carousel).
- **About Us**: Banner header crimson solid, Visi-Misi 2 kolom dengan angka kicker, Sejarah timeline vertikal (`border-l-2 border-rpo-red`), Tim/Crew pakai pola card Guest.
- **Community**: Grid card netral (bukan border merah — logo pihak lain).
- **Events (List/Detail)**: Filter pill, card tiket border-merah, EventDetail 2 kolom asimetris + filmstrip line-up.
- **Programs**: Card lembut tanpa border tebal, underline crimson di judul.
- **Talent/Line-Up**: Foto full-bleed + overlay gradient caption, kicker kategori merah.
- **Gallery**: Grid rapat radius lembut tanpa border merah, hover scale + ikon `Expand`.
- **Contact**: Split layout, ikon dalam lingkaran `bg-rpo-red/10`, tombol submit dengan `Loader2 animate-spin`.
- **FAQ**: Nomor urut jadi kicker kecil merah di depan tiap pertanyaan.
- **Policies**: Paling minim dekorasi — kolom baca `max-w-[70ch]`, opsional sticky table-of-contents.

---

## 9. Asumsi Teknis yang Perlu Diverifikasi Agent/User

- Komponen (`Button`, `Card`, dll) diasumsikan menerima `className` yang bisa di-override langsung. **Verifikasi ke source sebelum eksekusi masif.**
- Transisi navbar scroll & loading state form butuh sedikit logic (hook), tapi tetap presentasional — tidak mengubah data flow.
- Pastikan versi Tailwind mendukung arbitrary values (`v3.1+`) jika ada kebutuhan efek non-standar di luar yang tercantum di sini.

---

## 10. Prioritas Implementasi (ringkasan dari diskusi)

1. Gradasi/overlay Hero + transisi Navbar (fondasi visual pertama yang terlihat).
2. Banner crimson solid + kicker label solid-block (pattern paling sering dipakai ulang).
3. Card "orang" dengan border merah (`rounded-xl border-2 border-rpo-red`) — dipakai di ≥4 halaman.
4. Filmstrip carousel (komponen reusable baru).
5. Flip Input/Textarea & komponen form ke light-mode.

---

*Brief ini dirangkum dari sesi diskusi desain — bukan spesifikasi final yang tidak bisa diubah. Kalau ada keputusan yang terasa kurang pas saat implementasi nyata, revisi bagian tersebut dan update brief ini.*