Instruksi: Dokumentasi Design System — Halaman Publik RPO
Konteks

Website RPO sudah selesai secara fungsional dan siap deploy, tapi tampilannya masih terasa generik/"AI-made". Sebelum deploy, saya ingin mempercantik UI-nya. Tahap ini kamu hanya mendokumentasikan, belum mengubah kode/tampilan apapun.

Dokumen ini akan saya kirim ke AI lain untuk disempurnakan, lalu hasil akhirnya baru dieksekusi jadi redesign nyata. Jadi dokumen harus jelas dan bisa dibaca AI lain tanpa konteks tambahan dariku.

Tugas

Buat dokumentasi untuk seluruh halaman publik website (temukan dan catat sendiri semua halaman publik yang ada, jangan ada yang terlewat). Simpan di folder /docs, format plain text/markdown, dipisah per bagian:

/docs/public-audit.md — kondisi tiap halaman saat ini: layout/section, komponen UI yang dipakai berulang (button, card, navbar, dll) beserta lokasi file, dan elemen spesifik yang terasa generik/kurang matang.
/docs/public-design-tokens.md — warna (hex), tipografi (font, skala ukuran), spacing/breakpoint, bentuk (radius, shadow), gaya ikon/imagery.
/docs/public-architecture.md — peta navigasi antar halaman, daftar tombol/CTA penting beserta fungsinya dan status (harus dipertahankan / boleh direvisi tampilannya), komponen reusable, stack teknis yang dipakai (framework/styling).

Struktur Isi yang Diminta
1. Audit Kondisi Saat Ini (wajib, sebelum bagian lain)
Screenshot atau deskripsi tiap halaman publik saat ini (layout, urutan section).
Inventaris komponen UI yang sudah dipakai berulang (button, card, navbar, footer, form, dll) beserta lokasi filenya di kodebase.
Identifikasi elemen yang terasa "generik/AI-made" secara spesifik (misal: warna terlalu default, spacing tidak konsisten, tipografi tidak ada hierarki, dll) — ini jadi acuan area prioritas perbaikan.
2. Token Visual
Warna: palet saat ini (hex code), termasuk warna yang dipakai untuk brand (crimson/navy/sakura sesuai identitas RPO), status warna (sukses/error/warning), dan warna netral.
Tipografi: font family yang dipakai, skala ukuran (heading 1–6, body, caption), font-weight yang tersedia.
Spacing & Grid: satuan spacing (misal berbasis 4px/8px), breakpoint responsive yang dipakai.
Bentuk & Referensi Visual: border-radius, shadow/elevation, style ikon (outline/filled), gaya imagery (foto event, ilustrasi, dsb).
3. Aturan Arsitektur Produk
Peta navigasi antar halaman publik (termasuk link di navbar/footer).
Pemetaan tombol/CTA: setiap tombol penting, fungsi yang dijalankan (link kemana, trigger apa), dan status: harus dipertahankan / boleh direvisi tampilannya.
Struktur komponen reusable (mana yang dipakai lintas halaman, mana yang unik per halaman).
Batasan teknis: stack yang dipakai (framework, styling method — misal Tailwind/CSS Modules), agar rekomendasi desain nanti realistis untuk diimplementasikan.
Batasan Penting
Jangan mengubah kode, struktur data, atau logic apapun di tahap ini.
Dokumen harus deskriptif dan akurat terhadap kondisi aktual, bukan berisi opini desain baru — rekomendasi perbaikan desain akan dilakukan oleh AI lain di tahap berikutnya berdasarkan dokumen ini.
Jika ada inkonsistensi ditemukan (misal dua halaman pakai warna primary berbeda), catat sebagai temuan, jangan langsung diseragamkan.
Setelah Selesai

Setelah dokumen untuk halaman publik selesai dan saya review, kita lanjut ke pembuatan dokumen yang sama untuk halaman admin dengan struktur serupa.