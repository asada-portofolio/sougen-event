import { Router } from 'express';
import { requireAuth } from '../middlewares/auth';
import * as galleryController from '../controllers/galleryController';

const router = Router();

router.get('/', galleryController.getAlbums);
router.get('/:eventSlug', galleryController.getPhotosByEvent);

export default router;

// POST /api/events/:eventId/gallery is registered in index.ts
// PUT /api/gallery-photos/:id is registered in index.ts
// PUT /api/events/:eventId/gallery/reorder is registered in index.ts
// DELETE /api/gallery-photos/:id is registered in index.ts
