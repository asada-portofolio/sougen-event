import { prisma } from '../utils/prisma';
import { slugify } from '../utils/slugify';
import { createHttpError } from '../middlewares/errorHandler';
import { processAndSaveImage, deleteImageFile } from '../utils/imageProcessor';
import { TalentRole } from '../generated/prisma/client';

// ── Types ──

interface CreateTalentInput {
  stageName: string;
  tag?: string;
  instagramUrl?: string;
  followerCount?: number;
  postCount?: number;
  bio?: string;
}

interface UpdateTalentInput {
  stageName?: string;
  tag?: string;
  instagramUrl?: string;
  followerCount?: number;
  postCount?: number;
  bio?: string;
}

interface LinkTalentInput {
  talentId: number;
  role: TalentRole;
  performOrder?: number;
  performTime?: string;
  displayOrder?: number;
}

interface UpdateEventTalentInput {
  role?: TalentRole;
  performOrder?: number;
  performTime?: string;
  displayOrder?: number;
}

// ── Talent CRUD ──

export async function getAllTalents() {
  return prisma.talent.findMany({
    orderBy: { stageName: 'asc' },
    include: {
      eventTalents: {
        select: { eventId: true, role: true },
      },
    },
  });
}

export async function getTalentById(id: number) {
  const talent = await prisma.talent.findUnique({
    where: { id },
    include: {
      eventTalents: {
        include: {
          event: {
            select: { name: true, slug: true, isActive: true },
          },
        },
      },
    },
  });
  if (!talent) throw createHttpError(404, 'Talent tidak ditemukan.');
  return talent;
}

export async function createTalent(data: CreateTalentInput) {
  let slug = slugify(data.stageName);
  const existing = await prisma.talent.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now()}`;

  return prisma.talent.create({
    data: {
      slug,
      stageName: data.stageName,
      tag: data.tag,
      instagramUrl: data.instagramUrl,
      followerCount: data.followerCount,
      postCount: data.postCount,
      bio: data.bio,
    },
  });
}

export async function updateTalent(id: number, data: UpdateTalentInput) {
  const talent = await prisma.talent.findUnique({ where: { id } });
  if (!talent) throw createHttpError(404, 'Talent tidak ditemukan.');

  return prisma.talent.update({
    where: { id },
    data: {
      stageName: data.stageName,
      tag: data.tag,
      instagramUrl: data.instagramUrl,
      followerCount: data.followerCount,
      postCount: data.postCount,
      bio: data.bio,
    },
  });
}

export async function uploadTalentPhoto(id: number, fileBuffer: Buffer) {
  const talent = await prisma.talent.findUnique({ where: { id } });
  if (!talent) throw createHttpError(404, 'Talent tidak ditemukan.');

  if (talent.profileImageUrl) {
    await deleteImageFile(talent.profileImageUrl);
  }

  const result = await processAndSaveImage(fileBuffer, 'talents', {
    generateThumb: false,
    fullMaxWidth: 800,
  });

  return prisma.talent.update({
    where: { id },
    data: { profileImageUrl: result.url },
  });
}

export async function deleteTalent(id: number) {
  const talent = await prisma.talent.findUnique({ where: { id } });
  if (!talent) throw createHttpError(404, 'Talent tidak ditemukan.');

  if (talent.profileImageUrl) await deleteImageFile(talent.profileImageUrl);
  await prisma.talent.delete({ where: { id } });
}

// ── EventTalent (Relasi Event ↔ Talent) ──

export async function linkTalentToEvent(eventId: number, data: LinkTalentInput) {
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) throw createHttpError(404, 'Event tidak ditemukan.');

  const talent = await prisma.talent.findUnique({ where: { id: data.talentId } });
  if (!talent) throw createHttpError(404, 'Talent tidak ditemukan.');

  return prisma.eventTalent.create({
    data: {
      eventId,
      talentId: data.talentId,
      role: data.role,
      performOrder: data.performOrder,
      performTime: data.performTime,
      displayOrder: data.displayOrder ?? 0,
    },
    include: { talent: true },
  });
}

export async function updateEventTalent(id: number, data: UpdateEventTalentInput) {
  const et = await prisma.eventTalent.findUnique({ where: { id } });
  if (!et) throw createHttpError(404, 'EventTalent tidak ditemukan.');

  return prisma.eventTalent.update({
    where: { id },
    data: {
      role: data.role,
      performOrder: data.performOrder,
      performTime: data.performTime,
      displayOrder: data.displayOrder,
    },
  });
}

export async function unlinkTalentFromEvent(id: number) {
  const et = await prisma.eventTalent.findUnique({ where: { id } });
  if (!et) throw createHttpError(404, 'EventTalent tidak ditemukan.');

  await prisma.eventTalent.delete({ where: { id } });
}
