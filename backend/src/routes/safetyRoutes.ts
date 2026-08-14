import { Router } from 'express';
import { requireAuth } from '../middlewares/auth';
import * as faqController from '../controllers/faqController';

const router = Router();

router.get('/', faqController.getSafeties);
router.post('/', requireAuth, faqController.createSafety);
router.put('/reorder', requireAuth, faqController.reorderSafeties);
router.put('/:id', requireAuth, faqController.updateSafety);
router.delete('/:id', requireAuth, faqController.deleteSafety);

export default router;
