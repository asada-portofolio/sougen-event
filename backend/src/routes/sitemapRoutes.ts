import { Router } from 'express';
import * as sitemapController from '../controllers/sitemapController';

const router = Router();

router.get('/', sitemapController.getSitemap);

export default router;
