1. SEO & Metadata (Agar Web Mudah Ditemukan)
 * [ ] Verifikasi Tag H1: Pastikan setiap halaman memiliki tepat satu tag <h1> yang mendeskripsikan judul atau topik utama halaman tersebut (tidak boleh 0, tidak boleh lebih dari 1).
 * [ ] Buat Judul Unik: Cek tag <title> di setiap halaman. Pastikan tidak ada halaman yang memiliki judul yang sama persis.
 * [ ] Tambahkan Meta Description: Tulis deskripsi singkat (<meta name="description">) yang relevan dan unik untuk setiap halaman.
 * [ ] Pasang Open Graph (OG) Tags: Tambahkan meta tag og:image, og:title, dan og:description agar ketika link website dibagikan di WhatsApp, Twitter, atau Facebook, muncul preview gambar dan teks yang rapi.
 * [ ] Gunakan Canonical Tag: Tambahkan <link rel="canonical" href="..."> untuk memberi tahu Google mana versi URL utama dari sebuah halaman (mencegah isu duplikat konten).
 * [ ] Terapkan Structured Data: Tambahkan schema markup (JSON-LD) seperti "Article", "Product", atau "Organization" agar hasil pencarian di Google lebih kaya (misalnya memunculkan rating atau harga).
 * [ ] Sediakan Sitemap: Generate file sitemap.xml dan submit ke Google Search Console.
2. Aksesibilitas & Tampilan Dasar (Untuk Pengguna)
 * [ ] Lengkapi Alt Text Gambar: Periksa semua tag <img> dan pastikan memiliki atribut alt="deskripsi gambar" untuk membantu pengguna tunanetra dan pencarian gambar Google.
 * [ ] Atur Atribut Bahasa: Tambahkan deklarasi bahasa pada tag pembuka HTML, misalnya <html lang="id"> untuk bahasa Indonesia atau "en" untuk Inggris.
 * [ ] Pasang Favicon: Jangan gunakan ikon bawaan framework. Buat dan pasang logo web Anda sendiri sebagai favicon.
 * [ ] Buat Halaman 404 Kustom: Buat halaman khusus yang informatif dan ramah pengguna ketika pengunjung salah memasukkan URL, lengkap dengan tombol untuk kembali ke "Beranda".
3. Kualitas Kode & Performa (Optimalisasi Teknis)
 * [ ] Gunakan Domain Kustom: Beli dan hubungkan domain profesional (seperti .com, .id), jangan biarkan website live menggunakan domain default bawaan hosting seperti .vercel.app atau .netlify.app.
 * [ ] Cek Console Error: Buka browser, klik kanan -> Inspect -> tab Console. Pastikan bersih! Perbaiki semua pesan error (merah) atau warning (kuning) yang muncul.
 * [ ] Kecilkan Ukuran JS Bundle: Lakukan code splitting dan lazy loading. Jangan memuat seluruh JavaScript web di halaman pertama. Pastikan beban loading web ringan.
 * [ ] Matikan Source Maps di Production: Saat melakukan build untuk di-deploy, pastikan source maps dinonaktifkan agar orang lain tidak bisa mengintip atau mengunduh source code asli Anda secara utuh.
 * [ ] Evaluasi Strategi Rendering (View Source): Jika klik kanan -> View Page Source isinya hanya <div id="root"></div> kosong, pertimbangkan menggunakan Server-Side Rendering (SSR) atau Static Site Generation (SSG) menggunakan framework seperti Next.js. Ini jauh lebih baik untuk SEO dibandingkan aplikasi React Murni (Client-side rendering).
4. Bot & Konfigurasi AI
 * [ ] Verifikasi robots.txt: Pastikan konfigurasi robots.txt Anda tidak memblokir mesin pencari secara tidak sengaja (Disallow: / yang salah tempat). Tentukan juga bot AI mana yang boleh atau tidak boleh merayapi situs Anda.
 * [ ] Tambahkan llms.txt (Opsional/Tren Baru): Jika website Anda berisi dokumentasi teknis atau informasi yang ingin mudah dibaca oleh AI (seperti ChatGPT atau Claude saat melakukan web browsing), buat file llms.txt di root directory yang berisi panduan ringkas tentang struktur konten web Anda.