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
29. [x] Case 1 (event berlangsung + jadwal program sudah ditentukan admin): tampilkan **Rundown**.
30. [x] Case 2 (tidak ada event, atau program belum ditentukan admin): tampilkan list **Program/Activity** umum.
31. [x] Mobile Case 1: tombol switch Day 1 / Day 2 di bagian atas (indikator segitiga untuk day yang aktif, warna tombol lebih menonjol saat aktif); judul "RUNDOWN"; info tanggal + jam mulai-selesai di kiri, alamat event di kanan; list jam & nama kegiatan di bawahnya; background solid sama seperti Guest.
32. [x] Mobile Case 2: judul "OUR ACTIVITY" + garis pembatas + teks intro; list card program (foto sebagai background, outline, sudut rounded, efek glass untuk nama program di bagian bawah); navigasi slide via swipe jari + tombol panah kiri-kanan; tombol shortcut ke halaman Programs/Activity.
33. [x] Desktop Case 1: label kecil "For This Event" (uppercase, rata kiri) di atas judul "RUNDOWN" (rata tengah + garis pembatas); semua rundown (multi-hari) ditampilkan sekaligus dengan label "Day" berbentuk kotak rounded sebagai pembeda.
34. [x] Desktop Case 2: judul "OUR ACTIVITY" (rata tengah, uppercase) + garis pembatas + teks intro; list card program sama seperti mobile, lengkap dengan navigasi slide + tombol shortcut.

**Section FAQ & Contact**
35. [x] Mobile: FAQ dan Contact terpisah menjadi 2 section berurutan (FAQ dahulu, baru Contact); konten diisi lewat admin.
36. [x] Mobile FAQ: label "you have to know" (uppercase, rata kiri) di atas judul "Frequently Asked Questions" (uppercase, rata tengah) + garis pembatas + teks intro; list pertanyaan berbentuk card (rata kiri) dengan tombol panah (↑ collapse / ↓ expand) untuk membuka jawaban; card juga bisa ditekan langsung tanpa harus menekan tombol panah.
37. [x] Mobile Contact: teks utama "Masih ada pertanyaan? langsung kirim ke kami!" (rata tengah) + tombol "Hubungi Kami" menuju halaman Contact Us.
38. [x] Desktop: FAQ & Contact digabung dalam satu section (2 sisi/kolom).
39. [x] Desktop FAQ: label "you have to know" rata kiri + judul "Frequently Asked Questions" (rata kiri) + garis pembatas + teks intro tetap ("Answers to questions regarding the event, tickets, exhibitors, and other booths.") + list pertanyaan sama seperti mobile.
40. [x] Desktop Contact: teks utama rata kiri + tombol "Hubungi Kami" sejajar/di tengah teks judul (bukan di tengah halaman).

**Section Bottom Navigation Bar (Khusus Mobile)**
41. [x] Hanya muncul di tampilan mobile; tersembunyi secara default saat halaman pertama kali dimuat, muncul setelah user pertama kali melakukan scroll.
42. [x] Bar navigasi rata tengah melekat di bagian bawah layar, berisi menu penting, menu aktif diberi latar warna serta icon/teks berubah warna, menu nonaktif berwarna abu-abu.

**Section Footer (Khusus Desktop)**
45. [x] Hanya muncul di tampilan desktop, berada di ujung bawah halaman, terbagi menjadi 3 sisi/kolom.
46. [x] Kolom kiri: logo + nama RPO, garis pembatas, lalu shortcut sosial media (saat ini hanya FB & IG aktif) dengan label "Follow Us".
47. [x] Kolom tengah: shortcut menu utama (Home, Guest, LineUp, Community, Activity, Event, Contact) & menu sampingan (Gallery, FAQ, Event Guidelines).
48. [x] Kolom kanan: kontak langsung (WhatsApp & Email).
49. [x] Semua info sosial media & kontak dapat dikustomisasi lewat panel admin.

**Tombol Back to Top (Fungsi Tambahan)**
50. [x] Tombol untuk scroll kembali ke posisi paling atas halaman; berfungsi di mobile & desktop; posisi di sudut kanan bawah; desain icon disesuaikan dengan style website.

## Section 2 — Re-Concept Halaman Event (Public)

### 1.1 Event List (Arsip)

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

### 1.2 Event Detail (Route per Event — Dua Varian: Terbaru & Lampau)

14. `[x]` Menu Bar: logo berubah menjadi ikon panah kembali (mengarah ke halaman Event List), mengikuti pola halaman LineUp.
15. `[x]` Hero Section Mode Template (default): tampilan terstruktur otomatis dari data (latar bertema, badge tema event, judul event besar) — identik secara konsep dengan Hero Jenis 2 di Home, namun versi penuh/lengkap (bukan versi ringkas preview).
16. `[x]` Hero Section Mode Poster Image: admin mengunggah gambar poster event yang sudah didesain, menggantikan tampilan template sepenuhnya.
17. `[x]` Pemilihan mode Hero (Template vs Poster Image) bersifat per event, diatur admin melalui panel admin; mode Template berfungsi sebagai fallback saat poster belum tersedia.
18. `[x]` Info Tanggal & Lokasi (Per Day): section ini SELALU ditampilkan dari data terstruktur, terlepas dari mode Hero yang dipilih (tidak "dipanggang" ke dalam gambar poster).
19. `[x]` Tampilkan beberapa kartu "Day" tersusun sejajar (jumlah menyesuaikan durasi event), masing-masing menampilkan nomor hari dan tanggal.
20. `[x]` Tampilkan satu kartu Lokasi di bawah kartu Day — nama venue dan alamat lengkap; lokasi per-hari dapat override lokasi default Event apabila venue berbeda di hari berbeda.
21. `[x]` Section Guest: menampilkan seluruh Talent role GUEST yang terhubung ke event ini via EventTalent, memakai Card yang identik dengan Guest di Home & halaman LineUp.
22. `[x]` **SUDAH SESUAI** ~*Untuk bagian program acara ubah card program acara menjadi seperti pada gambar (Program.png)*~
23. `[x]` **SUDAH SESUAI** ~*Khusus pada tampilan desktop perlebar masing masing card pada program acara dan line up agar menyentuh garis tebal bagian penutup section*~
24. `[x]` **SUDAH SESUAI** ~*Pada halaman admin, di bagian Kelola detail event pada bagian pengaturan lanjutan terdapat "Tautan Eksternal". Pisahkan setiap program yang di masukkan untuk suatu event agar mendapat "Tautan" pendafataran nya sendiri, pisahkan bagian yang mengatur "Tautan lomba" dengan "tautan google drive".*~
25. `[x]` **SUDAH SESUAI** ~*Section Rundown: menampilkan susunan acara terjadwal per jam, dikelompokkan berdasarkan EventDay yang relevan (mis. Day 1: 10:00 Registrasi, 11:00 Pembukaan, dst; berlanjut ke Day 2 jika multi-hari).*~
26. `[x]` **SUDAH SESUAI** ~*Aksi Khusus — Varian Event Terbaru: Tombol Pendaftaran mengarah ke tautan eksternal yang dikonfigurasi admin per event (Google Form/platform tiket/WhatsApp) — murni tautan eksternal, TIDAK ada sistem pendaftaran/pembayaran internal.*~ -> Telah diubah: Aksi pendaftaran dipindah ke level Program Acara. Pada section "Program Acara" di detail event, bagian bawah card (yang awalnya gambar dokumentasi) telah diganti menjadi kolom khusus untuk tombol mendaftar.
27. `[x]` Aksi Khusus — Varian Event Lampau: Tombol shortcut ke Gallery, mengarah langsung ke halaman Detail Album event ini (`/gallery/:eventId`), reuse penuh tanpa data tambahan.
28. `[x]` Aksi Khusus — Varian Event Lampau: Tombol shortcut ke Google Drive, tautan eksternal ke folder dokumentasi lengkap yang dikonfigurasi admin per event.
29. `[x]` (Perbaikan UX Mobile) Penyelarasan batas lebar (width) dari informasi di dalam Tiket dan komponen Hari & Lokasi agar maksimal lebarnya sejajar/tidak melebihi batas 85% lebar garis merah Line-Up. Selain itu, dilakukan *scale down* pada teks Hari & Lokasi dan penyempitan jarak antar teks agar lebih padat.
30. `[x]` (Perbaikan UX Mobile) Mengubah card pada section Line-Up menjadi desain lanskap beraksen garis merah dan layout 1 kolom ke bawah khusus tampilan mobile. Tampilan desktop tetap memakai grid vertikal biasa.
31. `[x]` (Perbaikan Navigasi) Menghapus menu "Policies" / "Event Guidelines" dari dalam dropdown menu Resources di Navbar Desktop dan SideMenu Mobile.

## Section 2 — Revisi Terhadap Keputusan Dokumen Sebelumnya

Bagian ini bukan checklist tampilan, melainkan penyesuaian keputusan lintas-dokumen yang perlu diselaraskan di seluruh proyek (termasuk dokumen Home Page & Programs/Activity yang sudah ada).

1. `[ ]` Pisahkan secara resmi entitas Program (katalog jenis kegiatan) dan Rundown (jadwal per jam per hari) sebagai dua entitas data berbeda — sebelumnya sempat digabung penamaannya di konsep Home Page sebagai satu section "Program/Rundown". Tampilan Home Page tetap boleh menampilkan section gabungan secara visual; yang berubah hanya sumber data di baliknya.
2. `[ ]` Revisi skema Program: tambahkan relasi formal ke Event (sebelumnya di dokumen Programs/Activity sengaja tidak dibuat relasi ini demi kesederhanaan skema) — kini dibutuhkan agar admin dapat memilih program spesifik yang berjalan di suatu event.
3. `[ ]` Perluas aturan Bottom Navigation Bar: sebelumnya eksklusif untuk halaman Home (mobile) saja — sekarang berlaku juga untuk halaman Event Detail (kedua varian, mobile). Halaman lain (termasuk Event List) tetap memakai Footer di semua breakpoint, tidak berubah.

## Section 3 — Implikasi Skema Data (Backend)

1. `[ ]` Perluas skema Event: tambahkan field `heroMode` (enum: TEMPLATE | POSTER_IMAGE), `posterImage` (opsional), `registrationUrl` (opsional), `googleDriveUrl` (opsional).
2. `[ ]` Buat entitas EventDay: `id`, `eventId`, `dayNumber`, `date`, `location` (opsional, override lokasi utama Event).
3. `[ ]` Buat entitas baru RundownItem: `id`, `eventDayId` (relasi ke EventDay), `time`, `activityName`, `location` (opsional, panggung spesifik), `displayOrder`.
4. `[ ]` Buat tabel relasi baru EventProgram (many-to-many Event ↔ Program): `id`, `eventId`, `programId`, `displayOrder`.
5. `[ ]` Pastikan entitas Talent, EventTalent, Program, dan GalleryPhoto yang sudah ada tetap dipakai ulang tanpa perubahan struktur tambahan, kecuali penambahan relasi EventProgram di atas.
6. `[ ]` Tambahkan validasi backend: hanya SATU event yang boleh memiliki toggle "Event Aktif Ditampilkan" menyala dalam satu waktu — validasi ini harus ditegaskan di level backend, bukan hanya asumsi di sisi tampilan.

## Section 4 — Hal yang Masih Terbuka (Perlu Keputusan Lanjutan)

1. `[ ]` Tentukan rasio/dimensi standar poster event (untuk Grid Arsip maupun mode Hero Poster Image) — akan diputuskan di Design.md.
2. `[ ]` Pertimbangkan perlu/tidaknya indikator/badge tambahan di Grid Arsip untuk event yang sudah sangat lama (mis. lebih dari 2 tahun) — belum menjadi kebutuhan yang ditetapkan.