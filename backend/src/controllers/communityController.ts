import { Request, Response, NextFunction } from 'express';
import { z } from 'zod/v4';
import * as communityService from '../services/communityService';

const createSchema = z.object({
  name: z.string().min(1),
  category: z.string().optional(),
  establishedYear: z.number().int().optional(),
  instagramUrl: z.string().optional(),
  description: z.string().optional(),
  displayOrder: z.number().int().optional(),
});

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  category: z.string().optional(),
  establishedYear: z.number().int().optional(),
  instagramUrl: z.string().optional(),
  description: z.string().optional(),
  displayOrder: z.number().int().optional(),
});

const reorderSchema = z.object({ orderedIds: z.array(z.number().int()) });

export async function getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try { res.json(await communityService.getAllCommunities()); } catch (err) { next(err); }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) { res.status(400).json({ error: 'ID tidak valid.' }); return; }
    res.json(await communityService.getCommunityById(id));
  } catch (err) { next(err); }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: 'Data tidak valid.', details: parsed.error.issues }); return; }
    res.status(201).json(await communityService.createCommunity(parsed.data));
  } catch (err) { next(err); }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) { res.status(400).json({ error: 'ID tidak valid.' }); return; }
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: 'Data tidak valid.', details: parsed.error.issues }); return; }
    res.json(await communityService.updateCommunity(id, parsed.data));
  } catch (err) { next(err); }
}

export async function uploadLogo(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) { res.status(400).json({ error: 'ID tidak valid.' }); return; }
    if (!req.file) { res.status(400).json({ error: 'File gambar wajib diupload.' }); return; }
    res.json(await communityService.uploadCommunityLogo(id, req.file.buffer));
  } catch (err) { next(err); }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) { res.status(400).json({ error: 'ID tidak valid.' }); return; }
    await communityService.deleteCommunity(id);
    res.json({ success: true });
  } catch (err) { next(err); }
}

export async function uploadPhotos(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) { res.status(400).json({ error: 'ID tidak valid.' }); return; }
    const files = req.files as Express.Multer.File[] | undefined;
    if (!files || files.length === 0) { res.status(400).json({ error: 'Minimal 1 file gambar wajib diupload.' }); return; }
    const buffers = files.map((f) => f.buffer);
    res.status(201).json(await communityService.uploadCommunityPhotos(id, buffers));
  } catch (err) { next(err); }
}

export async function reorderPhotos(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) { res.status(400).json({ error: 'ID tidak valid.' }); return; }
    const parsed = reorderSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: 'Data tidak valid.', details: parsed.error.issues }); return; }
    await communityService.reorderCommunityPhotos(id, parsed.data.orderedIds);
    res.json({ success: true });
  } catch (err) { next(err); }
}

export async function deletePhoto(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) { res.status(400).json({ error: 'ID tidak valid.' }); return; }
    await communityService.deleteCommunityPhoto(id);
    res.json({ success: true });
  } catch (err) { next(err); }
}
