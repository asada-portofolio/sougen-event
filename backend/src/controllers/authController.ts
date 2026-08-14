import { Request, Response, NextFunction } from 'express';
import { z } from 'zod/v4';
import * as authService from '../services/authService';

const loginSchema = z.object({
  username: z.string().min(1, 'Username wajib diisi'),
  password: z.string().min(1, 'Password wajib diisi'),
});

/**
 * POST /api/auth/login
 * Terima { username, password }, verifikasi, buat session.
 */
export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Username dan password wajib diisi.' });
      return;
    }

    const { username, password } = parsed.data;
    const userId = await authService.verifyCredentials(username, password);

    if (!userId) {
      res.status(401).json({ error: 'Username atau password salah.' });
      return;
    }

    // Set session
    req.session.userId = userId;
    req.session.save((err) => {
      if (err) {
        next(err);
        return;
      }
      res.json({ success: true });
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/logout
 * Hancurkan session.
 */
export async function logout(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    req.session.destroy((err) => {
      if (err) {
        next(err);
        return;
      }
      res.clearCookie('connect.sid');
      res.json({ success: true });
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/auth/me
 * Kembalikan status login saat ini.
 */
export async function me(req: Request, res: Response): Promise<void> {
  res.json({ isLoggedIn: !!req.session.userId });
}
