/**
 * Activity Controller
 *
 * Handles activity CRUD and triggers the Consequence Engine pipeline
 * on activity creation.
 */

import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import * as activityModel from '../models/activityModel.js';
import * as consequenceEngine from '../services/consequenceEngine.js';
import * as reminderModel from '../models/reminderModel.js';

/**
 * POST /api/activities
 * Create an activity and run the full consequence pipeline.
 */
export const createActivity = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const {
    title, category, startTime, endTime,
    location, district, state, overnight,
    returnHomeTime, returnedHome,
    permissionRequestedAt,
  } = req.body;

  if (!title || !startTime) {
    throw new AppError('Title and startTime are required.', 400);
  }

  // Create the activity
  const activity = await activityModel.create(userId, {
    title,
    category,
    startTime,
    endTime,
    location,
    district,
    state,
    overnight,
    returnHomeTime,
    returnedHome,
  });

  // Run the full consequence pipeline
  const consequences = await consequenceEngine.analyzeActivity(userId, activity, {
    permissionRequestedAt,
  });

  res.status(201).json({
    message: 'Activity created. Consequences have been calculated. 🌿',
    ...consequences,
  });
});

/**
 * POST /api/activities/preview
 * Simulate an activity and generate structured consequences without saving to DB.
 */
export const previewActivity = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const {
    title, category, startTime, endTime,
    location, district, state, overnight,
    returnHomeTime, returnedHome,
    permissionRequestedAt,
  } = req.body;

  if (!title || !startTime) {
    throw new AppError('Title and startTime are required for preview.', 400);
  }

  // Create a mock activity object for simulation
  const activity = {
    title,
    category,
    startTime,
    endTime,
    location,
    district,
    state,
    overnight,
    returnHomeTime,
    returnedHome,
  };

  const preview = await consequenceEngine.simulateActivity(userId, activity, {
    permissionRequestedAt,
  });

  res.json({
    message: 'Activity simulated.',
    preview,
  });
});

/**
 * GET /api/activities
 * List all activities for the authenticated user.
 */
export const getActivities = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { category, status, limit, offset } = req.query;

  const activities = await activityModel.findAll(userId, {
    category,
    status,
    limit: limit ? parseInt(limit) : undefined,
    offset: offset ? parseInt(offset) : undefined,
  });

  res.json({ activities, count: activities.length });
});

/**
 * GET /api/activities/:id
 * Get a single activity by ID.
 */
export const getActivity = asyncHandler(async (req, res) => {
  const activity = await activityModel.findById(req.user.id, req.params.id);
  res.json({ activity });
});

/**
 * PUT /api/activities/:id
 * Update an activity. Handles side effects:
 * - If overnight changes to false → deactivate Achan reminders
 * - If returnedHome changes to true → deactivate Achan reminders
 */
export const updateActivity = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const activityId = req.params.id;

  // Get current state for side-effect comparison
  const current = await activityModel.findById(userId, activityId);

  const activity = await activityModel.update(userId, activityId, req.body);

  // Side effects: deactivate reminders if overnight cancelled or user returned home
  const overnightDisabled = current.overnight && req.body.overnight === false;
  const returnedHome = !current.returned_home && req.body.returnedHome === true;

  if (overnightDisabled || returnedHome) {
    await reminderModel.deactivateByActivity(activityId);
  }

  res.json({
    message: 'Activity updated.',
    activity,
    ...(overnightDisabled && { note: 'Overnight cancelled. Achan protocol deactivated.' }),
    ...(returnedHome && { note: 'Welcome home. Achan protocol deactivated. 🏠' }),
  });
});

/**
 * DELETE /api/activities/:id
 * Soft-delete (cancel) an activity and deactivate related reminders.
 */
export const deleteActivity = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const activityId = req.params.id;

  const activity = await activityModel.remove(userId, activityId);

  // Deactivate any related reminders
  await reminderModel.deactivateByActivity(activityId);

  res.json({
    message: 'Activity cancelled. Related reminders deactivated. Vallis remain in history.',
    activity,
  });
});
