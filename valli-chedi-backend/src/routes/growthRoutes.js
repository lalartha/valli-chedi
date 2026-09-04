import { Router } from 'express';
import {
  getValliState,
  getGrowth,
  getGrowthHistory,
} from '../controllers/growthController.js';

const router = Router();

router.get('/valli-state', getValliState);
router.get('/growth', getGrowth);
router.get('/growth/history', getGrowthHistory);

export default router;
