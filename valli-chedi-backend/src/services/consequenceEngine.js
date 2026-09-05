/**
 * Consequence Engine
 *
 * Orchestrates the full consequence pipeline when an activity is created.
 * DPR Section 7.5 and Section 37.
 *
 * Pipeline:
 *   1. Collision Engine → detect overlaps
 *   2. Permission Engine → analyze difficulty
 *   3. Overnight check → detect overnight stays
 *   4. Generate consequence Vallis
 *   5. Create Valli events
 *   6. Growth Engine → add points
 *   7. Reminder Engine → create if needed
 *
 * Returns the complete result for the frontend.
 */

import * as collisionEngine from './collisionEngine.js';
import * as permissionEngine from './permissionEngine.js';
import * as valliEngine from './valliEngine.js';
import * as reminderEngine from './reminderEngine.js';
import * as growthEngine from './growthEngine.js';
import * as homeDebtModel from '../models/homeDebtModel.js';
import { getDistanceLevel, getDistanceScore } from '../utils/distance.js';
import { getNoticeScore } from '../utils/noticePeriod.js';
import { formatConsequenceOutput } from '../utils/consequenceFormatter.js';

/**
 * Analyze an activity and generate all consequences.
 *
 * @param {string} userId
 * @param {Object} activity - The created activity record
 * @param {Object} options
 * @param {string} options.permissionRequestedAt - When permission was requested
 * @returns {Object} Complete consequence result
 */
export async function analyzeActivity(userId, activity, options = {}) {
  const result = {
    activity: {
      id: activity.id,
      title: activity.title,
      overnight: activity.overnight,
    },
    permission: null,
    collisions: null,
    vallisCreated: [],
    reminder: null,
    valliState: null,
  };

  // ── 1. Collision Detection ──────────────────────────────────────────────
  const collisionResult = await collisionEngine.detect(userId, activity);
  result.collisions = collisionResult;

  if (collisionResult.collisionCount > 0) {
    const collisionVallis = await collisionEngine.createCollisionVallis(
      userId, activity, collisionResult.collisions
    );
    result.vallisCreated.push(...collisionVallis);
  }

  // ── 2. Permission Analysis ──────────────────────────────────────────────
  if (options.permissionRequestedAt) {
    const permissionResult = await permissionEngine.analyze(userId, activity, {
      permissionRequestedAt: options.permissionRequestedAt,
    });
    result.permission = permissionResult;

    // Generate PERMISSION Valli if notice was late (score >= 4)
    if (permissionResult.analysis.noticeScore >= 4) {
      const permValli = await valliEngine.createValli(userId, {
        activityId: activity.id,
        category: 'PERMISSION',
        title: `Late permission for "${activity.title}"`,
        description: permissionResult.analysis.noticeMessage,
        rawScore: permissionResult.analysis.noticeScore * 5,
      });
      result.vallisCreated.push(permValli);

      // Generate NOTICE_PERIOD Valli if same day
      if (permissionResult.analysis.noticeDays === 0) {
        const noticeValli = await valliEngine.createValli(userId, {
          activityId: activity.id,
          parentValliId: permValli.id,
          category: 'NOTICE_PERIOD',
          title: 'Same-day notice',
          description: 'Permission requested on the same day. Maximum notice valli.',
          rawScore: 50,
        });
        result.vallisCreated.push(noticeValli);
      }
    }
  }

  // ── 3. Distance/Travel Valli ────────────────────────────────────────────
  const distanceLevel = getDistanceLevel(activity.district, activity.state);
  if (distanceLevel >= 4) {
    // Find the last permission valli to chain from, or null
    const parentValli = result.vallisCreated.find(
      (v) => v.category === 'PERMISSION'
    );

    const travelValli = await valliEngine.createValli(userId, {
      activityId: activity.id,
      parentValliId: parentValli?.id || null,
      category: 'TRAVEL',
      title: `Travel to ${activity.location || activity.district || 'far destination'}`,
      description: `Distance level: ${distanceLevel}/10.`,
      rawScore: getDistanceScore(distanceLevel) * 5,
    });
    result.vallisCreated.push(travelValli);
  }

  // ── 4. Overnight Detection ──────────────────────────────────────────────
  if (activity.overnight) {
    const parentValli = result.vallisCreated.find(
      (v) => v.category === 'TRAVEL'
    ) || result.vallisCreated[result.vallisCreated.length - 1];

    const overnightValli = await valliEngine.createValli(userId, {
      activityId: activity.id,
      parentValliId: parentValli?.id || null,
      category: 'OVERNIGHT',
      title: 'Overnight stay away from home',
      description: 'Multi-night trip detected. Achan protocol will be activated.',
      rawScore: 15,
    });
    result.vallisCreated.push(overnightValli);
  }

  // ── 5. Home Responsibility Check ───────────────────────────────────────
  const pendingDebtCount = await homeDebtModel.countPending(userId);
  if (pendingDebtCount > 0) {
    const parentValli = result.vallisCreated.find(
      (v) => v.category === 'OVERNIGHT'
    ) || result.vallisCreated[result.vallisCreated.length - 1];

    const homeValli = await valliEngine.createValli(userId, {
      activityId: activity.id,
      parentValliId: parentValli?.id || null,
      category: 'HOME',
      title: 'Pending home responsibilities',
      description: `${pendingDebtCount} unresolved household responsibilities while planning activity.`,
      rawScore: Math.min(pendingDebtCount * 5, 40),
    });
    result.vallisCreated.push(homeValli);
  }

  // ── 6. Family Check-In Reminders ───────────────────────────────────────
  if (activity.overnight && !activity.returned_home) {
    const reminders = await reminderEngine.createFamilyReminders(
      userId,
      activity.id,
      activity.start_time
    );
    result.reminder = {
      enabled: true,
      ...reminders,
    };
  }

  // ── 7. Get Updated Valli State ─────────────────────────────────────────
  result.valliState = await growthEngine.getValliState(userId);

  // Return the raw result along with the formatted output for the UI
  return {
    raw: result,
    formatted: formatConsequenceOutput(result, result.valliState)
  };
}

/**
 * Simulate an activity and generate structured consequences without saving to DB.
 * Used for the pre-creation preview popup.
 */
export async function simulateActivity(userId, activity, options = {}) {
  const result = {
    activity: {
      id: 'preview-id',
      title: activity.title,
      overnight: activity.overnight,
      location: activity.location,
      district: activity.district,
      state: activity.state
    },
    permission: null,
    collisions: null,
    vallisCreated: [],
    reminder: null,
    valliState: null,
  };

  // 1. Collision Detection (simulate)
  const collisionResult = await collisionEngine.detect(userId, activity);
  result.collisions = collisionResult;
  if (collisionResult.collisionCount > 0) {
    collisionResult.collisions.forEach(c => {
      result.vallisCreated.push({
        category: 'TIME_COLLISION',
        title: `Collision with ${c.title}`,
        description: `Overlaps with existing activity.`,
        rawScore: 10
      });
    });
  }

  // 2. Permission Analysis
  if (options.permissionRequestedAt) {
    const permissionResult = await permissionEngine.analyze(userId, activity, {
      permissionRequestedAt: options.permissionRequestedAt,
    });
    result.permission = permissionResult;

    if (permissionResult.analysis.noticeScore >= 4) {
      result.vallisCreated.push({
        category: 'PERMISSION',
        title: `Late permission for "${activity.title}"`,
        description: permissionResult.analysis.noticeMessage,
        rawScore: permissionResult.analysis.noticeScore * 5,
      });

      if (permissionResult.analysis.noticeDays === 0) {
        result.vallisCreated.push({
          category: 'NOTICE_PERIOD',
          title: 'Same-day notice',
          description: 'Permission requested on the same day. Maximum notice valli.',
          rawScore: 50,
        });
      }
    }
  }

  // 3. Distance/Travel Valli
  const distanceLevel = getDistanceLevel(activity.district, activity.state);
  if (distanceLevel >= 4) {
    result.vallisCreated.push({
      category: 'TRAVEL',
      title: `Travel to ${activity.location || activity.district || 'far destination'}`,
      description: `Distance level: ${distanceLevel}/10.`,
      rawScore: getDistanceScore(distanceLevel) * 5,
    });
  }

  // 4. Overnight Detection
  if (activity.overnight) {
    result.vallisCreated.push({
      category: 'OVERNIGHT',
      title: 'Overnight stay away from home',
      description: 'Multi-night trip detected. Achan protocol will be activated.',
      rawScore: 15,
    });
  }

  // 5. Home Responsibility Check
  const pendingDebtCount = await homeDebtModel.countPending(userId);
  if (pendingDebtCount > 0) {
    result.vallisCreated.push({
      category: 'HOME',
      title: 'Pending home responsibilities',
      description: `${pendingDebtCount} unresolved household responsibilities while planning activity.`,
      rawScore: Math.min(pendingDebtCount * 5, 40),
    });
  }

  // Fetch real current state to project the new state
  const currentState = await growthEngine.getValliState(userId);
  result.valliState = currentState;

  // Format the output specifically for the new UI
  return formatConsequenceOutput(result, currentState);
}
