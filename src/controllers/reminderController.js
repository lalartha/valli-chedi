/**
 * Reminder Controller
 *
 * Handles reminder CRUD, check-in confirmation, and stopping.
 */

import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import * as reminderModel from '../models/reminderModel.js';
import * as reminderEngine from '../services/reminderEngine.js';

/**
 * POST /api/reminders
 * Manually create a reminder.
 */
export const createReminder = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { activityId, type, recipient, intervalHours, nextTrigger } = req.body;

  if (!nextTrigger) {
    throw new AppError('nextTrigger is required.', 400);
  }

  const reminder = await reminderModel.create(userId, {
    activityId,
    type: type || 'PARENT_CHECKIN',
    recipient: recipient || 'ACHAN',
    intervalHours: intervalHours || 5,
    nextTrigger,
  });

  res.status(201).json({
    message: 'Reminder created. 📞',
    reminder,
  });
});

/**
 * GET /api/reminders
 * List all reminders for the authenticated user.
 */
export const getReminders = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { active, type } = req.query;

  const reminders = await reminderModel.findAll(userId, {
    active: active !== undefined ? active === 'true' : undefined,
    type,
  });

  res.json({ reminders, count: reminders.length });
});

/**
 * POST /api/reminders/:id/checkin
 * Confirm a check-in — user has called Achan.
 */
export const checkIn = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const reminderId = req.params.id;
  const { completedAt } = req.body;

  const result = await reminderEngine.confirmCheckIn(
    userId,
    reminderId,
    completedAt || new Date().toISOString()
  );

  res.json(result);
});

/**
 * POST /api/reminders/:id/stop
 * Stop a reminder (e.g., user returned home).
 */
export const stopReminder = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const reminderId = req.params.id;
  const { reason } = req.body;

  const result = await reminderEngine.stopReminder(
    userId,
    reminderId,
    reason || 'RETURNED_HOME'
  );

  res.json(result);
});
