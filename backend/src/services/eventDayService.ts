import { prisma } from '../utils/prisma';
import { createHttpError } from '../middlewares/errorHandler';

// ── EventDay ──

interface CreateEventDayInput {
  dayNumber: number;
  date: string;
  locationOverride?: string;
}

interface UpdateEventDayInput {
  dayNumber?: number;
  date?: string;
  locationOverride?: string;
}

export async function createEventDay(eventId: number, data: CreateEventDayInput) {
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) throw createHttpError(404, 'Event tidak ditemukan.');

  return prisma.eventDay.create({
    data: {
      eventId,
      dayNumber: data.dayNumber,
      date: new Date(data.date),
      locationOverride: data.locationOverride,
    },
  });
}

export async function updateEventDay(id: number, data: UpdateEventDayInput) {
  const day = await prisma.eventDay.findUnique({ where: { id } });
  if (!day) throw createHttpError(404, 'EventDay tidak ditemukan.');

  return prisma.eventDay.update({
    where: { id },
    data: {
      dayNumber: data.dayNumber,
      date: data.date ? new Date(data.date) : undefined,
      locationOverride: data.locationOverride,
    },
  });
}

export async function deleteEventDay(id: number) {
  const day = await prisma.eventDay.findUnique({ where: { id } });
  if (!day) throw createHttpError(404, 'EventDay tidak ditemukan.');

  await prisma.eventDay.delete({ where: { id } });
}

// ── RundownItem ──

interface CreateRundownInput {
  time: string;
  activityName: string;
  location?: string;
  displayOrder?: number;
}

interface UpdateRundownInput {
  time?: string;
  activityName?: string;
  location?: string;
  displayOrder?: number;
}

export async function createRundownItem(eventDayId: number, data: CreateRundownInput) {
  const day = await prisma.eventDay.findUnique({ where: { id: eventDayId } });
  if (!day) throw createHttpError(404, 'EventDay tidak ditemukan.');

  return prisma.rundownItem.create({
    data: {
      eventDayId,
      time: data.time,
      activityName: data.activityName,
      location: data.location,
      displayOrder: data.displayOrder ?? 0,
    },
  });
}

export async function updateRundownItem(id: number, data: UpdateRundownInput) {
  const item = await prisma.rundownItem.findUnique({ where: { id } });
  if (!item) throw createHttpError(404, 'RundownItem tidak ditemukan.');

  return prisma.rundownItem.update({
    where: { id },
    data: {
      time: data.time,
      activityName: data.activityName,
      location: data.location,
      displayOrder: data.displayOrder,
    },
  });
}

export async function deleteRundownItem(id: number) {
  const item = await prisma.rundownItem.findUnique({ where: { id } });
  if (!item) throw createHttpError(404, 'RundownItem tidak ditemukan.');

  await prisma.rundownItem.delete({ where: { id } });
}

export async function reorderRundownItems(eventDayId: number, orderedIds: number[]) {
  const day = await prisma.eventDay.findUnique({ where: { id: eventDayId } });
  if (!day) throw createHttpError(404, 'EventDay tidak ditemukan.');

  // Update displayOrder untuk setiap item berdasarkan posisi di array
  const updates = orderedIds.map((id, index) =>
    prisma.rundownItem.update({
      where: { id },
      data: { displayOrder: index },
    }),
  );

  await prisma.$transaction(updates);
}
