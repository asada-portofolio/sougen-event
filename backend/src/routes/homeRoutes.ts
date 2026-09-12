import { Router } from 'express';
import * as homeController from '../controllers/homeController';

const router = Router();

router.get('/bootstrap', homeController.getHomeBootstrap);

export default router;
