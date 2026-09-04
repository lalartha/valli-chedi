/**
 * Collision Engine
 *
 * Detects overlapping activities and generates TIME_COLLISION Vallis.
 * DPR Sections 7.4, 28.
 *
 * Overlap formula:
 *   activityA.start < activityB.end && activityB.start < activityA.end
 */

import * as activityModel from '../models/activityModel.js';
import * as valliEngine from './valliEngine.js';

/**
 * Detect all activities that overlap with the given activity.
 *
 * @param {string} userId
 * @param {Object} activity - The activity to check collisions for
 * @returns {Object} Collision detection result
 */
export async function detect(userId, activity) {
  const startTime = activity.start_time || activity.startTime;
  const endTime = activity.end_time || activity.endTime;

  if (!startTime || !endTime) {
    return { collisions: [], collisionCount: 0, collisionScore: 0 };
  }

  const overlapping = await activityModel.findOverlapping(
    userId, startTime, endTime, activity.id
  );

  const collisionCount = overlapping.length;
  const collisionScore = calculateCollisionScore(collisionCount);

  return {
    collisions: overlapping.map((a) => ({
      id: a.id,
      title: a.title,
      startTime: a.start_time,
      endTime: a.end_time,
    })),
    collisionCount,
    collisionScore,
    message: getCollisionMessage(collisionCount),
  };
}

/**
 * Create TIME_COLLISION Vallis for detected overlaps.
 *
 * @param {string} userId
 * @param {Object} activity - The new activity causing collisions
 * @param {Array} collisions - List of overlapping activities
 * @returns {Array} Created Vallis
 */
export async function createCollisionVallis(userId, activity, collisions) {
  if (!collisions || collisions.length === 0) return [];

  const createdVallis = [];

  // Create one collision Valli per overlapping pair
  for (const collision of collisions) {
    const severity = Math.min(3 + collisions.length, 10);
    const valli = await valliEngine.createValli(userId, {
      activityId: activity.id,
      category: 'TIME_COLLISION',
      title: `Time collision: ${activity.title} ↔ ${collision.title}`,
      description: `Overlapping commitments detected. "${activity.title}" collides with "${collision.title}".`,
      rawScore: severity * 5,
    });
    createdVallis.push(valli);
  }

  return createdVallis;
}

/**
 * Calculate collision score based on number of overlaps.
 * More overlaps → higher score.
 */
function calculateCollisionScore(count) {
  if (count === 0) return 0;
  if (count === 1) return 3;
  if (count === 2) return 6;
  if (count === 3) return 8;
  return 10; // 4+ overlaps
}

/**
 * Get a humorous collision message.
 */
function getCollisionMessage(count) {
  if (count === 0) return 'No collisions detected. Impressive scheduling.';
  if (count === 1) return '⚠️ VALLI COLLISION DETECTED. 1 overlapping commitment.';
  if (count === 2) return '⚠️ DOUBLE COLLISION. 2 overlapping commitments. The chedi notices.';
  if (count === 3) return '🚨 TRIPLE COLLISION. 3 overlapping commitments. This is getting serious.';
  return `💀 CATASTROPHIC COLLISION. ${count} overlapping commitments. You have transcended scheduling.`;
}
