import { Router } from 'express';
import {
  createDebt,
  getDebts,
  resolveDebt,
} from '../controllers/homeDebtController.js';

const router = Router();

router.post('/', createDebt);
router.get('/', getDebts);
router.post('/:id/resolve', resolveDebt);

export default router;
