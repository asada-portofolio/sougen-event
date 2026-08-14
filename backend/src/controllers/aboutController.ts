import { Request, Response, NextFunction } from 'express';
import { z } from 'zod/v4';
import * as aboutService from '../services/aboutService';

// ── Schemas ──
const aboutContentSchema = z.object({
  storyText: z.string().optional(),
  visionText: z.string().optional(),
  missionList: z.array(z.string()).optional(),
});

const teamMemberSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  displayOrder: z.number().int().optional(),
});
const updateTeamMemberSchema = teamMemberSchema.partial();

const reorderSchema = z.object({ orderedIds: z.array(z.number().int()) });

// ── About Content ──
export async function getContent(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try { res.json(await aboutService.getAboutContent()); } catch (err) { next(err); }
}

export async function updateContent(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = aboutContentSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: 'Data tidak valid.', details: parsed.error.issues }); return; }
    res.json(await aboutService.updateAboutContent(parsed.data));
  } catch (err) { next(err); }
}

export async function uploadStoryImage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.file) { res.status(400).json({ error: 'File gambar wajib diupload.' }); return; }
    res.json(await aboutService.uploadStoryImage(req.file.buffer));
  } catch (err) { next(err); }
}

// ── Team Member ──
export async function getStats(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try { res.json(await aboutService.getAboutStats()); } catch (err) { next(err); }
}

export async function getTeamMembers(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try { res.json(await aboutService.getAllTeamMembers()); } catch (err) { next(err); }
}

export async function createTeamMember(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = teamMemberSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: 'Data tidak valid.', details: parsed.error.issues }); return; }
    res.status(201).json(await aboutService.createTeamMember(parsed.data));
  } catch (err) { next(err); }
}

export async function updateTeamMember(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) { res.status(400).json({ error: 'ID tidak valid.' }); return; }
    const parsed = updateTeamMemberSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: 'Data tidak valid.', details: parsed.error.issues }); return; }
    res.json(await aboutService.updateTeamMember(id, parsed.data));
  } catch (err) { next(err); }
}

export async function uploadTeamMemberPhoto(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) { res.status(400).json({ error: 'ID tidak valid.' }); return; }
    if (!req.file) { res.status(400).json({ error: 'File gambar wajib diupload.' }); return; }
    res.json(await aboutService.uploadTeamMemberPhoto(id, req.file.buffer));
  } catch (err) { next(err); }
}

export async function deleteTeamMember(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) { res.status(400).json({ error: 'ID tidak valid.' }); return; }
    await aboutService.deleteTeamMember(id);
    res.json({ success: true });
  } catch (err) { next(err); }
}

export async function reorderTeamMembers(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = reorderSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: 'Data tidak valid.', details: parsed.error.issues }); return; }
    await aboutService.reorderTeamMembers(parsed.data.orderedIds);
    res.json({ success: true });
  } catch (err) { next(err); }
}
