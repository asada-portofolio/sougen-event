import rateLimit from 'express-rate-limit';

/**
 * Rate limiter khusus untuk POST /api/contact/message.
 * Membatasi 5 request per 15 menit per IP untuk mencegah spam.
 */
export const contactRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Terlalu banyak pesan dikirim. Silakan coba lagi dalam 15 menit.',
  },
});
