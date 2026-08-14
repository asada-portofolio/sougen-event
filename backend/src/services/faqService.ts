import { prisma } from '../utils/prisma';
import { createHttpError } from '../middlewares/errorHandler';

// ── FAQ ──
export async function getAllFaqs() {
  return prisma.fAQItem.findMany({ orderBy: { displayOrder: 'asc' } });
}

export async function createFaq(data: { question: string; answer: string; displayOrder?: number }) {
  return prisma.fAQItem.create({ data });
}

export async function updateFaq(id: number, data: { question?: string; answer?: string; displayOrder?: number }) {
  const faq = await prisma.fAQItem.findUnique({ where: { id } });
  if (!faq) throw createHttpError(404, 'FAQ tidak ditemukan.');
  return prisma.fAQItem.update({ where: { id }, data });
}

export async function deleteFaq(id: number) {
  const faq = await prisma.fAQItem.findUnique({ where: { id } });
  if (!faq) throw createHttpError(404, 'FAQ tidak ditemukan.');
  await prisma.fAQItem.delete({ where: { id } });
}

export async function reorderFaqs(orderedIds: number[]) {
  const updates = orderedIds.map((id, index) =>
    prisma.fAQItem.update({ where: { id }, data: { displayOrder: index } })
  );
  await prisma.$transaction(updates);
}

// ── PolicyRule ──
export async function getAllPolicies() {
  return prisma.policyRule.findMany({ orderBy: { displayOrder: 'asc' } });
}

export async function createPolicy(data: { ruleText: string; iconName: string; displayOrder?: number }) {
  return prisma.policyRule.create({ data });
}

export async function updatePolicy(id: number, data: { ruleText?: string; iconName?: string; displayOrder?: number }) {
  const policy = await prisma.policyRule.findUnique({ where: { id } });
  if (!policy) throw createHttpError(404, 'Kebijakan tidak ditemukan.');
  return prisma.policyRule.update({ where: { id }, data });
}

export async function deletePolicy(id: number) {
  const policy = await prisma.policyRule.findUnique({ where: { id } });
  if (!policy) throw createHttpError(404, 'Kebijakan tidak ditemukan.');
  await prisma.policyRule.delete({ where: { id } });
}

export async function reorderPolicies(orderedIds: number[]) {
  const updates = orderedIds.map((id, index) =>
    prisma.policyRule.update({ where: { id }, data: { displayOrder: index } })
  );
  await prisma.$transaction(updates);
}

// ── SafetyProcedure ──
export async function getAllSafeties() {
  return prisma.safetyProcedure.findMany({ orderBy: { displayOrder: 'asc' } });
}

export async function createSafety(data: { question: string; answer: string; displayOrder?: number }) {
  return prisma.safetyProcedure.create({ data });
}

export async function updateSafety(id: number, data: { question?: string; answer?: string; displayOrder?: number }) {
  const safety = await prisma.safetyProcedure.findUnique({ where: { id } });
  if (!safety) throw createHttpError(404, 'Prosedur Keamanan tidak ditemukan.');
  return prisma.safetyProcedure.update({ where: { id }, data });
}

export async function deleteSafety(id: number) {
  const safety = await prisma.safetyProcedure.findUnique({ where: { id } });
  if (!safety) throw createHttpError(404, 'Prosedur Keamanan tidak ditemukan.');
  await prisma.safetyProcedure.delete({ where: { id } });
}

export async function reorderSafeties(orderedIds: number[]) {
  const updates = orderedIds.map((id, index) =>
    prisma.safetyProcedure.update({ where: { id }, data: { displayOrder: index } })
  );
  await prisma.$transaction(updates);
}
