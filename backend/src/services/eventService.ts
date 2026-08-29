import { prisma } from '../utils/prisma';
import { slugify } from '../utils/slugify';
import { activeEventGuard } from '../utils/activeEventGuard';
import { processAndSaveImage, deleteImageFile } from '../utils/imageProcessor';
import { createHttpError } from '../middlewares/errorHandler';
import { HeroMode } from '../generated/prisma/client';

// ── Types ──

interface CreateEventInput {
  name: string;
  theme?: string;
  description?: string;
  startDate: string;
  endDate: string;
  location: string;
  heroMode?: HeroMode;
  googleDriveUrl?: string;
}

interface UpdateEventInput {
  name?: string;
  theme?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  heroMode?: HeroMode;
  googleDriveUrl?: string;
  isActive?: boolean;
  selectedDates?: string[];
}

// ── Service Functions ──

/**
 * Mengecek apakah ada event H-2 yang harus diaktifkan otomatis.
 */
async function autoActivateUpcomingEvent() {
  const twoDaysFromNow = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
  
  const upcomingEvents = await prisma.event.findMany({
    where: {
      isActive: false,
      isForceDraft: false,
      startDate: {
        lte: twoDaysFromNow
      },
      endDate: {
        gte: new Date()
      }
    },
    orderBy: {
      startDate: 'asc'
    }
  });

  if (upcomingEvents.length > 0) {
    const eventToActivate = upcomingEvents[0];
    await activeEventGuard(eventToActivate.id);
    await prisma.event.update({
      where: { id: eventToActivate.id },
      data: { isActive: true }
    });
    console.log(`[Auto-Activate] Event otomatis dipublikasikan: ${eventToActivate.name}`);
  }
}

/**
 * Ambil semua event (untuk grid arsip publik).
 * Urut descending berdasarkan startDate.
 * Hanya field ringkas untuk performa.
 */
export async function getAllEvents() {
  await autoActivateUpcomingEvent();

  return prisma.event.findMany({
    orderBy: { startDate: 'desc' },
    select: {
      id: true,
      slug: true,
      name: true,
      theme: true,
      description: true,
      startDate: true,
      endDate: true,
      location: true,
      posterImageUrl: true,
      heroImageUrl: true,
      heroMode: true,
      isActive: true,
      _count: {
        select: {
          eventDays: true,
          eventTalents: true,
          eventPrograms: true,
          galleryPhotos: true,
        },
      },
      galleryPhotos: {
        where: { isCover: true },
        select: { imageUrlThumb: true },
        take: 1,
      },
    },
  });
}

/**
 * Ambil satu event aktif dengan semua relasi.
 * Mengembalikan null jika tidak ada event aktif.
 */
export async function getActiveEvent() {
  await autoActivateUpcomingEvent();
  return prisma.event.findFirst({
    where: { isActive: true },
    include: {
      eventDays: {
        orderBy: { dayNumber: 'asc' },
        include: {
          rundownItems: {
            orderBy: { displayOrder: 'asc' },
          },
        },
      },
      eventTalents: {
        orderBy: { displayOrder: 'asc' },
        include: { talent: true },
      },
      eventPrograms: {
        orderBy: { displayOrder: 'asc' },
        include: { 
          program: {
            include: { photos: { orderBy: { displayOrder: 'asc' } } }
          }
        },
      },
      galleryPhotos: {
        where: { isCover: true },
        take: 1,
      },
      _count: {
        select: {
          eventDays: true,
          eventTalents: true,
          eventPrograms: true,
          galleryPhotos: true,
        },
      },
    },
  });
}

/**
 * Ambil detail lengkap satu event berdasarkan slug atau ID.
 */
export async function getEventBySlug(slugOrId: string) {
  const numId = parseInt(slugOrId, 10);
  const isNumeric = !isNaN(numId) && String(numId) === slugOrId;

  const event = await prisma.event.findFirst({
    where: isNumeric ? { OR: [{ id: numId }, { slug: slugOrId }] } : { slug: slugOrId },
    include: {
      eventDays: {
        orderBy: { dayNumber: 'asc' },
        include: {
          rundownItems: {
            orderBy: { displayOrder: 'asc' },
          },
        },
      },
      eventTalents: {
        orderBy: { displayOrder: 'asc' },
        include: { talent: true },
      },
      eventPrograms: {
        orderBy: { displayOrder: 'asc' },
        include: { 
          program: {
            include: { photos: { orderBy: { displayOrder: 'asc' } } }
          }
        },
      },
      galleryPhotos: {
        orderBy: { displayOrder: 'asc' },
      },
    },
  });

  if (!event) {
    throw createHttpError(404, 'Event tidak ditemukan.');
  }

  return event;
}

function parseYMDToUTCDate(dateStr: string): Date {
  const parts = dateStr.split('T')[0].split('-').map(Number);
  return new Date(Date.UTC(parts[0], parts[1] - 1, parts[2], 0, 0, 0, 0));
}

function formatDateToYMD(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Buat event baru beserta generate slug unik.
 */
export async function createEvent(data: CreateEventInput) {
  let slug = slugify(data.name);
  
  const existing = await prisma.event.findUnique({ where: { slug } });
  if (existing) {
    slug = `${slug}-${Date.now()}`;
  }

  const startDate = parseYMDToUTCDate(data.startDate);
  const endDate = parseYMDToUTCDate(data.endDate);

  const event = await prisma.event.create({
    data: {
      slug,
      name: data.name,
      theme: data.theme,
      description: data.description,
      startDate,
      endDate,
      location: data.location,
      heroMode: data.heroMode ?? 'TEMPLATE',
      googleDriveUrl: data.googleDriveUrl,
    },
  });

  // Auto-generate EventDays
  await syncEventDays(event.id);

  return prisma.event.findUnique({
    where: { id: event.id },
    include: {
      eventDays: {
        include: { rundownItems: true },
        orderBy: { dayNumber: 'asc' },
      },
      eventTalents: { include: { talent: true } },
      eventPrograms: { include: { program: true } },
    },
  });
}

/**
 * Sinkronisasi EventDays otomatis dari startDate dan endDate event, atau daftar tanggal kustom.
 */
export async function syncEventDays(eventId: number, customDates?: string[]) {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      eventDays: {
        include: { rundownItems: true },
        orderBy: { date: 'asc' },
      },
    },
  });

  if (!event) {
    throw createHttpError(404, 'Event tidak ditemukan.');
  }

  let targetDates: Date[] = [];

  if (customDates && customDates.length > 0) {
    targetDates = customDates
      .map(dStr => parseYMDToUTCDate(dStr))
      .filter(d => !isNaN(d.getTime()))
      .sort((a, b) => a.getTime() - b.getTime());
  } else {
    const start = parseYMDToUTCDate(event.startDate.toISOString());
    const end = parseYMDToUTCDate(event.endDate.toISOString());

    const daysDifference = Math.round((end.getTime() - start.getTime()) / (1000 * 3600 * 24));

    if (daysDifference >= 0) {
      for (let i = 0; i <= daysDifference; i++) {
        const currentDay = new Date(start);
        currentDay.setUTCDate(currentDay.getUTCDate() + i);
        targetDates.push(currentDay);
      }
    }
  }

  if (targetDates.length === 0) {
    return prisma.event.findUnique({
      where: { id: eventId },
      include: {
        eventDays: {
          include: { rundownItems: true },
          orderBy: { dayNumber: 'asc' },
        },
        eventTalents: { include: { talent: true } },
        eventPrograms: { include: { program: true } },
      },
    });
  }

  const existingDays = event.eventDays;
  const targetDateStrings = targetDates.map(d => formatDateToYMD(d));

  // 1. Hapus EventDay yang tidak dipilih
  for (const existingDay of existingDays) {
    const existingDateStr = formatDateToYMD(existingDay.date);
    if (!targetDateStrings.includes(existingDateStr)) {
      await prisma.eventDay.delete({
        where: { id: existingDay.id },
      });
    }
  }

  // 2. Buat hari baru jika ada tanggal target yang belum terdaftar
  const remainingDays = await prisma.eventDay.findMany({
    where: { eventId },
  });

  for (let i = 0; i < targetDates.length; i++) {
    const targetDate = targetDates[i];
    const targetDateStr = formatDateToYMD(targetDate);
    const found = remainingDays.find(d => formatDateToYMD(d.date) === targetDateStr);

    if (!found) {
      const maxDayNum = remainingDays.reduce((max, d) => Math.max(max, d.dayNumber), 0);
      const newDay = await prisma.eventDay.create({
        data: {
          eventId,
          dayNumber: maxDayNum + i + 1,
          date: targetDate,
        },
      });
      remainingDays.push(newDay);
    }
  }

  // 3. Urutkan semua hari yang ada secara kronologis & beri nomor hari berurutan (H1, H2, H3...)
  const allDaysSorted = await prisma.eventDay.findMany({
    where: { eventId },
    orderBy: { date: 'asc' },
  });

  // Gunakan offset sementara untuk mencegah collision @@unique([eventId, dayNumber])
  for (let i = 0; i < allDaysSorted.length; i++) {
    await prisma.eventDay.update({
      where: { id: allDaysSorted[i].id },
      data: { dayNumber: 10000 + i },
    });
  }

  for (let i = 0; i < allDaysSorted.length; i++) {
    await prisma.eventDay.update({
      where: { id: allDaysSorted[i].id },
      data: { dayNumber: i + 1 },
    });
  }

  return prisma.event.findUnique({
    where: { id: eventId },
    include: {
      eventDays: {
        include: { rundownItems: true },
        orderBy: { dayNumber: 'asc' },
      },
      eventTalents: { include: { talent: true } },
      eventPrograms: { include: { program: true } },
    },
  });
}

/**
 * Update data event. Jika isActive di-set true, panggil activeEventGuard.
 */
export async function updateEvent(id: number, data: UpdateEventInput) {
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) {
    throw createHttpError(404, 'Event tidak ditemukan.');
  }

  // Jika mengaktifkan event ini, non-aktifkan event lain
  if (data.isActive === true) {
    await activeEventGuard(id);
  }

  let isForceDraftUpdate: boolean | undefined = undefined;
  if (data.isActive === false) {
    isForceDraftUpdate = true;
  } else if (data.isActive === true) {
    isForceDraftUpdate = false;
  }

  await prisma.event.update({
    where: { id },
    data: {
      name: data.name,
      theme: data.theme,
      description: data.description,
      startDate: data.startDate ? parseYMDToUTCDate(data.startDate) : undefined,
      endDate: data.endDate ? parseYMDToUTCDate(data.endDate) : undefined,
      location: data.location,
      heroMode: data.heroMode,
      googleDriveUrl: data.googleDriveUrl,
      isActive: data.isActive,
      ...(isForceDraftUpdate !== undefined && { isForceDraft: isForceDraftUpdate }),
    },
  });

  // Jika tanggal atau hari kustom diubah, sinkronkan hari event secara otomatis
  if (data.startDate || data.endDate || data.selectedDates !== undefined) {
    await syncEventDays(id, data.selectedDates);
  }

  return prisma.event.findUnique({
    where: { id },
    include: {
      eventDays: {
        include: { rundownItems: true },
        orderBy: { dayNumber: 'asc' },
      },
      eventTalents: {
        include: { talent: true },
        orderBy: { role: 'asc' },
      },
      eventPrograms: {
        include: { program: true },
      },
      galleryPhotos: true,
    },
  });
}

/**
 * Upload poster event (single-version image processing).
 */
export async function uploadEventPoster(id: number, fileBuffer: Buffer) {
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) {
    throw createHttpError(404, 'Event tidak ditemukan.');
  }

  // Hapus poster lama jika ada
  if (event.posterImageUrl) {
    await deleteImageFile(event.posterImageUrl);
  }

  const result = await processAndSaveImage(fileBuffer, 'events/posters', {
    generateThumb: false,
    fullMaxWidth: 1200,
  });

  return prisma.event.update({
    where: { id },
    data: { posterImageUrl: result.url },
  });
}

/**
 * Upload hero image event (single-version image processing).
 */
export async function uploadEventHero(id: number, fileBuffer: Buffer) {
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) {
    throw createHttpError(404, 'Event tidak ditemukan.');
  }

  if (event.heroImageUrl) {
    await deleteImageFile(event.heroImageUrl);
  }

  const result = await processAndSaveImage(fileBuffer, 'events/heroes', {
    generateThumb: false,
    fullMaxWidth: 1920,
  });

  return prisma.event.update({
    where: { id },
    data: { heroImageUrl: result.url },
  });
}

/**
 * Hapus event dan semua relasinya (cascade di Prisma).
 * Juga hapus file gambar terkait dari disk.
 */
export async function deleteEvent(id: number) {
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      galleryPhotos: true,
    },
  });

  if (!event) {
    throw createHttpError(404, 'Event tidak ditemukan.');
  }

  // Hapus file gambar dari disk
  if (event.posterImageUrl) await deleteImageFile(event.posterImageUrl);
  if (event.heroImageUrl) await deleteImageFile(event.heroImageUrl);
  for (const photo of event.galleryPhotos) {
    await deleteImageFile(photo.imageUrlFull);
    await deleteImageFile(photo.imageUrlThumb);
  }

  // Hapus dari DB (cascade menangani relasi anak)
  await prisma.event.delete({ where: { id } });
}
