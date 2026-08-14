import { Request, Response, NextFunction } from 'express';

/**
 * Global Error Handler middleware.
 * Menangkap semua error yang dilempar (throw) atau di-next(err) dan
 * mengembalikan response JSON yang konsisten.
 *
 * PENTING: Harus didaftarkan SETELAH semua route di index.ts.
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  console.error('[ERROR]', err.stack || err.message);

  // Prisma known error codes bisa ditambahkan di sini nanti
  const statusCode = (err as { statusCode?: number }).statusCode || 500;
  const message = statusCode === 500
    ? 'Internal Server Error'
    : err.message;

  res.status(statusCode).json({ error: message });
}

/**
 * Helper untuk membuat error dengan status code kustom.
 * Digunakan di service/controller: throw createHttpError(404, 'Event tidak ditemukan');
 */
export function createHttpError(statusCode: number, message: string): Error & { statusCode: number } {
  const error = new Error(message) as Error & { statusCode: number };
  error.statusCode = statusCode;
  return error;
}
