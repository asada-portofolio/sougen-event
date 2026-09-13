# NavigationAudit.md — Audit & Peta Navigasi Website Sougen

Dokumen ini memetakan seluruh elemen navigasi di website Sougen Creative Management. Setiap item adalah satu titik navigasi yang dapat diverifikasi keberadaannya di UI, rute-nya di router, dan konsistensinya antar komponen. Gunakan dokumen ini untuk melacak proses audit navigasi.

**Status:**
- `[ ]` Belum diaudit
- `[/]` Sedang diaudit / ada catatan
- `[x]` Sudah diaudit & konsisten

**File Referensi:**
- Router: `frontend/src/App.tsx`
- Navbar Desktop: `frontend/src/components/public/Navbar.tsx`
- Side Menu: `frontend/src/components/public/SideMenu.tsx`
- Bottom Nav Mobile: `frontend/src/components/public/BottomNav.tsx`
- Footer: `frontend/src/components/public/Footer.tsx`
- Admin Nav Data: `frontend/src/components/admin/adminNavData.ts`
- Admin Sidebar: `frontend/src/components/admin/AdminSidebar.tsx`
- Admin Bottom Nav: `frontend/src/components/admin/AdminBottomNav.tsx`

---

## BAGIAN 1 — Navigasi Publik: Navbar Desktop

> Sumber: `Navbar.tsx` — Tampil di layar `lg:` ke atas (≥1024px). Menu utama rata tengah, dropdown "Resources", dan link "Contact" terpisah.

### 1.1 Menu Utama (navLinksLeft)
- [x] **Home** → `/` — Tampil di Navbar, aktif saat `pathname === '/'`
- [x] **Event** → `/event` — Tampil di Navbar, aktif saat `pathname.startsWith('/event')`
- [x] **Community** → `/community` — Tampil di Navbar, aktif saat `pathname.startsWith('/community')`
- [x] **About** → `/about` — Tampil di Navbar, aktif saat `pathname.startsWith('/about')`

### 1.2 Dropdown "Resources" (resourceLinks)
- [x] **Gallery** → `/gallery` — Tampil dalam dropdown hover
- [x] **FAQ** → `/faq` — Tampil dalam dropdown hover

### 1.3 Link Terpisah
- [ ] **Contact** → `/contact` — Dirender manual di luar array, setelah dropdown Resources

### 1.4 Perilaku Kontekstual (leftNav)
- [ ] Default: Logo Sougen (link ke `/`)
- [ ] Di `/event/:slug`: Tombol "Kembali" → `/event`
- [ ] Di `/gallery/:slug`: Tombol "Kembali" → `/gallery`
- [ ] Di `/lineup` atau `/talents`: Tombol "Kembali" → `/`

---

## BAGIAN 2 — Navigasi Publik: Side Menu (Hamburger)

> Sumber: `SideMenu.tsx` — Panel Radix Dialog dari sisi kanan layar. Tersedia di semua ukuran layar via tombol hamburger di Navbar.

### 2.1 Menu Utama (mainLinks — Kolom Kanan)
- [ ] **Home** → `/`
- [ ] **Event** → `/event`
- [ ] **Line Up** → `/lineup`
- [ ] **Community** → `/community`
- [ ] **About Us** → `/about`
- [ ] **Program** → `/programs`
- [ ] **Contact** → `/contact`

### 2.2 Resources (resourceLinks — Kolom Kiri)
- [ ] **Gallery** → `/gallery`
- [ ] **FAQ** → `/faq`

### 2.3 Get in Touch (contactLinks — Kolom Kiri)
- [ ] **Email** → `mailto:contact@rpo.com` (link eksternal)
- [ ] **WhatsApp** → `https://wa.me/628123456789` (link eksternal)

### 2.4 Social (socialLinks — Kolom Kiri)
- [ ] **Instagram** → `https://instagram.com/rpo` (link eksternal)

---

## BAGIAN 3 — Navigasi Publik: Bottom Nav Mobile

> Sumber: `BottomNav.tsx` — Fixed di bawah layar, hanya tampil di layar `< lg` (mobile/tablet). Muncul setelah scroll >50px atau di halaman tertentu.

### 3.1 Item Navigasi (navItems)
- [ ] **Home** → `/` — Ikon: `Home`
- [ ] **Events** → `/event` — Ikon: `CalendarSearch`
- [ ] **About** → `/about` — Ikon: `UserCircle`
- [ ] **Contact** → `/contact` — Ikon: `MessageSquare`

### 3.2 Perilaku Visibilitas
- [ ] Selalu terlihat di: Event Detail (`/event/:slug`), Line Up (`/lineup`), About (`/about`)
- [ ] Halaman lain: Muncul setelah scroll >50px, sembunyi saat di atas

---

## BAGIAN 4 — Navigasi Publik: Footer

> Sumber: `Footer.tsx` — Hanya tampil di layar `lg:` ke atas (desktop). Data kontak & sosial media bersumber dari API `/api/contact/channels`.

### 4.1 Kolom Kiri — Logo & Social Media
- [ ] **Logo Sougen** → `/` (link internal)
- [ ] **Follow Us** — Dinamis dari API (tipe: INSTAGRAM, FACEBOOK, TIKTOK, TWITTER, YOUTUBE)

### 4.2 Kolom Tengah — Menu Utama
- [ ] **Home** → `/`
- [ ] **Event** → `/event`
- [ ] **LineUp** → `/lineup`
- [ ] **Community** → `/community`
- [ ] **About** → `/about`
- [ ] **Contact** → `/contact`

### 4.3 Kolom Tengah — Resource
- [ ] **Gallery** → `/gallery`
- [ ] **FAQ** → `/faq`

### 4.4 Kolom Kanan — Hubungi Kami
- [ ] Dinamis dari API (tipe: WHATSAPP, EMAIL, TELEPHONE, TELEGRAM, LINE)

---

## BAGIAN 5 — Navigasi Admin: Sidebar & Bottom Nav

> Sumber: `adminNavData.ts` — Data navigasi terpusat untuk `AdminSidebar.tsx` (desktop) dan `AdminBottomNav.tsx` (mobile).

### 5.1 Grup "Utama"
- [ ] **Dashboard** → `/admin` — Ikon: `LayoutDashboard`
- [ ] **Event** → `/admin/event` — Ikon: `CalendarDays`

### 5.2 Grup "Konten"
- [ ] **Talent** → `/admin/talent` — Ikon: `Users`
- [ ] **Community** → `/admin/community` — Ikon: `Handshake`
- [ ] **Programs** → `/admin/programs` — Ikon: `Sparkles`
- [ ] **FAQ** → `/admin/faq` — Ikon: `HelpCircle`
- [ ] **Safety & Policy** → `/admin/safety` — Ikon: `ShieldCheck`

### 5.3 Grup "Komunikasi"
- [ ] **Kontak** → `/admin/kontak` — Ikon: `MessageSquare`
- [ ] **About Us** → `/admin/about` — Ikon: `Info`

### 5.4 Grup "Sistem"
- [ ] **Pengaturan** → `/admin/pengaturan` — Ikon: `Settings`

---

## BAGIAN 6 — Rute di Router yang Tidak Ada di Navigasi Manapun

> Sumber: `App.tsx` — Rute-rute ini terdaftar di router tetapi tidak muncul sebagai item menu di navigasi manapun. Mereka diakses melalui link internal di halaman lain.

### 6.1 Halaman Detail (Publik)
- [ ] **Event Detail** → `/event/:slug` — Diakses dari klik kartu event di `/event`
- [ ] **Gallery Detail** → `/gallery/:slug` — Diakses dari klik album di `/gallery`

### 6.2 Halaman Khusus (Publik)
- [ ] **Policies / Safety** → `/safety` — Tidak ada di Navbar/BottomNav; hanya di internal link
- [ ] **Line Up** → `/lineup` — Tidak ada di Navbar desktop; ada di SideMenu & Footer
- [ ] **Programs** → `/programs` — Tidak ada di Navbar desktop; ada di SideMenu

### 6.3 Halaman Admin (Tanpa Nav Item Langsung)
- [ ] **Admin Login** → `/admin/login` — Halaman login terpisah, tanpa layout admin
- [ ] **Admin Event Detail** → `/admin/event/:id` — Diakses dari klik event di daftar
- [ ] **Admin Talent Form** → `/admin/talent/:id` — Diakses dari klik talent di daftar
- [ ] **Admin Community Form** → `/admin/community/:id` — Diakses dari klik komunitas di daftar
- [ ] **Admin Program Form** → `/admin/programs/:id` — Diakses dari klik program di daftar

### 6.4 Halaman Fallback
- [ ] **404 Not Found** → `*` — Catch-all untuk rute yang tidak dikenali

---

## BAGIAN 7 — Matriks Konsistensi Navigasi

> Audit silang: apakah setiap halaman publik muncul secara konsisten di semua komponen navigasi yang relevan.

| Halaman | Path | Navbar Desktop | SideMenu | BottomNav | Footer |
|---------|------|:-:|:-:|:-:|:-:|
| Home | `/` | `[ ]` | `[ ]` | `[ ]` | `[ ]` |
| Event | `/event` | `[ ]` | `[ ]` | `[ ]` | `[ ]` |
| Line Up | `/lineup` | `[ ]` *(tidak ada)* | `[ ]` | `[ ]` *(tidak ada)* | `[ ]` |
| Community | `/community` | `[ ]` | `[ ]` | `[ ]` *(tidak ada)* | `[ ]` *(tidak ada)* |
| About | `/about` | `[ ]` | `[ ]` | `[ ]` | `[ ]` |
| Programs | `/programs` | `[ ]` *(tidak ada)* | `[ ]` | `[ ]` *(tidak ada)* | `[ ]` *(tidak ada)* |
| Gallery | `/gallery` | `[ ]` *(dropdown)* | `[ ]` | `[ ]` *(tidak ada)* | `[ ]` |
| FAQ | `/faq` | `[ ]` *(dropdown)* | `[ ]` | `[ ]` *(tidak ada)* | `[ ]` |
| Contact | `/contact` | `[ ]` | `[ ]` | `[ ]` | `[ ]` |
| Safety | `/safety` | `[ ]` *(tidak ada)* | `[ ]` *(tidak ada)* | `[ ]` *(tidak ada)* | `[ ]` *(tidak ada)* |

---

## BAGIAN 8 — Catatan Temuan & Rekomendasi

> Gunakan bagian ini untuk mencatat inkonsistensi, bug, atau rekomendasi perbaikan selama proses audit.

### 8.1 Inkonsistensi yang Teridentifikasi
- [ ] Halaman **Safety/Policies** (`/safety`) tidak muncul di navigasi manapun — perlu ditentukan apakah ditambahkan ke menu atau hanya diakses via internal link
- [ ] Halaman **Programs** (`/programs`) tidak ada di Navbar desktop — hanya di SideMenu
- [ ] Halaman **Line Up** (`/lineup`) tidak ada di Navbar desktop & BottomNav — hanya di SideMenu & Footer
- [ ] Halaman **Community** (`/community`) ada di Navbar desktop tapi tidak di Footer & BottomNav
- [ ] Link di SideMenu bagian "Get in Touch" dan "Social" masih hardcoded (bukan dari API) — Footer sudah dinamis dari API

### 8.2 Rekomendasi
- [ ] *(Tambahkan catatan rekomendasi di sini selama audit)*

### 8.3 Perbaikan yang Sudah Dilakukan
- [ ] *(Catat perubahan yang sudah diimplementasi)*
