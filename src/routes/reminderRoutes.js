import { Router } from 'express';
import {
  createReminder,
  getReminders,
  checkIn,
  stopReminder,
} from '../controllers/reminderController.js';

const router = Router();

router.post('/', createReminder);
router.get('/', getReminders);
router.post('/:id/checkin', checkIn);
router.post('/:id/stop', stopReminder);

export default router;
