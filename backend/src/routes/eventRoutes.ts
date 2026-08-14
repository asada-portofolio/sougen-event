import { Router } from 'express';
import { requireAuth } from '../middlewares/auth';
import { uploadSingle } from '../middlewares/upload';
import * as eventController from '../controllers/eventController';

const router = Router();

// ── Public ──
router.get('/', eventController.getAll);
router.get('/active', eventController.getActive);
router.get('/:slug', eventController.getBySlug);

// ── Admin (Auth Required) ──
router.post('/', requireAuth, eventController.create);
router.put('/:id', requireAuth, eventController.update);
router.post('/:id/poster', requireAuth, uploadSingle, eventController.uploadPoster);
router.post('/:id/hero', requireAuth, uploadSingle, eventController.uploadHero);
router.delete('/:id', requireAuth, eventController.remove);

export default router;
