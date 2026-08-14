import { Router } from 'express';
import { requireAuth } from '../middlewares/auth';
import * as faqController from '../controllers/faqController';

const router = Router();

router.get('/', faqController.getPolicies);
router.post('/', requireAuth, faqController.createPolicy);
router.put('/reorder', requireAuth, faqController.reorderPolicies);
router.put('/:id', requireAuth, faqController.updatePolicy);
router.delete('/:id', requireAuth, faqController.deletePolicy);

export default router;
