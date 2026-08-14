# Guideline Teknis (Developer Guidelines) — Website RPO

Dokumen ini merupakan panduan teknis yang mengunci spesifikasi *Tech Stack*, arsitektur repositori, konvensi kode, library, serta struktur *Database* (ERD) agar proses *coding* berjalan terarah, seragam, dan minim kendala.

---

## 1. Arsitektur Proyek dan Tech Stack Utama

Proyek menggunakan pola **Decoupled Architecture** (Pemisahan Klien dan Server) dengan struktur *Monorepo* sederhana (dua folder berbeda dalam satu *repository*).

- **Frontend**: React + Vite + TypeScript (Hosting: Vercel)
- **Backend**: Node.js + Express + TypeScript (Hosting: Render / Railway)
- **Database**: PostgreSQL (Hosting: Supabase / Neon / sejenisnya)
- **ORM**: Prisma

---

## 2. Struktur Direktori Repositori

```text
rpo-website/
├── frontend/                # Aplikasi React (Client Publik & Admin Panel)
│   ├── public/              # Aset statis publik
│   ├── src/
│   │   ├── assets/          # Gambar, font statis
│   │   ├── components/      # Komponen UI Reusable (Card, Button, Navbar)
│   │   ├── hooks/           # Custom React Hooks
│   │   ├── layouts/         # Layout Wrapper (PublicLayout, AdminLayout)
│   │   ├── pages/           # Halaman Utama (Publik & Admin)
│   │   ├── services/        # Konfigurasi Axios & API Client
│   │   ├── store/           # Zustand Store (State Management Client)
│   │   ├── types/           # Deklarasi Type/Interface TypeScript
│   │   ├── utils/           # Fungsi helper (formatDate, clsx)
│   │   └── App.tsx          # Root Component & Routing
│   ├── index.html
│   └── package.json
│
├── backend/                 # API Server (Express + Prisma)
│   ├── prisma/
│   │   └── schema.prisma    # Definisi skema Database
│   ├── src/
│   │   ├── controllers/     # Menangani Request/Response HTTP
│   │   ├── middlewares/     # Auth Guard, Rate Limiter, Error Handler
│   │   ├── routes/          # Definisi Endpoint API
│   │   ├── services/        # Logika Bisnis & Query Prisma (Layer utama)
│   │   ├── utils/           # Helper, Image Processing logic
│   │   └── index.ts         # Entry point server
│   └── package.json
│
└── docs/                    # Berisi PRD, Guideline, Design, Task (Bab IV)
```

---

## 3. Spesifikasi Library & Dependencies

Pemilihan library difokuskan pada performa, stabilitas, dan UX terbaik.

### 3.1 Frontend
- **Styling**: Tailwind CSS terintegrasi dengan `clsx` dan `tailwind-merge` (untuk menggabungkan *utility class* tanpa konflik).
- **Icons**: `lucide-react` (Wajib digunakan untuk seluruh ikon. **Dilarang keras menggunakan emoji**).
- **State Management**:
  - `zustand`: Untuk *Client State* (UI State, buka-tutup modal, toggle sidebar).
  - `@tanstack/react-query`: Untuk *Server State* (Fetching API, caching, loading/error state). Sangat krusial untuk sinkronisasi data Admin & Publik.
- **Routing**: `react-router-dom` (versi 6+).
- **Gallery & Masonry**: `react-photo-album` (untuk *Masonry Layout*) + `yet-another-react-lightbox` (untuk *Fullscreen View* foto).
- **UI Components (Headless)**: Radix UI Primitives atau Headless UI (Digunakan untuk membuat *Accordion*, *Dialog/Modal*, dan *Dropdown* yang *accessible* tanpa membawa desain bawaan).
- **Modul Admin**:
  - *Rich Text Editor*: `@tiptap/react` + `@tiptap/starter-kit` (Bersih, modern, hasil HTML terprediksi).
  - *Drag & Drop*: `@dnd-kit/core` (Untuk mengurutkan data di Admin).
  - *Form & Validation*: `react-hook-form` + `@hookform/resolvers/zod` (Validasi dengan Zod).

### 3.2 Backend
- **Framework**: `express`
- **ORM**: `@prisma/client`
- **Authentication**: `express-session`, `connect-pg-simple` (menyimpan sesi login di tabel DB agar tidak hilang saat server restart), `bcryptjs` (hashing password). Karena Frontend (Vercel) dan Backend (Render) berada di domain berbeda, konfigurasi sesi wajib menggunakan **Cross-Origin Cookie** (`sameSite: 'none'`, `secure: true`) dan Express harus dikonfigurasi dengan `app.set('trust proxy', 1)`.
- **Image Processing**: `sharp` (Eksekusi konversi ke WebP, kompresi, dan deteksi rasio gambar) + `multer` (Upload multipart/form-data).
- **Security & Optimasi**: `helmet`, `cors`, `express-rate-limit` (Melindungi form kontak dari spam).
- **Validation**: `zod` (Validasi tipe data API masuk).

---

## 4. Konvensi Kode (Coding Conventions)

- **Strict TypeScript**: Wajib menggunakan mode strict (`"strict": true`). **Hindari penggunaan tipe `any`**. Gunakan *type inference* atau deklarasikan *interface* dengan jelas (terutama *type* turunan dari Prisma di frontend).
- **Layered Architecture (Backend)**: 
  - *Controller* hanya bertugas menerima *Request* dan mengembalikan *Response* (JSON).
  - Seluruh *Business Logic* (Logika penentuan event aktif, pengolahan gambar, pemrosesan query) WAJIB diletakkan di layer *Service*.
- **Otomasi Pemrosesan Gambar (Aturan Emas)**:
  - Frontend **TIDAK** memproses gambar.
  - Setiap unggahan gambar diproses backend menggunakan `sharp` untuk konversi ke `.webp` dan kompresi kualitas.
  - **Fleksibilitas Resolusi**: Fungsi upload menerima parameter konfigurasi. Untuk entitas tunggal (Logo Komunitas, Profil Talent, Cover Program), fungsi hanya menghasilkan **1 versi gambar (single-version)**. Untuk entitas galeri (GalleryPhoto, CommunityPhoto, ProgramPhoto), fungsi menghasilkan **2 versi (`_thumb.webp` dan `_full.webp`)**.
  - **Pencegahan Layout Shift (CLS)**: Untuk galeri, fungsi mengembalikan `width` dan `height` asli untuk disimpan di DB. Untuk gambar tunggal, frontend akan menggunakan CSS *fixed aspect ratio* (misal `aspect-square` atau `aspect-video`) sehingga tidak memerlukan metadata dimensi dari DB.
- **Penamaan File Frontend**: *PascalCase* untuk Komponen React (`EventCard.tsx`, `HeroSection.tsx`). *camelCase* untuk Utility/Hooks (`formatDate.ts`, `useToggle.ts`).
- **Sinkronisasi Tipe Prisma (Cross-Repo)**: Frontend memerlukan tipe data dari Prisma yang ada di backend. Solusinya, gunakan *npm script* di root atau jalankan sinkronisasi manual yang menyalin direktori hasil `npx prisma generate` ke folder `frontend/src/types/prisma` agar frontend tetap type-safe tanpa redundansi.

---

## 5. Skema Database / Entity Relationship (Prisma ORM Konseptual)

Berikut adalah cetak biru relasi data yang akan diimplementasikan ke `schema.prisma`.

### 5.1 Entitas Sistem
- **`User`** (Single Admin)
  - Fields: `id`, `username`, `passwordHash`
- **`Session`** (Wajib untuk `connect-pg-simple`)
  - Fields: `sid` (String, @id), `sess` (Json), `expire` (DateTime)

### 5.2 Entitas Inti (Core Content)
- **`Event`** (Album Utama & Arsip)
  - Fields: `id`, `slug`, `name`, `theme`, `startDate`, `endDate`, `location`, `heroMode` (ENUM: TEMPLATE/POSTER), `posterImageUrl`, `heroImageUrl`, `registrationUrl`, `googleDriveUrl`, `isActive` (Boolean).
  - *Rule*: Constraint/Logic backend memastikan max 1 `isActive` = true.
- **`Talent`** (Guest & Performer)
  - Fields: `id`, `slug`, `stageName`, `instagramUrl`, `followerCount`, `postCount`, `bio`, `profileImageUrl`.
- **`Community`** (Mitra)
  - Fields: `id`, `slug`, `name`, `category`, `establishedYear`, `instagramUrl`, `description`, `logoUrl`, `displayOrder`.
- **`Program`** (Katalog Kegiatan)
  - Fields: `id`, `slug`, `name`, `description`, `rulesHtml` (Hasil dari Tiptap), `coverImageUrl`, `displayOrder`.

### 5.3 Entitas Relasional & Kompleks
- **`EventTalent`** (Relasi Event ↔ Talent)
  - Fields: `id`, `eventId`, `talentId`, `role` (ENUM: GUEST/PERFORMER), `performOrder`, `performTime`, `displayOrder`.
- **`EventProgram`** (Relasi Event ↔ Program)
  - Fields: `id`, `eventId`, `programId`, `displayOrder`.
- **`EventDay`** (Multi-hari event)
  - Fields: `id`, `eventId`, `dayNumber`, `date`, `locationOverride` (opsional).
- **`RundownItem`** (Jadwal per jam)
  - Fields: `id`, `eventDayId`, `time`, `activityName`, `location`, `displayOrder`.

### 5.4 Entitas Media Tambahan (Gallery & Strip Foto)
- **`GalleryPhoto`** (Dokumentasi Resmi berelasi ke Event)
  - Fields: `id`, `eventId`, `imageUrlFull`, `imageUrlThumb`, `width`, `height`, `caption`, `isCover`, `displayOrder`.
- **`CommunityPhoto`** (Strip dokumentasi komunitas)
  - Fields: `id`, `communityId`, `imageUrlFull`, `imageUrlThumb`, `width`, `height`, `caption`, `displayOrder`.
- **`ProgramPhoto`** (Strip dokumentasi program)
  - Fields: `id`, `programId`, `imageUrlFull`, `imageUrlThumb`, `width`, `height`, `caption`, `displayOrder`.

### 5.5 Entitas Informasi Statis & Pengaturan
- **`FAQItem`**
  - Fields: `id`, `question`, `answer`, `displayOrder`.
- **`PolicyRule`** (Aturan Pengunjung)
  - Fields: `id`, `ruleText`, `iconName` (nama ikon referensi Lucide React), `displayOrder`.
- **`SafetyProcedure`** (Darurat)
  - Fields: `id`, `question`, `answer`, `displayOrder`.
- **`ContactChannel`** (Kanal Komunikasi)
  - Fields: `id`, `type` (ENUM: WA/EMAIL/IG), `label`, `value`, `url`, `isEmergencyContact` (Boolean), `displayOrder`.
- **`ContactMessage`** (Pesan masuk dari form)
  - Fields: `id`, `senderName`, `senderEmail`, `senderPhone`, `message`, `createdAt`, `isRead`.
- **`AboutContent`** (Singleton)
  - Fields: `id`, `storyText`, `storyImageUrl`, `visionText`, `missionList` (JSON).
- **`TeamMember`**
  - Fields: `id`, `name`, `role`, `profileImageUrl`, `displayOrder`.
