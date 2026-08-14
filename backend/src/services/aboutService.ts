import { prisma } from '../utils/prisma';
import { createHttpError } from '../middlewares/errorHandler';
import { processAndSaveImage, deleteImageFile } from '../utils/imageProcessor';
import { Prisma } from '../generated/prisma/client';

// ── About Content ──
export async function getAboutContent() {
  let content = await prisma.aboutContent.findFirst();
  // Jika belum ada di database, buat data kosong sebagai fallback (walaupun seed.ts harusnya sudah membuat ini)
  if (!content) {
    content = await prisma.aboutContent.create({
      data: {
        storyText: '',
        visionText: '',
        missionList: [],
      }
    });
  }
  return content;
}

export async function updateAboutContent(data: { storyText?: string; visionText?: string; missionList?: any }) {
  const content = await getAboutContent();
  return prisma.aboutContent.update({
    where: { id: content.id },
    data: {
      storyText: data.storyText,
      visionText: data.visionText,
      missionList: data.missionList ? (data.missionList as Prisma.InputJsonValue) : undefined,
    }
  });
}

export async function uploadStoryImage(fileBuffer: Buffer) {
  const content = await getAboutContent();
  
  if (content.storyImageUrl) {
    await deleteImageFile(content.storyImageUrl);
  }
  
  const result = await processAndSaveImage(fileBuffer, 'about', { generateThumb: false });
  
  return prisma.aboutContent.update({
    where: { id: content.id },
    data: { storyImageUrl: result.url }
  });
}

// ── Team Member ──
export async function getAllTeamMembers() {
  return prisma.teamMember.findMany({ orderBy: { displayOrder: 'asc' } });
}

export async function getAboutStats() {
  const [eventCount, talentCount, communityCount] = await Promise.all([
    prisma.event.count(),
    prisma.talent.count(),
    prisma.community.count(),
  ]);

  return {
    events: eventCount,
    talents: talentCount,
    communities: communityCount,
  };
}

export async function createTeamMember(data: { name: string; role: string; displayOrder?: number }) {
  return prisma.teamMember.create({ data });
}

export async function updateTeamMember(id: number, data: { name?: string; role?: string; displayOrder?: number }) {
  const member = await prisma.teamMember.findUnique({ where: { id } });
  if (!member) throw createHttpError(404, 'Anggota tim tidak ditemukan.');
  return prisma.teamMember.update({ where: { id }, data });
}

export async function uploadTeamMemberPhoto(id: number, fileBuffer: Buffer) {
  const member = await prisma.teamMember.findUnique({ where: { id } });
  if (!member) throw createHttpError(404, 'Anggota tim tidak ditemukan.');
  
  if (member.profileImageUrl) {
    await deleteImageFile(member.profileImageUrl);
  }
  
  const result = await processAndSaveImage(fileBuffer, 'team', { generateThumb: false });
  
  return prisma.teamMember.update({
    where: { id },
    data: { profileImageUrl: result.url }
  });
}

export async function deleteTeamMember(id: number) {
  const member = await prisma.teamMember.findUnique({ where: { id } });
  if (!member) throw createHttpError(404, 'Anggota tim tidak ditemukan.');
  
  if (member.profileImageUrl) {
    await deleteImageFile(member.profileImageUrl);
  }
  
  await prisma.teamMember.delete({ where: { id } });
}

export async function reorderTeamMembers(orderedIds: number[]) {
  const updates = orderedIds.map((id, index) =>
    prisma.teamMember.update({ where: { id }, data: { displayOrder: index } })
  );
  await prisma.$transaction(updates);
}
