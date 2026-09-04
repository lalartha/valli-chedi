import { Router } from 'express';
import {
  createValli,
  getVallis,
  getValli,
  updateValli,
  resolveValli,
  getValliChain,
} from '../controllers/valliController.js';

const router = Router();

router.post('/', createValli);
router.get('/', getVallis);
router.get('/:id', getValli);
router.put('/:id', updateValli);
router.post('/:id/resolve', resolveValli);
router.get('/:id/chain', getValliChain);

export default router;
