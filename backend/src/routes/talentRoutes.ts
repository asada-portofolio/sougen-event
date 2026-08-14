import { Router } from 'express';
import { requireAuth } from '../middlewares/auth';
import { uploadSingle } from '../middlewares/upload';
import * as talentController from '../controllers/talentController';

const router = Router();

// ── Talent CRUD ──
router.get('/', talentController.getAll);
router.get('/:id', talentController.getById);
router.post('/', requireAuth, talentController.create);
router.put('/:id', requireAuth, talentController.update);
router.post('/:id/photo', requireAuth, uploadSingle, talentController.uploadPhoto);
router.delete('/:id', requireAuth, talentController.remove);

// ── EventTalent (link/unlink) — dipasang di eventDayRoutes karena path /events/:eventId ──
// Rute ini didaftarkan langsung di index.ts karena pathnya melintasi dua resource

export default router;
