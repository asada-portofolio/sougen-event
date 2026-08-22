# Recolor Task & Checklist — Halaman Public Website

> **Konteks:** Reality Project Organizer (RPO) berganti nama menjadi **Sougen Creative Management (Sougen)**. Dokumen ini adalah checklist perombakan palet warna halaman publik dari skema **merah RPO (`#fe0000`)** ke palet warna **Sougen** yang diturunkan dari logo resmi.

> **Cakupan:** Hanya perubahan warna (recolor). Konsep, bentuk, tata letak, dan struktur UI **tidak berubah**.

---

## Palet Warna Baru — Sougen Brand

| Token Lama (RPO)     | Kode Lama   | → | Token Baru (Sougen)      | Kode Baru   | Peran                              |
|----------------------|-------------|---|--------------------------|-------------|-------------------------------------|
| `rpo-red` / `--accent` | `#fe0000`   | → | `sougen-blue`            | `#0094DE`   | **Aksen utama (Primary)** — tombol, link aktif, highlight, focus ring |
| —                    | —           | → | `sougen-green-dark`      | `#004D2C`   | **Aksen sekunder (Secondary)** — elemen grounding, badge, hover state |
| —                    | —           | → | `sougen-green-mint`      | `#3ECC8B`   | **Aksen tersier (Tertiary)** — aksen segar, dekorasi, indikator sukses |
| —                    | —           | → | `sougen-gray`            | `#9CA3A7`   | **Netral aksen** — teks sekunder, placeholder |

> **Catatan:** Warna-warna non-merah (background, surface, border, teks hitam/putih, semantik error/warning/success) **tidak berubah** kecuali jika secara visual berbenturan dengan palet baru.

**Status:**
- `[ ]` Belum dimulai
- `[/]` Sedang dikerjakan
- `[x]` Selesai

---

## Section 0 — File Konfigurasi Global (Fondasi Warna)

Perubahan di section ini akan menjadi fondasi bagi seluruh perombakan. Dikerjakan **paling awal**.

### 0.1 Tailwind Config (`tailwind.config.ts`)
1. `[x]` Ganti definisi `'rpo-red': '#fe0000'` → `'sougen-blue': '#0094DE'` sebagai warna aksen utama.
2. `[x]` Tambahkan token warna baru: `'sougen-green-dark': '#004D2C'`, `'sougen-green-mint': '#3ECC8B'`, `'sougen-gray': '#9CA3A7'`.
3. `[x]` Pertahankan seluruh warna non-merah yang ada (`rpo-black`, `rpo-surface`, `rpo-gray`, dll.) tanpa perubahan.
4. `[x]` Pertahankan seluruh warna admin theme (`admin-base`, `admin-surface`, dll.) tanpa perubahan.

### 0.2 CSS Variables (`index.css`)
5. `[x]` Ganti `--accent: #fe0000;` → `--accent: #0094DE;` pada `:root`.
6. `[x]` (Opsional) Tambahkan CSS custom properties tambahan: `--accent-secondary`, `--accent-tertiary` jika diperlukan.

### 0.3 App CSS (`App.css`)
7. `[x]` Tidak ada perubahan langsung — file ini menggunakan `var(--accent)` yang akan otomatis berubah setelah `index.css` diupdate. **Cukup verifikasi visual.**

---

## Section 1 — Komponen Shared (Digunakan Lintas Halaman)

Perubahan di sini berdampak ke banyak halaman sekaligus. Dikerjakan **setelah Section 0**.

### 1.1 Section Header (`components/shared/SectionHeader.tsx`)
8. `[x]` Ganti semua referensi `rpo-red` (garis pembatas, dekorasi) → `sougen-blue` atau `sougen-green-mint` sesuai konteks visual.

### 1.2 Pagination (`components/shared/Pagination.tsx`)
9. `[x]` Ganti warna halaman aktif/hover dari `rpo-red` → `sougen-blue`.

### 1.3 Talent Card (`components/shared/TalentCard.tsx`)
10. `[x]` Ganti warna aksen (outline, tombol Follow, hover state) dari `rpo-red` → `sougen-blue`.

### 1.4 Mobile LineUp Card (`components/shared/MobileLineUpCard.tsx`)
11. `[x]` Ganti aksen garis merah pada card landscape → `sougen-blue` atau `sougen-green-dark`.

### 1.5 Program Card — Shared (`components/shared/ProgramCard.tsx`)
12. `[x]` Ganti warna aksen overlay/nama program dari `rpo-red` → `sougen-blue`.

### 1.6 Contact Info Box (`components/shared/ContactInfoBox.tsx`)
13. `[x]` Ganti warna ikon/aksen dari `rpo-red` → `sougen-blue`.

### 1.7 Filmstrip Carousel (`components/shared/FilmstripCarousel.tsx`)
14. `[x]` Ganti warna indikator/tombol navigasi dari `rpo-red` → `sougen-blue`.

---

## Section 2 — Komponen Public (Navigasi & Layout)

### 2.1 Navbar (`components/public/Navbar.tsx`)
15. `[x]` Ganti semua warna merah pada logo text, menu aktif, hover state → `sougen-blue`.
16. `[x]` Garis bawah/indicator menu aktif dari merah → `sougen-blue`.

### 2.2 Side Menu (`components/public/SideMenu.tsx`)
17. `[x]` Ganti warna aksen menu aktif, ikon shortcut dari `rpo-red` → `sougen-blue`.
18. `[x]` Ganti warna hover teks menu → `sougen-blue` atau `sougen-green-mint`.

### 2.3 Footer — Desktop (`components/public/Footer.tsx`)
19. `[x]` Ganti warna aksen (link hover, ikon sosial media, garis dekorasi) dari `rpo-red` → `sougen-blue`.
20. `[x]` Ganti teks nama RPO di footer → sesuaikan warna aksen Sougen.

### 2.4 Bottom Navigation — Mobile (`components/public/BottomNav.tsx`)
21. `[x]` Ganti warna ikon/teks menu aktif dari `rpo-red` → `sougen-blue`.
22. `[x]` Ganti latar warna aktif (jika ada) → varian transparan `sougen-blue`.

### 2.5 Back to Top Button (`components/public/BackToTop.tsx`)
23. `[x]` Ganti warna tombol/ikon dari `rpo-red` → `sougen-blue` atau `sougen-green-dark`.

---

## Section 3 — Komponen Home Page

### 3.1 Hero Section (`components/home/HeroSection.tsx`)
24. `[x]` Ganti warna teks aksen, badge, tombol CTA dari `rpo-red` → `sougen-blue`.
25. `[x]` Ganti warna desain karcis tiket (border, aksen) dari merah → `sougen-blue` / `sougen-green-dark`.

### 3.2 Running Text Banner (`components/home/RunningTextBanner.tsx`)
26. `[x]` Ganti background solid merah → `sougen-blue` atau gradien Sougen (`sougen-blue` → `sougen-green-mint`).
27. `[x]` Pastikan kontras teks putih tetap baik di atas warna baru.

### 3.3 Animation Text (`components/home/AnimationText.tsx`)
28. `[x]` Ganti warna teks/background dari `rpo-red` → `sougen-blue`.

### 3.4 LineUp Section (`components/home/LineUpSection.tsx`)
29. `[x]` Ganti garis tebal merah penutup section → `sougen-blue` atau `sougen-green-dark`.
30. `[x]` Ganti warna tombol "lihat selengkapnya" dari `rpo-red` → `sougen-blue`.

### 3.5 Guest Section (`components/home/GuestSection.tsx`)
31. `[x]` Ganti warna aksen (garis, tombol navigasi panah) dari `rpo-red` → `sougen-blue`.

### 3.6 Activity Section (`components/home/ActivitySection.tsx`)
32. `[x]` Ganti warna aksen navigasi, tombol panah, shortcut → `sougen-blue`.

### 3.7 Program Rundown Section (`components/home/ProgramRundownSection.tsx`)
33. `[x]` Ganti warna tombol switch Day aktif dari merah → `sougen-blue`.
34. `[x]` Ganti warna indikator segitiga aktif → `sougen-blue`.
35. `[x]` Ganti warna label "Day" pada desktop dari merah → `sougen-green-dark` atau `sougen-blue`.

### 3.8 FAQ & Contact Section (`components/home/FaqContactSection.tsx`)
36. `[x]` Ganti warna nomor urut FAQ dari `rpo-red` → `sougen-blue`.
37. `[x]` Ganti warna hover accordion trigger → `sougen-blue`.
38. `[x]` Ganti warna tombol "Hubungi Kami" → `sougen-blue` background atau outline.

---

## Section 4 — Komponen Event

### 4.1 Event Card (`components/event/EventCard.tsx`)
39. `[x]` Ganti warna aksen (border, overlay) dari `rpo-red` → `sougen-blue`.

### 4.2 Highlight Banner (`components/event/HighlightBanner.tsx`)
40. `[x]` Ganti warna badge "Sedang Berlangsung" dan tombol dari `rpo-red` → `sougen-blue`.

### 4.3 Event Hero (`components/event/EventHero.tsx`)
41. `[x]` Ganti warna badge, tombol, dan aksen dekoratif dari `rpo-red` → `sougen-blue`.

### 4.4 Event Info Section (`components/event/EventInfoSection.tsx`)
42. `[x]` Ganti warna aksen kartu Day/Lokasi dari `rpo-red` → `sougen-blue` atau `sougen-green-dark`.

### 4.5 Event Guest Section (`components/event/EventGuestSection.tsx`)
43. `[x]` Ganti garis pembatas/aksen section dari `rpo-red` → `sougen-blue`.

### 4.6 Event LineUp Section (`components/event/EventLineUpSection.tsx`)
44. `[x]` Ganti warna aksen garis dan tombol navigasi dari `rpo-red` → `sougen-blue`.

### 4.7 Event Program Section (`components/event/EventProgramSection.tsx`)
45. `[x]` Ganti warna aksen card dan tombol pendaftaran dari `rpo-red` → `sougen-blue`.

### 4.8 Event Rundown Section (`components/event/EventRundownSection.tsx`)
46. `[x]` Ganti warna label Day, garis waktu, dan aksen jam dari `rpo-red` → `sougen-blue` / `sougen-green-dark`.

---

## Section 5 — Komponen Domain Spesifik

### 5.1 Album Card — Gallery (`components/gallery/AlbumCard.tsx`)
47. `[x]` Ganti warna overlay/aksen dari `rpo-red` → `sougen-blue`.

### 5.2 Community Card (`components/community/CommunityCard.tsx`)
48. `[x]` Ganti warna aksen (ikon, border hover, tombol Follow) dari `rpo-red` → `sougen-blue`.

### 5.3 Program Card — Domain (`components/program/ProgramCard.tsx`)
49. `[x]` Ganti warna aksen card, tombol "Lihat Aturan Main" dari `rpo-red` → `sougen-blue`.

### 5.4 Rules Modal (`components/program/RulesModal.tsx`)
50. `[x]` Ganti warna header/aksen modal dari `rpo-red` → `sougen-blue` atau `sougen-green-dark`.

---

## Section 6 — Komponen UI (Design System)

### 6.1 Button (`components/ui/Button.tsx`)
51. `[x]` Ganti varian primary/aksen dari `rpo-red` → `sougen-blue`.
52. `[x]` Ganti hover state → `sougen-green-dark` atau darken `sougen-blue`.

### 6.2 Badge (`components/ui/Badge.tsx`)
53. `[x]` Ganti varian merah/aksen dari `rpo-red` → `sougen-blue`.

### 6.3 Input (`components/ui/Input.tsx`)
54. `[x]` Ganti focus ring/border dari `rpo-red` → `sougen-blue`.

### 6.4 Textarea (`components/ui/Textarea.tsx`)
55. `[x]` Ganti focus ring/border dari `rpo-red` → `sougen-blue`.

### 6.5 Accordion (`components/ui/Accordion.tsx`)
56. `[x]` Ganti warna indikator/chevron aktif dari `rpo-red` → `sougen-blue`.

### 6.6 Modal (`components/ui/Modal.tsx`)
57. `[x]` Ganti warna aksen tombol/header dari `rpo-red` → `sougen-blue`.

### 6.7 Toast (`components/ui/Toast.tsx`)
58. `[x]` Ganti warna toast varian error dari `rpo-red` → pertahankan merah semantik (`rpo-negative`).
59. `[x]` Pastikan toast sukses tidak berbenturan dengan `sougen-green-mint`.

---

## Section 7 — Halaman Public (Page-Level)

### 7.1 Home Page (`pages/Home.tsx`)
60. `[x]` Ganti warna skeleton loading dari `rpo-red/20` → `sougen-blue/20`.

### 7.2 Event List (`pages/EventList.tsx`)
61. `[x]` Ganti warna filter/tab aktif dari `rpo-red` → `sougen-blue`.
62. `[x]` Ganti warna hover border filter → `sougen-blue`.

### 7.3 Event Detail (`pages/EventDetail.tsx`)
63. `[x]` Ganti warna teks error "Event Tidak Ditemukan" dari `rpo-red` → `sougen-blue` atau semantik error.

### 7.4 LineUp Page (`pages/LineUp.tsx`)
64. `[x]` Ganti warna teks error dari `rpo-red` → `sougen-blue`.

### 7.5 Community Page (`pages/Community.tsx`)
65. `[x]` Ganti warna teks error dari `rpo-red` → `sougen-blue`.

### 7.6 Programs Page (`pages/Programs.tsx`)
66. `[x]` Ganti warna teks error dari `rpo-red` → `sougen-blue`.

### 7.7 FAQ Page (`pages/FAQ.tsx`)
67. `[x]` Ganti warna focus ring search input dari `rpo-red` → `sougen-blue`.
68. `[x]` Ganti warna nomor FAQ dan hover trigger → `sougen-blue`.
69. `[x]` Ganti warna teks error dari `rpo-red` → `sougen-blue`.

### 7.8 Policies Page (`pages/Policies.tsx`)
70. `[x]` Ganti warna border heading dari `rpo-red` → `sougen-blue`.
71. `[x]` Ganti warna ikon/badge kebijakan dari `rpo-red` → `sougen-blue`.
72. `[x]` Ganti warna hover card/accordion → `sougen-blue`.

### 7.9 Contact Page (`pages/Contact.tsx`)
73. `[x]` Ganti warna focus ring semua input dari `rpo-red` → `sougen-blue`.
74. `[x]` Ganti warna tanda wajib (*) dari `rpo-red` → `sougen-blue`.
75. `[x]` Ganti warna validasi inline error → pertahankan merah semantik (`rpo-negative`) atau `sougen-blue`.
76. `[x]` Ganti warna hover tombol Submit dari `rpo-red` → `sougen-blue`.

### 7.10 Gallery Overview (`pages/GalleryOverview.tsx`)
77. `[x]` Ganti warna teks error dari `rpo-red` → `sougen-blue`.

### 7.11 Gallery Detail (`pages/GalleryDetail.tsx`)
78. `[x]` Ganti warna border heading dari `rpo-red` → `sougen-blue`.
79. `[x]` Ganti warna tombol "Muat Lebih Banyak" dari `rpo-red` → `sougen-blue`.
80. `[x]` Ganti warna spinner loading dari `rpo-red` → `sougen-blue`.

### 7.12 About Us (`pages/AboutUs.tsx`)
81. `[x]` Ganti semua warna aksen merah (garis, badge statistik, dekorasi) → `sougen-blue` / `sougen-green-mint`.

---

## Section 8 — Verifikasi Akhir

82. `[x]` **Cek Kontras Warna:** Pastikan semua kombinasi teks/background memenuhi standar WCAG AA (rasio kontras ≥ 4.5:1 untuk teks normal, ≥ 3:1 untuk teks besar).
83. `[x]` **Cek Konsistensi Lintas Halaman:** Verifikasi setiap halaman public menggunakan palet Sougen secara konsisten (tidak ada sisa warna merah RPO).
84. `[x]` **Cek Mode Mobile & Desktop:** Pastikan perubahan warna terlihat benar di kedua mode tampilan.
85. `[x]` **Cek Skeleton Loading:** Pastikan warna skeleton selaras dengan palet baru.
86. `[x]` **Cek Animasi & Transisi:** Pastikan warna hover/focus/transition terasa smooth dan tidak janggal.
87. `[x]` **Pastikan warna semantik Error/Warning/Success tidak tercampur** dengan warna aksen brand.
