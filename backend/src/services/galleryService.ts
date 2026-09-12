import { prisma } from '../utils/prisma';
import { createHttpError } from '../middlewares/errorHandler';
import { processAndSaveImage, deleteImageFile } from '../utils/imageProcessor';

// ── Types ──

interface UpdateGalleryPhotoInput {
  caption?: string;
  isCover?: boolean;
  displayOrder?: number;
}

// ── Gallery Queries ──

/**
 * Mendapatkan semua event yang memiliki minimal 1 foto gallery.
 * Digunakan untuk halaman Tingkat 1 (Grid Album).
 */
export async function getAlbums() {
  return prisma.event.findMany({
    where: {
      galleryPhotos: { some: {} },
    },
    select: {
      id: true,
      slug: true,
      name: true,
      startDate: true,
      endDate: true,
      // Ambil foto yang dijadikan cover (jika tidak ada, fallback ke foto pertama)
      galleryPhotos: {
        orderBy: [
          { isCover: 'desc' },
          { displayOrder: 'asc' }
        ],
        take: 1,
        select: { imageUrlThumb: true },
      },
      _count: {
        select: { galleryPhotos: true }
      }
    },
    orderBy: { startDate: 'desc' },
  });
}

/**
 * Mendapatkan foto gallery dari satu event berdasarkan slug (Tingkat 2).
 * Mendukung pagination (cursor-based).
 */
export async function getPhotosByEventSlug(slug: string, cursor?: number, limit = 20) {
  const event = await prisma.event.findUnique({
    where: { slug },
    select: { 
      id: true, 
      name: true, 
      slug: true,
      theme: true,
      startDate: true,
      endDate: true,
      location: true,
      googleDriveUrl: true,
      _count: {
        select: { galleryPhotos: true }
      }
    },
  });

  if (!event) {
    throw createHttpError(404, 'Event tidak ditemukan.');
  }

  const queryOptions: any = {
    where: { eventId: event.id },
    take: limit + 1, // Ambil 1 data ekstra untuk mengecek apakah ada halaman berikutnya
    orderBy: { displayOrder: 'asc' },
  };

  if (cursor) {
    queryOptions.cursor = { id: cursor };
    queryOptions.skip = 1; // Lewati cursor itu sendiri
  }

  const photos = await prisma.galleryPhoto.findMany(queryOptions);

  let nextCursor: number | null = null;
  if (photos.length > limit) {
    const nextItem = photos.pop();
    nextCursor = nextItem!.id;
  }

  return {
    event,
    photos,
    nextCursor,
  };
}

// ── Gallery Mutations (Admin) ──

/**
 * Multi-upload foto ke sebuah event.
 */
export async function uploadGalleryPhotos(eventId: number, fileBuffers: Buffer[]) {
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) throw createHttpError(404, 'Event tidak ditemukan.');

  const results = [];
  for (const buffer of fileBuffers) {
    const result = await processAndSaveImage(buffer, 'events/gallery', {
      generateThumb: true,
    });

    const photo = await prisma.galleryPhoto.create({
      data: {
        eventId,
        imageUrlFull: result.urlFull,
        imageUrlThumb: result.urlThumb,
        width: result.width,
        height: result.height,
        isCover: false, // Default bukan cover
      },
    });
    results.push(photo);
  }

  return results;
}

/**
 * Update metadata foto (caption, isCover, urutan).
 * Jika isCover di-set true, foto lain di event tersebut akan di-set isCover = false.
 */
export async function updateGalleryPhoto(id: number, data: UpdateGalleryPhotoInput) {
  const photo = await prisma.galleryPhoto.findUnique({ where: { id } });
  if (!photo) throw createHttpError(404, 'Foto tidak ditemukan.');

  // Jika dijadikan cover, hilangkan status cover dari foto-foto lain di event yang sama
  if (data.isCover === true) {
    await prisma.galleryPhoto.updateMany({
      where: {
        eventId: photo.eventId,
        id: { not: id },
      },
      data: { isCover: false },
    });
  }

  return prisma.galleryPhoto.update({
    where: { id },
    data: {
      caption: data.caption,
      isCover: data.isCover,
      displayOrder: data.displayOrder,
    },
  });
}

/**
 * Update urutan (displayOrder) secara massal.
 */
export async function reorderGalleryPhotos(eventId: number, orderedIds: number[]) {
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) throw createHttpError(404, 'Event tidak ditemukan.');

  const updates = orderedIds.map((photoId, index) =>
    prisma.galleryPhoto.update({
      where: { id: photoId },
      data: { displayOrder: index },
    })
  );

  await prisma.$transaction(updates);
}

/**
 * Hapus sebuah foto gallery beserta file-nya dari disk.
 */
export async function deleteGalleryPhoto(id: number) {
  const photo = await prisma.galleryPhoto.findUnique({ where: { id } });
  if (!photo) throw createHttpError(404, 'Foto tidak ditemukan.');

  await deleteImageFile(photo.imageUrlFull);
  await deleteImageFile(photo.imageUrlThumb);
  await prisma.galleryPhoto.delete({ where: { id } });
}
