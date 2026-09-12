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
  startDate: string;
  endDate: string;
  location: string;
  heroMode?: HeroMode;
  googleDriveUrl?: string;
}

interface UpdateEventInput {
  name?: string;
  theme?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  heroMode?: HeroMode;
  googleDriveUrl?: string;
  isActive?: boolean;
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
      startDate: true,
      endDate: true,
      location: true,
      posterImageUrl: true,
      isActive: true,
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
    },
  });
}

/**
 * Ambil detail lengkap satu event berdasarkan slug.
 */
export async function getEventBySlug(slug: string) {
  const event = await prisma.event.findUnique({
    where: { slug },
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

/**
 * Buat event baru. Auto-generate slug dari nama.
 */
export async function createEvent(data: CreateEventInput) {
  let slug = slugify(data.name);

  // Pastikan slug unik — tambahkan suffix angka jika duplikat
  const existing = await prisma.event.findUnique({ where: { slug } });
  if (existing) {
    slug = `${slug}-${Date.now()}`;
  }

  const event = await prisma.event.create({
    data: {
      slug,
      name: data.name,
      theme: data.theme,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      location: data.location,
      heroMode: data.heroMode ?? 'TEMPLATE',
      googleDriveUrl: data.googleDriveUrl,
    },
  });

  // Auto-generate EventDays
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  
  // Normalize dates to midnight to avoid time zone issues when calculating difference
  const startNormalized = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const endNormalized = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  
  const daysDifference = Math.floor((endNormalized.getTime() - startNormalized.getTime()) / (1000 * 3600 * 24));
  
  if (daysDifference >= 0) {
    const eventDays = [];
    for (let i = 0; i <= daysDifference; i++) {
      const currentDay = new Date(startNormalized);
      currentDay.setDate(currentDay.getDate() + i);
      
      eventDays.push({
        eventId: event.id,
        dayNumber: i + 1,
        date: currentDay,
      });
    }
    
    if (eventDays.length > 0) {
      await prisma.eventDay.createMany({
        data: eventDays,
      });
    }
  }
  
  return event;
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

  return prisma.event.update({
    where: { id },
    data: {
      name: data.name,
      theme: data.theme,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate: data.endDate ? new Date(data.endDate) : undefined,
      location: data.location,
      heroMode: data.heroMode,
      googleDriveUrl: data.googleDriveUrl,
      isActive: data.isActive,
      ...(isForceDraftUpdate !== undefined && { isForceDraft: isForceDraftUpdate }),
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
