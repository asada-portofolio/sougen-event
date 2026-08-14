import { Request, Response, NextFunction } from 'express';
import { z } from 'zod/v4';
import { ChannelType } from '../generated/prisma/client';
import * as contactService from '../services/contactService';

// ── Schemas ──
const channelSchema = z.object({
  type: z.nativeEnum(ChannelType),
  label: z.string().min(1),
  value: z.string().min(1),
  url: z.string().url().optional().or(z.literal('')),
  isEmergencyContact: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
});
const updateChannelSchema = channelSchema.partial();

const messageSchema = z.object({
  senderName: z.string().min(1),
  senderEmail: z.string().email(),
  senderPhone: z.string().optional(),
  message: z.string().min(1),
});

const reorderSchema = z.object({ orderedIds: z.array(z.number().int()) });

// ── Channels ──
export async function getChannels(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try { res.json(await contactService.getAllChannels()); } catch (err) { next(err); }
}

export async function createChannel(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = channelSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: 'Data tidak valid.', details: parsed.error.issues }); return; }
    res.status(201).json(await contactService.createChannel(parsed.data));
  } catch (err) { next(err); }
}

export async function updateChannel(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) { res.status(400).json({ error: 'ID tidak valid.' }); return; }
    const parsed = updateChannelSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: 'Data tidak valid.', details: parsed.error.issues }); return; }
    res.json(await contactService.updateChannel(id, parsed.data));
  } catch (err) { next(err); }
}

export async function deleteChannel(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) { res.status(400).json({ error: 'ID tidak valid.' }); return; }
    await contactService.deleteChannel(id);
    res.json({ success: true });
  } catch (err) { next(err); }
}

export async function reorderChannels(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = reorderSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: 'Data tidak valid.', details: parsed.error.issues }); return; }
    await contactService.reorderChannels(parsed.data.orderedIds);
    res.json({ success: true });
  } catch (err) { next(err); }
}

// ── Messages ──
export async function getMessages(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const unreadOnly = req.query.unread === 'true';
    res.json(await contactService.getAllMessages(unreadOnly)); 
  } catch (err) { next(err); }
}

export async function createMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // Honeypot check: If the 'website' field is filled out, assume it's a bot and return success silently.
    if (req.body.website) {
      res.status(201).json({ success: true, message: 'Message sent successfully.' });
      return;
    }

    const parsed = messageSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: 'Data tidak valid.', details: parsed.error.issues }); return; }
    res.status(201).json(await contactService.createMessage(parsed.data));
  } catch (err) { next(err); }
}

export async function markMessageRead(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) { res.status(400).json({ error: 'ID tidak valid.' }); return; }
    res.json(await contactService.markMessageRead(id));
  } catch (err) { next(err); }
}

export async function deleteMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) { res.status(400).json({ error: 'ID tidak valid.' }); return; }
    await contactService.deleteMessage(id);
    res.json({ success: true });
  } catch (err) { next(err); }
}
