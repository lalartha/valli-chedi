/**
 * Valli Scoring Engine
 *
 * Deterministic scoring utilities for Valli severity and growth points.
 * All numbers are fictional comedy mechanics.
 *
 * VALLI SCORE = Base + Notice + Distance + Overnight + Collision
 *            + Pending Responsibility + Communication + Recent Activity Multiplier
 */

/**
 * Calculate the total Valli score from individual components.
 * @param {Object} components
 * @param {number} components.base - Base score (default 2)
 * @param {number} components.notice - Notice period penalty (0–10)
 * @param {number} components.distance - Distance penalty (0–10)
 * @param {number} components.overnight - Overnight penalty (0 or 3)
 * @param {number} components.collision - Collision penalty (0–10)
 * @param {number} components.responsibility - Pending home responsibility (0–10)
 * @param {number} components.communication - Communication penalty (0–10)
 * @param {number} components.recentActivity - Recent activity multiplier (0–10)
 * @returns {number} Raw Valli score
 */
export function calculateValliScore(components = {}) {
  const {
    base = 2,
    notice = 0,
    distance = 0,
    overnight = 0,
    collision = 0,
    responsibility = 0,
    communication = 0,
    recentActivity = 0,
  } = components;

  return base + notice + distance + overnight + collision
    + responsibility + communication + recentActivity;
}

/**
 * Normalize a raw score to the 1–10 severity scale.
 * @param {number} rawScore
 * @param {number} maxPossible - Maximum possible raw score (default 50)
 * @returns {number} Normalized score 1–10
 */
export function normalizeTo10(rawScore, maxPossible = 50) {
  if (rawScore <= 0) return 1;
  const normalized = Math.ceil((rawScore / maxPossible) * 10);
  return Math.min(Math.max(normalized, 1), 10);
}

/**
 * Get severity label from a 1–10 score.
 * DPR Section 19.
 */
export function getSeverityLabel(score) {
  if (score <= 2) return 'Harmless';
  if (score <= 4) return 'Mild';
  if (score <= 6) return 'Growing';
  if (score <= 8) return 'Serious';
  if (score === 9) return 'Critical';
  return 'Absolute Valli';
}

/**
 * Get severity emoji from a 1–10 score.
 */
export function getSeverityEmoji(score) {
  if (score <= 2) return '🌱';
  if (score <= 4) return '🌿';
  if (score <= 6) return '☘️';
  if (score <= 8) return '⚠️';
  if (score === 9) return '🚨';
  return '💀';
}

/**
 * Calculate growth points from severity and category.
 * Higher severity → more growth points. Some categories have multipliers.
 */
export function calculateGrowthPoints(severity, category = 'OTHER') {
  const categoryMultipliers = {
    PERMISSION: 1.5,
    TRAVEL: 1.3,
    OVERNIGHT: 1.2,
    TIME_COLLISION: 1.4,
    COMMUNICATION: 1.3,
    NOTICE_PERIOD: 1.5,
    HOME: 1.1,
    RESPONSIBILITY: 1.0,
    COLLEGE: 1.0,
    FAMILY: 1.2,
    PERSONAL: 1.0,
    OTHER: 1.0,
  };

  const multiplier = categoryMultipliers[category] || 1.0;
  return Math.round(severity * multiplier);
}

/**
 * Generate a humorous Valli message based on severity.
 */
export function getValliMessage(severity) {
  if (severity <= 2) return 'Barely a valli. The chedi hasn\'t noticed.';
  if (severity <= 4) return 'A mild valli. The chedi has stirred.';
  if (severity <= 6) return 'The valli is growing. You should probably address this.';
  if (severity <= 8) return 'Serious valli detected. The chedi is aware.';
  if (severity === 9) return '🚨 CRITICAL. The chedi has noticed. Consequences are imminent.';
  return '💀 ABSOLUTE VALLI. The chedi has escaped control. Good luck.';
}
