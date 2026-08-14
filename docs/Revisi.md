# Revisi.md — Checklist Eksekusi Revsisi dari Website RPO

Dokumen ini adalah panduan eksekusi *Revisi* yang mendetail. Setiap bagian adalah hasil observasi yang dilakukan secara mandiri. jangan lewati fase sebelum fase di atasnya selesai. Pengecualian untuk bagian yang memiliki relasi kuat pada antar bagian hal ini di perbolehkan. Dokumen ini akan di update secara berkala Ketika user/admin menemukan bug atau mendapatkan revisi dari ahli.

**Status:**
- `{ }` Spesial case 
- `[ ]` Belum dimulai
- `[/]` Sedang dikerjakan
- `[x]` Selesai

---

## 0 — REVISI UMUM


### A. Bagian Event & Kelola detail Event pada halaman admin 

1. [x] fungsi penambahan talent di section Line Up Talent masih tidak dapat berfungsi.

2. [x] pada section program khusus di tampilan dekstop, pada bagian Master Data Program, data program dengan nama yang panjang membuat tombol add '+' tidak terlihat sehingga membuatnya tidak bisa di tambahkan.

3. [x] pada section program khusus di tampilan mobile, tombol untuk menghapus program yang di inputkan masuk berada di bawah teks sehingga mengurangi estetika nya, ubah konsep nya dengan membaginya menjadi 3 bagian sebagai berikut bagian kiri gambar image program, tengah teks programnya, dan bagian kanan tombol hapus yang sejajar. dengan begini admin tidak perlu scroll ke bawah untuk menghapus program yang baru saja di tambahkan. hal ini juga berlaku di section talent.

4. [x] pada tampilan mobile saya ingin Page Header, Back Button, Page Title, Status Badge / Status Text, Page Navigation (Tabs) tidak ikut saat di scroll ke bawah.

5. [x] saya ingin saat user menentukan tanggal event pada saat membuat event,section rundown akan secara otomatis menambahkan data tanggal event tersebut. sebagai contoh : Jika User membuat event pada tanggal 31 Desember,maka di rundown akan ada informasi mengenai tanggal 31 Desember.

6. [x] tambahkan form yang proper untuk mengisi rundown di section rundown agar admin lebih mudah menambahkan rundown. informasi yang mesti di masukkan adalah waktu awal - waktu berakhir, program/penampilan talent (user bisa memasukkan secara manual, atau user bisa langsung memilih berdasarkan opsi yang dipilih).

7. [x] dikarenakan section rundown sekarang menampilkan 2 tipe jam (jadwal mulai dan selesai), atur yang tampil di halaman publik hanya menampilkan jam mulainya saja, tidak perlu menampilkan jam selesainya.

### B. Bagian Talent & Kelola detail Talent pada halaman admin 

1. [x] pada bagian talent atur agar user dapat memberikan tag/jenis ke setiap talent yang ada atau yang ingin di tambahkan (seperti: Cosplayer,Musisi, band, Influencer, Juri, MC/Master of Ceremony), dalam bentuk dropdown, atau user bisa mengetikkannya sendiri.

1.1 [x] masalah baru muncul dimana saya tidak bisa menambahkan talent baru.

2. [x] khusus untuk tampilan desktop, pada bagian detail event saya ingin posisi Live Preview Kartu dapat tetap stay berada di posisi atas.

### C. Bagian Manajemen & Kelola detail Komunitas pada halaman admin 

### D. Bagian Manajemen & Kelola detail Program pada halaman admin 

1. [x] Khusus untuk tampilan mode dekstop saja, buat tombol 'simpan perubahan' yang ada pada kelola detail event tetap diam berada dibawah bagian "Aturan Main & Persyaratan", disini tombol tersebut melayang dan mengambang. gambar akan di lampirkan sebagai bukti.

### E. Bagian Manajemen & Kelola detail Program pada halaman admin 