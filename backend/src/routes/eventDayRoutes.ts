import { Router } from 'express';
import { requireAuth } from '../middlewares/auth';
import * as eventDayController from '../controllers/eventDayController';

const router = Router();

// ── EventDay ──
router.post('/events/:eventId/days', requireAuth, eventDayController.createDay);
router.put('/event-days/:id', requireAuth, eventDayController.updateDay);
router.delete('/event-days/:id', requireAuth, eventDayController.deleteDay);

// ── RundownItem ──
router.post('/event-days/:dayId/rundown', requireAuth, eventDayController.createRundown);
router.put('/rundown/:id', requireAuth, eventDayController.updateRundown);
router.delete('/rundown/:id', requireAuth, eventDayController.deleteRundown);
router.put('/event-days/:dayId/rundown/reorder', requireAuth, eventDayController.reorderRundown);

export default router;
