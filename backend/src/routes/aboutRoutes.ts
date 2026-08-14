import { Router } from 'express';
import { requireAuth } from '../middlewares/auth';
import { uploadSingle } from '../middlewares/upload';
import * as aboutController from '../controllers/aboutController';

const router = Router();

// ── About Content ──
router.get('/content', aboutController.getContent);
router.put('/content', requireAuth, aboutController.updateContent);
router.post('/content/image', requireAuth, uploadSingle, aboutController.uploadStoryImage);

// ── Stats ──
router.get('/stats', aboutController.getStats);

// ── Team Member ──
router.get('/team', aboutController.getTeamMembers);
router.post('/team', requireAuth, aboutController.createTeamMember);
router.put('/team/reorder', requireAuth, aboutController.reorderTeamMembers);
router.put('/team/:id', requireAuth, aboutController.updateTeamMember);
router.post('/team/:id/photo', requireAuth, uploadSingle, aboutController.uploadTeamMemberPhoto);
router.delete('/team/:id', requireAuth, aboutController.deleteTeamMember);

export default router;
