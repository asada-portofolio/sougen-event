import bcrypt from 'bcryptjs';
import { prisma } from '../utils/prisma';

/**
 * Auth Service — Business logic untuk autentikasi admin.
 */

/**
 * Verifikasi kredensial admin.
 * @returns userId jika valid, null jika tidak
 */
export async function verifyCredentials(
  username: string,
  password: string,
): Promise<number | null> {
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) return null;

  return user.id;
}

/**
 * Cek apakah ada user yang sudah terdaftar (untuk validasi awal).
 */
export async function getUserById(userId: number) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, username: true },
  });
}
