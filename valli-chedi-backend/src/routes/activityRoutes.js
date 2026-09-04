import { Router } from 'express';
import {
  createActivity,
  getActivities,
  getActivity,
  updateActivity,
  deleteActivity,
} from '../controllers/activityController.js';

const router = Router();

router.post('/', createActivity);
router.get('/', getActivities);
router.get('/:id', getActivity);
router.put('/:id', updateActivity);
router.delete('/:id', deleteActivity);

export default router;
