# Production Readiness â€” Checklist Kualitas & Kesiapan Rilis Website RPO

Dokumen ini adalah panduan pengecekan kualitas non-fungsional (SEO, aksesibilitas, performa, keamanan, konfigurasi bot) sebelum website di-deploy ke production. Setiap item adalah satu unit pekerjaan yang spesifik dan dapat diverifikasi.

**Status:**
- `[ ]` Belum dimulai
- `[/]` Sedang dikerjakan (bisa di lewati dulu)
- `[x]` Selesai

---

## FASE PR-1 â€” SEO & Metadata

### PR-1.1 Tag `<title>` Unik Per Halaman
- [x] Ganti `<title>frontend</title>` di `index.html` menjadi judul default yang representatif (contoh: `Sougen Creative Management â€” Event Organizer Komunitas Kreatif`)
- [x] Verifikasi bahwa komponen `SEO.tsx` sudah digunakan di **semua** halaman publik dan menghasilkan `<title>` unik per rute
- [x] Pastikan tidak ada 2 halaman publik yang memiliki `<title>` identik

### PR-1.2 Meta Description Unik Per Halaman
- [x] Verifikasi bahwa setiap pemanggilan komponen `SEO.tsx` menyertakan prop `description` yang relevan dan spesifik per halaman â€” bukan teks generik yang sama
- [x] Periksa panjang deskripsi: idealnya 120â€“160 karakter per halaman

### PR-1.3 Open Graph (OG) Tags
- [x] Verifikasi bahwa prop `ogImage` pada komponen `SEO.tsx` sudah mengarah ke gambar yang valid (bukan placeholder) untuk setiap halaman
- [x] Siapkan gambar OG default berukuran 1200Ã—630px di `public/` sebagai fallback global (contoh: `og-default.jpg`)
- [x] Tes preview link dengan membagikan URL halaman ke WhatsApp / Twitter / Facebook â€” pastikan gambar dan teks muncul rapi

### PR-1.4 Canonical Tag
- [x] Komponen `SEO.tsx` sudah merender `<link rel="canonical">` secara otomatis berdasarkan URL aktif

### PR-1.5 Structured Data (JSON-LD)
- [x] Tambahkan Structured Data `Organization` di halaman Home atau About (`@type: Organization`, `name`, `url`, `logo`, `sameAs`)
- [x] Verifikasi bahwa halaman Contact sudah memiliki Structured Data `ContactPage` (sudah ada, perlu validasi isi)
- [x] Pertimbangkan menambahkan Structured Data `Event` di halaman Event Detail (`@type: Event`, `name`, `startDate`, `location`)
- [x] Validasi semua JSON-LD menggunakan [Google Rich Results Test](https://search.google.com/test/rich-results)

### PR-1.6 Sitemap
- [x] Endpoint `GET /sitemap.xml` sudah diimplementasikan di backend (`sitemapController.ts`)
- [x] Verifikasi bahwa sitemap menghasilkan XML valid dan mencakup semua rute publik (Home, Event, Gallery, FAQ, dll.)
- [ ] Submit sitemap ke Google Search Console setelah deploy ke production

---

## FASE PR-2 â€” Aksesibilitas & Tampilan Dasar

### PR-2.1 Verifikasi Tag `<h1>` Per Halaman
- [x] Audit semua halaman publik: pastikan setiap halaman memiliki tepat **satu** tag `<h1>` yang mendeskripsikan topik utama halaman
- [x] Pastikan tidak ada halaman yang memiliki 0 atau lebih dari 1 `<h1>`

### PR-2.2 Alt Text Gambar
- [x] Audit semua komponen yang merender `<img>`: pastikan tidak ada `alt=""` (string kosong) pada gambar yang bermakna konten
- [x] Khusus gambar dekoratif yang murni estetis, boleh menggunakan `alt=""` â€” tetapi gambar dengan informasi (logo, poster, foto profil) wajib memiliki deskripsi yang relevan
- [x] Periksa komponen `ImageWithSkeleton.tsx` â€” pastikan fallback `alt` bukan string kosong jika tidak ada prop `alt` yang dikirim

### PR-2.3 Atribut Bahasa HTML
- [x] Ubah `<html lang="en">` di `index.html` menjadi `<html lang="id">` karena konten website menggunakan Bahasa Indonesia

### PR-2.4 Favicon Kustom
- [x] Favicon kustom sudah terpasang (`favicon.svg` di `public/`)

### PR-2.5 Halaman 404 Kustom
- [x] Buat komponen `NotFoundPage.tsx` yang informatif dan ramah pengguna
- [x] Tampilkan pesan jelas bahwa halaman tidak ditemukan, dengan tombol "Kembali ke Beranda"
- [x] Daftarkan sebagai *catch-all route* (`path="*"`) di `App.tsx`

---

## FASE PR-3 â€” Kualitas Kode & Performa

### PR-3.1 Domain Kustom
- [ ] Beli dan hubungkan domain profesional (`.com`, `.id`, `.org`) setelah deployment
- [ ] Konfigurasi DNS di registrar domain dan platform hosting (Vercel/Render)
- [ ] Pastikan HTTPS aktif dan berjalan di domain kustom

### PR-3.2 Console Error Bersih
- [ ] Buka semua halaman publik satu per satu di browser â†’ Inspect â†’ Console
- [ ] Perbaiki semua pesan error (merah) yang muncul
- [ ] Evaluasi dan perbaiki peringatan (kuning) yang signifikan
- [ ] Pertimbangkan mengganti `console.error()` di kode produksi dengan error reporting yang lebih proper (atau hapus jika tidak perlu)

### PR-3.3 Code Splitting & Lazy Loading
- [ ] Implementasi `React.lazy()` + `Suspense` untuk semua halaman di `App.tsx` â€” saat ini semua halaman di-import secara eager (langsung)
- [ ] Prioritaskan lazy loading untuk halaman Admin (jarang diakses pengunjung publik)
- [ ] Verifikasi bahwa bundle JS terpecah menjadi beberapa chunk setelah build (`npm run build` â†’ periksa output `dist/assets/`)

### PR-3.4 Source Maps di Production
- [ ] Tambahkan konfigurasi `build: { sourcemap: false }` di `vite.config.ts` untuk menonaktifkan source maps pada build production
- [ ] Verifikasi setelah build: pastikan tidak ada file `.map` di folder `dist/assets/`

### PR-3.5 Evaluasi Strategi Rendering (CSR vs SSR/SSG)
> **Catatan**: Saat ini website menggunakan React murni (CSR). Jika *View Page Source* di browser hanya menampilkan `<div id="root"></div>` kosong, maka konten tidak terbaca oleh crawler mesin pencari secara optimal. Migrasi ke SSR/SSG (misalnya Next.js) adalah perubahan besar dan bersifat **opsional / pertimbangan jangka panjang**.
- [ ] Evaluasi apakah perlu migrasi ke Next.js untuk SEO yang lebih optimal â€” dokumentasikan keputusan dan alasannya
- [ ] Jika keputusan tetap CSR: pastikan prerendering minimal tersedia melalui plugin seperti `vite-plugin-prerender` untuk halaman-halaman kritis (Home, About, Contact)

---

## FASE PR-4 â€” Konfigurasi Bot & AI

### PR-4.1 File `robots.txt`
- [x] Buat file `robots.txt` di `frontend/public/` dengan konfigurasi yang tepat
- [x] Izinkan crawler mesin pencari mengakses seluruh halaman publik (`Allow: /`)
- [x] Blokir akses ke rute admin (`Disallow: /admin`)
- [x] Tambahkan referensi ke sitemap: `Sitemap: https://domain-anda.com/sitemap.xml`
- [x] Tentukan kebijakan untuk bot AI (ChatGPT, Claude, dll.) â€” izinkan atau blokir sesuai kebutuhan

### PR-4.2 File `llms.txt` (Opsional)
> **Catatan**: Ini adalah standar baru yang sedang berkembang. Bersifat opsional tetapi bisa memberikan keuntungan jika website ingin mudah dipahami oleh AI.
- [ ] Evaluasi apakah website RPO membutuhkan `llms.txt` â€” jika kontennya bersifat informatif publik, bisa bermanfaat
- [ ] Jika ya: buat `llms.txt` di `frontend/public/` berisi ringkasan struktur website (daftar halaman, deskripsi konten tiap halaman)

---

## Verifikasi Akhir

- [ ] Jalankan `npm run build` di frontend â€” pastikan build berhasil tanpa error
- [ ] Periksa ukuran output bundle â€” catat total ukuran `dist/assets/` sebagai baseline
- [ ] Tes semua halaman publik di 3 breakpoint: Mobile (375px), Tablet (768px), Desktop (1280px)
- [ ] Lakukan audit Lighthouse (Chrome DevTools â†’ Lighthouse) untuk halaman Home â€” targetkan skor hijau (â‰¥90) pada semua kategori: Performance, Accessibility, Best Practices, SEO
- [ ] Screenshot/catat hasil audit sebagai bukti kesiapan rilis

