# Dokumentasi Design System — Halaman Publik RPO
## 3. Aturan Arsitektur Produk (Public Architecture)

Dokumen ini memetakan alur interaksi pengguna (UX), peta struktur navigasi, elemen Call-to-Action (CTA), serta batasan teknis platform RPO di sisi Frontend (publik).

### 3.1. Peta Navigasi Halaman (Sitemap Publik)

Struktur perutean (*routing*) yang ada saat ini:

- **`/` (Beranda)**
  - Mengakses berbagai bagian sorotan: Event Unggulan, Komunitas, dll.
- **`/about` (Tentang Kami)**
- **`/events` (Daftar Event)**
  - Tautan ke `/event/:slug` (Detail Event spesifik).
- **`/programs` (Daftar Program)**
- **`/talents` (Line-up Talent)**
- **`/gallery` (Galeri Dokumentasi)**
  - Tautan ke `/gallery/:id` (Detail Album Galeri).
- **`/community` (Komunitas RPO)**
- **`/contact` (Hubungi Kami)**
- **`/faq` (Tanya Jawab)**
- **`/policies` (Kebijakan dan Privasi)**

Peta navigasi ini tertuang pada:
1. **Navbar Desktop Utama**: Memuat tautan `Home`, `About`, `Events`, `Programs`, `Talents`, `Gallery`, dan `Community`.
2. **Bottom Navigation (Mobile)**: Biasanya memuat ikon pintasan untuk halaman-halaman utama (Home, Events, dll).
3. **Footer**: Memuat tautan sekunder seperti `FAQ`, `Kebijakan & Privasi`, dan `Kontak`.

---

### 3.2. Pemetaan Tombol & CTA Penting

Berikut adalah tombol-tombol fungsional yang krusial bagi interaksi pengunjung publik (seluruhnya boleh direvisi bentuk/desainnya secara drastis, selama fungsionalitas rutenya terjaga):

1. **CTA Utama di Hero Beranda**
   - **Teks**: "Jelajahi Event Kami" (Atau sejenisnya).
   - **Fungsi**: Navigasi/scroll ke seksi Event, atau pindah ke rute `/events`.
   - **Status**: Wajib dipertahankan secara fungsi, namun desain visual (warna, ukuran, efek *hover*) *SANGAT BOLEH DIREVISI*.

2. **Tombol Navigasi Menu (Mobile Hamburger)**
   - **Fungsi**: Membuka komponen `SideMenu.tsx` (Laci menu dari samping).
   - **Status**: Boleh direvisi visualnya, misal diubah menjadi animasi mikro yang lebih modern.

3. **Tombol Filter / Tab (misalnya di Event atau Galeri)**
   - **Fungsi**: Menyaring atau mengubah tab tampilan (jika ada).
   - **Status**: Boleh direvisi menjadi *pill-shaped tab* atau variasi *segmented control* yang lebih premium.

4. **Tombol "Kirim Pesan" di Halaman Hubungi Kami**
   - **Fungsi**: Melakukan *submit form* POST data kontak.
   - **Status**: Boleh direvisi ukuran dan efek *loading*-nya.

---

### 3.3. Struktur Komponen Reusable (Lintas Halaman)

Beberapa komponen bersifat global (muncul di mana saja) dan beberapa bersifat spesifik.
- **Komponen Global Lintas Halaman**: 
  - `Navbar.tsx`, `Footer.tsx`, `BottomNav.tsx`, `SideMenu.tsx`. Komponen-komponen penyusun kerangka (*scaffolding*) aplikasi.
- **Komponen Fungsional Lintas Halaman**: 
  - `Button.tsx` (Digunakan di hampir setiap formulir dan CTA).
  - `ImageWithSkeleton.tsx` (Digunakan setiap kali memuat aset gambar dari backend untuk mencegah pergeseran layout).
  - `SEO.tsx` (Komponen meta-tag transparan yang di-*inject* ke *head* tiap halaman, tidak berpengaruh pada UI namun penting).
- **Komponen Form**: 
  - `Input.tsx` dan `Textarea.tsx` (Khusus untuk halaman Contact atau pencarian/form lainnya jika ada).

---

### 3.4. Batasan Teknis (Tech-Stack & Styling)

Rekomendasi *redesign* nantinya harus mematuhi dan realistis terhadap batasan tumpukan teknologi (tech-stack) berikut:

1. **Framework**: `React` (menggunakan bundler `Vite`).
2. **Metodologi Styling**: **Tailwind CSS**.
   - Artinya, perombakan desain tidak boleh menyarankan penggunaan *styled-components*, SASS/SCSS, atau file `.css` terpisah yang masif (kecuali sangat terpaksa). Semua perubahan gaya harus bisa diterjemahkan menjadi utilitas kelas (*utility classes*) Tailwind.
3. **Ikon**: Menggunakan pustaka `lucide-react`. Jika AI desainer menyarankan pergantian jenis ikon (misalnya menjadi tebal/filled), pastikan ikon tersebut tersedia atau setara di pustaka Lucide.
4. **State Management UI**: Mengandalkan *state* lokal React (Hooks). Komponen semacam Modal, Tab, dan Accordion bersifat reaktif. Animasi CSS kompleks diperbolehkan, asalkan bisa disisipkan ke Tailwind `theme.extend.keyframes` atau menggunakan interisi kelas *hover/focus* yang *native*.
