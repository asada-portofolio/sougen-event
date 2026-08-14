import { Request, Response, NextFunction } from 'express';
import { z } from 'zod/v4';
import * as galleryService from '../services/galleryService';

const updateSchema = z.object({
  caption: z.string().optional(),
  isCover: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
});

const reorderSchema = z.object({ orderedIds: z.array(z.number().int()) });

export async function getAlbums(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.json(await galleryService.getAlbums());
  } catch (err) { next(err); }
}

export async function getPhotosByEvent(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const slug = req.params.eventSlug as string;
    const cursor = req.query.cursor ? parseInt(req.query.cursor as string, 10) : undefined;
    res.json(await galleryService.getPhotosByEventSlug(slug, cursor));
  } catch (err) { next(err); }
}

export async function uploadPhotos(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const eventId = parseInt(req.params.eventId as string, 10);
    if (isNaN(eventId)) { res.status(400).json({ error: 'ID event tidak valid.' }); return; }
    
    const files = req.files as Express.Multer.File[] | undefined;
    if (!files || files.length === 0) { res.status(400).json({ error: 'Minimal 1 file gambar wajib diupload.' }); return; }
    
    const buffers = files.map((f) => f.buffer);
    res.status(201).json(await galleryService.uploadGalleryPhotos(eventId, buffers));
  } catch (err) { next(err); }
}

export async function updatePhoto(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) { res.status(400).json({ error: 'ID tidak valid.' }); return; }
    
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: 'Data tidak valid.', details: parsed.error.issues }); return; }
    
    res.json(await galleryService.updateGalleryPhoto(id, parsed.data));
  } catch (err) { next(err); }
}

export async function reorderPhotos(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const eventId = parseInt(req.params.eventId as string, 10);
    if (isNaN(eventId)) { res.status(400).json({ error: 'ID event tidak valid.' }); return; }
    
    const parsed = reorderSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: 'Data tidak valid.', details: parsed.error.issues }); return; }
    
    await galleryService.reorderGalleryPhotos(eventId, parsed.data.orderedIds);
    res.json({ success: true });
  } catch (err) { next(err); }
}

export async function deletePhoto(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) { res.status(400).json({ error: 'ID tidak valid.' }); return; }
    
    await galleryService.deleteGalleryPhoto(id);
    res.json({ success: true });
  } catch (err) { next(err); }
}
