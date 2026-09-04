/**
 * Permission Engine
 *
 * Calculates a fictional permission difficulty using:
 * - Notice period
 * - Destination distance
 * - Overnight status
 * - Recent activities
 * - Pending responsibilities
 *
 * DPR Sections 7.3, 20, 21, 30.
 * This is a comedic simulation, not a real prediction.
 */

import * as permissionModel from '../models/permissionModel.js';
import * as activityModel from '../models/activityModel.js';
import * as homeDebtModel from '../models/homeDebtModel.js';
import { calculateNoticeDays, getNoticeScore, getNoticeMessage } from '../utils/noticePeriod.js';
import { getDistanceLevel, getDistanceScore, getDistanceMessage } from '../utils/distance.js';
import { normalizeTo10 } from '../utils/scoring.js';

/**
 * Analyze permission difficulty for an activity.
 *
 * @param {string} userId
 * @param {Object} activity - The activity record
 * @param {Object} permissionData
 * @param {string} permissionData.requestedAt - When permission was requested
 * @returns {Object} Full permission analysis
 */
export async function analyze(userId, activity, permissionData = {}) {
  const requestedAt = permissionData.requestedAt || permissionData.permissionRequestedAt || new Date().toISOString();
  const requiredBy = activity.start_time || activity.startTime;

  // 1. Notice period
  const noticeDays = calculateNoticeDays(requestedAt, requiredBy);
  const noticeScore = getNoticeScore(noticeDays);

  // 2. Distance
  const distanceLevel = getDistanceLevel(
    activity.district || permissionData.district,
    activity.state || permissionData.state
  );
  const distanceScore = getDistanceScore(distanceLevel);

  // 3. Overnight
  const overnightScore = activity.overnight ? 3 : 0;

  // 4. Recent activities (last 7 days)
  const recentCount = await activityModel.countRecent(userId, 7);
  const recentActivityScore = Math.min(recentCount * 2, 10);

  // 5. Pending home responsibilities
  const pendingDebt = await homeDebtModel.countPending(userId);
  const pendingHomeScore = Math.min(pendingDebt * 2, 10);

  // 6. Calculate total difficulty
  const rawDifficulty = noticeScore + distanceScore + overnightScore
    + recentActivityScore + pendingHomeScore;
  const difficultyScore = normalizeTo10(rawDifficulty, 43); // max possible: 10+10+3+10+10=43

  // Store the permission record
  const permissionRecord = await permissionModel.create(userId, {
    activityId: activity.id,
    requestedAt,
    requiredBy,
    destination: activity.location || permissionData.destination,
    district: activity.district || permissionData.district,
    state: activity.state || permissionData.state,
    distanceLevel,
    noticeDays,
    noticeScore,
    difficultyScore,
    status: 'PENDING',
  });

  // Generate humorous output
  const difficultyLabel = getDifficultyLabel(difficultyScore);
  const recommendedNotice = getRecommendedNotice(distanceLevel, activity.overnight);

  return {
    permission: permissionRecord,
    analysis: {
      noticeDays,
      noticeScore,
      noticeMessage: getNoticeMessage(noticeDays),
      distanceLevel,
      distanceScore,
      distanceMessage: getDistanceMessage(distanceLevel),
      overnightScore,
      recentActivityScore,
      recentActivities: recentCount,
      pendingHomeScore,
      pendingDebts: pendingDebt,
      rawDifficulty,
      difficultyScore,
      difficultyLabel,
      recommendedNotice,
      message: generatePermissionMessage(difficultyScore, noticeDays, recommendedNotice),
    },
  };
}

/**
 * Get difficulty label from score.
 */
function getDifficultyLabel(score) {
  if (score <= 2) return 'EASY';
  if (score <= 4) return 'MODERATE';
  if (score <= 6) return 'DIFFICULT';
  if (score <= 8) return 'VERY_DIFFICULT';
  return 'EXTREME';
}

/**
 * Suggest a recommended notice period based on distance and overnight.
 */
function getRecommendedNotice(distanceLevel, overnight) {
  let days = 1;
  if (distanceLevel >= 8) days = 28;
  else if (distanceLevel >= 6) days = 14;
  else if (distanceLevel >= 4) days = 7;
  else if (distanceLevel >= 2) days = 3;

  if (overnight) days = Math.max(days, 7);

  return days;
}

/**
 * Generate a humorous permission message.
 */
function generatePermissionMessage(difficulty, noticeDays, recommendedNotice) {
  if (difficulty <= 2) {
    return 'This should be straightforward. Minimal valli expected.';
  }
  if (difficulty <= 5) {
    return `Permission difficulty: moderate. You gave ${noticeDays} day(s) notice. Recommended: ${recommendedNotice} days.`;
  }
  if (difficulty <= 8) {
    return `Permission difficulty: HIGH. Recommended notice: ${recommendedNotice} days. Actual notice: ${noticeDays} day(s). The chedi grows.`;
  }
  return `Permission difficulty: EXTREME. Recommended notice: ${recommendedNotice} days. Actual notice: ${noticeDays} day(s). You have successfully converted a simple permission request into a Valli.`;
}
