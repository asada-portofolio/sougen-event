import { Router } from 'express';
import { requireAuth } from '../middlewares/auth';
import { uploadSingle, uploadMultiple } from '../middlewares/upload';
import * as programController from '../controllers/programController';

const router = Router();

router.get('/', programController.getAll);
router.get('/:id', programController.getById);
router.post('/', requireAuth, programController.create);
router.put('/:id', requireAuth, programController.update);
router.post('/:id/cover', requireAuth, uploadSingle, programController.uploadCover);
router.delete('/:id', requireAuth, programController.remove);

router.post('/:id/photos', requireAuth, uploadMultiple, programController.uploadPhotos);
router.put('/:id/photos/reorder', requireAuth, programController.reorderPhotos);

export default router;

// DELETE /api/program-photos/:id is registered in index.ts
// POST /api/events/:eventId/programs is registered in index.ts
// PUT /api/event-programs/reorder is registered in index.ts
// DELETE /api/event-programs/:id is registered in index.ts
