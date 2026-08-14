import { prisma } from '../utils/prisma';
import { slugify } from '../utils/slugify';
import { createHttpError } from '../middlewares/errorHandler';
import { processAndSaveImage, deleteImageFile } from '../utils/imageProcessor';

// ── Types ──

interface CreateCommunityInput {
  name: string;
  category?: string;
  establishedYear?: number;
  instagramUrl?: string;
  description?: string;
  displayOrder?: number;
}

interface UpdateCommunityInput {
  name?: string;
  category?: string;
  establishedYear?: number;
  instagramUrl?: string;
  description?: string;
  displayOrder?: number;
}

// ── Community CRUD ──

export async function getAllCommunities() {
  return prisma.community.findMany({
    orderBy: { displayOrder: 'asc' },
    include: {
      photos: { orderBy: { displayOrder: 'asc' } },
    },
  });
}

export async function getCommunityById(id: number) {
  const community = await prisma.community.findUnique({
    where: { id },
    include: {
      photos: { orderBy: { displayOrder: 'asc' } },
    },
  });
  if (!community) throw createHttpError(404, 'Komunitas tidak ditemukan.');
  return community;
}

export async function createCommunity(data: CreateCommunityInput) {
  let slug = slugify(data.name);
  const existing = await prisma.community.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now()}`;

  return prisma.community.create({
    data: {
      slug,
      name: data.name,
      category: data.category,
      establishedYear: data.establishedYear,
      instagramUrl: data.instagramUrl,
      description: data.description,
      displayOrder: data.displayOrder ?? 0,
    },
  });
}

export async function updateCommunity(id: number, data: UpdateCommunityInput) {
  const community = await prisma.community.findUnique({ where: { id } });
  if (!community) throw createHttpError(404, 'Komunitas tidak ditemukan.');

  return prisma.community.update({
    where: { id },
    data: {
      name: data.name,
      category: data.category,
      establishedYear: data.establishedYear,
      instagramUrl: data.instagramUrl,
      description: data.description,
      displayOrder: data.displayOrder,
    },
  });
}

export async function uploadCommunityLogo(id: number, fileBuffer: Buffer) {
  const community = await prisma.community.findUnique({ where: { id } });
  if (!community) throw createHttpError(404, 'Komunitas tidak ditemukan.');

  if (community.logoUrl) await deleteImageFile(community.logoUrl);

  const result = await processAndSaveImage(fileBuffer, 'communities/logos', {
    generateThumb: false,
    fullMaxWidth: 400,
  });

  return prisma.community.update({
    where: { id },
    data: { logoUrl: result.url },
  });
}

export async function deleteCommunity(id: number) {
  const community = await prisma.community.findUnique({
    where: { id },
    include: { photos: true },
  });
  if (!community) throw createHttpError(404, 'Komunitas tidak ditemukan.');

  if (community.logoUrl) await deleteImageFile(community.logoUrl);
  for (const photo of community.photos) {
    await deleteImageFile(photo.imageUrlFull);
    await deleteImageFile(photo.imageUrlThumb);
  }

  await prisma.community.delete({ where: { id } });
}

// ── CommunityPhoto (Strip Foto) ──

export async function uploadCommunityPhotos(id: number, fileBuffers: Buffer[]) {
  const community = await prisma.community.findUnique({ where: { id } });
  if (!community) throw createHttpError(404, 'Komunitas tidak ditemukan.');

  const results = [];
  for (const buffer of fileBuffers) {
    const result = await processAndSaveImage(buffer, 'communities/photos', {
      generateThumb: true,
    });

    const photo = await prisma.communityPhoto.create({
      data: {
        communityId: id,
        imageUrlFull: result.urlFull,
        imageUrlThumb: result.urlThumb,
        width: result.width,
        height: result.height,
      },
    });
    results.push(photo);
  }

  return results;
}

export async function reorderCommunityPhotos(id: number, orderedIds: number[]) {
  const community = await prisma.community.findUnique({ where: { id } });
  if (!community) throw createHttpError(404, 'Komunitas tidak ditemukan.');

  const updates = orderedIds.map((photoId, index) =>
    prisma.communityPhoto.update({
      where: { id: photoId },
      data: { displayOrder: index },
    }),
  );

  await prisma.$transaction(updates);
}

export async function deleteCommunityPhoto(id: number) {
  const photo = await prisma.communityPhoto.findUnique({ where: { id } });
  if (!photo) throw createHttpError(404, 'Foto tidak ditemukan.');

  await deleteImageFile(photo.imageUrlFull);
  await deleteImageFile(photo.imageUrlThumb);
  await prisma.communityPhoto.delete({ where: { id } });
}
