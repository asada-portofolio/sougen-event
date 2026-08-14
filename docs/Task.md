# Task.md — Checklist Eksekusi Teknis Website RPO

Dokumen ini adalah panduan eksekusi *coding* yang mendetail. Setiap item adalah satu unit pekerjaan yang spesifik dan dapat diverifikasi. Urutan pengerjaan mengikuti dependensi teknis — jangan lewati fase sebelum fase di atasnya selesai.

**Status:**
- `[ ]` Belum dimulai
- `[/]` Sedang dikerjakan (bisa di lewati dulu) 
- `[x]` Selesai

---

## FASE 0 — Setup Proyek & Infrastruktur

### 0.1 Inisialisasi Repositori
- [x] Buat folder `rpo-website/` sebagai root monorepo
- [x] Inisialisasi Git (`git init`) di root
- [x] Buat `.gitignore` di root (mencakup `node_modules`, `.env`, `dist`, `build`, `.DS_Store`)
- [x] Buat `README.md` dengan deskripsi singkat proyek

### 0.2 Setup Backend (Node/Express/TypeScript)
- [x] Inisialisasi `package.json` di `backend/`
- [x] Install dependencies utama: `express`, `@prisma/client`, `bcryptjs`, `express-session`, `connect-pg-simple`, `multer`, `sharp`, `helmet`, `cors`, `express-rate-limit`, `zod`
- [x] Install dev dependencies: `typescript`, `ts-node`, `nodemon`, `@types/express`, `@types/node`, `@types/bcryptjs`, `@types/express-session`, `@types/multer`, `prisma`
- [x] Buat `tsconfig.json` dengan `strict: true`, `rootDir: src`, `outDir: dist`
- [x] Buat `nodemon.json` untuk *hot reload* saat development
- [x] Buat entry point `src/index.ts` — setup Express server + middleware global (`helmet`, `cors`, `express-session`)
- [x] Konfigurasi `app.set('trust proxy', 1)` agar Express mempercayai proxy dari platform hosting (Render/Railway).
- [x] Konfigurasi `cors` (origin dari frontend, `credentials: true`) dan konfigurasi cookie `express-session` (`sameSite: 'none'`, `secure: true`, `httpOnly: true`) untuk menangani *cross-origin cookies*.
- [x] Buat `.env` di `backend/` (Template: `DATABASE_URL`, `SESSION_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, `FRONTEND_URL`, `PORT`). *Catatan: Untuk `ADMIN_PASSWORD_HASH`, gunakan skrip `node -e "require('bcryptjs').hash('password', 10).then(console.log)"`*
- [x] Tambahkan skrip di `package.json`: `"dev"`, `"build"`, `"start"`

### 0.3 Setup Database (PostgreSQL + Prisma)
- [x] Setup PostgreSQL lokal via Docker untuk development (Supabase/Neon dipakai nanti di Fase 7 untuk production)
- [x] Salin `DATABASE_URL` dan `DIRECT_URL` ke `.env` backend
- [x] Jalankan `npx prisma init` di dalam folder `backend/`
- [x] Buat file `backend/prisma/seed.ts` untuk membuat data awal (akun admin, beberapa FAQ dummy, 1 Event dummy) — dikerjakan setelah skema & migrasi di FASE 1 selesai
- [x] Jalankan seed: `npx tsx prisma/seed.ts`

> Catatan: penulisan skema, migrasi, dan verifikasi Prisma Studio sengaja tidak diulang di sini — sudah tercakup penuh di section **FASE 1** di bawah, supaya tidak ada checklist ganda.

### 0.4 Setup Frontend (React/Vite/TypeScript)
- [x] Inisialisasi project Vite di `frontend/`: `npm create vite@latest . -- --template react-ts`
- [x] Install dependencies utama: `react-router-dom`, `zustand`, `@tanstack/react-query`, `axios`, `lucide-react`, `clsx`, `tailwind-merge`
- [x] Install Tailwind CSS: `tailwindcss`, `@tailwindcss/forms`, `postcss`, `autoprefixer`
- [x] Install UI & Komponen: `@radix-ui/react-dialog`, `@radix-ui/react-accordion`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-switch`, `@radix-ui/react-toast`
- [x] Install Gallery & Admin: `react-photo-album`, `yet-another-react-lightbox`, `@dnd-kit/core`, `@dnd-kit/sortable`, `@tiptap/react`, `@tiptap/starter-kit`, `react-hook-form`, `@hookform/resolvers`, `zod`
- [x] Konfigurasi `tailwind.config.ts`: tambahkan custom warna `rpo-red: '#fe0000'`, extend font `poppins` dan `inter`, tentukan `content` path
- [x] Tambahkan Google Fonts (`Poppins` dan `Inter`) ke `index.html` via `<link>` tag
- [x] Konfigurasi `vite.config.ts`: tambahkan `proxy` ke `http://localhost:PORT` untuk dev agar request ke `/api/*` diteruskan ke backend
- [x] Buat file `.env` di `frontend/`: `VITE_API_BASE_URL=http://localhost:PORT`
- [x] Setup `src/services/api.ts`: Buat instance Axios dengan `baseURL` dari env dan `withCredentials: true`
- [x] Setup `@tanstack/react-query` dengan `QueryClientProvider` di `src/main.tsx`

### 0.5 Setup Routing Dasar
- [x] Buat `src/App.tsx` dengan `BrowserRouter` dan struktur routing dasar
- [x] Buat placeholder halaman untuk semua rute publik: `/`, `/event`, `/event/:slug`, `/lineup`, `/community`, `/programs`, `/gallery`, `/gallery/:slug`, `/faq`, `/kebijakan`, `/contact`, `/about`
- [x] Buat placeholder halaman untuk semua rute admin: `/admin/login`, `/admn`, `/admin/event`, `/admin/event/:id`, `/admin/talent`, `/admin/talent/:id`, `/admin/community`, `/admin/community/:id`, `/admin/programs`, `/admin/programs/:id`, `/admin/faq`, `/admin/kebijakan`, `/admin/kontak`, `/admin/about`, `/admin/pengaturan`
- [x] Buat komponen `PublicLayout.tsx` (Navbar + Outlet + Footer)
- [x] Buat komponen `AdminLayout.tsx` (Sidebar/BottomNav + Outlet)
- [x] Buat komponen `ProtectedRoute.tsx` yang mengecek status autentikasi admin sebelum mengizinkan akses ke rute `/admin/*`

---

## FASE 1 — Skema Database (Prisma Schema)

- [x] Tulis model `User` (`id`, `username`, `passwordHash`)
- [x] Tulis model `Session` (`sid` String @id, `sess` Json, `expire` DateTime) wajib untuk `connect-pg-simple`
- [x] Tulis model `Event` (`id`, `slug`, `name`, `theme`, `startDate`, `endDate`, `location`, `heroMode`, `posterImageUrl`, `heroImageUrl`, `registrationUrl`, `googleDriveUrl`, `isActive`, `createdAt`, `updatedAt`)
- [x] Tulis model `EventDay` (`id`, `eventId`, `dayNumber`, `date`, `locationOverride`)
- [x] Tulis model `RundownItem` (`id`, `eventDayId`, `time`, `activityName`, `location`, `displayOrder`)
- [x] Tulis model `Talent` (`id`, `slug`, `stageName`, `instagramUrl`, `followerCount`, `postCount`, `bio`, `profileImageUrl`)
- [x] Tulis model `EventTalent` (`id`, `eventId`, `talentId`, `role` [ENUM: GUEST/PERFORMER], `performOrder`, `performTime`, `displayOrder`)
- [x] Tulis model `Community` (`id`, `slug`, `name`, `category`, `establishedYear`, `instagramUrl`, `description`, `logoUrl`, `displayOrder`)
- [x] Tulis model `CommunityPhoto` (`id`, `communityId`, `imageUrlFull`, `imageUrlThumb`, `width`, `height`, `caption`, `displayOrder`)
- [x] Tulis model `Program` (`id`, `slug`, `name`, `description`, `rulesHtml`, `coverImageUrl`, `displayOrder`)
- [x] Tulis model `ProgramPhoto` (`id`, `programId`, `imageUrlFull`, `imageUrlThumb`, `width`, `height`, `caption`, `displayOrder`)
- [x] Tulis model `EventProgram` (`id`, `eventId`, `programId`, `displayOrder`)
- [x] Tulis model `GalleryPhoto` (`id`, `eventId`, `imageUrlFull`, `imageUrlThumb`, `width`, `height`, `caption`, `isCover`, `displayOrder`)
- [x] Tulis model `FAQItem` (`id`, `question`, `answer`, `displayOrder`)
- [x] Tulis model `PolicyRule` (`id`, `ruleText`, `iconName`, `displayOrder`)
- [x] Tulis model `SafetyProcedure` (`id`, `question`, `answer`, `displayOrder`)
- [x] Tulis model `ContactChannel` (`id`, `type` [ENUM: WA/EMAIL/IG/OTHER], `label`, `value`, `url`, `isEmergencyContact`, `displayOrder`)
- [x] Tulis model `ContactMessage` (`id`, `senderName`, `senderEmail`, `senderPhone`, `message`, `createdAt`, `isRead`)
- [x] Tulis model `AboutContent` (`id`, `storyText`, `storyImageUrl`, `visionText`, `missionList` [JSON])
- [x] Tulis model `TeamMember` (`id`, `name`, `role`, `profileImageUrl`, `displayOrder`)
- [x] Jalankan `npx prisma migrate dev` untuk mengaplikasikan seluruh skema
- [x] Verifikasi semua relasi dan *constraint* sudah benar melalui Prisma Studio

---

## FASE 2 — Backend API

Setiap kelompok rute memiliki file terpisah di `src/routes/` dan controller di `src/controllers/`.

### 2.1 Middleware & Utilities
- [x] Buat `middlewares/auth.ts`: middleware `requireAuth` yang mengecek `req.session.userId`. Jika tidak ada, kembalikan `401 Unauthorized`.
- [x] Buat `middlewares/errorHandler.ts`: global error handler Express untuk menangkap error yang tidak tertangani dan mengembalikan response JSON yang konsisten.
- [x] Buat `middlewares/rateLimiter.ts`: Konfigurasi `express-rate-limit` khusus untuk rute `POST /api/contact/message` (contoh: max 5 request/15 menit per IP).
- [x] Buat `utils/imageProcessor.ts`: Fungsi `processAndSaveImage(file, outputDir, options)` menggunakan `sharp`. Menerima opsi fleksibel (contoh: `{ generateThumb: boolean }`). Jika `generateThumb: true` (untuk Galeri/Strip Foto), simpan `_full.webp` dan `_thumb.webp` serta kembalikan `width` & `height`. Jika `false` (untuk logo/avatar tunggal), simpan versi tunggal `.webp` saja tanpa mengembalikan dimensi.
- [x] Buat `utils/slugify.ts`: Fungsi helper untuk mengonversi string nama menjadi URL slug yang aman.
- [x] Buat `utils/activeEventGuard.ts`: Fungsi helper yang, saat satu event di-set `isActive: true`, secara otomatis men-set semua event lain menjadi `isActive: false`.

### 2.2 Auth API (`/api/auth`)
- [x] `POST /api/auth/login`: Terima `{ username, password }`. Verifikasi dengan `bcryptjs`. Jika valid, buat `req.session`. Kembalikan `{ success: true }`.
- [x] `POST /api/auth/logout`: Hancurkan `req.session`. Kembalikan `{ success: true }`.
- [x] `GET /api/auth/me`: Kembalikan status login saat ini `{ isLoggedIn: bool }`.

### 2.3 Event API (`/api/events`)
- [x] `GET /api/events`: Kembalikan semua event (urut descending tanggal). Untuk publik, hanya field ringkas (untuk grid arsip).
- [x] `GET /api/events/active`: Kembalikan satu event dengan `isActive: true`, termasuk relasi `EventTalent` (Guest/Performer), `EventProgram`, `EventDay`, dan `RundownItem`. Kembalikan `null` jika tidak ada.
- [x] `GET /api/events/:slug`: Kembalikan detail lengkap satu event (termasuk semua relasi). Akses publik.
- [x] `POST /api/events` [Auth]: Buat event baru. Validasi dengan Zod. Auto-generate `slug`.
- [x] `PUT /api/events/:id` [Auth]: Update data event. Jika `isActive: true`, panggil `activeEventGuard`.
- [x] `POST /api/events/:id/poster` [Auth]: Upload dan proses poster event menggunakan `multer` + `sharp`.
- [x] `DELETE /api/events/:id` [Auth]: Hapus event dan semua relasinya (Cascade di Prisma).

### 2.4 EventDay & RundownItem API
- [x] `POST /api/events/:eventId/days` [Auth]: Buat hari baru untuk sebuah event.
- [x] `PUT /api/event-days/:id` [Auth]: Update info hari.
- [x] `DELETE /api/event-days/:id` [Auth]: Hapus hari beserta seluruh `RundownItem`-nya (Cascade).
- [x] `POST /api/event-days/:dayId/rundown` [Auth]: Tambah item rundown ke sebuah hari.
- [x] `PUT /api/rundown/:id` [Auth]: Update item rundown.
- [x] `DELETE /api/rundown/:id` [Auth]: Hapus item rundown.
- [x] `PUT /api/event-days/:dayId/rundown/reorder` [Auth]: Terima array ID terurut, update `displayOrder` semua item rundown.

### 2.5 Talent API (`/api/talents`)
- [x] `GET /api/talents`: Kembalikan semua talent (untuk halaman LineUp publik).
- [x] `POST /api/talents` [Auth]: Buat talent baru.
- [x] `PUT /api/talents/:id` [Auth]: Update data talent.
- [x] `POST /api/talents/:id/photo` [Auth]: Upload foto profil (diproses `sharp`, disimpan versi tunggal `_full.webp`).
- [x] `DELETE /api/talents/:id` [Auth]: Hapus talent.
- [x] `POST /api/events/:eventId/talents` [Auth]: Tautkan talent ke event (buat `EventTalent`).
- [x] `PUT /api/event-talents/:id` [Auth]: Update role/urutan talent dalam event.
- [x] `DELETE /api/event-talents/:id` [Auth]: Lepas talent dari event.

### 2.6 Community API (`/api/communities`)
- [x] `GET /api/communities`: Kembalikan semua komunitas termasuk foto-fotonya.
- [x] `POST /api/communities` [Auth]: Buat komunitas baru.
- [x] `PUT /api/communities/:id` [Auth]: Update data komunitas.
- [x] `POST /api/communities/:id/logo` [Auth]: Upload logo.
- [x] `DELETE /api/communities/:id` [Auth]: Hapus komunitas.
- [x] `POST /api/communities/:id/photos` [Auth]: Multi-upload foto. Loop setiap file, proses dengan `processAndSaveImage`, simpan ke `CommunityPhoto`.
- [x] `PUT /api/communities/:id/photos/reorder` [Auth]: Update `displayOrder` foto.
- [x] `DELETE /api/community-photos/:id` [Auth]: Hapus satu foto.

### 2.7 Program API (`/api/programs`)
- [x] `GET /api/programs`: Kembalikan semua program termasuk foto-fotonya.
- [x] `POST /api/programs` [Auth]: Buat program baru (termasuk `rulesHtml` dari Tiptap).
- [x] `PUT /api/programs/:id` [Auth]: Update data program.
- [x] `POST /api/programs/:id/cover` [Auth]: Upload foto cover program.
- [x] `DELETE /api/programs/:id` [Auth]: Hapus program.
- [x] `POST /api/programs/:id/photos` [Auth]: Multi-upload foto dokumentasi program.
- [x] `PUT /api/programs/:id/photos/reorder` [Auth]: Update urutan foto.
- [x] `DELETE /api/program-photos/:id` [Auth]: Hapus satu foto.
- [x] `POST /api/events/:eventId/programs` [Auth]: Tautkan program ke event (buat `EventProgram`).
- [x] `PUT /api/event-programs/reorder` [Auth]: Update urutan program dalam event.
- [x] `DELETE /api/event-programs/:id` [Auth]: Lepas program dari event.

### 2.8 Gallery API (`/api/gallery`)
- [x] `GET /api/gallery`: Kembalikan semua event yang memiliki foto gallery (hanya data ringkas + foto cover untuk grid album di Tingkat 1).
- [x] `GET /api/gallery/:eventSlug`: Kembalikan semua `GalleryPhoto` untuk satu event (dengan pagination/cursor).
- [x] `POST /api/events/:eventId/gallery` [Auth]: Multi-upload foto gallery. Proses setiap file dengan `processAndSaveImage`.
- [x] `PUT /api/gallery-photos/:id` [Auth]: Update `caption`, `isCover`, atau `displayOrder`.
- [x] `PUT /api/events/:eventId/gallery/reorder` [Auth]: Update urutan seluruh foto gallery dalam satu event.
- [x] `DELETE /api/gallery-photos/:id` [Auth]: Hapus satu foto gallery.

### 2.9 FAQ & Kebijakan API
- [x] `GET /api/faqs`: Kembalikan semua FAQ (urut `displayOrder`).
- [x] `POST /api/faqs` [Auth]: Buat FAQ baru.
- [x] `PUT /api/faqs/:id` [Auth]: Update FAQ.
- [x] `DELETE /api/faqs/:id` [Auth]: Hapus FAQ.
- [x] `PUT /api/faqs/reorder` [Auth]: Update urutan seluruh FAQ.
- [x] `GET /api/policies`: Kembalikan semua `PolicyRule`.
- [x] `POST /api/policies` [Auth], `PUT /api/policies/:id` [Auth], `DELETE /api/policies/:id` [Auth], `PUT /api/policies/reorder` [Auth].
- [x] `GET /api/safety`: Kembalikan semua `SafetyProcedure`.
- [x] `POST /api/safety` [Auth], `PUT /api/safety/:id` [Auth], `DELETE /api/safety/:id` [Auth], `PUT /api/safety/reorder` [Auth].

### 2.10 Contact API (`/api/contact`)
- [x] `GET /api/contact/channels`: Kembalikan semua `ContactChannel` (urut `displayOrder`).
- [x] `POST /api/contact/channels` [Auth], `PUT /api/contact/channels/:id` [Auth], `DELETE /api/contact/channels/:id` [Auth], `PUT /api/contact/channels/reorder` [Auth].
- [x] `POST /api/contact/messages`: Publik bisa mengirim pesan kontak (buat `ContactMessage`).
- [x] `GET /api/contact/messages` [Auth]: Admin melihat daftar pesan masuk (urut tanggal).
- [x] `PUT /api/contact/messages/:id/read` [Auth]: Tandai pesan sudah dibaca.
- [x] `DELETE /api/contact/messages/:id` [Auth]: Hapus pesan.

### 2.11 About API (`/api/about`)
- [x] `GET /api/about/content`: Kembalikan data `AboutContent` (hanya ada 1 baris di DB).
- [x] `PUT /api/about/content` [Auth]: Update data About.
- [x] `POST /api/about/content/image` [Auth]: Upload gambar story.
- [x] `GET /api/about/team`: Kembalikan semua `TeamMember`.
- [x] `POST /api/about/team` [Auth]: Tambah anggota tim baru.
- [x] `PUT /api/about/team/:id` [Auth]: Update anggota tim.
- [x] `POST /api/about/team/:id/photo` [Auth]: Upload foto profil tim.
- [x] `DELETE /api/about/team/:id` [Auth]: Hapus anggota tim.
- [x] `PUT /api/about/team/reorder` [Auth]: Update urutan tampil anggota tim.

---

## FASE 3 — Frontend: Design System & Komponen Global

### 3.1 Design System Foundation
- [x] Konfigurasi `tailwind.config.ts` lengkap: Warna kustom (`rpo-red`, semua shade gelap), custom font family, custom spacing (jika perlu), border-radius kustom.
- [x] Buat `src/index.css`: Deklarasi `@import` font Google, CSS variable global (`--bg-base`, `--bg-surface`, `--text-base`, `--text-muted`, `--accent`).

### 3.2 Komponen Primitif (Reusable UI)
- [x] Buat `components/ui/Button.tsx`: Mendukung varian `primary`, `dark`, `outlined`. Selalu menggunakan Inter font, uppercase, letter-spacing. Prop: `variant`, `size`, `loading` (menampilkan spinner ikon), `asChild`.
- [x] Buat `components/ui/Badge.tsx`: Mendukung varian `active` (merah), `draft` (abu), `done` (hijau). Format teks uppercase.
- [x] Buat `components/ui/Skeleton.tsx`: Komponen kotak abu-abu beranimasi `pulse`. Prop: `className` untuk mengatur ukuran.
- [x] Buat `components/ui/Modal.tsx`: Wrapper Radix `Dialog` yang sudah diberi styling gelap.
- [x] Buat `components/ui/Toast.tsx`: Komponen notifikasi menggunakan Radix `Toast`. Mendukung varian `success`, `error`, `warning`.
- [x] Buat `components/ui/Input.tsx`: Input field dengan styling gelap, focus ring merah, dan label.
- [x] Buat `components/ui/Textarea.tsx`: Textarea dengan styling serupa Input.
- [x] Buat `components/ui/Accordion.tsx`: Wrapper Radix `Accordion` dengan styling gelap (untuk FAQ).
- [x] Buat `components/ui/ImageWithSkeleton.tsx`: Komponen `<img>` ber-Skeleton dengan dua mode. **Mode 1**: Menerima prop `width` dan `height` (untuk galeri). **Mode 2**: Tanpa mewajibkan `width/height`, melainkan menggunakan prop `className` dengan CSS *fixed aspect ratio* (misal `aspect-square`) untuk entitas gambar tunggal.

### 3.3 Komponen Layout Global
- [x] Buat `layouts/PublicLayout.tsx`: Membungkus halaman publik dengan `Navbar` di atas dan `Footer` (atau `BottomNav`) di bawah. Menerima prop untuk mengontrol komponen mana yang dirender.
- [x] Buat `layouts/AdminLayout.tsx`: Membungkus halaman admin dengan `AdminSidebar` (desktop) dan `AdminBottomNav` (mobile).

### 3.4 Komponen Navigasi Publik
- [x] Buat `components/public/Navbar.tsx`: Navbar Desktop (menu tengah). Implementasi `hide active link` logic, dropdown Resource. Sticky, menggunakan backdrop blur.
- [x] Buat `components/public/SideMenu.tsx`: Panel navigasi Radix `Sheet` (sisi kanan). Konten navigasi statis.
- [x] Buat `components/public/BottomNav.tsx`: Komponen Bottom Navigation Bar (Mobile). Dipakai di Home dan Event Detail.
- [x] Buat `components/public/Footer.tsx`: Footer website publik. Data konten bersumber dari API `/api/contact/channels` dan konfigurasi pengaturan umum.

### 3.5 Komponen Bersama (Shared)
- [x] Buat `components/shared/SectionHeader.tsx`: Komponen header section (Label kotak merah kecil + Judul besar + Garis pembatas + Teks intro). Digunakan di hampir semua halaman.
- [x] Buat `components/shared/ContactInfoBox.tsx`: Kotak info kontak (reusable di FAQ, Kebijakan). Mengambil data dari query `/api/contact/channels`.
- [x] Buat `components/shared/TalentCard.tsx`: Kartu Talent (foto, nama, IG). Digunakan di Home, Event Detail, dan LineUp.
- [x] Buat `components/shared/Pagination.tsx`: Komponen pagination standar.

---

## FASE 4 — Frontend: Halaman Publik

### 4.1 Halaman Home (`/`)
- [x] Implementasi `HeroSection.tsx`: Mengambil data dari `/api/events/active`. Render `HeroVariant1` (default) atau `HeroVariant2` (event aktif ada).
- [x] Implementasi `AnimationText.tsx`: Animasi teks berputar sesuai status Hero.
- [x] Implementasi `GuestSection.tsx` (kondisional): Ambil data dari event aktif (`role: GUEST`). Tampil dengan scroll horizontal kartu. Render `null` jika tidak ada event aktif.
- [x] Implementasi `LineUpSection.tsx` (kondisional): Ambil data dari event aktif (`role: PERFORMER`). Render `null` jika tidak ada event aktif.
- [x] Implementasi `ProgramRundownSection.tsx` (kondisional): Ambil data Program dan Rundown dari event aktif. Render `null` jika tidak ada event aktif.
- [x] Implementasi seluruh Skeleton Loading state untuk setiap section di Home.
- [x] Implementasi Bottom Navigation Bar di Home (Mobile).
- [x] Pastikan `<head>` Home memiliki `<title>`, `<meta description>`, dan Open Graph tags yang tepat.

### 4.2 Halaman Event List (`/event`)
- [x] Implementasi `HighlightBanner.tsx` (kondisional): Mengambil data dari `/api/events/active`. Render sebagai banner full-width di atas. Render `null` jika tidak ada.
- [x] Implementasi grid arsip event: Ambil data dari `/api/events`, render kartu event portrait, urut descending.
- [x] Implementasi Pagination untuk grid arsip (>10 event).
- [x] Pastikan SEO tags terpasang.

### 4.3 Halaman Event Detail (`/event/:slug`)
- [x] Ambil data dari `GET /api/events/:slug`.
- [x] Implementasi `EventHero.tsx`: Render mode TEMPLATE atau mode POSTER berdasarkan `heroMode` dari data.
- [x] Implementasi section Tanggal & Lokasi (per hari, dinamis).
- [x] Implementasi section Guest (hanya untuk event ini, tanpa pagination).
- [x] Implementasi section Performer/LineUp (urut `performOrder`).
- [x] Implementasi section Program Event (katalog program di event ini).
- [x] Implementasi section Rundown (Timeline per `EventDay`).
- [x] Implementasi Aksi Kondisional: Tombol "Pendaftaran" (jika `isActive`) atau tombol "Gallery" & "Google Drive" (jika tidak aktif).
- [x] Implementasi Bottom Navigation Bar (Mobile).
- [x] Pastikan SEO tags bersifat dinamis (judul = nama event, deskripsi = tema event, image = poster event).

### 4.4 Halaman LineUp (`/lineup`)
- [x] Ambil data dari `GET /api/talents`.
- [x] Implementasi grid Talent (2 kolom Mobile, 4 kolom Desktop) dengan `TalentCard`.
- [x] Implementasi Pagination.
- [x] Pastikan SEO tags terpasang.

### 4.5 Halaman Community (`/community`)
- [x] Ambil data dari `GET /api/communities`.
- [x] Render kartu komunitas (logo, nama, deskripsi, strip foto).
- [x] Implementasi Modal Gallery (Lightbox) saat foto diklik.
- [x] Implementasi Pagination.
- [x] Pastikan SEO tags terpasang.

### 4.6 Halaman Programs (`/programs`)
- [x] Ambil data dari `GET /api/programs`.
- [x] Render kartu program (cover, nama, deskripsi, strip foto).
- [x] Implementasi Modal Gallery untuk foto dokumentasi.
- [x] Implementasi Modal "Aturan Main" yang menampilkan `rulesHtml` (menggunakan `dangerouslySetInnerHTML` dengan sanitasi `DOMPurify`).
- [x] Implementasi Pagination.
- [x] Pastikan SEO tags terpasang.

### 4.7 Halaman Gallery Overview (`/gallery`)
- [x] Ambil data dari `GET /api/gallery`.
- [x] Render grid album event (foto cover, nama event, tanggal, jumlah foto).
- [x] Implementasi Pagination (>10 album).
- [x] Pastikan SEO tags terpasang.

### 4.8 Halaman Gallery Detail (`/gallery/:slug`)
- [x] Ambil data dari `GET /api/gallery/:eventSlug` (paginated/cursor-based).
- [x] Implementasi Masonry Layout menggunakan `react-photo-album` (modus masonry, `columns` responsif).
- [x] Implementasi `ImageWithSkeleton` untuk setiap foto (gunakan `width`/`height` dari DB).
- [x] Implementasi "Muat Lebih Banyak" setelah 30 foto pertama.
- [x] Implementasi Fullscreen Lightbox (`yet-another-react-lightbox`) saat foto diklik, dengan navigasi kiri/kanan dan swipe.
- [x] Pastikan SEO tags terpasang (OG image = foto cover album).

### 4.9 Halaman FAQ (`/faq`)
- [x] Ambil data dari `GET /api/faqs`.
- [x] Implementasi `SearchBar` (client-side filtering, memfilter pertanyaan berdasarkan input pengguna secara realtime).
- [x] Implementasi Accordion Eksklusif (hanya 1 item terbuka).
- [x] Tampilkan `ContactInfoBox` di bawah accordion.
- [x] Pastikan SEO tags terpasang.

### 4.10 Halaman Kebijakan & Keamanan (`/kebijakan`)
- [x] Ambil data dari `/api/policies` dan `/api/safety`.
- [x] Render daftar `PolicyRule` (dengan ikon Lucide React berdasarkan `iconName`).
- [x] Render Accordion `SafetyProcedure` (Eksklusif).
- [x] Tampilkan `ContactInfoBox` (prioritaskan kontak dengan `isEmergencyContact: true`).
- [x] Pastikan SEO tags terpasang.

### 4.11 Halaman Contact (`/contact`)
- [x] Ambil data dari `GET /api/contact/channels`.
- [x] Render grid kartu kanal komunikasi.
- [x] Implementasi form pesan (dengan `react-hook-form` + Zod). Field: Nama, Email, WA, Pesan.
- [x] Tambahkan *honeypot field* tersembunyi (`name="website"`, `display: none via CSS`).
- [x] Hubungkan form ke `POST /api/contact/messages`. Tampilkan feedback berhasil/gagal dengan state lokal.
- [x] Pastikan SEO tags dan Structured Data JSON-LD `ContactPage` terpasang.

### 4.12 Halaman About Us (`/about`)
- [x] Ambil data dari `GET /api/about`.
- [x] Render section "Cerita Kami" (teks + foto).
- [x] Render section "Visi & Misi".
- [x] Render section Statistik (query COUNT agregat dari total Event, Talent, Community di backend, eksposekan melalui `GET /api/about/stats`).
- [x] Render grid "Tim Kami" (`TeamMember`).
- [x] Pastikan SEO tags terpasang.

---

## FASE 5 — Frontend: Admin Panel

### 5.1 Autentikasi Admin
- [x] Buat halaman `AdminLogin.tsx`: Form username/password, POST ke `/api/auth/login`. Redirect ke `/admin` jika berhasil. Tampilkan error jika gagal.
- [x] Implementasi `ProtectedRoute.tsx`: Saat diakses, periksa `GET /api/auth/me`. Jika `isLoggedIn: false`, redirect ke `/admin/login`.
- [x] Buat `useAuthStore.ts` (Zustand): Menyimpan status autentikasi global. Diperbarui saat login/logout.

### 5.2 Layout & Navigasi Admin
- [x] Buat `AdminSidebar.tsx` (Desktop): Sidebar kiri dengan logo, grup navigasi, item navigasi aktif (merah), dan info profil admin + tombol logout di bawah.
- [x] Buat `AdminBottomNav.tsx` (Mobile): Bottom Navigation Bar 5 tombol. Tombol "Konten" membuka `AdminContentSheet`.
- [x] Buat `AdminContentSheet.tsx` (Mobile): Bottom Sheet berisi daftar seluruh modul konten.
- [x] Buat `AdminHeader.tsx`: Header tipis berisi *breadcrumb* halaman aktif dan tombol "Lihat Website".

### 5.3 Dashboard Admin
- [x] Fetch data dari: `/api/events/active`, `/api/about/stats`, `/api/contact/messages?unread=true`.
- [x] Render Banner Event Aktif (kondisional) dengan indikator kelengkapan data.
- [x] Render 4 Kartu Statistik (Total Event, Total Talent, Total Komunitas, Pesan Belum Dibaca).
- [x] Render Log Aktivitas (5 item terakhir dari data yang tersedia).
- [x] Render tombol Akses Cepat (shortcut ke modul yang paling sering digunakan).

### 5.4 Modul Event (Admin)
- [x] Buat halaman `AdminEventList.tsx`: Tampilan Card View daftar event. Render badge status, indikator kelengkapan, dan switch toggle event aktif (dengan konfirmasi jika ada event lain yang sedang aktif).
- [x] Buat halaman `AdminEventDetail.tsx`: Implementasi Tab Navigation (7 tab).
  - [x] Tab 1 (Info Dasar): Form dengan preview kartu event di samping.
  - [x] Tab 2 (Hero & Visual): Toggle mode TEMPLATE/POSTER, area upload gambar.
  - [x] Tab 3 (Talent): Daftar talent terpilih + panel pencarian untuk menambah.
  - [x] Tab 4 (Program): Checklist program dari katalog.
  - [x] Tab 5 (Rundown): Timeline visual per hari, dengan input inline per item. Tombol "Tambah Hari".
  - [x] Tab 6 (Gallery): Grid foto, multi-upload, drag-and-drop urutan, pemilih foto cover.
  - [x] Tab 7 (Pengaturan): Toggle isActive, Danger Zone (hapus event dengan konfirmasi ketik nama).

### 5.5 Modul Talent (Admin)
- [x] Buat halaman `AdminTalentList.tsx`: Photo Grid View semua talent. Filter by role. Tombol tambah talent baru.
- [x] Buat halaman `AdminTalentForm.tsx`: Form split-screen (kiri: form, kanan: preview kartu).

### 5.6 Modul Community (Admin)
- [x] Buat halaman `AdminCommunityList.tsx`: Card List View dengan strip foto.
- [x] Buat halaman `AdminCommunityForm.tsx`: Form (Profil + Foto Dokumentasi dengan multi-upload dan drag-and-drop).

### 5.7 Modul Programs (Admin)
- [x] Buat halaman `AdminProgramList.tsx`: Card List View.
- [x] Buat halaman `AdminProgramForm.tsx`: Form (Profil + Editor Tiptap untuk Aturan Main + Foto Dokumentasi).

### 5.8 Modul FAQ (Admin)
- [x] Buat halaman `AdminFAQList.tsx`: Accordion Preview. Drag-and-drop untuk reorder. Tombol edit/hapus per item. Input dan tombol "Tambah Pertanyaan" di atas.

### 5.9 Modul Kebijakan & Keamanan (Admin)
- [x] Buat halaman `AdminKebijakan.tsx`: Dua sub-tab (Aturan Pengunjung: Inline edit + drag, dan Prosedur Darurat: Tampilan seperti FAQ admin).

### 5.10 Modul Kontak (Admin)
- [x] Buat halaman `AdminKontak.tsx`:
  - [x] Sub-tab "Kanal Komunikasi": Daftar kartu kanal, toggle isEmergencyContact, drag-and-drop urutan.
  - [x] Sub-tab "Pesan Masuk": Inbox bergaya email, klik untuk detail, tandai sudah dibaca.

### 5.11 Modul About Us (Admin)
- [x] Buat halaman `AdminAbout.tsx`:
  - [x] Bagian 1: Form Konten (Cerita, foto, Visi, daftar Misi).
  - [x] Bagian 2: Photo Grid Tim (identik UX dengan modul Talent).

### 5.12 Modul Pengaturan (Admin)
- [x] Buat halaman `AdminSettings.tsx`:
  - [x] Pengaturan Footer: Editor konten footer + preview footer di bawah.
  - [x] Pengaturan Umum: Form untuk metadata global website.

---

## FASE 6 — Pengujian & Finalisasi
- [x] Pengecekan standar dan audit infrastruktur (Fase 0)
- [x] Pengecekan standar dan audit Skema Database (Fase 1)
- [x] Pengecekan standar dan audit Backend API (Fase 2)
- [x] Pengecekan standar dan audit Frontend Design System (Fase 3)
- [x] Pengecekan standar dan audit Frontend Halaman Publik (Fase 4)
- [x] Pengecekan standar dan audit Frontend Admin Panel (Fase 5)
- [x] Uji seluruh alur CRUD (Buat, Baca, Update, Hapus) di semua modul Admin.
- [x] Uji fitur toggle event aktif: pastikan hanya 1 event aktif yang dapat ada di waktu bersamaan.
- [x] Uji pemrosesan gambar: upload JPEG/PNG → verifikasi file `.webp` tersimpan dengan benar, dimensi tersimpan di DB.
- [x] Uji form Contact: kirim pesan normal, uji honeypot (isi field tersembunyi), uji rate limiting (kirim >5 kali dalam 15 menit).
- [x] Uji SEO: periksa `<title>`, `<meta description>`, OG tags, dan Structured Data di setiap halaman publik menggunakan browser DevTools.
- [x] Uji SEO Lanjutan: Pastikan tag `<link rel="canonical">` terpasang di setiap halaman publik, dan buat fungsi untuk men-generate `sitemap.xml`.
- [x] Uji responsivitas di 3 breakpoint: Mobile (375px), Tablet (768px), Desktop (1280px).
- [x] Uji aksesibilitas dasar: navigasi keyboard, fokus yang terlihat, atribut `alt` pada gambar.

---

## FASE 7 — Deployment

- [ ] Build frontend: `npm run build` di `frontend/`.
- [ ] Buat project di Vercel, hubungkan ke repositori, konfigurasi environment variable (`VITE_API_BASE_URL` ke URL backend production).
- [ ] Build dan deploy backend ke Render/Railway. Konfigurasi environment variables (`DATABASE_URL`, `SESSION_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, `FRONTEND_URL`).
- [ ] Jalankan `prisma migrate deploy` di environment production.
- [ ] Jalankan seed awal (akun admin) di production.
- [ ] Verifikasi koneksi frontend ↔ backend di production.
- [ ] Tes login admin di production.
- [ ] Tes alur pengguna publik (Buka Home → Klik Event → Lihat Detail) di production.
