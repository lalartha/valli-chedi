import { Router } from 'express';
import {
  analyzePermission,
  getPermission,
} from '../controllers/permissionController.js';

const router = Router();

router.post('/analyze', analyzePermission);
router.get('/:activityId', getPermission);

export default router;
