import { Request, Response, NextFunction } from 'express';
import { z } from 'zod/v4';
import * as faqService from '../services/faqService';

// ── Schemas ──
const faqSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  displayOrder: z.number().int().optional(),
});
const updateFaqSchema = faqSchema.partial();

const policySchema = z.object({
  ruleText: z.string().min(1),
  iconName: z.string().min(1),
  displayOrder: z.number().int().optional(),
});
const updatePolicySchema = policySchema.partial();

const reorderSchema = z.object({ orderedIds: z.array(z.number().int()) });

// ── FAQ ──
export async function getFaqs(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try { res.json(await faqService.getAllFaqs()); } catch (err) { next(err); }
}

export async function createFaq(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = faqSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: 'Data tidak valid.', details: parsed.error.issues }); return; }
    res.status(201).json(await faqService.createFaq(parsed.data));
  } catch (err) { next(err); }
}

export async function updateFaq(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) { res.status(400).json({ error: 'ID tidak valid.' }); return; }
    const parsed = updateFaqSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: 'Data tidak valid.', details: parsed.error.issues }); return; }
    res.json(await faqService.updateFaq(id, parsed.data));
  } catch (err) { next(err); }
}

export async function deleteFaq(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) { res.status(400).json({ error: 'ID tidak valid.' }); return; }
    await faqService.deleteFaq(id);
    res.json({ success: true });
  } catch (err) { next(err); }
}

export async function reorderFaqs(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = reorderSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: 'Data tidak valid.', details: parsed.error.issues }); return; }
    await faqService.reorderFaqs(parsed.data.orderedIds);
    res.json({ success: true });
  } catch (err) { next(err); }
}

// ── PolicyRule ──
export async function getPolicies(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try { res.json(await faqService.getAllPolicies()); } catch (err) { next(err); }
}

export async function createPolicy(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = policySchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: 'Data tidak valid.', details: parsed.error.issues }); return; }
    res.status(201).json(await faqService.createPolicy(parsed.data));
  } catch (err) { next(err); }
}

export async function updatePolicy(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) { res.status(400).json({ error: 'ID tidak valid.' }); return; }
    const parsed = updatePolicySchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: 'Data tidak valid.', details: parsed.error.issues }); return; }
    res.json(await faqService.updatePolicy(id, parsed.data));
  } catch (err) { next(err); }
}

export async function deletePolicy(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) { res.status(400).json({ error: 'ID tidak valid.' }); return; }
    await faqService.deletePolicy(id);
    res.json({ success: true });
  } catch (err) { next(err); }
}

export async function reorderPolicies(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = reorderSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: 'Data tidak valid.', details: parsed.error.issues }); return; }
    await faqService.reorderPolicies(parsed.data.orderedIds);
    res.json({ success: true });
  } catch (err) { next(err); }
}

// ── SafetyProcedure ──
export async function getSafeties(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try { res.json(await faqService.getAllSafeties()); } catch (err) { next(err); }
}

export async function createSafety(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = faqSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: 'Data tidak valid.', details: parsed.error.issues }); return; }
    res.status(201).json(await faqService.createSafety(parsed.data));
  } catch (err) { next(err); }
}

export async function updateSafety(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) { res.status(400).json({ error: 'ID tidak valid.' }); return; }
    const parsed = updateFaqSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: 'Data tidak valid.', details: parsed.error.issues }); return; }
    res.json(await faqService.updateSafety(id, parsed.data));
  } catch (err) { next(err); }
}

export async function deleteSafety(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) { res.status(400).json({ error: 'ID tidak valid.' }); return; }
    await faqService.deleteSafety(id);
    res.json({ success: true });
  } catch (err) { next(err); }
}

export async function reorderSafeties(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = reorderSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: 'Data tidak valid.', details: parsed.error.issues }); return; }
    await faqService.reorderSafeties(parsed.data.orderedIds);
    res.json({ success: true });
  } catch (err) { next(err); }
}
