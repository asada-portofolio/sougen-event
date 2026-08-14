import { prisma } from './prisma';

/**
 * Active Event Guard
 *
 * Memastikan constraint bisnis: maksimal 1 Event dengan isActive: true
 * di waktu bersamaan (PRD §2, Guideline.md §4).
 *
 * Saat satu event di-set isActive: true, fungsi ini secara otomatis
 * men-set SEMUA event lain menjadi isActive: false.
 *
 * Wajib dipanggil di service layer sebelum/saat update isActive.
 * JANGAN menulis logika ini inline di controller.
 *
 * @param eventId - ID event yang ingin diaktifkan
 */
export async function activeEventGuard(eventId: number): Promise<void> {
  // Non-aktifkan semua event lain yang sedang aktif
  await prisma.event.updateMany({
    where: {
      isActive: true,
      id: { not: eventId },
    },
    data: {
      isActive: false,
    },
  });
}
