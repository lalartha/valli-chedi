/**
 * Valli Engine
 *
 * Core Valli logic — creation, severity, growth points, chains, resolution.
 * All consequence scores are fictional, rule-based comedy mechanics.
 */

import * as valliModel from '../models/valliModel.js';
import {
  normalizeTo10,
  getSeverityLabel,
  getSeverityEmoji,
  calculateGrowthPoints,
  getValliMessage,
} from '../utils/scoring.js';
import * as growthEngine from './growthEngine.js';

/**
 * Create a new Valli with calculated severity and growth points.
 *
 * @param {string} userId
 * @param {Object} data
 * @param {string} data.activityId
 * @param {string} data.parentValliId - For chaining
 * @param {string} data.category - Valli category enum
 * @param {string} data.title
 * @param {string} data.description
 * @param {number} data.rawScore - Raw score before normalization
 * @returns {Object} Created Valli with severity info
 */
export async function createValli(userId, data) {
  const severity = data.severity || normalizeTo10(data.rawScore || 5);
  const growthPoints = data.growthPoints || calculateGrowthPoints(severity, data.category);

  const valli = await valliModel.create(userId, {
    activityId: data.activityId,
    parentValliId: data.parentValliId || null,
    category: data.category,
    title: data.title,
    description: data.description,
    severity,
    growthPoints,
  });

  // Create the initial event
  await valliModel.createEvent(
    valli.id,
    'CREATED',
    data.description || data.title,
    growthPoints
  );

  // Add growth points
  await growthEngine.addGrowthPoints(userId, valli.id, growthPoints, `${data.category}_VALLI`);

  return {
    ...valli,
    severityLabel: getSeverityLabel(severity),
    severityEmoji: getSeverityEmoji(severity),
    message: getValliMessage(severity),
  };
}

/**
 * Resolve a Valli — mark as resolved, keep in history.
 * Growth history remains intact. Valli disappears from active but not from records.
 */
export async function resolveValli(userId, valliId) {
  const valli = await valliModel.findById(userId, valliId);

  if (valli.status === 'RESOLVED') {
    return { ...valli, message: 'This valli is already resolved.' };
  }

  const resolved = await valliModel.update(userId, valliId, {
    status: 'RESOLVED',
    resolvedAt: new Date().toISOString(),
  });

  const pointsToDeduct = valli.growth_points || 0;

  // Log the resolution event
  await valliModel.createEvent(
    valliId,
    'RESOLVED',
    `Valli cancelled/resolved. ${pointsToDeduct} points deducted.`,
    -pointsToDeduct
  );

  // Deduct points from user growth state if points were present
  if (pointsToDeduct > 0) {
    await growthEngine.addGrowthPoints(userId, valliId, -pointsToDeduct, 'VALLI_CANCELLED');
  } else {
    // Recalculate the user's valli state
    await growthEngine.recalculateState(userId);
  }

  return {
    ...resolved,
    deductedPoints: pointsToDeduct,
    message: `Valli cancelled. ${pointsToDeduct} points deducted. The chedi has been pruned. 🌿✂️`,
  };
}

/**
 * Get the full chain for a Valli.
 */
export async function getValliChain(userId, valliId) {
  const chain = await valliModel.findChain(userId, valliId);

  return {
    rootValliId: chain[0]?.id,
    chainLength: chain.length,
    totalGrowthPoints: chain.reduce((sum, v) => sum + (v.growth_points || 0), 0),
    vallis: chain.map((v) => ({
      ...v,
      severityLabel: getSeverityLabel(v.severity),
      severityEmoji: getSeverityEmoji(v.severity),
    })),
  };
}
