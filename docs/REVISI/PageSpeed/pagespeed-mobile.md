# pagespeed-mobile.md — Daftar Masalah Audit Performa Mobile (PageSpeed Insights)

Dokumen ini merangkum seluruh temuan masalah performa, aksesibilitas, struktur dokumen, best practices, dan agen AI pada tampilan **Mobile** berdasarkan hasil pengujian Google PageSpeed Insights (mencakup bagian **Insight**, **Diagnostics**, **Accessibility / Contrast**, **Navigation / Heading Structure**, **General / Console Diagnostics**, dan **Agent Accessibility**) pada website `https://sougen-event.vercel.app`. Dokumen ini difokuskan secara murni untuk mencatat **daftar permasalahan** yang perlu dioptimasi.

**Status:**

- `[ ]` Belum diselesaikan
- `[/]` Sedang dikerjakan
- `[x]` Selesai

---

## 📊 Data Diagnosa & Riwayat Pengujian (Audit History)

- **Target URL:** `https://sougen-event.vercel.app`
- **Tipe Pengujian:** Mobile (Emulasi Moto G Power, Lighthouse 13.4.1, Slow 4G Throttling)
- **Tautan Laporan Terkini:** [PageSpeed Insights Report (13 Sep 2026)](https://pagespeed.web.dev/analysis/https-sougen-event-vercel-app/s8ku9xxcfb?form_factor=mobile)

### 📈 Tabel Perbandingan Skor Kategori

| Kategori | Baseline Awal | Audit Terkini (Tahap 1) | Target Akhir | Status |
| --- | :---: | :---: | :---: | :---: |
| **Performance** | 78 / 100 | **78** / 100 | **90+** / 100 | 🟡 Perlu Optimasi LCP & FCP |
| **Accessibility** | 93 / 100 | **95** / 100 | **95+** / 100 | 🟢 Sangat Baik (+2) |
| **Best Practices** | 96 / 100 | **100** / 100 | **100** / 100 | 🟢 Sempurna (+4) |
| **SEO** | 100 / 100 | **100** / 100 | **100** / 100 | 🟢 Sempurna |
| **Agentic Browsing** | 2 / 3 | **3 / 3** | **3 / 3** | 🟢 Sempurna (100%) |

### ⏱️ Tabel Perbandingan Metrik Utama (Core Web Vitals)

| Metrik | Baseline Awal | Audit Terkini (Tahap 1) | Ambang Batas Baik (Good) | Keterangan Evaluasi |
| --- | :---: | :---: | :---: | --- |
| 🔴 **First Contentful Paint (FCP)** | 3.2 s | **3.5 s** | ≤ 1.8 s | Terhambat waktu unduh bundle JS di Slow 4G |
| 🔴 **Largest Contentful Paint (LCP)** | 4.1 s | **4.2 s** | ≤ 2.5 s | Tertunda oleh waterfall lazy-chunk & API Railway |
| 🟡 **Speed Index (SI)** | 5.0 s | **3.8 s** | ≤ 3.4 s | 🟢 Membaik drastis (-1.2 s) |
| 🟢 **Total Blocking Time (TBT)** | 40 ms | **0 ms** | ≤ 200 ms | 🟢 Sempurna! Zero main-thread blocking |
| 🟢 **Cumulative Layout Shift (CLS)** | 0 | **0** | ≤ 0.1 | 🟢 Sempurna! Nol pergeseran tata letak |
| 🟢 **Time to First Byte (TTFB)** | 0 ms | **0 ms** | ≤ 800 ms | 🟢 Sempurna! Vercel Edge Server respons instan |

---

## 🔴 1. Kategori: Performa — Gawat (Skor 0–49 / Kritis)

### A. LCP Element Render Delay (Penundaan Render Elemen Utama)

- [x] **Penundaan Render Heading Utama (`<h2>`)**
  - **Metrik Terdampak:** LCP
  - **Deskripsi Masalah:** Elemen teks `<h2>` ("COSPLAY IN SQUARE") mengalami penundaan render sebesar **2.340 ms (2,34 detik)** sebelum berhasil digambar di layar browser. Meskipun TTFB server 0 ms, pemuatan terhambat oleh antrean unduhan font eksternal serta kalkulasi layout JavaScript sebelum browser dapat merender teks.

### B. Network Dependency Tree (Rantai Dependensi Jaringan Kritis)

- [x] **Rantai Unduhan Aset Font Berurutan (Chained Requests)**
  - **Metrik Terdampak:** LCP, FCP
  - **Deskripsi Masalah:** Terdapat rantai unduhan dependensi berurutan dengan latensi kritis kumulatif mencapai **1.758 ms**. Browser harus menunggu file HTML selesai diurai, lalu meminta file CSS Font, kemudian baru mengunduh file fisik `.woff2` secara serial.

### C. Render-Blocking Requests (Sumber Daya Pemblokir Render Awal)

- [x] **Pemblokiran Render Siklus Awal oleh CSS & Font Eksternal**
  - **Metrik Terdampak:** FCP, LCP
  - **Deskripsi Masalah:** File stylesheet bundle `/assets/index-rhl8nN9M.css` (18 KiB) dan CDN Google Fonts (3,7 KiB) memblokir proses parsing dan rendering awal halaman selama **340 ms hingga 1.200 ms**.

### D. Forced Reflow / Layout Thrashing (Perhitungan Ulang Geometri Layout)

- [x] **Sinkronisasi Kalkulasi Layout Berulang pada Thread JavaScript**
  - **Metrik Terdampak:** INP, TBT
  - **Deskripsi Masalah:** Skrip JavaScript mengeksekusi pembacaan/perubahan geometri DOM secara sinkron yang memaksa browser menghitung ulang layout (*forced reflow*) selama total **163 ms**. Kontributor terbesar berasal dari bundle `/assets/dist-Oyix-RzG.js` sebesar **127 ms**.

### E. Reduce Unused JavaScript (Kode JavaScript Tidak Terpakai Saat Initial Load)

- [x] **Muatan Bundle JavaScript Awal Mengandung Kode Non-Kritis**
  - **File Sumber:** `/assets/index-CPcvqAzf.js`
  - **Metrik Terdampak:** LCP, FCP
  - **Deskripsi Masalah:** Dari total 98,3 KiB transfer file JavaScript utama, sebanyak **44,4 KiB (45,2%)** tidak dieksekusi saat pemuatan awal halaman, sehingga memperpanjang waktu download serta beban *parsing* dan *compilation* di browser sebelum halaman dapat berinteraksi.

### F. Reduce Unused CSS (Aturan CSS Tidak Terpakai pada Layar Pertama)

- [x] **Sebagian Besar Aturan Stylesheet Tidak Digunakan pada Above-the-Fold**
  - **File Sumber:** `/assets/index-rhl8nN9M.css`
  - **Metrik Terdampak:** FCP, LCP
  - **Deskripsi Masalah:** Dari total 17,4 KiB transfer CSS, sebesar **14,1 KiB (81,0%)** tidak diterapkan pada elemen layar pertama (*above-the-fold*), namun tetap bersifat memblokir proses render browser (*render-blocking*).

### G. Avoid Long Main-Thread Tasks (Tugas Berat yang Mengunci Thread Utama)

- [x] **Eksekusi Tugas Berat Memblokir Thread Utama (> 50 ms)**
  - **File Sumber:** `/assets/index-CPcvqAzf.js` (3 tugas) dan Browser Internal (2 tugas)
  - **Metrik Terdampak:** TBT, INP
  - **Deskripsi Masalah:** Terdeteksi 5 proses yang mengeksekusi *main thread* melampaui batas aman 50 ms (dua tugas terberat berjalan selama **135 ms** dan **129 ms**), dengan total akumulasi waktu tugas mencapai **469 ms** dan waktu pemblokiran bersih (*blocking time*) sebesar **219 ms**, berpotensi membekukan (*freeze*) respons antarmuka saat pengguna berinteraksi.

---

## 🟡 2. Kategori: Performa — Sedang (Skor 50–89 / Inefisiensi Beban & Potensi Layout Shift)

### H. Image Delivery & Oversized Images (Ukuran dan Resolusi Gambar Berlebih)

- [x] **Resolusi Gambar Logo Terlalu Besar Dibandingkan Ukuran Tampilan**
  - **Metrik Terdampak:** LCP, Bandwidth / Transfer Jaringan
  - **Deskripsi Masalah:** File logo (`main-logo.png` dan `logo-ver2.png`) memiliki resolusi asli 3937×2953 px, namun hanya ditampilkan pada ukuran kontainer 43×32 px di layar mobile. Hal ini menyebabkan pemborosan transfer data sebesar **465 KiB**.
- [x] **Ketiadaan Varian Thumbnail untuk Gambar Dinamis (Talent/Event)**
  - **Metrik Terdampak:** LCP, Bandwidth
  - **Deskripsi Masalah:** Aset gambar talent yang dimuat dari backend Railway dimuat dalam ukuran asli tanpa varian ukuran thumbnail yang optimal untuk layar kecil, menyumbang total pemborosan data gambar hingga **641 KiB**.

### I. Missing Explicit Width & Height on Image Elements (Atribut Dimensi Gambar)

- [x] **Elemen Gambar Logo Navbar Tidak Memiliki Atribut Width dan Height Eksplisit**
  - **Elemen Terdampak:** `<img alt="Sougen Logo" src="/images/main-logo.png">`
  - **Metrik Terdampak:** CLS
  - **Deskripsi Masalah:** Tag gambar logo hanya mengandalkan class CSS (`h-8 lg:h-9 w-auto`) tanpa mendeklarasikan atribut dimensi HTML `width` dan `height`. Hal ini membuat peramban tidak dapat mencadangkan ruang tata letak (*layout placeholder*) sebelum file gambar selesai diunduh, berisiko memicu pergeseran konten visual (*layout shift*).

### J. 3rd Party Overheads & API Fragmentation (Fragmentasi Panggilan Backend)

- [x] **Fragmentasi Panggilan API Saat Inisialisasi Awal Halaman**
  - **Metrik Terdampak:** Latensi Jaringan, FCP
  - **Deskripsi Masalah:** Pada inisialisasi awal halaman dimuat, frontend melakukan **5 panggilan API terpisah** (`settings`, `channels`, `faqs`, `talents`, `events/active`) ke domain backend eksternal (`sougen-event-production.up.railway.app`). Hal ini menimbulkan beban *multiple network roundtrip*, overhead handshake SSL/TLS terpisah, dan negosiasi CORS.

### K. Optimize DOM Size (Ukuran dan Kedalaman Struktur DOM)

- [x] **Kedalaman Nesting dan Jumlah Node DOM Melebihi Batas Panduan**
  - **Metrik Terdampak:** DOM Depth, TBT
  - **Deskripsi Masalah:** Jumlah total node DOM mencapai **874 elemen** (melebihi ambang panduan dasar Lighthouse < 800 node) dengan kedalaman nesting bersarang hingga **19 tingkat**, yang didominasi oleh elemen pembungkus (*wrapper flex*) bertingkat di sekitar ikon SVG Lucide.

---

## 🔴 3. Kategori: Aksesibilitas — Gawat (WCAG 2.1 AA — Contrast Ratio & Readability)

### L. Metadata Label Contrast & Micro Typography (Keterbacaan Label Kecil)

- [x] **Rasio Kontras Rendah pada Label Metadata Berukuran Mikro (8–9 px)**
  - **Elemen / Class Terdampak:** `TANGGAL`, `LOKASI`, `VENUE LOKASI` (`text-[8px]`, `text-[9px]`, `text-gray-400`, `text-rpo-black/40` di atas latar putih / `#FAFAFA`)
  - **Metrik Terdampak:** Accessibility, Readability
  - **Deskripsi Masalah:** Penggunaan ukuran font yang sangat kecil (8–9 px) dipadukan dengan warna abu-abu pudar atau transparan di atas latar belakang putih/abu terang gagal memenuhi ambang batas kontras WCAG 2.1 AA (minimal 4,5:1), menyebabkan teks sulit dibaca terutama di bawah pencahayaan luar ruangan atau layar redup.

### M. Brand Color Contrast on Light Background (Kontras Teks Biru Sougen)

- [x] **Rasio Kontras Rendah pada Teks Berwarna Biru Sougen di Atas Latar Terang**
  - **Elemen / Class Terdampak:** `OFFICIAL EVENT PASS`, `YOU HAVE TO KNOW`, `Lihat Semua FAQ →` (`color: rgb(0, 148, 222)` / `#0094DE`, `text-sougen-blue` di atas latar putih / `#FAFAFA` / transparan)
  - **Metrik Terdampak:** Accessibility (WCAG 2.1 AA)
  - **Deskripsi Masalah:** Warna biru muda `#0094DE` yang diaplikasikan pada teks di atas latar belakang putih/terang hanya memiliki rasio kontras ~**3,2:1**, jauh di bawah standar minimal WCAG sebesar **4,5:1** untuk teks normal.

### N. Interactive Elements & Tab Navigation Contrast (Kontras Tombol dan Tab)

- [x] **Kontras Tidak Memadai pada Tombol Navigasi Tab dan Tombol CTA**
  - **Elemen / Class Terdampak:** `DAY 1`, `DAY 2`, `LIHAT DETAIL EVENT`, `Maps`, `Hubungi Kami` (pada latar `bg-white/50`, `#FAFAFA`)
  - **Metrik Terdampak:** Accessibility, Interactive Usability
  - **Deskripsi Masalah:** Rasio kontras teks pada status tombol aktif maupun non-aktif terhadap warna latar belakangnya tidak memenuhi ambang batas keterbacaan elemen interaktif.

### O. Schedule & Rundown Timestamp Contrast (Kontras Penanda Jam Acara)

- [x] **Rasio Kontras Rendah pada Penanda Waktu Jadwal Rundown**
  - **Elemen / Class Terdampak:** `19:00 - 22:25`, `19:00`, `19:05`, `20:05`, `20:35`, `20:55`, `21:25` (`text-sougen-blue`, `text-[11px]`, `<span>` di dalam kartu `bg-white` / `#FAFAFA`)
  - **Metrik Terdampak:** Accessibility, Content Scannability
  - **Deskripsi Masalah:** Waktu penanda jadwal acara menggunakan teks abu-abu/biru terang dengan ukuran font kecil di dalam kartu putih sehingga menyulitkan pengguna saat membaca jadwal rundown acara.

---

## 🔴 4. Kategori: Struktur Semantik & Navigasi — Gawat (WCAG 2.1 Kriteria 1.3.1 / Heading Hierarchy)

### P. Heading Hierarchy & Sequential Order (Hierarki Tingkat Heading Melompat)

- [x] **Penggunaan Tag Heading `<h4>` yang Melompati Tingkat `<h3>` pada Kartu Talent**
  - **Elemen Terdampak:** `<h4 class="font-poppins text-sm font-bold text-gray-900 leading-tight truncate">Aidoru Tamio</h4>`
  - **Metrik Terdampak:** Accessibility (WCAG 2.1 - 1.3.1), Screen Reader Navigation, Semantic SEO
  - **Deskripsi Masalah:** Tag `<h4>` digunakan langsung pada nama talent tanpa didahului penanda hierarki tingkat `<h3>` di bawah judul seksi talent, menyebabkan susunan daftar isi dokumen (*outline*) menjadi tidak berurutan bagi teknologi asistif (*screen reader*).
- [x] **Penggunaan Tag Heading `<h4>` yang Melompati Tingkat `<h3>` pada Baris Agenda Rundown**
  - **Elemen Terdampak:** `<h4 class="font-poppins font-bold text-rpo-black text-[14px] lg:text-[15px] leading-s…">Opening by MC</h4>`
  - **Metrik Terdampak:** Accessibility (WCAG 2.1 - 1.3.1), Screen Reader Navigation
  - **Deskripsi Masalah:** Tag `<h4>` digunakan pada agenda acara rundown (diduga dipilih hanya demi styling ukuran font) dan melompati struktur tingkat `<h3>` dari pembagian hari/seksi rundown, merusak hierarki logis dokumen.

---

## 🔴 5. Kategori: Best Practices & Console Diagnostics — Gawat (Errors Logged to Console)

### Q. Broken Resource Requests (Eror Jaringan 404 Not Found di Konsol)

- [x] **Permintaan Berulang Gagal Memuat Berkas Gambar Pengaturan (`404 Not Found`)**
  - **Domain / Path Sumber:** `sougen-event-production.up.railway.app` $\rightarrow$ `...settings/settings-178…-753a425f.webp` (2× request)
  - **Metrik Terdampak:** Best Practices Score, Stabilitas Visual (Broken Image), Efisiensi Jaringan
  - **Deskripsi Masalah:** Jendela konsol peramban mencatat galat jaringan aktif akibat komponen frontend mencoba memuat berkas gambar pengaturan (`settings`) yang tautan URL-nya tersimpan di database tetapi berkas fisiknya tidak ditemukan di server backend (akibat penyimpanan ephemeral atau file terhapus). Request yang gagal dipicu sebanyak 2 kali secara simultan dan secara otomatis menggagalkan audit kategori Best Practices pada Lighthouse.

---

## 🔴 6. Kategori: Agent Accessibility & AI Crawlability — Gawat (Format Berkas llms.txt)

### R. Standar Struktur dan Spesifikasi Berkas `llms.txt`

- [x] **Berkas `llms.txt` Gagal Memenuhi Format Standar Markdown & Navigasi Agen AI**
  - **Lokasi Berkas:** `/llms.txt` (`public/llms.txt`)
  - **Metrik Terdampak:** Skor Agentic Browsing (2/3), AI Crawlability, LLM Search/Indexing
  - **Deskripsi Masalah:** Berkas `llms.txt` pada root domain tidak sesuai dengan standar spesifikasi resmi, yaitu:
    1. *Missing H1 Header:* Berkas tidak memiliki heading tingkat satu (`# Judul`) di baris paling atas.
    2. *Missing Links:* Berkas tidak mencantumkan tautan berformat Markdown (`- [Nama Dokumen](https://...)`) yang merujuk ke konten atau halaman penting situs web.
  - Kondisi ini menyebabkan crawler model bahasa (LLM) menandai berkas sebagai tidak valid, sehingga menurunkan skor evaluasi *Agentic Browsing*.

---

## 🚀 7. Rencana Aksi & Roadmap Optimasi Performa (Target Skor 90+)

Bagian ini mendokumentasikan setiap masalah performa yang masih menahan skor LCP dan FCP, akar penyebab teknis, solusi konkret, dan saran perbaikan agar setiap langkah optimasi dapat dipantau (*tracking*) secara transparan hingga mencapai skor **90+**.

### S. Optimasi Arsitektur Bundle JavaScript (Surgical Code Splitting)

- [x] **Akar Masalah:**
  - File bundle `vendor-react-*.js` berukuran sangat besar (**1.057 kB uncompressed / ~296 kB gzip**).
  - Pada [`vite.config.ts`](file:///f:/Collage%20File/UNITAMA/SEMESTER%208/SKRIPSI%20ROMO/Coding/sougen-website/frontend/vite.config.ts), kondisi `id.includes('react')` terlalu agresif dan menelan seluruh pustaka yang mengandung nama 'react' (`@radix-ui/react-*`, `react-icons`, `react-dropzone`, dll.) ke dalam satu file awal.
  - Pada jaringan Slow 4G (~200 KB/s), mengunduh 296 kB membutuhkan waktu ~1,5 detik sebelum browser dapat mulai mem-parse dan mengeksekusi JavaScript.
- [x] **Solusi & Saran Teknis:**
  - Perbaiki filter chunking di `vite.config.ts` agar hanya paket inti yang masuk ke `vendor-react` (`node_modules/react/`, `node_modules/react-dom/`, `react-router-dom`).
  - Pisahkan pustaka UI komponen (`@radix-ui`, `icons`, `lucide-react`) ke dalam chunk `vendor-ui` terpisah yang dapat di-lazy load.
  - **Hasil Implementasi (SELESAI):**
    - `vendor-react` awal: **1.057,68 kB** (gzip: **295,90 kB**) $\rightarrow$ Berhasil turun ke **232,32 kB** (gzip: **74,77 kB**)! **(Pemangkasan sebesar 74,7%)**.
    - Pustaka non-kritis terpisah ke chunk independen: `vendor-editor` (394 kB gzip 124 kB - admin only), `vendor-forms` (105 kB gzip 30 kB), `vendor-gallery` (53 kB gzip 18 kB), dan `vendor-ui` (708 kB gzip 182 kB).
    - Waktu download JavaScript awal pada Slow 4G (200 KB/s) berkurang dari ~1,5 detik menjadi hanya **~0,37 detik** (menghemat ~1,1 detik waktu render awal).
- [x] **File Terdampak:**
  - [`frontend/vite.config.ts`](file:///f:/Collage%20File/UNITAMA/SEMESTER%208/SKRIPSI%20ROMO/Coding/sougen-website/frontend/vite.config.ts)

### T. Eliminasi Waterfall Request Halaman Landing Page (Eager Load Home)

- [ ] **Akar Masalah:**
  - Di [`frontend/src/App.tsx`](file:///f:/Collage%20File/UNITAMA/SEMESTER%208/SKRIPSI%20ROMO/Coding/sougen-website/frontend/src/App.tsx), halaman landing page di-load via `lazy(() => import('./pages/Home'))`.
  - Hal ini memaksa browser mengunduh bundle utama terlebih dahulu, merender `<PageLoader />` kosong, lalu memicu request jaringan kedua (*waterfall*) untuk mengunduh chunk `Home-*.js`.
  - Terjadi latensi beruntun (*round-trip time*) sebesar 300–500 ms di jaringan mobile.
- [ ] **Solusi & Saran Teknis:**
  - Terapkan **Eager Loading** khusus untuk `Home.tsx` (`import Home from './pages/Home'`).
  - Biarkan halaman lain (Admin, Gallery, FAQ, dll.) tetap memakai `lazy()` code splitting.
  - **Hasil:** Kode halaman Home langsung tersedia bersama bundle utama tanpa perlu request jaringan kedua.
- [ ] **File Terdampak:**
  - [`frontend/src/App.tsx`](file:///f:/Collage%20File/UNITAMA/SEMESTER%208/SKRIPSI%20ROMO/Coding/sougen-website/frontend/src/App.tsx)

### U. Mengatasi LCP Render Delay dari Ketergantungan API Dinamis (Client-Side Rendering Gap)

- [ ] **Akar Masalah:**
  - Di [`frontend/src/pages/Home.tsx`](file:///f:/Collage%20File/UNITAMA/SEMESTER%208/SKRIPSI%20ROMO/Coding/sougen-website/frontend/src/pages/Home.tsx), saat status `eventLoading` bernilai `true`, halaman hanya me-render skeleton abu-abu kosong (`<Skeleton className="w-full h-[85vh]..." />`).
  - Elemen LCP utama yaitu judul event `<h2>` ("COSPLAY IN SQUARE") atau poster event baru dirender setelah request API ke backend Railway (`GET /api/events/active`) selesai sepenuhnya.
  - Latensi roundtrip ke backend Railway via Slow 4G memakan waktu 700–1200 ms, menunda LCP hingga detik ke 4.2s.
- [ ] **Solusi & Saran Teknis:**
  - Terapkan **Instant Visual Shell (Optimistic Hero Shell)**: Render struktur HeroSection langsung dengan teks default ("Sougen Creative Management" / fallback shell) daripada skeleton abu-abu kosong saat data sedang dimuat.
  - Manfaatkan *cache-first hydration* (misal: localStorage / TanStack Query `staleTime` & `placeholderData`) sehingga jika pengguna atau crawler membuka halaman, konten teks LCP langsung digambar pada frame pertama (detik ke ~1.8s - 2.2s).
- [ ] **File Terdampak:**
  - [`frontend/src/pages/Home.tsx`](file:///f:/Collage%20File/UNITAMA/SEMESTER%208/SKRIPSI%20ROMO/Coding/sougen-website/frontend/src/pages/Home.tsx)
  - [`frontend/src/hooks/useActiveEvent.ts`](file:///f:/Collage%20File/UNITAMA/SEMESTER%208/SKRIPSI%20ROMO/Coding/sougen-website/frontend/src/hooks/useActiveEvent.ts)

### V. Preload Aset Font Kritis WOFF2 di Dokumen HTML

- [ ] **Akar Masalah:**
  - Berkas font fisik `poppins-latin-900-normal-*.woff2` dan `poppins-latin-700-normal-*.woff2` belum dideklarasikan melalui `<link rel="preload">` di `index.html`.
  - Browser baru meminta file font setelah CSS terurai dan pohon DOM menemukan elemen teks berkebutuhan font tersebut (*Font Discovery Delay*).
- [ ] **Solusi & Saran Teknis:**
  - Tambahkan tag `preload` font dengan atribut `as="font"` dan `crossorigin` pada `index.html` untuk font heading LCP.
  - Terapkan `font-display: swap` konsisten agar teks langsung muncul menggunakan fallback font sistem saat file font sedang dalam antrean unduh.
- [ ] **File Terdampak:**
  - [`frontend/index.html`](file:///f:/Collage%20File/UNITAMA/SEMESTER%208/SKRIPSI%20ROMO/Coding/sougen-website/frontend/index.html)
