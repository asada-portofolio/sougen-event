import { Request, Response, NextFunction } from 'express';
import { z } from 'zod/v4';
import * as settingsService from '../services/settingsService';

const updateSettingsSchema = z.object({
  siteTitle: z.string().optional(),
  siteDescription: z.string().optional(),
  footerDescription: z.string().optional(),
  footerCopyright: z.string().optional(),
});

/** GET /api/settings */
export async function getSettings(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const settings = await settingsService.getSettings();
    res.json(settings);
  } catch (err) {
    next(err);
  }
}

/** PUT /api/settings [Auth] */
export async function updateSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = updateSettingsSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Data tidak valid.', details: parsed.error.issues });
      return;
    }

    const updated = await settingsService.updateSettings(parsed.data);
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

/** POST /api/settings/hero [Auth] */
export async function uploadHeroImage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'File hero image wajib diupload.' });
      return;
    }
    const updated = await settingsService.uploadHeroImage(req.file.buffer);
    res.json(updated);
  } catch (err) {
    next(err);
  }
}
