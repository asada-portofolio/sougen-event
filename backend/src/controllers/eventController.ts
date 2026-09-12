import { Request, Response, NextFunction } from 'express';
import { z } from 'zod/v4';
import * as eventService from '../services/eventService';

// ── Zod Schemas ──

const createEventSchema = z.object({
  name: z.string().min(1, 'Nama event wajib diisi'),
  theme: z.string().optional(),
  startDate: z.string().min(1, 'Tanggal mulai wajib diisi'),
  endDate: z.string().min(1, 'Tanggal selesai wajib diisi'),
  location: z.string().min(1, 'Lokasi wajib diisi'),
  heroMode: z.enum(['TEMPLATE', 'POSTER']).optional(),
  googleDriveUrl: z.string().optional(),
});

const updateEventSchema = z.object({
  name: z.string().min(1).optional(),
  theme: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  location: z.string().optional(),
  heroMode: z.enum(['TEMPLATE', 'POSTER']).optional(),
  googleDriveUrl: z.string().optional(),
  isActive: z.boolean().optional(),
});

// ── Controllers ──

/** GET /api/events — Semua event (grid arsip) */
export async function getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const events = await eventService.getAllEvents();
    res.json(events);
  } catch (err) {
    next(err);
  }
}

/** GET /api/events/active — Event aktif dengan semua relasi */
export async function getActive(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const event = await eventService.getActiveEvent();
    res.json(event);
  } catch (err) {
    next(err);
  }
}

/** GET /api/events/:slug — Detail satu event */
export async function getBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const event = await eventService.getEventBySlug(req.params.slug as string);
    res.json(event);
  } catch (err) {
    next(err);
  }
}

/** POST /api/events [Auth] — Buat event baru */
export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = createEventSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Data tidak valid.', details: parsed.error.issues });
      return;
    }

    const event = await eventService.createEvent(parsed.data);
    res.status(201).json(event);
  } catch (err) {
    next(err);
  }
}

/** PUT /api/events/:id [Auth] — Update event */
export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'ID event tidak valid.' });
      return;
    }

    const parsed = updateEventSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Data tidak valid.', details: parsed.error.issues });
      return;
    }

    const event = await eventService.updateEvent(id, parsed.data);
    res.json(event);
  } catch (err) {
    next(err);
  }
}

/** POST /api/events/:id/poster [Auth] — Upload poster event */
export async function uploadPoster(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'ID event tidak valid.' });
      return;
    }

    if (!req.file) {
      res.status(400).json({ error: 'File gambar wajib diupload.' });
      return;
    }

    const event = await eventService.uploadEventPoster(id, req.file.buffer);
    res.json(event);
  } catch (err) {
    next(err);
  }
}

/** POST /api/events/:id/hero [Auth] — Upload hero image event */
export async function uploadHero(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'ID event tidak valid.' });
      return;
    }

    if (!req.file) {
      res.status(400).json({ error: 'File gambar wajib diupload.' });
      return;
    }

    const event = await eventService.uploadEventHero(id, req.file.buffer);
    res.json(event);
  } catch (err) {
    next(err);
  }
}

/** DELETE /api/events/:id [Auth] — Hapus event */
export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'ID event tidak valid.' });
      return;
    }

    await eventService.deleteEvent(id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}
