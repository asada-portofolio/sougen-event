import { Request, Response, NextFunction } from 'express';
import { z } from 'zod/v4';
import * as talentService from '../services/talentService';

const createSchema = z.object({
  stageName: z.string().min(1),
  tag: z.string().optional(),
  instagramUrl: z.string().optional(),
  followerCount: z.number().int().optional(),
  postCount: z.number().int().optional(),
  bio: z.string().optional(),
});

const updateSchema = z.object({
  stageName: z.string().min(1).optional(),
  tag: z.string().optional(),
  instagramUrl: z.string().optional(),
  followerCount: z.number().int().optional(),
  postCount: z.number().int().optional(),
  bio: z.string().optional(),
});


const linkSchema = z.object({
  talentId: z.number().int(),
  role: z.enum(['GUEST', 'PERFORMER']),
  performOrder: z.number().int().optional(),
  performTime: z.string().optional(),
  displayOrder: z.number().int().optional(),
});

const updateEventTalentSchema = z.object({
  role: z.enum(['GUEST', 'PERFORMER']).optional(),
  performOrder: z.number().int().optional(),
  performTime: z.string().optional(),
  displayOrder: z.number().int().optional(),
});

export async function getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try { res.json(await talentService.getAllTalents()); } catch (err) { next(err); }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) { res.status(400).json({ error: 'ID tidak valid.' }); return; }
    res.json(await talentService.getTalentById(id));
  } catch (err) { next(err); }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: 'Data tidak valid.', details: parsed.error.issues }); return; }
    res.status(201).json(await talentService.createTalent(parsed.data));
  } catch (err) { next(err); }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) { res.status(400).json({ error: 'ID tidak valid.' }); return; }
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: 'Data tidak valid.', details: parsed.error.issues }); return; }
    res.json(await talentService.updateTalent(id, parsed.data));
  } catch (err) { next(err); }
}

export async function uploadPhoto(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) { res.status(400).json({ error: 'ID tidak valid.' }); return; }
    if (!req.file) { res.status(400).json({ error: 'File gambar wajib diupload.' }); return; }
    res.json(await talentService.uploadTalentPhoto(id, req.file.buffer));
  } catch (err) { next(err); }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) { res.status(400).json({ error: 'ID tidak valid.' }); return; }
    await talentService.deleteTalent(id);
    res.json({ success: true });
  } catch (err) { next(err); }
}

export async function linkToEvent(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const eventId = parseInt(req.params.eventId as string, 10);
    if (isNaN(eventId)) { res.status(400).json({ error: 'ID event tidak valid.' }); return; }
    const parsed = linkSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: 'Data tidak valid.', details: parsed.error.issues }); return; }
    res.status(201).json(await talentService.linkTalentToEvent(eventId, parsed.data));
  } catch (err) { next(err); }
}

export async function updateEventTalent(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) { res.status(400).json({ error: 'ID tidak valid.' }); return; }
    const parsed = updateEventTalentSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: 'Data tidak valid.', details: parsed.error.issues }); return; }
    res.json(await talentService.updateEventTalent(id, parsed.data));
  } catch (err) { next(err); }
}

export async function unlinkFromEvent(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) { res.status(400).json({ error: 'ID tidak valid.' }); return; }
    await talentService.unlinkTalentFromEvent(id);
    res.json({ success: true });
  } catch (err) { next(err); }
}

