# SetupDeviceBaru.md — Checklist Penyesuaian & Pemulihan Akses Proyek (Device Baru)

Dokumen ini merupakan panduan teknis langkah demi langkah untuk mengonfigurasi dan memulihkan proyek Website RPO agar dapat diakses dan dijalankan secara penuh di perangkat baru (setelah dipindahkan melalui arsip ZIP/RAR atau clone).

Urutan eksekusi mengikuti dependensi teknis. Harap selesaikan fase secara berurutan.

**Status:**

- `[ ]` Belum dimulai
- `[/]` Sedang dikerjakan
- `[x]` Selesai

---

## FASE 1 — Penyiapan Environment Sistem & Node.js Runtime (Wajib)

Masalah utama kegagalan *run* disebabkan oleh Node.js v18.10.0 yang tidak mendukung fitur modern (`styleText` pada bundler frontend dan ESM loader baru pada backend `tsx`).

### 1.1 Upgrade Node.js ke Versi LTS

- [x] Unduh installer **Node.js LTS terbaru (v20.x atau v22.x)** dari [https://nodejs.org/](https://nodejs.org/)
- [x] Jalankan installer dan ikuti petunjuk hingga selesai
- [x] Buka terminal PowerShell / Command Prompt baru untuk memuat `PATH` terbaru
- [ ] Verifikasi versi Node.js dan NPM:

  ```powershell
  node -v
  # Target: >= v20.12.0 atau v22.x
  
  npm -v
  # Target: >= v10.x
  ```

---

## FASE 2 — Pembersihan Dependencies Corrupt (Akibat Ekstraksi RAR)

Folder `node_modules` yang dibawa dari perangkat lama mengandung *native binary* OS lama dan *symlink* yang rusak saat diekstrak di Windows.

### 2.1 Pembersihan Backend

- [x] Buka direktori `backend/`:

  ```powershell
  cd "f:\Collage File\UNITAMA\SEMESTER 8\SKRIPSI ROMO\Coding\sougen-website\backend"
  ```

- [x] Hapus folder `node_modules`:

  ```powershell
  Remove-Item -Recurse -Force node_modules
  ```

- [x] (Opsional) Hapus folder build lama jika ada:

  ```powershell
  if (Test-Path "dist") { Remove-Item -Recurse -Force dist }
  ```

### 2.2 Pembersihan Frontend

- [x] Buka direktori `frontend/`:

  ```powershell
  cd "f:\Collage File\UNITAMA\SEMESTER 8\SKRIPSI ROMO\Coding\sougen-website\frontend"
  ```

- [x] Hapus folder `node_modules`:

  ```powershell
  Remove-Item -Recurse -Force node_modules
  ```

- [x] (Opsional) Hapus folder build lama jika ada:

  ```powershell
  if (Test-Path "dist") { Remove-Item -Recurse -Force dist }
  ```

---

## FASE 3 — Instalasi & Konfigurasi Backend (Node.js / Express / Prisma)

### 3.1 Instalasi Fresh Dependencies Backend

- [x] Buka terminal di folder `backend/`:

  ```powershell
  cd "f:\Collage File\UNITAMA\SEMESTER 8\SKRIPSI ROMO\Coding\sougen-website\backend"
  ```

- [x] Jalankan instalasi dependensi:

  ```powershell
  npm install
  ```

### 3.2 Regenerasi Prisma Client Lokal

- [x] Generate ulang Prisma Client dan Engine biner untuk arsitektur mesin lokal:

  ```powershell
  npx prisma generate
  ```

- [x] Pastikan folder `backend/src/generated/prisma` terbuat dan terisi dengan benar.

### 3.3 Verifikasi Konfigurasi Lingkungan Backend (`.env`)

- [x] Periksa isi file `backend/.env`:

  ```env
  DATABASE_URL="postgresql://postgres.slpjolibobjbpfupobuy:sougen-website@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"
  DIRECT_URL="postgresql://postgres.slpjolibobjbpfupobuy:sougen-website@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
  SESSION_SECRET=5b5a86cdccbab8e9f16c6243511ac8296f5e86b66e2a273784fb5d71b4d2b8d4
  ADMIN_USERNAME=admin
  ADMIN_PASSWORD_HASH=$2b$10$zgsjbYmpci.WlW/JPc0/6eLGCtbQD57AdB1mT1Il9PSJiRxzsW4fC
  FRONTEND_URL=http://localhost:5173
  PORT=4000
  ```

- [x] Uji koneksi database ke Supabase:

  ```powershell
  node -e "const { Pool } = require('pg'); const pool = new Pool({ connectionString: process.env.DATABASE_URL || 'postgresql://postgres.slpjolibobjbpfupobuy:sougen-website@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres' }); pool.query('SELECT 1').then(() => console.log('Database Connected Successfully!')).catch(err => console.error(err)).finally(() => pool.end());"
  ```

### 3.4 Verifikasi Direktori Media / Uploads

- [ ] Pastikan struktur folder `backend/uploads` tersedia untuk penyimpanan gambar:
  - `backend/uploads/about`
  - `backend/uploads/communities`
  - `backend/uploads/events`
  - `backend/uploads/programs`
  - `backend/uploads/settings`
  - `backend/uploads/talents`
  - `backend/uploads/team`

---

## FASE 4 — Instalasi & Konfigurasi Frontend (React / Vite / TypeScript)

### 4.1 Instalasi Fresh Dependencies Frontend

- [x] Buka terminal di folder `frontend/`:

  ```powershell
  cd "f:\Collage File\UNITAMA\SEMESTER 8\SKRIPSI ROMO\Coding\sougen-website\frontend"
  ```

- [x] Jalankan instalasi dependensi:

  ```powershell
  npm install
  ```

### 4.2 Verifikasi Konfigurasi Lingkungan Frontend (`.env`)

- [x] Periksa isi file `frontend/.env`:

  ```env
  VITE_API_BASE_URL=http://localhost:4000
  ```

### 4.3 Uji Kompilasi TypeScript & Build Frontend

- [x] Jalankan uji build:

  ```powershell
  npm run build
  ```

  *(Memastikan tidak ada error tipe data atau sintaks sebelum server dijalankan)*

---

## FASE 5 — Menjalankan Proyek & Verifikasi Akses Penuh

Proyek ini membutuhkan 2 terminal terpisah karena frontend dan backend berjalan independen.

### 5.1 Menjalankan Server Backend (Terminal 1)

- [x] Buka Terminal 1 dan jalankan:

  ```powershell
  cd "f:\Collage File\UNITAMA\SEMESTER 8\SKRIPSI ROMO\Coding\sougen-website\backend"
  npm run dev
  ```

- [x] Verifikasi output konsol:
  `Server jalan di port 4000`
- [x] Buka browser dan buka `http://localhost:4000/api/health`
  - [x] Hasil respons JSON: `{"status":"ok"}`

### 5.2 Menjalankan Server Frontend (Terminal 2)

- [x] Buka Terminal 2 dan jalankan:

  ```powershell
  cd "f:\Collage File\UNITAMA\SEMESTER 8\SKRIPSI ROMO\Coding\sougen-website\frontend"
  npm run dev
  ```

- [x] Verifikasi output konsol:
  `Local: http://localhost:5173/`

### 5.3 Verifikasi Akses & Fungsi Aplikasi di Browser

- [x] **Halaman Utama (Publik):** Buka `http://localhost:5173`
  - [x] Navbar, Hero Banner, dan Event Aktif tampil tanpa error
- [x] **Halaman Detail & Galeri:**
  - [x] Buka halaman `/event`, `/lineup`, `/community`, `/programs`, `/gallery`
  - [x] Pastikan data dari Supabase PostgreSQL ter-fetch dengan baik melalui API backend
- [x] **Akses Panel Admin & Login:**
  - [x] Buka `http://localhost:5173/admin/login`
  - [x] Masukkan kredensial login default (`admin`)
  - [x] Pastikan sesi tersimpan (Session cookie) dan diarahkan ke Dashboard Admin `/admin`
  - [x] Uji fitur CRUD di salah satu modul admin (misal Event / FAQ / Program)

---

## Ringkasan Catatan Penting untuk Migrasi Device Berikutnya

1. **Jangan Menyertakan `node_modules`:** Saat mengompresi proyek ke file `.zip` / `.rar`, selalu abaikan folder `node_modules` dan `dist` untuk menghemat ukuran file dan mencegah kerusakan binary berekstensi native OS.
2. **Gunakan Versi Node.js LTS Konsisten:** Selalu gunakan Node.js LTS versi 20.x atau 22.x di seluruh mesin pengembangan.
3. **Selalu Jalankan `npx prisma generate`:** Dijalankan setiap kali selesai melakukan `npm install` atau perubahan skema database di device baru.
