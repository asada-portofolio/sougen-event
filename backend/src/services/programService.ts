import { prisma } from '../utils/prisma';
import { slugify } from '../utils/slugify';
import { createHttpError } from '../middlewares/errorHandler';
import { processAndSaveImage, deleteImageFile } from '../utils/imageProcessor';

// ── Types ──

interface CreateProgramInput {
  name: string;
  category?: string;
  description?: string;
  rulesHtml?: string;
}

interface UpdateProgramInput {
  name?: string;
  category?: string;
  description?: string;
  rulesHtml?: string;
}

// ── Program CRUD ──

export async function getAllPrograms() {
  return prisma.program.findMany({
    orderBy: { name: 'asc' },
    include: {
      photos: { orderBy: { displayOrder: 'asc' } },
    },
  });
}

export async function getProgramById(id: number) {
  const program = await prisma.program.findUnique({
    where: { id },
    include: {
      photos: { orderBy: { displayOrder: 'asc' } },
    },
  });
  if (!program) throw createHttpError(404, 'Program tidak ditemukan.');
  return program;
}

export async function createProgram(data: CreateProgramInput) {
  let slug = slugify(data.name);
  const existing = await prisma.program.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now()}`;

  return prisma.program.create({
    data: {
      slug,
      name: data.name,
      category: data.category,
      description: data.description,
      rulesHtml: data.rulesHtml,
    },
  });
}

export async function updateProgram(id: number, data: UpdateProgramInput) {
  const program = await prisma.program.findUnique({ where: { id } });
  if (!program) throw createHttpError(404, 'Program tidak ditemukan.');

  let slug: string | undefined;
  if (data.name) {
    slug = slugify(data.name);
    const existing = await prisma.program.findUnique({ where: { slug } });
    if (existing && existing.id !== id) slug = `${slug}-${Date.now()}`;
  }

  return prisma.program.update({
    where: { id },
    data: {
      ...(slug && { slug }),
      ...(data.name !== undefined && { name: data.name }),
      ...(data.category !== undefined && { category: data.category }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.rulesHtml !== undefined && { rulesHtml: data.rulesHtml }),
    },
  });
}

export async function uploadProgramCover(id: number, fileBuffer: Buffer) {
  const program = await prisma.program.findUnique({ where: { id } });
  if (!program) throw createHttpError(404, 'Program tidak ditemukan.');

  if (program.coverImageUrl) await deleteImageFile(program.coverImageUrl);

  const result = await processAndSaveImage(fileBuffer, 'programs/covers', {
    generateThumb: false,
    fullMaxWidth: 1200,
  });

  return prisma.program.update({
    where: { id },
    data: { coverImageUrl: result.url },
  });
}

export async function deleteProgram(id: number) {
  const program = await prisma.program.findUnique({
    where: { id },
    include: { photos: true },
  });
  if (!program) throw createHttpError(404, 'Program tidak ditemukan.');

  if (program.coverImageUrl) await deleteImageFile(program.coverImageUrl);
  for (const photo of program.photos) {
    await deleteImageFile(photo.imageUrlFull);
    await deleteImageFile(photo.imageUrlThumb);
  }

  await prisma.program.delete({ where: { id } });
}

// ── ProgramPhoto ──

export async function uploadProgramPhotos(id: number, fileBuffers: Buffer[]) {
  const program = await prisma.program.findUnique({ where: { id } });
  if (!program) throw createHttpError(404, 'Program tidak ditemukan.');

  const results = [];
  for (const buffer of fileBuffers) {
    const result = await processAndSaveImage(buffer, 'programs/photos', {
      generateThumb: true,
    });
    const photo = await prisma.programPhoto.create({
      data: {
        programId: id,
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

export async function reorderProgramPhotos(id: number, orderedIds: number[]) {
  const program = await prisma.program.findUnique({ where: { id } });
  if (!program) throw createHttpError(404, 'Program tidak ditemukan.');

  const updates = orderedIds.map((photoId, index) =>
    prisma.programPhoto.update({ where: { id: photoId }, data: { displayOrder: index } }),
  );
  await prisma.$transaction(updates);
}

export async function deleteProgramPhoto(id: number) {
  const photo = await prisma.programPhoto.findUnique({ where: { id } });
  if (!photo) throw createHttpError(404, 'Foto tidak ditemukan.');

  await deleteImageFile(photo.imageUrlFull);
  await deleteImageFile(photo.imageUrlThumb);
  await prisma.programPhoto.delete({ where: { id } });
}

// ── EventProgram (Relasi Event ↔ Program) ──

export async function linkProgramToEvent(eventId: number, programId: number, displayOrder = 0) {
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) throw createHttpError(404, 'Event tidak ditemukan.');

  const program = await prisma.program.findUnique({ where: { id: programId } });
  if (!program) throw createHttpError(404, 'Program tidak ditemukan.');

  return prisma.eventProgram.create({
    data: { eventId, programId, displayOrder },
    include: { program: true },
  });
}

export async function reorderEventPrograms(orderedIds: number[]) {
  const updates = orderedIds.map((id, index) =>
    prisma.eventProgram.update({ where: { id }, data: { displayOrder: index } }),
  );
  await prisma.$transaction(updates);
}

export async function updateEventProgram(id: number, data: { registrationUrl?: string | null }) {
  const ep = await prisma.eventProgram.findUnique({ where: { id } });
  if (!ep) throw createHttpError(404, 'EventProgram tidak ditemukan.');

  return prisma.eventProgram.update({
    where: { id },
    data: { registrationUrl: data.registrationUrl },
  });
}

export async function unlinkProgramFromEvent(id: number) {
  const ep = await prisma.eventProgram.findUnique({ where: { id } });
  if (!ep) throw createHttpError(404, 'EventProgram tidak ditemukan.');

  await prisma.eventProgram.delete({ where: { id } });
}
