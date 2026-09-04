/**
 * Home Debt Controller
 *
 * Handles home debt (household responsibility) CRUD and resolution.
 * "A deliberately humorous representation of pending household responsibilities."
 */

import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import * as homeDebtModel from '../models/homeDebtModel.js';

/**
 * POST /api/home-debt
 * Record a new home responsibility debt.
 */
export const createDebt = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { activityId, reason, points } = req.body;

  if (!reason) {
    throw new AppError('Reason is required.', 400);
  }

  const debt = await homeDebtModel.create(userId, {
    activityId,
    reason,
    points: points || 1,
  });

  res.status(201).json({
    message: 'Home debt recorded. The chedi remembers. 🏠',
    debt,
  });
});

/**
 * GET /api/home-debt
 * List all home debts for the authenticated user.
 */
export const getDebts = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { status } = req.query;

  const debts = await homeDebtModel.findAll(userId, { status });
  const pendingCount = await homeDebtModel.countPending(userId);
  const pendingPoints = await homeDebtModel.sumPendingPoints(userId);

  res.json({
    debts,
    count: debts.length,
    pendingCount,
    pendingPoints,
  });
});

/**
 * POST /api/home-debt/:id/resolve
 * Mark a home debt as resolved.
 */
export const resolveDebt = asyncHandler(async (req, res) => {
  const debt = await homeDebtModel.resolve(req.user.id, req.params.id);

  res.json({
    message: 'Home debt resolved. One less branch on the chedi. ✂️',
    debt,
  });
});
