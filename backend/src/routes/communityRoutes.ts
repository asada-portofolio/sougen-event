import { Router } from 'express';
import { requireAuth } from '../middlewares/auth';
import { uploadSingle, uploadMultiple } from '../middlewares/upload';
import * as communityController from '../controllers/communityController';

const router = Router();

router.get('/', communityController.getAll);
router.get('/:id', communityController.getById);
router.post('/', requireAuth, communityController.create);
router.put('/:id', requireAuth, communityController.update);
router.post('/:id/logo', requireAuth, uploadSingle, communityController.uploadLogo);
router.delete('/:id', requireAuth, communityController.remove);
router.post('/:id/photos', requireAuth, uploadMultiple, communityController.uploadPhotos);
router.put('/:id/photos/reorder', requireAuth, communityController.reorderPhotos);

export default router;

// DELETE /api/community-photos/:id is registered separately in index.ts
