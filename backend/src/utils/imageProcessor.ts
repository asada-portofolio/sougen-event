import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';

/**
 * Konfigurasi untuk pemrosesan gambar.
 */
interface ImageProcessOptions {
  /** Jika true, menghasilkan 2 versi: _full.webp dan _thumb.webp + mengembalikan width/height */
  generateThumb: boolean;
  /** Lebar maksimal untuk gambar full (default: 1920px) */
  fullMaxWidth?: number;
  /** Lebar maksimal untuk thumbnail (default: 400px) */
  thumbMaxWidth?: number;
  /** Kualitas WebP (default: 80) */
  quality?: number;
}

/**
 * Hasil pemrosesan gambar versi tunggal (entitas logo, profil, cover).
 */
interface SingleImageResult {
  filename: string;
  url: string;
}

/**
 * Hasil pemrosesan gambar versi ganda (galeri, strip foto).
 * Menyertakan width/height asli untuk pencegahan CLS.
 */
interface GalleryImageResult {
  filenameFull: string;
  filenameThumb: string;
  urlFull: string;
  urlThumb: string;
  width: number;
  height: number;
}

// Direktori root untuk menyimpan gambar yang diupload
const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

/**
 * Pastikan direktori output ada.
 */
async function ensureDir(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true });
}

/**
 * Buat nama file unik berdasarkan timestamp + random hex.
 */
function generateFilename(prefix: string): string {
  const timestamp = Date.now();
  const random = crypto.randomBytes(4).toString('hex');
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * Proses dan simpan gambar yang diupload.
 *
 * Dua mode operasi sesuai Guideline.md §4 "Aturan Emas":
 *
 * 1. **Single-version** (`generateThumb: false`):
 *    Untuk entitas tunggal (logo komunitas, profil talent, cover program).
 *    Menghasilkan 1 file .webp. Frontend pakai CSS aspect-ratio.
 *
 * 2. **Gallery-version** (`generateThumb: true`):
 *    Untuk entitas galeri (GalleryPhoto, CommunityPhoto, ProgramPhoto).
 *    Menghasilkan 2 file (_full.webp + _thumb.webp) dan mengembalikan
 *    width/height untuk pencegahan CLS.
 *
 * @param fileBuffer - Buffer dari file yang diupload (dari multer)
 * @param subDir - Subdirektori di dalam uploads/ (contoh: 'talents', 'events/gallery')
 * @param options - Konfigurasi pemrosesan
 */
export async function processAndSaveImage(
  fileBuffer: Buffer,
  subDir: string,
  options: ImageProcessOptions & { generateThumb: false },
): Promise<SingleImageResult>;

export async function processAndSaveImage(
  fileBuffer: Buffer,
  subDir: string,
  options: ImageProcessOptions & { generateThumb: true },
): Promise<GalleryImageResult>;

export async function processAndSaveImage(
  fileBuffer: Buffer,
  subDir: string,
  options: ImageProcessOptions,
): Promise<SingleImageResult | GalleryImageResult> {
  const {
    generateThumb,
    fullMaxWidth = 1920,
    thumbMaxWidth = 400,
    quality = 80,
  } = options;

  const outputDir = path.join(UPLOAD_DIR, subDir);
  await ensureDir(outputDir);

  const baseName = generateFilename(subDir.replace(/\//g, '-'));

  // Dapatkan metadata gambar asli
  const metadata = await sharp(fileBuffer).metadata();
  const originalWidth = metadata.width ?? 0;
  const originalHeight = metadata.height ?? 0;

  if (generateThumb) {
    // ── Mode Gallery: 2 versi + width/height ──
    const fullFilename = `${baseName}_full.webp`;
    const thumbFilename = `${baseName}_thumb.webp`;

    // Proses full version
    await sharp(fileBuffer)
      .resize({ width: fullMaxWidth, withoutEnlargement: true })
      .webp({ quality })
      .toFile(path.join(outputDir, fullFilename));

    // Proses thumbnail version
    await sharp(fileBuffer)
      .resize({ width: thumbMaxWidth, withoutEnlargement: true })
      .webp({ quality: quality - 10 })
      .toFile(path.join(outputDir, thumbFilename));

    // Hitung dimensi proporsional setelah resize
    const fullMeta = await sharp(path.join(outputDir, fullFilename)).metadata();

    return {
      filenameFull: fullFilename,
      filenameThumb: thumbFilename,
      urlFull: `/uploads/${subDir}/${fullFilename}`,
      urlThumb: `/uploads/${subDir}/${thumbFilename}`,
      width: fullMeta.width ?? originalWidth,
      height: fullMeta.height ?? originalHeight,
    };
  } else {
    // ── Mode Single: 1 versi saja ──
    const filename = `${baseName}.webp`;

    await sharp(fileBuffer)
      .resize({ width: fullMaxWidth, withoutEnlargement: true })
      .webp({ quality })
      .toFile(path.join(outputDir, filename));

    return {
      filename,
      url: `/uploads/${subDir}/${filename}`,
    };
  }
}

/**
 * Hapus file gambar dari disk.
 * Tidak throw error jika file tidak ditemukan (sudah terhapus sebelumnya).
 */
export async function deleteImageFile(fileUrl: string): Promise<void> {
  if (!fileUrl) return;

  // Konversi URL path ke filesystem path
  // fileUrl format: /uploads/subDir/filename.webp
  const filePath = path.join(process.cwd(), fileUrl);

  try {
    await fs.unlink(filePath);
  } catch (err) {
    // File mungkin sudah dihapus sebelumnya, abaikan
    if ((err as NodeJS.ErrnoException).code !== 'ENOENT') {
      console.error(`Gagal menghapus file: ${filePath}`, err);
    }
  }
}
