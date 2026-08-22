# Redesign Task & Guideline — RPO Public Website

Dokumen ini adalah panduan lengkap dan checklist eksekusi untuk proses redesign antarmuka (UI/UX) halaman publik dan admin di website RPO. Urutan pengerjaan mengikuti dependensi teknis, dan untuk urutan tampilan mengikuti urutan dari atas hingga bawah.

**Status:**
- `[ ]` Belum dimulai
- `[/]` Sedang dikerjakan
- `[x]` Selesai

## Section 0 — Catatan & Ketentuan Umum (Berlaku untuk Seluruh Halaman)

1. [x] Development difokuskan ke tampilan **Mobile** terlebih dahulu, baru setelahnya menyesuaikan tampilan **Desktop**.
2. [x] Setiap section wajib menerapkan **lazy loading** dan **skeleton loading** untuk pengalaman pengguna yang lebih baik.
3. [x] Gambar referensi di dokumen hanya sebagai acuan bentuk — sebagian elemen bisa dibuat sangat mirip, sebagian lain hanya perlu sama secara konsep dan boleh dikreasikan ulang.
4. [x] Beberapa section hanya muncul / berubah isi tergantung status: **ada event berlangsung** vs **tidak ada event (standby)**.
5. [x] Gunakan dummy asset untuk gambar/logo yang belum tersedia, dan catat aset mana saja yang sudah/belum tersedia.
6. [x] Skema warna halaman Home menggunakan palet **light (terang)**.

## Section 1 — Re-Concept Halaman Public

### 1.1 Re-Concept Halaman Home

**\**
1. [x] Terdapat Top Navbar pada sisi atas yang berisikan logo, menu, dan hamburger menu (mobile & desktop).
2. [x] Desain header berbentuk kotak panjang dengan efek glass (setting Figma: Refraction 80, Depth 40, Dispersion 60, Frost 0, Splay 44) + drop shadow tipis agar mudah terlihat.
3. [x] Mobile: sisi kiri berisi logo RPO + teks "Reality Project Organizer" (ditumpuk 3); sisi kanan berisi icon hamburger (3 garis).
4. [x] Desktop: menu tengah berisi Home, Guest, LineUp, Community, Resource, Contact; logo + nama panjang RPO di kiri; hamburger di kanan.
5. [x] Saat hamburger ditekan: Mobile → side menu menutupi seluruh layar; Desktop → side menu menutupi setengah layar. Icon berubah dari 3 garis menjadi silang (X) sebagai penanda aktif/back button.
6. [x] Side menu terbagi 2 sisi: kanan berisi menu utama (Home, Guest, LineUp, Community, Activity, Event, Contact); kiri berisi shortcut (Gallery, FAQ, Event Guidelines, kontak email, kontak WhatsApp, shortcut Instagram). Background efek glass dengan overlay lebih gelap agar teks tetap terbaca.
7. [x] Desktop only: menu "Resource" bertipe dropdown menampilkan Gallery, FAQ, Event Guideline. Arrow indicator (↑ default / ↓ saat hover-aktif) berubah sesuai state; posisi dropdown tepat di bawah header; background efek glass + outline tipis.

**Hero Section (Bagian Awal)**
8. [x] Hero section full-screen (menutupi satu layar penuh) saat halaman pertama kali dimuat.
9. [x] Konsep 1 (tidak ada event/standby): logo RPO ditumpuk 3 ukuran + nama "Reality Project Organizer" (posisi bawah logo di mobile, samping kanan logo di desktop); logo rounded (bukan kotak penuh); font Poppins Bold dengan letter-spacing disesuaikan agar match ukuran logo utama.
10. [x] Konsep 2 (ada event, mobile): desain karcis tiket dengan 3 bagian — nama RPO, info event (tanggal, judul, tema, lokasi), tombol menuju halaman detail event.
11. [x] Konsep 2 (ada event, desktop): hero menampilkan info ringkas event (tanggal, judul, tema, lokasi) diambil dari data yang diinput admin; badge "Free Entry" / "Ticketed Entry" sesuai jenis event; jika berbayar tambahkan tombol menuju section opsi tiket.
12. [x] Gambar latar hero berrasio 16:9, dapat diubah lewat halaman admin, dan dibuat sedikit lebih gelap agar teks tetap kontras dan terbaca.

**Section Animation Text (Running Text)**
13. [x] Posisi tepat setelah Hero Section; ukuran section pendek; background warna solid; font Poppins Bold, letter-spacing 10%, semua teks uppercase.
14. [x] Konsep 1 (tidak ada event / event status "Pause"): teks "Reality Project Organizer" (atau nama event jika event berlangsung dalam waktu kurang dari 7 hari) berjalan/running text ke kanan (mobile) atau statis (desktop) → bertransisi ke teks statis "Coming Soon".
15. [x] Konsep 2 (event status "Live"): teks "Upcoming Event in" → transisi ke countdown format Jam:Menit:Detik sebelum event mulai; saat event berlangsung → berubah jadi "Ongoing Event" → transisi ke countdown selesai, dengan label mengikuti nama kegiatan rundown yang aktif (mis. "Cosplay"). Jika status event masih "Pause", tampilkan konsep 1. Teks yang terlalu panjang dibuat running text.

**Section LineUp (Gabungan Guest & Performer)**
16. [x] Section LineUp (sebelumnya bernama Guest) menampung seluruh entitas talent event (GUEST maupun PERFORMER) dalam satu wadah "OUR LINEUP". Tampil saat ada event aktif.
17. [x] Posisi setelah Animation Text section; header teks rata kiri; layout berbasis card.
18. [x] Background warna solid cerah, namun dikreasikan agar tidak terlihat membosankan.
19. [x] Mobile: maksimal 4 talent ditampilkan (grid 2x2); jika lebih dari 4, tampilkan tombol "lihat selengkapnya >" di sudut kanan bawah.
20. [x] Desktop: semua talent ditampilkan via scroll/drag horizontal atau tombol panah kiri-kanan (pojok kanan bawah); tombol panah hanya aktif jika talent > 4; tombol "lihat semua" mengarah ke halaman event.
21. [x] Desain card: foto talent sebagai background, outline di sisi luar, outer shadow tipis; 40% bagian bawah card untuk info (efek glass + feather di sisi atas overlay) berisi nama/username Instagram, bio singkat, jumlah followers & postingan, serta tombol Follow.
22. [x] Section ditutup garis tebal merah sebagai pembatas; perhatikan gap, spacing, dan size yang presisi (tidak terlalu jauh/dekat, tidak terlalu kecil/besar); font Poppins family.
23. [x] Case 2 (Tidak ada event aktif / mode standby): section ini dapat dialihfungsikan untuk menampilkan list performer reguler/umum yang biasa bekerja sama dengan RPO, dengan gaya desain card dan layout yang sama (mengikuti Poin 19-21).

**Section Program/Activity OR Rundown**
24. [x] Case 1 (event berlangsung + jadwal program sudah ditentukan admin): tampilkan **Rundown**.
25. [x] Case 2 (tidak ada event, atau program belum ditentukan admin): tampilkan list **Program/Activity** umum.
26. [x] Mobile Case 1: tombol switch Day 1 / Day 2 di bagian atas (indikator segitiga untuk day yang aktif, warna tombol lebih menonjol saat aktif); judul "RUNDOWN"; info tanggal + jam mulai-selesai di kiri, alamat event di kanan; list jam & nama kegiatan di bawahnya; background solid sama seperti Guest.
27. [x] Mobile Case 2: judul "OUR ACTIVITY" + garis pembatas + teks intro; list card program (foto sebagai background, outline, sudut rounded, efek glass untuk nama program di bagian bawah); navigasi slide via swipe jari + tombol panah kiri-kanan; tombol shortcut ke halaman Programs/Activity.
28. [x] Desktop Case 1: label kecil "For This Event" (uppercase, rata kiri) di atas judul "RUNDOWN" (rata tengah + garis pembatas); semua rundown (multi-hari) ditampilkan sekaligus dengan label "Day" berbentuk kotak rounded sebagai pembeda.
29. [x] Desktop Case 2: judul "OUR ACTIVITY" (rata tengah, uppercase) + garis pembatas + teks intro; list card program sama seperti mobile, lengkap dengan navigasi slide + tombol shortcut.

**Section FAQ & Contact**
30. [x] Mobile: FAQ dan Contact terpisah menjadi 2 section berurutan (FAQ dahulu, baru Contact); konten diisi lewat admin.
31. [x] Mobile FAQ: label "you have to know" (uppercase, rata kiri) di atas judul "Frequently Asked Questions" (uppercase, rata tengah) + garis pembatas + teks intro; list pertanyaan berbentuk card (rata kiri) dengan tombol panah (↑ collapse / ↓ expand) untuk membuka jawaban; card juga bisa ditekan langsung tanpa harus menekan tombol panah.
32. [x] Mobile Contact: teks utama "Masih ada pertanyaan? langsung kirim ke kami!" (rata tengah) + tombol "Hubungi Kami" menuju halaman Contact Us.
33. [x] Desktop: FAQ & Contact digabung dalam satu section (2 sisi/kolom).
34. [x] Desktop FAQ: label "you have to know" rata kiri + judul "Frequently Asked Questions" (rata kiri) + garis pembatas + teks intro tetap ("Answers to questions regarding the event, tickets, exhibitors, and other booths.") + list pertanyaan sama seperti mobile.
35. [x] Desktop Contact: teks utama rata kiri + tombol "Hubungi Kami" sejajar/di tengah teks judul (bukan di tengah halaman).

**Section Bottom Navigation Bar (Khusus Mobile)**
36. [x] Hanya muncul di tampilan mobile; tersembunyi secara default saat halaman pertama kali dimuat, muncul setelah user pertama kali melakukan scroll.
37. [x] Bar navigasi rata tengah melekat di bagian bawah layar, berisi menu penting, menu aktif diberi latar warna serta icon/teks berubah warna, menu nonaktif berwarna abu-abu.

**Section Footer (Khusus Desktop)**
38. [x] Hanya muncul di tampilan desktop, berada di ujung bawah halaman, terbagi menjadi 3 sisi/kolom.
39. [x] Kolom kiri: logo + nama RPO, garis pembatas, lalu shortcut sosial media (saat ini hanya FB & IG aktif) dengan label "Follow Us".
40. [x] Kolom tengah: shortcut menu utama (Home, Guest, LineUp, Community, Activity, Event, Contact) & menu sampingan (Gallery, FAQ, Event Guidelines).
41. [x] Kolom kanan: kontak langsung (WhatsApp & Email).
42. [x] Semua info sosial media & kontak dapat dikustomisasi lewat panel admin.

**Tombol Back to Top (Fungsi Tambahan)**
43. [x] Tombol untuk scroll kembali ke posisi paling atas halaman; berfungsi di mobile & desktop; posisi di sudut kanan bawah; desain icon disesuaikan dengan style website.

## Section 2 — Re-Concept Halaman Event (Public)

### 2.1 Event List (Arsip)

1. `[x]` Menu Bar menggunakan komponen Navbar standar (sama seperti halaman lain).
2. `[x]` Judul Utama & Intro mengikuti pola dasar halaman lain: label kecil ("OUR JOURNEY"), judul besar ("EVENT ARCHIVE"), garis pembatas, teks intro.
3. `[x]` Highlight Banner Event Terbaru (kondisional) — muncul hanya jika ada event dengan toggle "Event Aktif Ditampilkan" = ON (reuse toggle dari konsep Home Page, bukan status baru).
4. `[x]` Banner tampil selebar penuh dengan gaya sinematik (website film): menggunakan gambar latar (*full background cover*) dengan *overlay* gradien gelap dari bawah ke atas.
5. `[x]` Teks utama (judul, badge "Sedang Berlangsung", lokasi, dan tombol) diposisikan secara elegan di atas gradien tersebut (rata kiri bawah/tengah) agar responsif dan mudah dibaca pada mobile maupun desktop.
6. `[x]` Jika tidak ada event dengan toggle aktif, section banner tidak dirender sama sekali (tanpa banner kosong) — grid arsip langsung tampil.
7. `[x]` Interaksi: menekan banner mengarahkan ke Event Detail varian Terbaru.
8. `[x]` Grid Arsip Event Lama: tiap kartu menampilkan poster event, tema event, judul event, dan tanggal event.
9. `[x]` Grid layout: 2 kolom (mobile), 3–4 kolom (desktop), rasio kartu portrait konsisten (rasio pasti mengacu ke Design.md).
10. `[x]` Urutan tampil: Event yang sedang aktif selalu menempati urutan pertama, lalu disusul event lainnya yang diurutkan berdasarkan tanggal pelaksanaan (reverse chronological) — konsisten dengan pola arsip Gallery.
11. `[x]` Pagination diaktifkan apabila jumlah event dalam grid arsip melebihi 10 item.
12. `[x]` Interaksi: menekan kartu arsip mengarahkan ke Event Detail varian Lampau.

### 2.2 Event Detail (Route per Event — Dua Varian: Terbaru & Lampau)

13. `[x]` Menu Bar: logo berubah menjadi ikon panah kembali (mengarah ke halaman Event List), mengikuti pola halaman LineUp.
14. `[x]` Hero Section Mode Template (default): tampilan terstruktur otomatis dari data (latar bertema, badge tema event, judul event besar) — identik secara konsep dengan Hero Jenis 2 di Home, namun versi penuh/lengkap (bukan versi ringkas preview).
15. `[x]` Hero Section Mode Poster Image: admin mengunggah gambar poster event yang sudah didesain, menggantikan tampilan template sepenuhnya.
16. `[x]` Pemilihan mode Hero (Template vs Poster Image) bersifat per event, diatur admin melalui panel admin; mode Template berfungsi sebagai fallback saat poster belum tersedia.
17. `[x]` Info Tanggal & Lokasi (Per Day): section ini SELALU ditampilkan dari data terstruktur, terlepas dari mode Hero yang dipilih (tidak "dipanggang" ke dalam gambar poster).
18. `[x]` Tampilkan beberapa kartu "Day" tersusun sejajar (jumlah menyesuaikan durasi event), masing-masing menampilkan nomor hari dan tanggal.
19. `[x]` Tampilkan satu kartu Lokasi di bawah kartu Day — nama venue dan alamat lengkap; lokasi per-hari dapat override lokasi default Event apabila venue berbeda di hari berbeda.
20. `[x]` Section Guest: menampilkan seluruh Talent role GUEST yang terhubung ke event ini via EventTalent, memakai Card yang identik dengan Guest di Home & halaman LineUp.
21. `[x]` **SUDAH SESUAI** ~*Untuk bagian program acara ubah card program acara menjadi seperti pada gambar (Program.png)*~
22. `[x]` **SUDAH SESUAI** ~*Khusus pada tampilan desktop perlebar masing masing card pada program acara dan line up agar menyentuh garis tebal bagian penutup section*~
23. `[x]` **SUDAH SESUAI** ~*Pada halaman admin, di bagian Kelola detail event pada bagian pengaturan lanjutan terdapat "Tautan Eksternal". Pisahkan setiap program yang di masukkan untuk suatu event agar mendapat "Tautan" pendafataran nya sendiri, pisahkan bagian yang mengatur "Tautan lomba" dengan "tautan google drive".*~
24. `[x]` **SUDAH SESUAI** ~*Section Rundown: menampilkan susunan acara terjadwal per jam, dikelompokkan berdasarkan EventDay yang relevan (mis. Day 1: 10:00 Registrasi, 11:00 Pembukaan, dst; berlanjut ke Day 2 jika multi-hari).*~
25. `[x]` **SUDAH SESUAI** ~*Aksi Khusus — Varian Event Terbaru: Tombol Pendaftaran mengarah ke tautan eksternal yang dikonfigurasi admin per event (Google Form/platform tiket/WhatsApp) — murni tautan eksternal, TIDAK ada sistem pendaftaran/pembayaran internal.*~ -> Telah diubah: Aksi pendaftaran dipindah ke level Program Acara. Pada section "Program Acara" di detail event, bagian bawah card (yang awalnya gambar dokumentasi) telah diganti menjadi kolom khusus untuk tombol mendaftar.
26. `[x]` Aksi Khusus — Varian Event Lampau: Tombol shortcut ke Gallery, mengarah langsung ke halaman Detail Album event ini (`/gallery/:eventId`), reuse penuh tanpa data tambahan.
27. `[x]` Aksi Khusus — Varian Event Lampau: Tombol shortcut ke Google Drive, tautan eksternal ke folder dokumentasi lengkap yang dikonfigurasi admin per event.
28. `[x]` (Perbaikan UX Mobile) Penyelarasan batas lebar (width) dari informasi di dalam Tiket dan komponen Hari & Lokasi agar maksimal lebarnya sejajar/tidak melebihi batas 85% lebar garis merah Line-Up. Selain itu, dilakukan *scale down* pada teks Hari & Lokasi dan penyempitan jarak antar teks agar lebih padat.
29. `[x]` (Perbaikan UX Mobile) Mengubah card pada section Line-Up menjadi desain lanskap beraksen garis merah dan layout 1 kolom ke bawah khusus tampilan mobile. Tampilan desktop tetap memakai grid vertikal biasa.
30. `[x]` (Perbaikan Navigasi) Menghapus menu "Policies" / "Event Guidelines" dari dalam dropdown menu Resources di Navbar Desktop dan SideMenu Mobile.

## Section 3 — Re-Concept Halaman Line-Up (Public)

### 3.1 Menu Bar (Navigasi Atas)
**Yang akan dibuat:** Komponen Navbar responsif yang diadaptasi dari halaman Home.
**Konsep Visual & Logika:**
1. `[x]` **Ikon Navigasi (Kiri):** Logo RPO diganti dengan ikon segitiga menghadap kiri bermakna "Kembali" (mengarahkan user ke Home Page).
2. `[x]` **Skema Warna:** Latar belakang berwarna cerah dengan efek *drop shadow* tipis sebagai pemisah visual dari konten utama. Semua elemen teks, logo, dan ikon wajib menggunakan warna merah khas logo RPO.
3. `[x]` **Tata Letak Desktop:** Posisi tengah berisi deretan *shortcut* halaman. Menu "Resources" berbentuk *dropdown* (berisi Gallery, FAQ, Kebijakan dan Keamanan).
4. `[x]` **Tata Letak Mobile & Desktop (Kanan):** Terdapat ikon Hamburger (3 garis) yang memicu munculnya *Side Menu* (konsep *overlay* sama seperti di Home).
5. `[x]` **Logika Navigasi (Global):** Sistem secara otomatis akan menyembunyikan *link* menu yang mengarah ke halaman yang sedang aktif dikunjungi pengguna.

### 3.2 Judul Utama & Intro Section
**Yang akan dibuat:** Area pengantar teks (Hero Text) tanpa gambar latar.
**Konsep Visual & Logika:**
6. `[x]` **Latar Belakang:** Berupa warna solid cerah, murni berfokus pada tipografi, tanpa foto/gambar *background*.
7. `[x]` **Tipografi & Susunan (Rata Tengah):** Menggunakan *font* keluarga Poppins. Tersusun dari atas ke bawah: 
   - Label kecil berlatar kotak (mis. "LET'S GET TO KNOW").
   - Judul utama berukuran besar (mis. "OUR GUEST").
   - Garis horizontal tipis yang panjangnya menyesuaikan lebar teks judul.
   - Paragraf intro singkat.

### 3.3 Grid Talent (Guest + Performer)
**Yang akan dibuat:** Galeri grid komprehensif berisi kartu profil *talent*.
**Konsep Visual & Logika:**
8. `[x]` **Desain Kartu (Card):** Menggunakan ulang (*reuse*) komponen Card dari section Guest/LineUp di halaman Home persis tanpa ubahan.
9. `[x]` **Sistem Grid:** Tersusun dalam 2 kolom pada layar *mobile* dan 4 kolom pada layar *desktop*.
10. `[x]` **Cakupan Data:** Menampilkan *seluruh* entri Talent yang pernah ada dalam sejarah RPO, bukan hanya yang terikat pada event yang sedang aktif.
11. `[x]` **Tampilan Universal:** Seluruh *talent* (Guest maupun Performer) digabung dalam satu *grid* tampilan yang sama tanpa pemisahan/tab (untuk versi rilis awal).
12. `[x]` **Manajemen Konten:** Memiliki fitur *pagination* jika jumlah kartu melebihi 10 item. Seluruh data dikendalikan melalui panel admin. (Gunakan *dummy assets* untuk profil yang belum memiliki foto).

### 3.4 Footer Standar
**Yang akan dibuat:** Bagian kaki halaman yang berlaku seragam.
**Konsep Visual & Logika:**
13. `[x]` **Konsistensi Komponen:** Memakai komponen Footer standar hasil kustomisasi admin untuk *Desktop* maupun *Mobile*.
14. `[x]` **Pengecualian Navigasi:** Halaman LineUp secara eksplisit **MENGGUNAKAN** *Bottom Navigation Bar* pada versi *mobile* dan diatur agar selalu muncul (berbeda dengan halaman Home yang perlu di-scroll).

## Section 4 — Konsep Pengalaman Pengguna (UX) & Performa

1. `[x]` **Progressive Loading:** Setiap section di halaman ini wajib menerapkan teknik *lazy loading* untuk menghemat *bandwidth*.
2. `[x]` **Loading State:** Transisi muat data harus menggunakan *Skeleton Loading* untuk mempertahankan bentuk *layout* di mata pengguna (menghindari layar kosong).
3. `[x]` **Fleksibilitas Desain:** Gambar acuan yang ada pada *Design.md* bersifat konseptual; eksekusi *frontend* dapat dikreasikan ulang selama konsep dan hierarki informasinya tercapai (tidak wajib *pixel-perfect* kecuali disebutkan khusus).
4. `[x]` **Penyesuaian Copywriting:** Mencari istilah/judul yang paling tepat untuk menggantikan "OUR GUEST" karena section ini mencakup *Guest* sekaligus *Performer*.

## Section 5 — Re-Concept Halaman About Us (Public)

### 5.1 Menu Bar (Navigasi Atas)
**Yang akan dibuat:** Komponen Navbar standar yang digunakan lintas halaman.
**Konsep Visual & Logika:**
1. `[x]` **Konsistensi Komponen:** Menggunakan Navbar yang identik dengan halaman lainnya tanpa perilaku khusus tambahan.
2. `[x]` **Logika Navigasi (Pengecualian):** Halaman About Us secara eksplisit **TIDAK** disertakan dalam *Navbar Desktop* utama. Akses menuju halaman ini murni hanya bisa melalui *Side Menu* dan *Footer* (menyesuaikan struktur navigasi final).

### 5.2 Judul Utama & Intro Section
**Yang akan dibuat:** Area pengantar teks (Hero Text) adaptasi dari halaman LineUp.
**Konsep Visual & Logika:**
3. `[x]` **Tipografi & Susunan (Rata Tengah):** Tersusun dari atas ke bawah: Label kecil berlatar kotak (mis. "GET TO KNOW") → Judul utama berukuran besar (mis. "ABOUT US") → Garis pembatas tipis → Teks intro singkat yang bertugas memperkenalkan RPO sebagai *event organizer* budaya pop Jepang di Makassar.
4. `[x]` **Latar Belakang:** Berupa warna solid cerah, konsisten dengan gaya visual section judul di halaman LineUp.

### 5.3 Cerita Kami (Our Story)
**Yang akan dibuat:** Bagian narasi sejarah dan latar belakang organisasi.
**Konsep Visual & Logika:**
5. `[x]` **Teks Narasi:** Berisi 1–2 paragraf singkat yang menjelaskan latar belakang berdirinya RPO (waktu mulai berjalan, motivasi awal, dan sejarah singkat).
6. `[x]` **Visual Pendukung:** Narasi didampingi oleh satu gambar representatif (foto dokumentasi event atau ilustrasi bernuansa Jepang) yang selaras dengan gaya visual pada hero section halaman Home.

### 5.4 Visi & Misi
**Yang akan dibuat:** Blok informasi struktural untuk memaparkan Visi dan Misi.
**Konsep Visual & Logika:**
7. `[x]` **Tata Letak Layout:** Ditampilkan bersebelahan kiri-kanan pada layar *desktop* dan bertumpuk vertikal atas-bawah pada layar *mobile*.
8. `[x]` **Format Visi:** Disajikan dalam bentuk satu paragraf teks singkat.
9. `[x]` **Format Misi:** Disajikan dalam bentuk daftar poin (*bullet list*), di mana jumlah poin bersifat fleksibel dan dikelola melalui panel admin.

### 5.5 Pencapaian (Statistik RPO)
**Yang akan dibuat:** *Counter/Badge* statistik operasional untuk membangun kredibilitas.
**Konsep Visual & Logika:**
10. `[x]` **Komponen Kartu Statistik:** Berisi angka seperti jumlah event yang terselenggara, jumlah komunitas mitra, total Talent (Guest & Performer), dan tahun berdirinya RPO.
11. `[x]` **Logika Perhitungan Otomatis:** Angka-angka ini **TIDAK** diinput manual oleh admin. Sistem wajib menghitung nilai secara dinamis menggunakan *query agregat* (COUNT) langsung ke tabel *Event*, *Community*, dan *Talent* agar selalu akurat dengan data terkini.

### 5.6 Tim Kami (Our Team)
**Yang akan dibuat:** Galeri *grid* berisi profil anggota atau tim internal pengelola.
**Konsep Visual & Logika:**
12. `[x]` **Desain Kartu (Card):** Menggunakan desain kartu yang lebih sederhana dan ringkas dari kartu Talent (hanya memuat foto, nama, dan jabatan/divisi; menghilangkan elemen statistik sosial media).
13. `[x]` **Manajemen Konten:** Struktur anggota tim tidak di-kode mati (*hardcoded*), melainkan dikelola sebagai entitas CRUD terpisah (TeamMember) pada panel admin.
14. `[x]` **Aset Visual:** Wajib menggunakan *dummy asset* untuk profil anggota tim yang belum memiliki foto, mengikuti standar yang disepakati sebelumnya.

### 5.7 Call-to-Action (CTA) Penutup
**Yang akan dibuat:** Area tombol navigasi persuasif di akhir halaman sebelum Footer.
**Konsep Visual & Logika:**
15. `[x]` **Elemen Navigasi:** Berisi tombol ajakan bertindak yang mengarahkan pengunjung untuk mengeksplorasi bagian lain website, seperti "Lihat Komunitas Mitra Kami" (menuju halaman Community) atau "Hubungi Kami" (menuju halaman Contact).
16. `[x]` **Logika Data:** Murni untuk kebutuhan navigasional statis dan tidak memerlukan modifikasi skema *database*.

### 5.8 Footer Standar
**Yang akan dibuat:** Bagian kaki halaman yang berlaku seragam.
**Konsep Visual & Logika:**
17. `[x]` **Konsistensi Komponen:** Menggunakan komponen Footer yang sama persis polanya dengan halaman LineUp untuk versi *Desktop*.
18. `[x]` **Pengecualian Navigasi:** Halaman About Us **TIDAK** menggunakan *Bottom Navigation Bar* pada versi *mobile* (Bottom Navigation hanya eksklusif untuk halaman Home versi *mobile*).

## Section 6 — Re-Concept Halaman Community (Public)

### 6.1 Menu Bar (Navigasi Atas)
**Yang akan dibuat:** Komponen Navbar standar yang digunakan lintas halaman.
**Konsep Visual & Logika:**
1. `[x]` **Konsistensi Komponen:** Menggunakan Navbar yang identik dengan halaman lainnya, tanpa penyesuaian khusus.
2. `[x]` **Logika Navigasi (Global):** Pastikan halaman Community tetap mengikuti aturan universal sistem, yaitu menyembunyikan *link* menuju halaman yang sedang aktif dikunjungi pada Navbar Desktop.

### 6.2 Judul Utama & Intro Section
**Yang akan dibuat:** Area pengantar teks (Hero Text) adaptasi dari halaman LineUp.
**Konsep Visual & Logika:**
3. `[x]` **Tipografi & Susunan (Rata Tengah):** Tersusun dari atas ke bawah: Label kecil berlatar kotak (mis. "OUR PARTNERS") → Judul utama berukuran besar (mis. "COMMUNITY") → Garis pembatas tipis → Teks intro singkat yang menjelaskan tujuan halaman ini.

### 6.3 Grid Community (Mitra Komunitas)
**Yang akan dibuat:** Galeri *grid* berisi kartu profil dan dokumentasi komunitas mitra.
**Konsep Visual & Logika:**
4. `[x]` **Desain Kartu Khusus (Card):** Berbeda dari Card Talent, kartu ini menampilkan: logo/foto profil komunitas, nama komunitas, kategori/jenis komunitas (berupa teks bebas yang diisi admin), dan deskripsi singkat komunitas.
5. `[x]` **Strip Dokumentasi Mini:** Tambahkan strip mini di dalam kartu yang memuat 2–3 *thumbnail* foto dokumentasi. Jika foto yang tersedia lebih banyak, tambahkan indikator visual (contoh: "+5 foto lainnya").
6. `[x]` **Tautan Sosial Media:** Sediakan tombol/tautan opsional yang mengarah ke akun Instagram komunitas, mengadopsi pola tombol "Follow" pada Card Talent jika datanya tersedia.
7. `[x]` **Interaksi Galeri (Lightbox/Modal):** Saat pengguna menekan Card, sistem akan membuka tampilan galeri (*lightbox/modal*) yang memuat seluruh foto dokumentasi komunitas tersebut dalam ukuran penuh. Pengguna dapat menggeser (*swipe*) untuk berpindah antar foto.
8. `[x]` **Sistem Grid Layout:** Tersusun dalam 2 kolom pada layar *mobile* dan 3 kolom pada layar *desktop* (bukan 4 kolom seperti LineUp, karena kepadatan informasi per Card di sini lebih tinggi).
9. `[x]` **Manajemen Pagination:** Fitur *pagination* diaktifkan apabila jumlah komunitas yang ditampilkan melebihi 10 item, selaras dengan perilaku di halaman LineUp.
10. `[x]` **Kontrol CMS Admin:** Memastikan seluruh proses penambahan, pengeditan, dan penghapusan data komunitas (termasuk foto-fotonya) dapat dilakukan secara penuh melalui panel admin. Unggah foto juga harus mendukung metode bertahap (tidak wajib diunggah sekaligus).
11. `[x]` **Aset Visual Dummy:** Wajib menggunakan *dummy asset* untuk logo/foto dokumentasi komunitas yang belum tersedia di tahap awal.

### 6.4 Footer Standar
**Yang akan dibuat:** Bagian kaki halaman yang berlaku seragam.
**Konsep Visual & Logika:**
12. `[x]` **Konsistensi Komponen:** Menggunakan komponen Footer yang sama persis polanya dengan halaman LineUp untuk versi *Desktop*.

## Section 7 — Re-Concept Halaman Halaman Programs/Activity (Public)

### 7.1 Menu Bar (Navigasi Atas)
**Yang akan dibuat:** Komponen Navbar standar yang digunakan lintas halaman.
**Konsep Visual & Logika:**
1. `[x]` **Konsistensi Komponen:** Menggunakan Navbar yang identik dengan halaman lainnya, tanpa penyesuaian khusus.
2. `[x]` **Logika Navigasi (Global):** Tetap mengikuti aturan universal sistem, yaitu menyembunyikan *link* menuju halaman yang sedang aktif dikunjungi pada Navbar Desktop.

### 7.2 Judul Utama & Intro Section
**Yang akan dibuat:** Area pengantar teks (Hero Text) adaptasi dari halaman LineUp dan Community.
**Konsep Visual & Logika:**
3. `[x]` **Tipografi & Susunan (Rata Tengah):** Tersusun dari atas ke bawah: Label kecil berlatar kotak (mis. "WHAT WE DO") → Judul utama berukuran besar (mis. "PROGRAMS & ACTIVITIES") → Garis pembatas tipis → Teks intro singkat yang menjelaskan cakupan kegiatan RPO.

### 7.3 Grid Program (Katalog Jenis Kegiatan)
**Yang akan dibuat:** Galeri *grid* berisi kartu informasi program kegiatan beserta dokumentasinya.
**Konsep Visual & Logika:**
4. `[x]` **Desain Kartu Khusus (Card):** Menampilkan susunan: foto sampul (*cover*) program, nama program, kategori opsional (teks bebas yang diisi admin, misal: "Lomba/Kompetisi", "Workshop", "Hiburan Panggung"), dan deskripsi singkat program.
5. `[x]` **Strip Dokumentasi Mini:** Menyematkan strip mini berisi 2–3 *thumbnail* foto dokumentasi. Tambahkan indikator visual (contoh: "+4 foto lainnya") jika foto yang tersedia melebihi kapasitas *thumbnail* (mengikuti pola Card Community).
6. `[x]` **Tombol Aksi Khusus:** Menambahkan elemen tombol "Lihat Aturan Main" pada Card (spesifik hanya ada di halaman ini).
7. `[x]` **Interaksi Galeri (Lightbox/Modal):** Saat pengguna menekan *Card* atau strip foto, sistem akan membuka *modal* galeri (*lightbox*) yang menampilkan seluruh foto dokumentasi program tersebut secara penuh dan dapat digeser (*swipe*).
8. `[x]` **Sistem Grid Layout:** Tersusun dalam 2 kolom pada layar *mobile* dan 3 kolom pada layar *desktop* (konsisten dengan halaman Community).
9. `[x]` **Manajemen Pagination:** Fitur *pagination* otomatis aktif apabila jumlah program yang ditampilkan melebihi 10 item.
10. `[x]` **Kontrol CMS Admin:** Penambahan nama, deskripsi, kategori, dan foto dokumentasi program harus bisa dilakukan bertahap (tidak wajib sekaligus) melalui panel admin.
11. `[x]` **Aset Visual Dummy:** Wajib menggunakan *dummy asset* untuk foto program atau dokumentasi yang belum tersedia saat pengembangan.

### 7.4 Fitur Baru: Modal Aturan Main (Rules)
**Yang akan dibuat:** *Modal popup* terpisah untuk membaca detail peraturan/ketentuan dari suatu program.
**Konsep Visual & Logika:**
12. `[x]` **Pemisahan Konteks Modal:** Tombol "Lihat Aturan Main" memicu pembukaan *modal* yang **TERPISAH** dari *modal* galeri foto (TIDAK digabung dengan sistem *tab*). Hal ini karena sifat kontennya berbeda (Galeri = visual/*swipe*; Aturan Main = teks panjang/baca/*scroll*).
13. `[x]` **Format Konten:** Isi *modal* berupa teks panjang yang dapat memuat elemen terstruktur seperti poin ketentuan, syarat pendaftaran, atau mekanisme pelaksanaan.
14. `[x]` **Rich Text Editor di CMS:** Admin harus disediakan *Rich Text Editor* (bukan sekadar kolom teks polos/textarea biasa) di *dashboard* agar dapat memformat teks (bold, list, dll) secara rapi. Pemilihan *library* untuk *Rich Text Editor* ini akan dicatat di `Guideline.md`.

### 7.5 Footer Standar
**Yang akan dibuat:** Bagian kaki halaman yang berlaku seragam.
**Konsep Visual & Logika:**
15. `[x]` **Konsistensi Komponen:** Menggunakan komponen Footer yang sama persis polanya dengan halaman LineUp untuk versi *Desktop*.

## Section 8 — Re-Concept Halaman Halaman Contact (Public)

### 8.1 Tata Letak Halaman (Layout Keseluruhan)
**Konsep Visual & Logika:**
1. `[x]` **Layout Desktop:** Membagi area konten menjadi dua kolom bersebelahan. Kolom kiri diisi oleh Info Kontak (jalur komunikasi instan), dan kolom kanan diisi oleh Form Kirim Pesan.
2. `[ ]` **Layout Mobile:** Disusun bertumpuk vertikal. Form Kirim Pesan ditampilkan lebih dahulu di bagian atas, diikuti Info Kontak di bawahnya.

### 8.2 Menu Bar (Navigasi Atas)
**Yang akan dibuat:** Komponen Navbar standar yang digunakan lintas halaman.
**Konsep Visual & Logika:**
3. `[x]` **Konsistensi Komponen:** Menggunakan Navbar yang identik dengan halaman lainnya.
4. `[x]` **Logika Navigasi (Global):** Tetap mengikuti aturan universal sistem, yaitu menyembunyikan *link* menuju halaman yang sedang aktif dikunjungi pada Navbar Desktop.

### 8.3 Judul Utama & Intro Section
**Yang akan dibuat:** Area pengantar teks (Hero Text).
**Konsep Visual & Logika:**
5. `[x]` **Tipografi & Susunan (Rata Tengah):** Tersusun dari atas ke bawah: Label kecil berlatar kotak (mis. "GET IN TOUCH") → Judul utama berukuran besar (mis. "CONTACT US") → Garis pembatas tipis → Teks intro singkat.

### 8.4 Info Kontak (Kanal Komunikasi)
**Yang akan dibuat:** Daftar *shortcut* menuju kanal komunikasi resmi RPO (WA, Email, IG, dll).
**Konsep Visual & Logika:**
6. `[x]` **Desain Item Kontak:** Ditampilkan sebagai daftar vertikal ringkas (bukan *grid* besar). Tiap baris menampilkan: Ikon platform, Label (mis. "WhatsApp"), Nilai/teks (nomor WA/email), dan area tombol/tautan yang mengarah langsung ke *deep link* platform (`wa.me/...`, `mailto:`, dll).
7. `[x]` **Manajemen Konten (CRUD):** Data kanal komunikasi bersifat dinamis (diatur lewat tabel `ContactChannel` di panel admin), bukan di-*hardcode*, agar penambahan kanal baru (seperti Line atau Discord) bisa dilakukan mandiri oleh admin.
8. `[x]` **Lokasi Fisik (Opsional):** Jika RPO memiliki alamat fisik tetap, diinput sebagai salah satu baris `ContactChannel` yang tautannya mengarah ke pencarian Google Maps. **Tidak perlu** menyematkan komponen peta interaktif (*embedded map*) pada halaman ini.

### 8.5 Form Kirim Pesan & UX
**Yang akan dibuat:** Formulir interaktif untuk mengirimkan pesan langsung ke sistem CMS RPO.
**Konsep Visual & Logika:**
9. `[x]` **Desain UI Input:** Antara teks *label* dan kotak input (*textbox*) wajib disusun terpisah secara vertikal. Posisi teks *label* berada di atas, dan *textbox* diposisikan tepat di bawahnya.
10. `[x]` **Struktur Field:** 
    - **Nama:** Wajib diisi (teks bebas).
    - **Email:** Wajib diisi (divalidasi format email).
    - **Nomor WhatsApp:** Wajib diisi (divalidasi format angka/telepon).
    - **Pesan:** Wajib diisi (menggunakan *textarea*, agar *form* tidak sekadar mengumpulkan kontak tetapi juga isi pesan).
11. `[x]` **Validasi Inline (UX):** Kesalahan format (misal email tidak menggunakan @) dimunculkan seketika (*real-time*) saat pengguna selesai mengetik di satu *field*, tanpa harus menunggu tombol Submit ditekan.
12. `[x]` **State Tombol Submit:** Tombol kirim harus memiliki indikator *loading* saat data sedang diproses, dan wajib dinonaktifkan sementara (*disabled*) untuk mencegah klik ganda/spam pengiriman.
13. `[x]` **Feedback Tanpa Reload (SPA):** Memunculkan notifikasi sukses (*toast/alert* kecil) di halaman yang sama setelah pesan terkirim. Jika gagal karena jaringan, tampilkan pesan *error* spesifik beserta tombol untuk mencoba lagi.

### 8.6 Keamanan Dasar Formulir
**Yang akan dibuat:** Lapisan keamanan awal untuk mencegah *spam bot*.
**Konsep Visual & Logika:**
14. `[x]` **Honeypot Field:** Menyisipkan *field* input tersembunyi di dalam kode (tidak terlihat oleh manusia). Jika *field* ini terisi (biasanya dilakukan oleh *bot* otomatis), sistem *backend* akan menolak *submission* tersebut.
15. `[x]` **Rate Limiting:** Menerapkan pembatasan jumlah pengiriman formulir dari satu alamat IP dalam durasi waktu tertentu di level *backend*. (Sistem reCAPTCHA belum diperlukan pada versi awal ini).

### 8.7 Footer Standar
**Yang akan dibuat:** Bagian kaki halaman yang berlaku seragam.
**Konsep Visual & Logika:**
16. `[x]` **Konsistensi Komponen:** Menggunakan komponen Footer yang sama persis polanya dengan halaman LineUp untuk versi *Desktop*.