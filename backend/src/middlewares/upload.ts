import multer from 'multer';

/**
 * Konfigurasi Multer untuk upload gambar.
 *
 * Menggunakan memory storage (buffer) karena file akan diproses
 * oleh sharp sebelum disimpan ke disk — tidak perlu simpan file asli.
 *
 * Batasan:
 * - Ukuran file maksimal: 10 MB
 * - Tipe file: hanya gambar (JPEG, PNG, WebP, GIF)
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipe file tidak didukung. Gunakan JPEG, PNG, WebP, atau GIF.'));
    }
  },
});

/** Upload field tunggal (logo, profil, cover, poster, hero) */
export const uploadSingle = upload.single('image');

/** Upload multiple (gallery, strip foto komunitas/program) — maks 20 file */
export const uploadMultiple = upload.array('images', 20);
