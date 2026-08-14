import { Router } from 'express';
import { requireAuth } from '../middlewares/auth';
import * as contactController from '../controllers/contactController';

import { contactRateLimiter } from '../middlewares/rateLimiter';

const router = Router();

// ── Channels ──
router.get('/channels', contactController.getChannels);
router.post('/channels', requireAuth, contactController.createChannel);
router.put('/channels/reorder', requireAuth, contactController.reorderChannels);
router.put('/channels/:id', requireAuth, contactController.updateChannel);
router.delete('/channels/:id', requireAuth, contactController.deleteChannel);

// ── Messages ──
router.post('/messages', contactRateLimiter, contactController.createMessage); // Publik
router.get('/messages', requireAuth, contactController.getMessages);
router.put('/messages/:id/read', requireAuth, contactController.markMessageRead);
router.delete('/messages/:id', requireAuth, contactController.deleteMessage);

export default router;
