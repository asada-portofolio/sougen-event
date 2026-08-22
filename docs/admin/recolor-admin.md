# Recolor Task & Checklist — Halaman Admin Panel

> **Konteks:** Reality Project Organizer (RPO) berganti nama menjadi **Sougen Creative Management (Sougen)**. Dokumen ini adalah checklist perombakan palet warna halaman admin panel dari skema **merah RPO (`#fe0000`)** ke palet warna **Sougen** yang diturunkan dari logo resmi.

> **Cakupan:** Hanya perubahan warna (recolor). Konsep, bentuk, tata letak, dan struktur UI **tidak berubah**.

---

## Palet Warna Baru — Sougen Brand (untuk Admin)

| Token Lama (RPO)     | Kode Lama   | → | Token Baru (Sougen)      | Kode Baru   | Peran di Admin                      |
|----------------------|-------------|---|--------------------------|-------------|--------------------------------------|
| `rpo-red` (di admin) | `#fe0000`   | → | `sougen-blue`            | `#0094DE`   | **Aksen utama** — tab aktif, focus ring, tombol utama, spinner loading |
| `red-50` (bg subtle) | Tailwind    | → | `blue-50` / custom       | —           | Background subtle untuk badge, filter aktif |
| `red-100/200` (border) | Tailwind  | → | `blue-100/200` / custom  | —           | Border subtle untuk alert, filter |
| `red-500/600` (button) | Tailwind  | → | `sougen-blue`            | `#0094DE`   | Tombol aksi utama (simpan, tambah) |

> **Catatan:** Warna admin theme base (`admin-base`, `admin-surface`, `admin-dark`, `admin-secondary`, `admin-border`) **tidak berubah**. Hanya warna aksen merah yang diganti.

**Status:**
- `[ ]` Belum dimulai
- `[/]` Sedang dikerjakan
- `[x]` Selesai

---

## Section 0 — Fondasi (Sudah Tercakup di Checklist Public)

> Perubahan pada `tailwind.config.ts` dan `index.css` sudah dicatat di [recolor-public.md](file:///c:/Users/daudk/OneDrive/Documents/SKRIPSI%20ROMO/Coding/rpo-website/docs/publik/recolor-public.md) Section 0. Pastikan section tersebut **dikerjakan terlebih dahulu** karena menjadi fondasi bagi seluruh file admin juga.

---

## Section 1 — Layout & Komponen Admin Global

### 1.1 Admin Layout (`layouts/AdminLayout.tsx`)
1. `[x]` Ganti warna teks "RPO" di mobile header dari `text-rpo-red` → `text-sougen-blue`.
2. `[x]` Update label teks dari "RPO Admin" → "Sougen Admin" (penyesuaian nama).

### 1.2 Admin Sidebar (`components/admin/AdminSidebar.tsx`)
3. `[x]` Ganti warna menu aktif/hover dari `rpo-red` → `sougen-blue`.
4. `[x]` Ganti warna indikator item sidebar aktif → `sougen-blue`.
5. `[x]` Update label/logo dari RPO → Sougen di sidebar.

### 1.3 Admin Header (`components/admin/AdminHeader.tsx`)
6. `[x]` Verifikasi tidak ada referensi warna merah langsung. Jika ada, ganti ke `sougen-blue`.

### 1.4 Admin Bottom Nav — Mobile (`components/admin/AdminBottomNav.tsx`)
7. `[x]` Ganti warna ikon/teks aktif dari `rpo-red` → `sougen-blue`.

### 1.5 Admin Content Sheet (`components/admin/AdminContentSheet.tsx`)
8. `[x]` Ganti warna aksen header/tombol dari `rpo-red` → `sougen-blue`.
9. `[x]` Ganti warna Tailwind `red-*` (jika digunakan) → padanan `blue-*`.

### 1.6 Rich Text Editor (`components/admin/RichTextEditor.tsx`)
10. `[x]` Verifikasi toolbar/aksen editor. Jika menggunakan warna merah, ganti ke `sougen-blue`.

---

## Section 2 — Halaman Autentikasi & Dashboard

### 2.1 Admin Login (`pages/admin/AdminLogin.tsx`)
11. `[x]` Ganti warna tombol Login dari `rpo-red` / `red-*` → `sougen-blue`.
12. `[x]` Ganti warna focus ring input dari merah → `sougen-blue`.
13. `[x]` Ganti warna logo/aksen dekoratif dari merah → `sougen-blue`.
14. `[x]` Update label "RPO" → "Sougen" jika tampil di halaman login.

### 2.2 Admin Dashboard (`pages/admin/AdminDashboard.tsx`)
15. `[x]` Ganti warna statistik/badge aksen dari `rpo-red` → `sougen-blue`.
16. `[x]` Ganti warna tombol shortcut utama dari `red-*` → `sougen-blue`.
17. `[x]` Ganti warna ikon/indikator highlight → `sougen-blue` atau `sougen-green-mint`.

---

## Section 3 — Manajemen Event

### 3.1 Admin Event List (`pages/admin/AdminEventList.tsx`)
18. `[x]` Ganti warna tombol "Tambah Event Baru" dari `rpo-red` / `red-*` → `sougen-blue`.
19. `[x]` Ganti warna badge status event dari merah → `sougen-blue` (aktif) / `sougen-green-mint` (sukses).
20. `[x]` Ganti warna hover baris tabel dari `red-*` → `blue-50` atau `sougen-blue/5`.
21. `[x]` Ganti warna focus ring search input → `sougen-blue`.

### 3.2 Admin Event Detail (`pages/admin/AdminEventDetail.tsx`)
22. `[x]` Ganti warna tab aktif (`data-[state=active]:bg-rpo-red`) → `sougen-blue`.
23. `[x]` Ganti warna spinner loading dari `rpo-red` → `sougen-blue`.

### 3.3 Tab Basic Info (`components/admin/event/TabBasicInfo.tsx`)
24. `[x]` Ganti warna tombol simpan/aksi dari `rpo-red` / `red-*` → `sougen-blue`.
25. `[x]` Ganti warna focus ring semua input → `sougen-blue`.

### 3.4 Tab Rundown (`components/admin/event/TabRundown.tsx`)
26. `[x]` Ganti warna tombol tambah hari/rundown dari `red-*` → `sougen-blue`.
27. `[x]` Ganti warna badge/label waktu dari merah → `sougen-blue`.
28. `[x]` Ganti warna focus ring input → `sougen-blue`.

### 3.5 Tab Program (`components/admin/event/TabProgram.tsx`)
29. `[x]` Ganti warna tombol tambah program dari `red-*` → `sougen-blue`.
30. `[x]` Ganti warna badge program aktif dari merah → `sougen-blue`.
31. `[x]` Ganti warna focus ring input → `sougen-blue`.

### 3.6 Tab Talent (`components/admin/event/TabTalent.tsx`)
32. `[x]` Ganti warna tombol tambah talent dari `red-*` → `sougen-blue`.
33. `[x]` Ganti warna aksen badge role dari merah → `sougen-blue` (GUEST) / `sougen-green-dark` (PERFORMER).

### 3.7 Tab Gallery (`components/admin/event/TabGallery.tsx`)
34. `[x]` Ganti warna tombol upload/tambah dari `red-*` → `sougen-blue`.
35. `[x]` Ganti warna progress bar upload → `sougen-blue`.

### 3.8 Tab Visual (`components/admin/event/TabVisual.tsx`)
36. `[x]` Ganti warna toggle/switch aktif dari `red-*` → `sougen-blue`.
37. `[x]` Ganti warna tombol aksi dan focus ring → `sougen-blue`.

### 3.9 Tab Advanced (`components/admin/event/TabAdvanced.tsx`)
38. `[x]` Ganti warna tombol simpan/aksi dari `red-*` → `sougen-blue`.
39. `[x]` Ganti warna focus ring input → `sougen-blue`.

---

## Section 4 — Manajemen Katalog & Entitas

### 4.1 Admin Talent List (`pages/admin/AdminTalentList.tsx`)
40. `[x]` Ganti warna tombol "Tambah Talent" dari `red-*` → `sougen-blue`.
41. `[x]` Ganti warna focus ring search input dari `rpo-red` → `sougen-blue`.
42. `[x]` Ganti warna filter role aktif dari `red-50 text-rpo-red border-rpo-red` → padanan `sougen-blue`.
43. `[x]` Ganti warna badge event di tabel dari `red-50 text-rpo-red` → padanan `sougen-blue`.

### 4.2 Admin Talent Form (`pages/admin/AdminTalentForm.tsx`)
44. `[x]` Ganti warna tombol simpan/aksi dari `red-*` → `sougen-blue`.
45. `[x]` Ganti warna focus ring semua input → `sougen-blue`.
46. `[x]` Ganti warna preview border/aksen → `sougen-blue`.

### 4.3 Admin Community List (`pages/admin/AdminCommunityList.tsx`)
47. `[x]` Ganti warna tombol "Tambah Komunitas" dari `red-*` → `sougen-blue`.
48. `[x]` Ganti warna hover baris tabel → `blue-50`.
49. `[x]` Ganti warna focus ring search → `sougen-blue`.

### 4.4 Admin Community Form (`pages/admin/AdminCommunityForm.tsx`)
50. `[x]` Ganti warna tombol simpan/aksi dari `red-*` → `sougen-blue`.
51. `[x]` Ganti warna focus ring semua input → `sougen-blue`.

### 4.5 Admin Program List (`pages/admin/AdminProgramList.tsx`)
52. `[x]` Ganti warna tombol "Tambah Program" dari `red-*` → `sougen-blue`.
53. `[x]` Ganti warna hover dan focus ring → `sougen-blue`.

### 4.6 Admin Program Form (`pages/admin/AdminProgramForm.tsx`)
54. `[x]` Ganti warna tombol simpan/aksi dari `red-*` → `sougen-blue`.
55. `[x]` Ganti warna focus ring semua input → `sougen-blue`.

---

## Section 5 — Manajemen Konten CMS

### 5.1 Admin FAQ (`pages/admin/AdminFAQ.tsx`)
56. `[x]` Ganti warna tombol "Tambah FAQ" dari `red-*` → `sougen-blue`.
57. `[x]` Ganti warna focus ring dan aksen card → `sougen-blue`.

### 5.2 Admin Kebijakan (`pages/admin/AdminKebijakan.tsx`)
58. `[x]` Ganti warna tombol tambah/simpan dari `red-*` → `sougen-blue`.
59. `[x]` Ganti warna focus ring dan aksen → `sougen-blue`.

### 5.3 Admin Kontak (`pages/admin/AdminKontak.tsx`)
60. `[x]` Ganti warna tombol aksi dari `red-*` → `sougen-blue`.
61. `[x]` Ganti warna tab/toggle section (Info Kontak vs Pesan Masuk) → `sougen-blue`.
62. `[x]` Ganti warna focus ring semua input → `sougen-blue`.

### 5.4 Admin About (`pages/admin/AdminAbout.tsx`)
63. `[x]` Ganti warna tombol simpan/aksi dari `red-*` → `sougen-blue`.
64. `[x]` Ganti warna focus ring semua input → `sougen-blue`.
65. `[x]` Ganti warna tombol tambah/hapus anggota tim → `sougen-blue`.

---

## Section 6 — Pengaturan Sistem

### 6.1 Admin Settings (`pages/admin/AdminSettings.tsx`)
66. `[x]` Ganti warna tombol simpan pengaturan dari `red-*` → `sougen-blue`.
67. `[x]` Ganti warna focus ring semua input → `sougen-blue`.
68. `[x]` Update preview/label yang masih merujuk ke "RPO" → "Sougen".

---

## Section 7 — Verifikasi Akhir (Admin)

69. `[x]` **Cek Konsistensi:** Pastikan seluruh halaman admin tidak ada sisa warna merah RPO (kecuali `rpo-negative` untuk error semantik).
70. `[x]` **Cek Tombol Hapus/Danger:** Pastikan tombol hapus/danger tetap menggunakan warna merah semantik (`rpo-negative` / `red-500`) — **JANGAN** diganti ke biru. Ini penting untuk UX keamanan.
71. `[x]` **Cek Focus Ring:** Verifikasi semua input/textarea/select memiliki focus ring `sougen-blue` yang konsisten.
72. `[x]` **Cek Mode Mobile & Desktop:** Pastikan perubahan warna terlihat benar di kedua mode tampilan admin.
73. `[x]` **Cek Aksentuasi Tab Admin Event:** Pastikan tab aktif pada halaman event detail terlihat jelas dengan warna `sougen-blue`.
74. `[x]` **Pastikan teks "RPO" di branding admin (header, sidebar, login) sudah diganti ke "Sougen".**
