import { Request, Response, NextFunction } from 'express';
import * as eventService from '../services/eventService';
import * as settingsService from '../services/settingsService';
import * as faqService from '../services/faqService';
import * as contactService from '../services/contactService';
import * as talentService from '../services/talentService';

/**
 * GET /api/home/bootstrap
 * Menggabungkan seluruh data publik beranda dalam 1 kali roundtrip (Single Round-Trip API).
 * Mengurangi overhead latensi koneksi mobile (FCP & TTI).
 */
export async function getHomeBootstrap(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const [activeEvent, settings, faqs, channels] = await Promise.all([
      eventService.getActiveEvent(),
      settingsService.getSettings(),
      faqService.getAllFaqs(),
      contactService.getAllChannels(),
    ]);

    let talents = null;
    if (!activeEvent) {
      talents = await talentService.getAllTalents();
    }

    // Cache header untuk optimasi CDN / Browser caching
    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=120, stale-while-revalidate=300');

    res.json({
      activeEvent,
      settings,
      faqs,
      channels,
      talents,
    });
  } catch (err) {
    next(err);
  }
}
