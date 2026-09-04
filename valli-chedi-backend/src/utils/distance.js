/**
 * Distance Valli Engine
 *
 * Fictional distance category system.
 * DPR Section 21.
 *
 * LEVEL 1  → Same college
 * LEVEL 2  → Same district
 * LEVEL 3  → Nearby district
 * LEVEL 4  → Other Kerala district
 * LEVEL 5  → Far Kerala district
 * LEVEL 6  → Northern Kerala
 * LEVEL 7  → Very far destination
 * LEVEL 8  → Outside Kerala
 * LEVEL 9  → Another state
 * LEVEL 10 → Extremely far / international
 */

/**
 * Kerala districts with their fictional distance level relative to Kollam
 * (assumed home base — can be customized).
 */
const DISTRICT_LEVELS = {
  // Home district
  'kollam': 1,

  // Nearby districts
  'thiruvananthapuram': 2,
  'pathanamthitta': 2,
  'alappuzha': 3,

  // Mid-range districts
  'kottayam': 3,
  'idukki': 4,
  'ernakulam': 4,

  // Far districts
  'thrissur': 5,
  'palakkad': 5,
  'malappuram': 6,

  // Northern Kerala
  'kozhikode': 6,
  'wayanad': 7,
  'kannur': 7,
  'kasaragod': 7,
};

/**
 * State-level overrides for out-of-Kerala destinations.
 */
const STATE_LEVELS = {
  'kerala': null, // Use district lookup
  'tamil nadu': 8,
  'karnataka': 9,
  'andhra pradesh': 8,
  'telangana': 8,
  'goa': 9,
  'maharashtra': 9,
  'delhi': 10,
  'uttar pradesh': 10,
  'west bengal': 10,
  'rajasthan': 10,
  'gujarat': 10,
};

/**
 * Get the fictional distance level for a destination.
 *
 * @param {string} district - District name (e.g., "Kozhikode")
 * @param {string} state - State name (e.g., "Kerala")
 * @returns {number} Distance level 1–10
 */
export function getDistanceLevel(district, state) {
  const normalizedState = (state || '').toLowerCase().trim();
  const normalizedDistrict = (district || '').toLowerCase().trim();

  // If state is specified and not Kerala, use state-level mapping
  if (normalizedState && normalizedState !== 'kerala') {
    return STATE_LEVELS[normalizedState] || 9; // Default out-of-Kerala to 9
  }

  // Kerala district lookup
  if (normalizedDistrict && DISTRICT_LEVELS[normalizedDistrict] !== undefined) {
    return DISTRICT_LEVELS[normalizedDistrict];
  }

  // Fallback — unknown destination
  return 5;
}

/**
 * Convert distance level to a Valli score contribution.
 * Levels 1–3 add minimal points; levels 7–10 add significant points.
 *
 * @param {number} level - Distance level 1–10
 * @returns {number} Score contribution
 */
export function getDistanceScore(level) {
  const scores = {
    1: 0,
    2: 1,
    3: 2,
    4: 3,
    5: 4,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
  };
  return scores[level] || 5;
}

/**
 * Get a humorous distance message.
 */
export function getDistanceMessage(level) {
  if (level <= 1) return 'Same area. Almost no distance valli.';
  if (level <= 3) return 'Nearby. Manageable distance.';
  if (level <= 5) return 'Moderate distance. The chedi notices.';
  if (level <= 7) return 'Far destination. This is getting serious.';
  if (level <= 9) return 'Another state. The chedi is fully alert.';
  return 'Extremely far. International-level valli detected.';
}
