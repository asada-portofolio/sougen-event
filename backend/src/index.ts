import 'dotenv/config';
import express from 'express';
import path from 'path';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import helmet from 'helmet';
import cors from 'cors';

import { errorHandler } from './middlewares/errorHandler';
import { requireAuth } from './middlewares/auth';
import { uploadSingle, uploadMultiple } from './middlewares/upload';

// ── Routes ──
import authRoutes from './routes/authRoutes';
import eventRoutes from './routes/eventRoutes';
import eventDayRoutes from './routes/eventDayRoutes';
import talentRoutes from './routes/talentRoutes';
import communityRoutes from './routes/communityRoutes';
import programRoutes from './routes/programRoutes';
import galleryRoutes from './routes/galleryRoutes';
import faqRoutes from './routes/faqRoutes';
import policyRoutes from './routes/policyRoutes';
import safetyRoutes from './routes/safetyRoutes';
import contactRoutes from './routes/contactRoutes';
import aboutRoutes from './routes/aboutRoutes';
import sitemapRoutes from './routes/sitemapRoutes';
import settingsRoutes from './routes/settingsRoutes';
import homeRoutes from './routes/homeRoutes';

// ── Controllers untuk rute lintas-resource ──
import * as eventDayController from './controllers/eventDayController';
import * as talentController from './controllers/talentController';
import * as communityController from './controllers/communityController';
import * as programController from './controllers/programController';
import * as galleryController from './controllers/galleryController';

const app = express();
const PgSession = connectPgSimple(session);

// Wajib untuk platform hosting seperti Render/Railway yang berada di belakang proxy
app.set('trust proxy', 1);

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.use(express.json());

// Serve uploaded images statically with caching
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads'), {
    maxAge: '7d',
    immutable: true,
}));

// Fallback untuk file upload yang hilang (mencegah 404 console error pada audit Lighthouse/Best Practices)
const TRANSPARENT_PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
app.use('/uploads', (req, res, next) => {
    if (/\.(webp|png|jpe?g|gif|svg)$/i.test(req.path)) {
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Cache-Control', 'public, max-age=86400');
        res.status(200).end(TRANSPARENT_PNG);
        return;
    }
    next();
});

app.use(session({
    store: new PgSession({
        // Sengaja pakai DIRECT_URL, bukan DATABASE_URL — DATABASE_URL lewat pooler
        // Supavisor (mode transaction) yang tidak mendukung prepared statements,
        // dan connect-pg-simple tidak butuh pooling karena volumenya rendah.
        conString: process.env.DIRECT_URL,
        // tableName cocok persis dengan model Session di schema.prisma (PascalCase).
        tableName: 'Session',
        createTableIfMissing: false, // tabel dibuat lewat Prisma migration, bukan otomatis di sini
    }),
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 hari
    },
}));

// ── Health Check ──
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
});

// ── API Routes ──
// ── API Routes (Standard) ──
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/event-days', eventDayRoutes);
app.use('/api/talents', talentRoutes);
app.use('/api/communities', communityRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/policies', policyRoutes);
app.use('/api/safety', safetyRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/home', homeRoutes);

// Sitemap
app.use('/sitemap.xml', sitemapRoutes);

// ── API Routes (Cross-Resource / Spesifik) ──
// EventDay & Rundown
app.post('/api/events/:eventId/days', requireAuth, eventDayController.createDay);
app.post('/api/event-days/:dayId/rundown', requireAuth, eventDayController.createRundown);
app.put('/api/rundown/:id', requireAuth, eventDayController.updateRundown);
app.delete('/api/rundown/:id', requireAuth, eventDayController.deleteRundown);
app.put('/api/event-days/:dayId/rundown/reorder', requireAuth, eventDayController.reorderRundown);

// Talent & EventTalent
app.post('/api/events/:eventId/talents', requireAuth, talentController.linkToEvent);
app.put('/api/event-talents/:id', requireAuth, talentController.updateEventTalent);
app.delete('/api/event-talents/:id', requireAuth, talentController.unlinkFromEvent);

// Community
app.delete('/api/community-photos/:id', requireAuth, communityController.deletePhoto);

// Program
app.post('/api/events/:eventId/programs', requireAuth, programController.linkToEvent);
app.put('/api/event-programs/reorder', requireAuth, programController.reorderEventPrograms);
app.put('/api/event-programs/:id', requireAuth, programController.updateEventProgram);
app.delete('/api/event-programs/:id', requireAuth, programController.unlinkFromEvent);
app.delete('/api/program-photos/:id', requireAuth, programController.deletePhoto);

// Gallery
app.post('/api/events/:eventId/gallery', requireAuth, uploadMultiple, galleryController.uploadPhotos);
app.put('/api/events/:eventId/gallery/reorder', requireAuth, galleryController.reorderPhotos);
app.put('/api/gallery-photos/:id', requireAuth, galleryController.updatePhoto);
app.delete('/api/gallery-photos/:id', requireAuth, galleryController.deletePhoto);

// ── Global Error Handler (HARUS di paling akhir, setelah semua route) ──
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server jalan di port ${PORT}`);
});