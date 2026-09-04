/**
 * Growth Controller
 *
 * Handles Valli State and Growth History endpoints.
 * These are the primary endpoints the frontend consumes.
 */

import { asyncHandler } from '../middleware/errorHandler.js';
import * as growthEngine from '../services/growthEngine.js';

/**
 * GET /api/valli-state
 * Get the user's current aggregate Valli state.
 * Primary endpoint for the frontend plant visualization.
 */
export const getValliState = asyncHandler(async (req, res) => {
  const state = await growthEngine.getValliState(req.user.id);

  res.json({
    ...state,
    message: getStateMessage(state.growthLevel),
  });
});

/**
 * GET /api/growth
 * Alias for valli-state with growth-focused response.
 */
export const getGrowth = asyncHandler(async (req, res) => {
  const state = await growthEngine.getValliState(req.user.id);

  res.json({
    growthPoints: state.totalPoints,
    growthLevel: state.growthLevel,
    growthPercentage: state.growthPercentage,
    status: state.severity,
    label: state.label,
  });
});

/**
 * GET /api/growth/history
 * Get the growth event history.
 */
export const getGrowthHistory = asyncHandler(async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 50;
  const history = await growthEngine.getGrowthHistory(req.user.id, limit);

  res.json({
    history,
    count: history.length,
  });
});

/**
 * Get a humorous state message based on growth level.
 */
function getStateMessage(level) {
  const messages = {
    1: '🌱 A tiny seed. The chedi barely exists.',
    2: '🌿 A sprout emerges. The consequences have begun.',
    3: '🌿🌿 A small vine. It\'s growing steadily.',
    4: '🌿🌿🌿 A growing chedi. Multiple branches reaching out.',
    5: '☘️☘️☘️ OVERGROWN. The chedi has taken notice.',
    6: '🚨🌿 VALLI TAKEOVER. The chedi is consuming the dashboard.',
    7: '💀🌿💀 UNCONTAINED. VALLI CHEDI HAS ESCAPED CONTROL.',
  };
  return messages[level] || messages[1];
}
