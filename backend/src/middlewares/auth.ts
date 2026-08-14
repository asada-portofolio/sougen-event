import { Request, Response, NextFunction } from 'express';

/**
 * Middleware: requireAuth
 * Mengecek apakah sesi admin aktif melalui req.session.userId.
 * Jika tidak ada sesi aktif → 401 Unauthorized.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (!req.session.userId) {
    res.status(401).json({ error: 'Unauthorized — sesi tidak ditemukan atau sudah kedaluwarsa.' });
    return;
  }
  next();
}
