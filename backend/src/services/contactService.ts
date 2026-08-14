import { prisma } from '../utils/prisma';
import { createHttpError } from '../middlewares/errorHandler';
import { ChannelType } from '../generated/prisma/client';

// ── ContactChannel ──
export async function getAllChannels() {
  return prisma.contactChannel.findMany({ orderBy: { displayOrder: 'asc' } });
}

export async function createChannel(data: { type: ChannelType; label: string; value: string; url?: string; isEmergencyContact?: boolean; displayOrder?: number }) {
  return prisma.contactChannel.create({ data });
}

export async function updateChannel(id: number, data: { type?: ChannelType; label?: string; value?: string; url?: string; isEmergencyContact?: boolean; displayOrder?: number }) {
  const channel = await prisma.contactChannel.findUnique({ where: { id } });
  if (!channel) throw createHttpError(404, 'Channel tidak ditemukan.');
  return prisma.contactChannel.update({ where: { id }, data });
}

export async function deleteChannel(id: number) {
  const channel = await prisma.contactChannel.findUnique({ where: { id } });
  if (!channel) throw createHttpError(404, 'Channel tidak ditemukan.');
  await prisma.contactChannel.delete({ where: { id } });
}

export async function reorderChannels(orderedIds: number[]) {
  const updates = orderedIds.map((id, index) =>
    prisma.contactChannel.update({ where: { id }, data: { displayOrder: index } })
  );
  await prisma.$transaction(updates);
}

// ── ContactMessage ──
export async function getAllMessages(unreadOnly?: boolean) {
  const where = unreadOnly ? { isRead: false } : undefined;
  return prisma.contactMessage.findMany({ where, orderBy: { createdAt: 'desc' } });
}

export async function createMessage(data: { senderName: string; senderEmail: string; senderPhone?: string; message: string }) {
  return prisma.contactMessage.create({ data });
}

export async function markMessageRead(id: number) {
  const message = await prisma.contactMessage.findUnique({ where: { id } });
  if (!message) throw createHttpError(404, 'Pesan tidak ditemukan.');
  return prisma.contactMessage.update({ where: { id }, data: { isRead: true } });
}

export async function deleteMessage(id: number) {
  const message = await prisma.contactMessage.findUnique({ where: { id } });
  if (!message) throw createHttpError(404, 'Pesan tidak ditemukan.');
  await prisma.contactMessage.delete({ where: { id } });
}
