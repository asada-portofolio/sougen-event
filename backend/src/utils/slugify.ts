/**
 * Mengonversi string menjadi URL slug yang aman.
 *
 * Contoh:
 *   slugify('Reality Fest Vol. 1') → 'reality-fest-vol-1'
 *   slugify('Cosplay Workshop & Showcase!') → 'cosplay-workshop-showcase'
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Ganti spasi dengan dash
    .replace(/[^\w-]+/g, '')     // Hapus karakter non-word (kecuali dash)
    .replace(/--+/g, '-')        // Ganti multi-dash jadi single dash
    .replace(/^-+/, '')          // Hapus dash di awal
    .replace(/-+$/, '');         // Hapus dash di akhir
}
