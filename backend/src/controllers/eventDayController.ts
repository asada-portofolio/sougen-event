import { Request, Response, NextFunction } from 'express';
import { z } from 'zod/v4';
import * as eventDayService from '../services/eventDayService';

// ── Zod Schemas ──

const createDaySchema = z.object({
  dayNumber: z.number().int().positive(),
  date: z.string().min(1),
  locationOverride: z.string().optional(),
});

const updateDaySchema = z.object({
  dayNumber: z.number().int().positive().optional(),
  date: z.string().optional(),
  locationOverride: z.string().optional(),
});

const createRundownSchema = z.object({
  time: z.string().min(1),
  activityName: z.string().min(1),
  location: z.string().optional(),
  displayOrder: z.number().int().optional(),
});

const updateRundownSchema = z.object({
  time: z.string().optional(),
  activityName: z.string().optional(),
  location: z.string().optional(),
  displayOrder: z.number().int().optional(),
});

const reorderSchema = z.object({
  orderedIds: z.array(z.number().int()),
});

// ── EventDay Controllers ──

export async function createDay(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const eventId = parseInt(req.params.eventId as string, 10);
    if (isNaN(eventId)) { res.status(400).json({ error: 'ID event tidak valid.' }); return; }

    const parsed = createDaySchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: 'Data tidak valid.', details: parsed.error.issues }); return; }

    const day = await eventDayService.createEventDay(eventId, parsed.data);
    res.status(201).json(day);
  } catch (err) { next(err); }
}

export async function updateDay(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) { res.status(400).json({ error: 'ID tidak valid.' }); return; }

    const parsed = updateDaySchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: 'Data tidak valid.', details: parsed.error.issues }); return; }

    const day = await eventDayService.updateEventDay(id, parsed.data);
    res.json(day);
  } catch (err) { next(err); }
}

export async function deleteDay(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) { res.status(400).json({ error: 'ID tidak valid.' }); return; }

    await eventDayService.deleteEventDay(id);
    res.json({ success: true });
  } catch (err) { next(err); }
}

// ── RundownItem Controllers ──

export async function createRundown(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const dayId = parseInt(req.params.dayId as string, 10);
    if (isNaN(dayId)) { res.status(400).json({ error: 'ID hari tidak valid.' }); return; }

    const parsed = createRundownSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: 'Data tidak valid.', details: parsed.error.issues }); return; }

    const item = await eventDayService.createRundownItem(dayId, parsed.data);
    res.status(201).json(item);
  } catch (err) { next(err); }
}

export async function updateRundown(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) { res.status(400).json({ error: 'ID tidak valid.' }); return; }

    const parsed = updateRundownSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: 'Data tidak valid.', details: parsed.error.issues }); return; }

    const item = await eventDayService.updateRundownItem(id, parsed.data);
    res.json(item);
  } catch (err) { next(err); }
}

export async function deleteRundown(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) { res.status(400).json({ error: 'ID tidak valid.' }); return; }

    await eventDayService.deleteRundownItem(id);
    res.json({ success: true });
  } catch (err) { next(err); }
}

export async function reorderRundown(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const dayId = parseInt(req.params.dayId as string, 10);
    if (isNaN(dayId)) { res.status(400).json({ error: 'ID hari tidak valid.' }); return; }

    const parsed = reorderSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: 'Data tidak valid.', details: parsed.error.issues }); return; }

    await eventDayService.reorderRundownItems(dayId, parsed.data.orderedIds);
    res.json({ success: true });
  } catch (err) { next(err); }
}
