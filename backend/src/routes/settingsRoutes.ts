import { Router } from 'express';
import * as settingsController from '../controllers/settingsController';
import { requireAuth } from '../middlewares/auth';
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', settingsController.getSettings);
router.put('/', requireAuth, settingsController.updateSettings);

router.post(
  '/hero',
  requireAuth,
  upload.single('image'),
  settingsController.uploadHeroImage
);

export default router;
