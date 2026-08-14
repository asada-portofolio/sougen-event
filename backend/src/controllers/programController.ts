import { Request, Response, NextFunction } from 'express';
import { z } from 'zod/v4';
import * as programService from '../services/programService';

const createSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  rulesHtml: z.string().optional(),
});

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  rulesHtml: z.string().optional(),
});

const linkSchema = z.object({
  programId: z.number().int(),
  displayOrder: z.number().int().optional(),
});

const reorderSchema = z.object({ orderedIds: z.array(z.number().int()) });

const updateEventProgramSchema = z.object({
  registrationUrl: z.string().optional().nullable(),
});

export async function getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try { res.json(await programService.getAllPrograms()); } catch (err) { next(err); }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) { res.status(400).json({ error: 'ID tidak valid.' }); return; }
    res.json(await programService.getProgramById(id));
  } catch (err) { next(err); }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: 'Data tidak valid.', details: parsed.error.issues }); return; }
    res.status(201).json(await programService.createProgram(parsed.data));
  } catch (err) { next(err); }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) { res.status(400).json({ error: 'ID tidak valid.' }); return; }
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: 'Data tidak valid.', details: parsed.error.issues }); return; }
    res.json(await programService.updateProgram(id, parsed.data));
  } catch (err) { next(err); }
}

export async function uploadCover(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) { res.status(400).json({ error: 'ID tidak valid.' }); return; }
    if (!req.file) { res.status(400).json({ error: 'File gambar wajib diupload.' }); return; }
    res.json(await programService.uploadProgramCover(id, req.file.buffer));
  } catch (err) { next(err); }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) { res.status(400).json({ error: 'ID tidak valid.' }); return; }
    await programService.deleteProgram(id);
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
    res.status(201).json(await programService.uploadProgramPhotos(id, buffers));
  } catch (err) { next(err); }
}

export async function reorderPhotos(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) { res.status(400).json({ error: 'ID tidak valid.' }); return; }
    const parsed = reorderSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: 'Data tidak valid.', details: parsed.error.issues }); return; }
    await programService.reorderProgramPhotos(id, parsed.data.orderedIds);
    res.json({ success: true });
  } catch (err) { next(err); }
}

export async function deletePhoto(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) { res.status(400).json({ error: 'ID tidak valid.' }); return; }
    await programService.deleteProgramPhoto(id);
    res.json({ success: true });
  } catch (err) { next(err); }
}

// ── EventProgram ──
export async function linkToEvent(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const eventId = parseInt(req.params.eventId as string, 10);
    if (isNaN(eventId)) { res.status(400).json({ error: 'ID event tidak valid.' }); return; }
    const parsed = linkSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: 'Data tidak valid.', details: parsed.error.issues }); return; }
    res.status(201).json(await programService.linkProgramToEvent(eventId, parsed.data.programId, parsed.data.displayOrder));
  } catch (err) { next(err); }
}

export async function reorderEventPrograms(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = reorderSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: 'Data tidak valid.', details: parsed.error.issues }); return; }
    await programService.reorderEventPrograms(parsed.data.orderedIds);
    res.json({ success: true });
  } catch (err) { next(err); }
}

export async function updateEventProgram(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) { res.status(400).json({ error: 'ID tidak valid.' }); return; }
    
    const parsed = updateEventProgramSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: 'Data tidak valid.', details: parsed.error.issues }); return; }
    
    res.json(await programService.updateEventProgram(id, parsed.data));
  } catch (err) { next(err); }
}

export async function unlinkFromEvent(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) { res.status(400).json({ error: 'ID tidak valid.' }); return; }
    await programService.unlinkProgramFromEvent(id);
    res.json({ success: true });
  } catch (err) { next(err); }
}
