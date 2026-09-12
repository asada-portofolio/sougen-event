# Deployment.md — Checklist Persiapan & Eksekusi Deployment Website Sougen

Dokumen ini adalah panduan persiapan dan eksekusi deployment yang mendetail. Setiap item adalah satu unit pekerjaan yang spesifik dan dapat diverifikasi. Urutan pengerjaan mengikuti dependensi teknis — jangan lewati fase sebelum fase di atasnya selesai.

**Platform yang digunakan:**
- **Git Repository**: GitHub
- **Database Cloud**: Supabase (PostgreSQL)
- **Backend Hosting**: Railway (Web Service)
- **Frontend Hosting**: Vercel

**Status:**
- `[ ]` Belum dimulai
- `[/]` Sedang dikerjakan (bisa di lewati dulu)
- `[x]` Selesai

---

## FASE D-0 — Persiapan Lokal & Repositori

### D-0.1 Rebranding Nama Proyek (RPO → Sougen)
- [x] Rename folder proyek lokal dari `rpo-website` menjadi nama baru yang sesuai (contoh: `sougen-website`)
- [x] Pastikan semua terminal yang menjalankan `npm run dev` (backend & frontend) sudah dihentikan sebelum rename folder
- [x] Setelah rename, buka kembali proyek di editor dan verifikasi semua file terbuka tanpa error path
- [x] Verifikasi bahwa `npm run dev` di backend dan frontend masih berjalan normal setelah rename folder

### D-0.2 Push Repositori ke GitHub
- [x] Buat repositori baru di GitHub (bisa *private* atau *public*, sesuai kebutuhan skripsi)
- [x] Verifikasi file `.gitignore` di root sudah mencakup: `node_modules/`, `.env`, `.env.local`, `dist/`, `build/`, `*.log`
- [x] Verifikasi file `.gitignore` di `backend/` sudah mencakup: `node_modules`, `.env`, `/src/generated/prisma`
- [x] Verifikasi folder `uploads/` **tidak** masuk ke Git (tambahkan `uploads/` ke `.gitignore` backend jika belum ada)
- [x] Tambahkan remote GitHub: `git remote add origin https://github.com/USERNAME/NAMA-REPO.git`
- [x] Commit semua perubahan terbaru: `git add .` → `git commit -m "Persiapan deployment"`
- [x] Push ke GitHub: `git push -u origin main` (atau `master`, sesuai branch utama)
- [x] Verifikasi di GitHub: pastikan semua file dan folder sudah muncul di repositori, dan **tidak ada** file `.env` atau `node_modules/` yang ikut ter-push

### D-0.3 Verifikasi Build Lokal
- [x] Jalankan `npm run build` di `backend/` — pastikan sukses tanpa error (TypeScript compile)
- [x] Jalankan `npm run build` di `frontend/` — pastikan sukses tanpa error (TypeScript + Vite build)
- [x] Catat ukuran output `frontend/dist/assets/` sebagai baseline performa

---

## FASE D-1 — Setup Database Cloud (Supabase)

### D-1.1 Buat Project Database di Supabase
- [x] Login ke [Supabase Dashboard](https://supabase.com/dashboard)
- [x] Buat project baru (atau gunakan project yang sudah ada). Catat **Region** yang dipilih — idealnya pilih region terdekat dengan target pengguna (contoh: `Southeast Asia (Singapore)`)
- [x] Set database password yang kuat dan **simpan password ini dengan aman** — tidak bisa dilihat lagi setelah project dibuat

### D-1.2 Ambil Connection Strings
- [x] Buka menu **Settings → Database** di dashboard Supabase
- [x] Salin **Connection String (URI)** mode **Transaction** (port `6543`, via Supavisor pooler) → ini akan menjadi nilai `DATABASE_URL`
- [x] Salin **Connection String (URI)** mode **Session** atau **Direct** (port `5432`, koneksi langsung) → ini akan menjadi nilai `DIRECT_URL`
- [x] Pastikan kedua string sudah berisi password database yang benar (ganti placeholder `[YOUR-PASSWORD]` dengan password asli)

> **Catatan Penting:**
> - `DATABASE_URL` (pooler, port 6543) digunakan oleh Prisma Client saat runtime aplikasi berjalan.
> - `DIRECT_URL` (direct, port 5432) digunakan oleh Prisma CLI (`migrate deploy`), `connect-pg-simple` (session store), dan `seed.ts`.
> - Kedua URL **wajib ada** agar backend berfungsi dengan benar.

### D-1.3 Verifikasi Koneksi Database
- [x] Tes koneksi menggunakan tool database client (pgAdmin, DBeaver, atau Supabase SQL Editor) untuk memastikan credential valid
- [x] Pastikan database kosong (belum ada tabel) — tabel akan dibuat otomatis oleh Prisma migrate di langkah berikutnya

---

## FASE D-2 — Deploy Backend ke Railway

### D-2.1 Buat Project & Service di Railway
- [x] Login ke [Railway Dashboard](https://railway.com/dashboard)
- [x] Klik **New Project** → pilih **Deploy from GitHub repo**
- [x] Hubungkan ke akun GitHub dan pilih repositori proyek
- [x] Setelah project terbuat, klik service yang muncul lalu konfigurasi pengaturan di tab **Settings**:
  - **Service Name**: `sougen-backend` (atau nama sesuai keinginan)
  - **Region**: Pilih region yang sama/dekat dengan Supabase (contoh: `Asia Southeast (Singapore)` jika tersedia, atau `US West` sebagai fallback)
  - **Source → Root Directory**: isi `backend`
  - **Source → Branch**: `main` (atau branch utama)
  - **Build → Build Command**: `npm install && npx prisma generate && npm run build`
  - **Deploy → Start Command**: `npm run start`

> **Catatan Railway:**
> Railway secara otomatis men-detect Node.js dan menjalankan `npm install` saat build. Namun kita tetap perlu memastikan `prisma generate` dijalankan sebelum `tsc` agar Prisma Client ter-generate.

### D-2.2 Konfigurasi Environment Variables di Railway
- [x] Klik service backend → buka tab **Variables**
- [x] Tambahkan variabel berikut satu per satu (klik **New Variable** atau gunakan **Raw Editor** untuk paste sekaligus):

| Variabel | Nilai | Keterangan |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Mengaktifkan cookie secure & sameSite none |
| `PORT` | `4000` | Port server Express (Railway juga menyediakan `PORT` otomatis) |
| `DATABASE_URL` | `postgresql://...@...supabase.co:6543/postgres?pgbouncer=true` | URL pooler dari Supabase (port 6543) |
| `DIRECT_URL` | `postgresql://...@...supabase.co:5432/postgres` | URL direct dari Supabase (port 5432) |
| `SESSION_SECRET` | *(string acak min. 32 karakter)* | Untuk enkripsi session cookie admin |
| `ADMIN_USERNAME` | *(username pilihan Anda)* | Username login admin panel |
| `ADMIN_PASSWORD_HASH` | *(hash bcrypt dari password admin)* | Lihat panduan di bawah |
| `FRONTEND_URL` | `https://sougen-website.vercel.app` | URL frontend di Vercel (diisi/diperbarui setelah frontend di-deploy) |

> **Cara Membuat `SESSION_SECRET`:**
> Jalankan di terminal:
> ```bash
> node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
> ```
> Salin output string panjang tersebut.

> **Cara Membuat `ADMIN_PASSWORD_HASH`:**
> Jalankan di terminal di dalam folder `backend/`:
> ```bash
> node -e "require('bcryptjs').hash('GANTI_PASSWORD_ANDA', 10).then(console.log)"
> ```
> Salin string hash yang dihasilkan (format: `$2a$10$...`).

### D-2.3 Generate Domain Publik di Railway
- [x] Klik service backend → buka tab **Settings** → bagian **Networking**
- [x] Klik **Generate Domain** untuk mendapatkan URL publik (contoh: `sougen-backend-production.up.railway.app`)
- [x] Catat URL ini — akan digunakan sebagai `VITE_API_BASE_URL` di frontend

### D-2.4 Deploy & Verifikasi Backend
- [x] Setelah environment variables diisi, Railway akan otomatis memulai deployment (atau klik **Deploy** secara manual)
- [x] Pantau log build di tab **Deployments** → klik deployment aktif → lihat **Build Logs** — pastikan `npm install`, `prisma generate`, dan `tsc` berjalan tanpa error
- [x] Pantau **Deploy Logs** — pastikan server berhasil start dengan pesan `Server jalan di port ...`
- [x] Akses endpoint health check: buka `https://URL-BACKEND.up.railway.app/api/health` di browser — pastikan respons `{"status":"ok"}`

### D-2.5 Jalankan Migrasi Database
- [x] Buka terminal lokal, pastikan `.env` di folder `backend/` sudah berisi `DATABASE_URL` dan `DIRECT_URL` production dari Supabase
- [x] Jalankan perintah migrasi dari terminal lokal:
  ```bash
  npx prisma migrate deploy
  ```
- [x] Verifikasi output: pastikan semua migrasi berhasil dijalankan tanpa error
- [x] Verifikasi di Supabase: buka **Table Editor** dan pastikan semua tabel sudah terbuat (User, Event, Talent, Community, dll.)

> **Catatan:** Railway juga mendukung menjalankan command langsung via **Railway CLI** jika sudah di-install. Alternatif lain adalah menambahkan migrasi ke Build Command: `npm install && npx prisma generate && npx prisma migrate deploy && npm run build` — namun cara ini akan menjalankan migrasi setiap kali deploy, yang bisa berisiko.

### D-2.6 Jalankan Seed Data Awal
- [x] Masih dari terminal lokal (dengan `.env` production), jalankan seed script:
  ```bash
  npx tsx prisma/seed.ts
  ```
- [x] Verifikasi output: pastikan muncul pesan sukses (`✓ Admin user created`, `✓ FAQ items seeded`, `✓ Dummy event created`, `✓ About content seeded`)
- [x] Verifikasi di Supabase Table Editor: cek tabel `User` sudah memiliki 1 row admin, tabel `FAQItem` sudah memiliki data

> **⚠️ Penting:** Setelah selesai menjalankan migrasi dan seed, **kembalikan** isi `.env` lokal ke connection string development (bukan production) agar tidak secara tidak sengaja mengubah data production saat development.

---

## FASE D-3 — Deploy Frontend ke Vercel

### D-3.1 Buat Project di Vercel
- [x] Login ke [Vercel Dashboard](https://vercel.com/dashboard)
- [x] Klik **Add New → Project**
- [x] Hubungkan ke akun GitHub dan pilih repositori proyek yang sama
- [x] Konfigurasi pengaturan:
  - **Framework Preset**: Vite
  - **Root Directory**: `frontend`
  - **Build Command**: *(biarkan default Vercel atau isi `npm run build`)*
  - **Output Directory**: `dist`
  - **Install Command**: *(biarkan default `npm install`)*

### D-3.2 Konfigurasi Environment Variables di Vercel
- [x] Tambahkan variabel berikut di tab **Environment Variables**:

| Variabel | Nilai | Keterangan |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | `https://sougen-backend-production.up.railway.app` | URL backend Railway (tanpa `/` di akhir) |
| `VITE_FRONTEND_URL` | `https://sougen-website.vercel.app` | URL frontend sendiri (untuk SEO canonical & OG tags) |

> **Penting:** Variabel dengan prefix `VITE_` akan di-*bundle* ke dalam kode frontend saat build. Pastikan nilainya benar **sebelum** melakukan deploy.

### D-3.3 Buat File `vercel.json` untuk SPA Routing
> **Mengapa?** Website ini adalah Single Page Application (SPA). Tanpa konfigurasi rewrite, Vercel akan mengembalikan error 404 ketika user mengakses langsung URL seperti `/event/slug` atau me-*refresh* halaman.

- [x] Buat file `frontend/vercel.json` dengan isi:
  ```json
  {
    "rewrites": [
      { "source": "/(.*)", "destination": "/index.html" }
    ]
  }
  ```
- [x] Commit dan push file ini ke GitHub sebelum deploy

### D-3.4 Deploy & Verifikasi Frontend
- [x] Klik **Deploy** di Vercel
- [x] Pantau log build — pastikan TypeScript compile dan Vite build berjalan tanpa error
- [x] Setelah deploy selesai, catat URL frontend yang diberikan Vercel (contoh: `https://sougen-website.vercel.app`)
- [x] Akses URL frontend di browser — pastikan halaman Home tampil dengan benar
- [x] Tes navigasi ke beberapa halaman: `/event`, `/lineup`, `/gallery`, `/about`, `/contact`
- [x] Tes *deep-link refresh*: buka langsung URL `/faq` di browser baru → pastikan halaman tampil (bukan 404)

---

## FASE D-4 — Sinkronisasi & Koneksi Frontend ↔ Backend

### D-4.1 Update `FRONTEND_URL` di Railway
- [x] Salin URL frontend dari Vercel (contoh: `https://sougen-website.vercel.app`)
- [x] Buka dashboard Railway → klik service backend → tab **Variables**
- [x] Perbarui nilai `FRONTEND_URL` dengan URL Vercel yang benar
- [x] Simpan perubahan — Railway akan otomatis melakukan redeploy

### D-4.2 Verifikasi CORS & Cookie Session
- [x] Buka frontend di browser → Inspect → tab **Network**
- [x] Pastikan request ke `/api/...` menuju URL backend Railway dan mendapat respons `200 OK` (bukan error CORS)
- [x] Buka halaman publik yang memuat data dari API (Home, Event List, FAQ) — pastikan data tampil

### D-4.3 Verifikasi Login Admin
- [x] Buka `/admin/login` di frontend production
- [x] Login menggunakan `ADMIN_USERNAME` dan password asli (sebelum di-hash)
- [x] Pastikan login berhasil dan redirect ke dashboard admin
- [x] Periksa tab **Application → Cookies** di DevTools: pastikan cookie session tersimpan dengan atribut `Secure`, `HttpOnly`, `SameSite=None`
- [x] Tes navigasi admin panel: buka beberapa halaman admin (Event, Talent, FAQ) — pastikan data dimuat

### D-4.4 Verifikasi Upload Gambar
- [x] Dari admin panel, coba upload 1 gambar (contoh: logo komunitas atau foto talent)
- [x] Pastikan gambar tersimpan dan bisa ditampilkan di halaman publik
- [x] Catat: gambar disimpan di disk lokal Railway. Jika menggunakan *free/hobby tier*, gambar akan hilang saat server restart/redeploy

> **⚠️ Catatan Penting tentang Penyimpanan File di Railway:**
> Railway menggunakan *ephemeral filesystem* — file yang ditulis ke disk (termasuk upload gambar) akan hilang setiap kali deployment baru terjadi. Untuk solusi permanen:
> - **Opsi A**: Gunakan [Railway Volume](https://docs.railway.com/reference/volumes) — persistent storage yang bisa di-mount ke path `/app/uploads` (tersedia di plan berbayar)
> - **Opsi B**: Migrasi penyimpanan gambar ke cloud storage (Supabase Storage, Cloudinary, dll.) — ini perlu perubahan kode di `imageProcessor.ts`
> - **Opsi C**: Gunakan VPS (DigitalOcean, IDCloudHost) sebagai hosting backend yang memiliki disk permanen

---

## FASE D-5 — Konfigurasi Post-Deployment

### D-5.1 File `robots.txt`
- [x] Buat file `frontend/public/robots.txt`:
  ```
  User-agent: *
  Allow: /
  Disallow: /admin

  Sitemap: https://URL-BACKEND/sitemap.xml
  ```
- [x] Ganti `URL-BACKEND` dengan URL backend Railway yang sebenarnya
- [x] Commit, push, dan tunggu Vercel auto-redeploy
- [x] Verifikasi: akses `https://URL-FRONTEND/robots.txt` di browser — pastikan konten tampil

### D-5.2 Verifikasi Sitemap
- [x] Akses `https://URL-BACKEND/sitemap.xml` di browser
- [x] Pastikan XML valid dan berisi semua rute publik (Home, About, Contact, FAQ, Event, Gallery, dll.)
- [x] Pastikan URL di dalam sitemap menggunakan domain frontend Vercel (bukan `localhost`)

### D-5.3 Submit ke Google Search Console (Opsional — Setelah Domain Kustom)
- [ ] Daftarkan website di [Google Search Console](https://search.google.com/search-console)
- [ ] Verifikasi kepemilikan domain
- [ ] Submit URL sitemap.xml
- [ ] Request indexing untuk halaman-halaman utama

### D-5.4 Domain Kustom (Opsional)
- [ ] Beli domain profesional (`.com`, `.id`, `.org`) jika diinginkan
- [ ] **Vercel**: Tambahkan custom domain di pengaturan project → ikuti instruksi DNS
- [ ] **Railway**: Tambahkan custom domain di service backend → tab **Settings** → **Networking** → **Custom Domain** → ikuti instruksi DNS (CNAME record)
- [ ] Perbarui Environment Variables:
  - Di Railway: update `FRONTEND_URL` ke domain kustom
  - Di Vercel: update `VITE_FRONTEND_URL` ke domain kustom, dan `VITE_API_BASE_URL` jika backend juga pakai domain kustom
- [ ] Pastikan HTTPS aktif dan berjalan di semua domain kustom (Railway dan Vercel menyediakan SSL otomatis)
- [ ] Update URL di `robots.txt` dan pastikan sitemap mengarah ke domain yang benar

---

## FASE D-6 — Pengujian Production

### D-6.1 Pengujian Fungsional
- [ ] **Halaman Publik**: Buka semua halaman publik satu per satu — pastikan tampil dan data dimuat dari API:
  - [ ] Home (`/`)
  - [ ] Event List (`/event`)
  - [ ] Event Detail (`/event/:slug`)
  - [ ] Line-Up (`/lineup`)
  - [ ] Community (`/community`)
  - [ ] Programs (`/programs`)
  - [ ] Gallery Overview (`/gallery`)
  - [ ] Gallery Detail (`/gallery/:slug`)
  - [ ] FAQ (`/faq`)
  - [ ] Kebijakan / Safety (`/kebijakan`)
  - [ ] Contact (`/contact`)
  - [ ] About Us (`/about`)
  - [ ] 404 Page (akses URL yang tidak ada, contoh: `/halaman-tidak-ada`)
- [ ] **Form Kontak**: Kirim pesan dari form kontak publik → verifikasi pesan masuk di admin panel
- [ ] **Admin CRUD**: Dari admin panel, lakukan minimal 1 operasi Create, Read, Update, Delete pada salah satu modul (contoh: FAQ atau Talent)

### D-6.2 Pengujian Non-Fungsional
- [ ] **Responsivitas**: Tes minimal di 3 ukuran layar — Mobile (375px), Tablet (768px), Desktop (1280px)
- [ ] **SEO**: Periksa `<title>`, `<meta description>`, OG tags di beberapa halaman menggunakan DevTools
- [ ] **Console Errors**: Buka DevTools → Console di setiap halaman publik — pastikan tidak ada error merah yang kritis
- [ ] **Lighthouse Audit**: Jalankan audit Lighthouse di halaman Home — catat skor Performance, Accessibility, Best Practices, SEO
- [ ] **Cross-browser**: Tes di minimal 2 browser berbeda (Chrome + Firefox/Safari/Edge)

### D-6.3 Dokumentasi Hasil
- [ ] Screenshot halaman Home di production sebagai bukti deployment berhasil
- [ ] Screenshot hasil Lighthouse audit
- [ ] Catat URL production final:
  - Frontend: `___________________________`
  - Backend: `___________________________`
  - Sitemap: `___________________________`

