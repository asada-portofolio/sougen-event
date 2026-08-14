import { Router } from 'express';
import { requireAuth } from '../middlewares/auth';
import * as faqController from '../controllers/faqController';

const router = Router();

router.get('/', faqController.getFaqs);
router.post('/', requireAuth, faqController.createFaq);
router.put('/reorder', requireAuth, faqController.reorderFaqs);
router.put('/:id', requireAuth, faqController.updateFaq);
router.delete('/:id', requireAuth, faqController.deleteFaq);

export default router;
