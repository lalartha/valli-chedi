/**
 * Notice Period Engine
 *
 * Calculates the fictional notice period penalty.
 * DPR Section 20.
 *
 * notice_days = required_date - permission_requested_date
 */

/**
 * Calculate number of days between permission request and event.
 * @param {string|Date} requestedAt - When permission was requested
 * @param {string|Date} requiredBy - When the event starts
 * @returns {number} Number of full days of notice (can be 0 or negative)
 */
export function calculateNoticeDays(requestedAt, requiredBy) {
  const requested = new Date(requestedAt);
  const required = new Date(requiredBy);
  const diffMs = required.getTime() - requested.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return Math.max(diffDays, 0);
}

/**
 * Get the fictional notice score from days of notice.
 * DPR Section 20 lookup table.
 *
 * | Notice       | Score |
 * |-------------|-------|
 * | 30+ days    | 0     |
 * | 14–29 days  | 1     |
 * | 7–13 days   | 2     |
 * | 4–6 days    | 4     |
 * | 2–3 days    | 6     |
 * | 1 day       | 8     |
 * | Same day    | 10    |
 *
 * @param {number} days - Number of notice days
 * @returns {number} Notice score (0–10)
 */
export function getNoticeScore(days) {
  if (days >= 30) return 0;
  if (days >= 14) return 1;
  if (days >= 7) return 2;
  if (days >= 4) return 4;
  if (days >= 2) return 6;
  if (days >= 1) return 8;
  return 10; // Same day
}

/**
 * Get a humorous notice message.
 */
export function getNoticeMessage(days) {
  if (days >= 30) return 'Excellent planning. Suspiciously responsible.';
  if (days >= 14) return 'Reasonable notice. Barely any valli here.';
  if (days >= 7) return 'A week\'s notice. Could be worse.';
  if (days >= 4) return 'Getting tight. The chedi stirs.';
  if (days >= 2) return 'Two to three days? Bold choice.';
  if (days >= 1) return 'One day notice. You knew about this earlier. You simply chose not to tell anyone.';
  return 'SAME DAY. You have successfully converted a simple permission request into a Valli.';
}
