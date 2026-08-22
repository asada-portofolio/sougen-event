# Deployment.md — Checklist Persiapan & Eksekusi Deployment Website Sougen

Dokumen ini adalah panduan persiapan dan eksekusi deployment yang mendetail. Setiap item adalah satu unit pekerjaan yang spesifik dan dapat diverifikasi. Urutan pengerjaan mengikuti dependensi teknis — jangan lewati fase sebelum fase di atasnya selesai.

**Platform yang digunakan:**
- **Git Repository**: GitHub
- **Database Cloud**: Supabase (PostgreSQL)
- **Backend Hosting**: Render (Web Service)
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
- [ ] Verifikasi file `.gitignore` di root sudah mencakup: `node_modules/`, `.env`, `.env.local`, `dist/`, `build/`, `*.log`
- [ ] Verifikasi file `.gitignore` di `backend/` sudah mencakup: `node_modules`, `.env`, `/src/generated/prisma`
- [ ] Verifikasi folder `uploads/` **tidak** masuk ke Git (tambahkan `uploads/` ke `.gitignore` backend jika belum ada)
- [ ] Tambahkan remote GitHub: `git remote add origin https://github.com/USERNAME/NAMA-REPO.git`
- [ ] Commit semua perubahan terbaru: `git add .` → `git commit -m "Persiapan deployment"`
- [ ] Push ke GitHub: `git push -u origin main` (atau `master`, sesuai branch utama)
- [ ] Verifikasi di GitHub: pastikan semua file dan folder sudah muncul di repositori, dan **tidak ada** file `.env` atau `node_modules/` yang ikut ter-push

### D-0.3 Verifikasi Build Lokal
- [ ] Jalankan `npm run build` di `backend/` — pastikan sukses tanpa error (TypeScript compile)
- [ ] Jalankan `npm run build` di `frontend/` — pastikan sukses tanpa error (TypeScript + Vite build)
- [ ] Catat ukuran output `frontend/dist/assets/` sebagai baseline performa

---

## FASE D-1 — Setup Database Cloud (Supabase)

### D-1.1 Buat Project Database di Supabase
- [ ] Login ke [Supabase Dashboard](https://supabase.com/dashboard)
- [ ] Buat project baru (atau gunakan project yang sudah ada). Catat **Region** yang dipilih — idealnya pilih region terdekat dengan target pengguna (contoh: `Southeast Asia (Singapore)`)
- [ ] Set database password yang kuat dan **simpan password ini dengan aman** — tidak bisa dilihat lagi setelah project dibuat

### D-1.2 Ambil Connection Strings
- [ ] Buka menu **Settings → Database** di dashboard Supabase
- [ ] Salin **Connection String (URI)** mode **Transaction** (port `6543`, via Supavisor pooler) → ini akan menjadi nilai `DATABASE_URL`
- [ ] Salin **Connection String (URI)** mode **Session** atau **Direct** (port `5432`, koneksi langsung) → ini akan menjadi nilai `DIRECT_URL`
- [ ] Pastikan kedua string sudah berisi password database yang benar (ganti placeholder `[YOUR-PASSWORD]` dengan password asli)

> **Catatan Penting:**
> - `DATABASE_URL` (pooler, port 6543) digunakan oleh Prisma Client saat runtime aplikasi berjalan.
> - `DIRECT_URL` (direct, port 5432) digunakan oleh Prisma CLI (`migrate deploy`), `connect-pg-simple` (session store), dan `seed.ts`.
> - Kedua URL **wajib ada** agar backend berfungsi dengan benar.

### D-1.3 Verifikasi Koneksi Database
- [ ] Tes koneksi menggunakan tool database client (pgAdmin, DBeaver, atau Supabase SQL Editor) untuk memastikan credential valid
- [ ] Pastikan database kosong (belum ada tabel) — tabel akan dibuat otomatis oleh Prisma migrate di langkah berikutnya

---

## FASE D-2 — Deploy Backend ke Render

### D-2.1 Buat Web Service di Render
- [ ] Login ke [Render Dashboard](https://dashboard.render.com)
- [ ] Klik **New → Web Service**
- [ ] Hubungkan ke akun GitHub dan pilih repositori proyek
- [ ] Konfigurasi pengaturan utama:
  - **Name**: `sougen-backend` (atau nama sesuai keinginan)
  - **Region**: Pilih region yang sama/dekat dengan Supabase (contoh: `Singapore`)
  - **Branch**: `main` (atau branch utama)
  - **Root Directory**: `backend`
  - **Runtime**: `Node`
  - **Build Command**: `npm install && npx prisma generate && npm run build`
  - **Start Command**: `npm run start`
  - **Instance Type**: Free (atau sesuai kebutuhan)

### D-2.2 Konfigurasi Environment Variables di Render
- [ ] Buka tab **Environment** di Web Service yang baru dibuat
- [ ] Tambahkan variabel berikut satu per satu:

| Variabel | Nilai | Keterangan |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Mengaktifkan cookie secure & sameSite none |
| `PORT` | `4000` | Port server Express (Render juga men-set via `PORT` otomatis) |
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

### D-2.3 Deploy & Verifikasi Backend
- [ ] Klik **Create Web Service** atau **Manual Deploy** untuk memulai proses build
- [ ] Pantau log build di Render — pastikan `npm install`, `prisma generate`, dan `tsc` berjalan tanpa error
- [ ] Setelah deploy selesai, catat URL backend yang diberikan Render (contoh: `https://sougen-backend.onrender.com`)
- [ ] Akses endpoint health check: buka `https://URL-BACKEND.onrender.com/api/health` di browser — pastikan respons `{"status":"ok"}`

### D-2.4 Jalankan Migrasi Database
- [ ] Buka tab **Shell** di Web Service Render (atau gunakan fitur **Run Console**)
- [ ] Jalankan perintah migrasi:
  ```bash
  npx prisma migrate deploy
  ```
- [ ] Verifikasi output: pastikan semua migrasi berhasil dijalankan tanpa error
- [ ] Verifikasi di Supabase: buka **Table Editor** dan pastikan semua tabel sudah terbuat (User, Event, Talent, Community, dll.)

### D-2.5 Jalankan Seed Data Awal
- [ ] Masih di Shell Render, jalankan seed script:
  ```bash
  npx tsx prisma/seed.ts
  ```
- [ ] Verifikasi output: pastikan muncul pesan sukses (`✓ Admin user created`, `✓ FAQ items seeded`, `✓ Dummy event created`, `✓ About content seeded`)
- [ ] Verifikasi di Supabase Table Editor: cek tabel `User` sudah memiliki 1 row admin, tabel `FAQItem` sudah memiliki data

---

## FASE D-3 — Deploy Frontend ke Vercel

### D-3.1 Buat Project di Vercel
- [ ] Login ke [Vercel Dashboard](https://vercel.com/dashboard)
- [ ] Klik **Add New → Project**
- [ ] Hubungkan ke akun GitHub dan pilih repositori proyek yang sama
- [ ] Konfigurasi pengaturan:
  - **Framework Preset**: Vite
  - **Root Directory**: `frontend`
  - **Build Command**: *(biarkan default Vercel atau isi `npm run build`)*
  - **Output Directory**: `dist`
  - **Install Command**: *(biarkan default `npm install`)*

### D-3.2 Konfigurasi Environment Variables di Vercel
- [ ] Tambahkan variabel berikut di tab **Environment Variables**:

| Variabel | Nilai | Keterangan |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | `https://sougen-backend.onrender.com` | URL backend Render (tanpa `/` di akhir) |
| `VITE_FRONTEND_URL` | `https://sougen-website.vercel.app` | URL frontend sendiri (untuk SEO canonical & OG tags) |

> **Penting:** Variabel dengan prefix `VITE_` akan di-*bundle* ke dalam kode frontend saat build. Pastikan nilainya benar **sebelum** melakukan deploy.

### D-3.3 Buat File `vercel.json` untuk SPA Routing
> **Mengapa?** Website ini adalah Single Page Application (SPA). Tanpa konfigurasi rewrite, Vercel akan mengembalikan error 404 ketika user mengakses langsung URL seperti `/event/slug` atau me-*refresh* halaman.

- [ ] Buat file `frontend/vercel.json` dengan isi:
  ```json
  {
    "rewrites": [
      { "source": "/(.*)", "destination": "/index.html" }
    ]
  }
  ```
- [ ] Commit dan push file ini ke GitHub sebelum deploy

### D-3.4 Deploy & Verifikasi Frontend
- [ ] Klik **Deploy** di Vercel
- [ ] Pantau log build — pastikan TypeScript compile dan Vite build berjalan tanpa error
- [ ] Setelah deploy selesai, catat URL frontend yang diberikan Vercel (contoh: `https://sougen-website.vercel.app`)
- [ ] Akses URL frontend di browser — pastikan halaman Home tampil dengan benar
- [ ] Tes navigasi ke beberapa halaman: `/event`, `/lineup`, `/gallery`, `/about`, `/contact`
- [ ] Tes *deep-link refresh*: buka langsung URL `/faq` di browser baru → pastikan halaman tampil (bukan 404)

---

## FASE D-4 — Sinkronisasi & Koneksi Frontend ↔ Backend

### D-4.1 Update `FRONTEND_URL` di Render
- [ ] Salin URL frontend dari Vercel (contoh: `https://sougen-website.vercel.app`)
- [ ] Buka dashboard Render → Web Service → tab **Environment**
- [ ] Perbarui nilai `FRONTEND_URL` dengan URL Vercel yang benar
- [ ] Simpan perubahan — Render akan otomatis melakukan redeploy

### D-4.2 Verifikasi CORS & Cookie Session
- [ ] Buka frontend di browser → Inspect → tab **Network**
- [ ] Pastikan request ke `/api/...` menuju URL backend Render dan mendapat respons `200 OK` (bukan error CORS)
- [ ] Buka halaman publik yang memuat data dari API (Home, Event List, FAQ) — pastikan data tampil

### D-4.3 Verifikasi Login Admin
- [ ] Buka `/admin/login` di frontend production
- [ ] Login menggunakan `ADMIN_USERNAME` dan password asli (sebelum di-hash)
- [ ] Pastikan login berhasil dan redirect ke dashboard admin
- [ ] Periksa tab **Application → Cookies** di DevTools: pastikan cookie session tersimpan dengan atribut `Secure`, `HttpOnly`, `SameSite=None`
- [ ] Tes navigasi admin panel: buka beberapa halaman admin (Event, Talent, FAQ) — pastikan data dimuat

### D-4.4 Verifikasi Upload Gambar
- [ ] Dari admin panel, coba upload 1 gambar (contoh: logo komunitas atau foto talent)
- [ ] Pastikan gambar tersimpan dan bisa ditampilkan di halaman publik
- [ ] Catat: gambar disimpan di disk lokal Render. Jika menggunakan *free tier* tanpa Persistent Disk, gambar akan hilang saat server restart/redeploy

> **⚠️ Catatan Penting tentang Persistent Disk:**
> Render *free tier* menggunakan *ephemeral disk* — file upload akan hilang setiap kali server restart. Untuk solusi permanen:
> - **Opsi A**: Upgrade ke Render plan berbayar dan aktifkan [Persistent Disk](https://docs.render.com/disks) yang di-mount ke path `/opt/render/project/src/uploads`
> - **Opsi B**: Migrasi penyimpanan gambar ke cloud storage (Supabase Storage, Cloudinary, dll.) — ini perlu perubahan kode di `imageProcessor.ts`
> - **Opsi C**: Gunakan VPS (DigitalOcean, IDCloudHost) sebagai hosting backend yang memiliki disk permanen

---

## FASE D-5 — Konfigurasi Post-Deployment

### D-5.1 File `robots.txt`
- [ ] Buat file `frontend/public/robots.txt`:
  ```
  User-agent: *
  Allow: /
  Disallow: /admin

  Sitemap: https://URL-BACKEND/sitemap.xml
  ```
- [ ] Ganti `URL-BACKEND` dengan URL backend Render yang sebenarnya
- [ ] Commit, push, dan tunggu Vercel auto-redeploy
- [ ] Verifikasi: akses `https://URL-FRONTEND/robots.txt` di browser — pastikan konten tampil

### D-5.2 Verifikasi Sitemap
- [ ] Akses `https://URL-BACKEND/sitemap.xml` di browser
- [ ] Pastikan XML valid dan berisi semua rute publik (Home, About, Contact, FAQ, Event, Gallery, dll.)
- [ ] Pastikan URL di dalam sitemap menggunakan domain frontend Vercel (bukan `localhost`)

### D-5.3 Submit ke Google Search Console (Opsional — Setelah Domain Kustom)
- [ ] Daftarkan website di [Google Search Console](https://search.google.com/search-console)
- [ ] Verifikasi kepemilikan domain
- [ ] Submit URL sitemap.xml
- [ ] Request indexing untuk halaman-halaman utama

### D-5.4 Domain Kustom (Opsional)
- [ ] Beli domain profesional (`.com`, `.id`, `.org`) jika diinginkan
- [ ] **Vercel**: Tambahkan custom domain di pengaturan project → ikuti instruksi DNS
- [ ] **Render**: Tambahkan custom domain di pengaturan Web Service → ikuti instruksi DNS
- [ ] Perbarui Environment Variables:
  - Di Render: update `FRONTEND_URL` ke domain kustom
  - Di Vercel: update `VITE_FRONTEND_URL` ke domain kustom, dan `VITE_API_BASE_URL` jika backend juga pakai domain kustom
- [ ] Pastikan HTTPS aktif dan berjalan di semua domain kustom
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
