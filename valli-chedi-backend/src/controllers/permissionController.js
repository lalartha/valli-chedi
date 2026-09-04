/**
 * Permission Controller
 *
 * Handles permission analysis and retrieval.
 */

import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import * as permissionEngine from '../services/permissionEngine.js';
import * as permissionModel from '../models/permissionModel.js';
import * as activityModel from '../models/activityModel.js';

/**
 * POST /api/permissions/analyze
 * Analyze permission difficulty for an activity.
 */
export const analyzePermission = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { activityId, requestedAt, destination, district, state } = req.body;

  if (!activityId) {
    throw new AppError('activityId is required.', 400);
  }

  // Get the activity
  const activity = await activityModel.findById(userId, activityId);

  const result = await permissionEngine.analyze(userId, activity, {
    permissionRequestedAt: requestedAt || new Date().toISOString(),
    destination,
    district,
    state,
  });

  res.json({
    message: 'Permission analyzed. 🌿',
    ...result,
  });
});

/**
 * GET /api/permissions/:activityId
 * Get the permission record for an activity.
 */
export const getPermission = asyncHandler(async (req, res) => {
  const permission = await permissionModel.findByActivity(
    req.user.id,
    req.params.activityId
  );
  res.json({ permission });
});
