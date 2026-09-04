/**
 * Growth Engine
 *
 * Converts Valli points into a frontend-friendly growth state.
 * DPR Sections 16, 17, 33.
 *
 * Growth Levels:
 *   0–50       → Seed       (1)
 *   51–150     → Sprout     (2)
 *   151–300    → Small Vine (3)
 *   301–500    → Growing Chedi (4)
 *   501–750    → Overgrown  (5)
 *   751–1000   → Valli Takeover (6)
 *   1000+      → Uncontained (7)
 */

import { supabaseAdmin } from '../config/supabase.js';
import * as valliModel from '../models/valliModel.js';
import * as reminderModel from '../models/reminderModel.js';
import { AppError } from '../middleware/errorHandler.js';

const GROWTH_TABLE = 'growth_events';
const STATE_TABLE = 'valli_state';

/** Growth level thresholds */
const LEVELS = [
  { min: 0, max: 50, level: 1, status: 'SEED', label: 'Seed 🌱' },
  { min: 51, max: 150, level: 2, status: 'SPROUT', label: 'Sprout 🌿' },
  { min: 151, max: 300, level: 3, status: 'SMALL_VINE', label: 'Small Vine 🌿🌿' },
  { min: 301, max: 500, level: 4, status: 'GROWING_CHEDI', label: 'Growing Chedi 🌿🌿🌿' },
  { min: 501, max: 750, level: 5, status: 'OVERGROWN', label: 'Overgrown ☘️☘️☘️' },
  { min: 751, max: 1000, level: 6, status: 'VALLI_TAKEOVER', label: 'Valli Takeover 🚨🌿' },
  { min: 1001, max: Infinity, level: 7, status: 'UNCONTAINED', label: 'Uncontained 💀🌿💀' },
];

/**
 * Add growth points for a Valli event.
 *
 * @param {string} userId
 * @param {string} valliId
 * @param {number} points
 * @param {string} growthType - e.g., 'PERMISSION_VALLI', 'TRAVEL_VALLI'
 */
export async function addGrowthPoints(userId, valliId, points, growthType) {
  // Insert growth event (append-only)
  const { error } = await supabaseAdmin
    .from(GROWTH_TABLE)
    .insert({
      user_id: userId,
      valli_id: valliId,
      growth_points: points,
      growth_type: growthType,
    });

  if (error) {
    console.error('Failed to insert growth event:', error.message);
  }

  // Update the valli state
  await updateValliState(userId);
}

/**
 * Calculate the growth level from total points.
 */
export function calculateGrowthLevel(totalPoints) {
  for (const level of LEVELS) {
    if (totalPoints >= level.min && totalPoints <= level.max) {
      return level;
    }
  }
  return LEVELS[LEVELS.length - 1];
}

/**
 * Calculate percentage within the current level.
 */
export function calculateGrowthPercentage(totalPoints, levelInfo) {
  if (levelInfo.max === Infinity) return 100;
  const range = levelInfo.max - levelInfo.min;
  const progress = totalPoints - levelInfo.min;
  return Math.min(Math.round((progress / range) * 100), 100);
}

/**
 * Get the full growth status string.
 */
export function getGrowthStatus(level) {
  return level.status;
}

/**
 * Recalculate valli state from scratch (for consistency).
 */
export async function recalculateState(userId) {
  await updateValliState(userId);
}

/**
 * Update (upsert) the valli_state row for a user.
 */
export async function updateValliState(userId) {
  // Sum all growth points
  const { data: growthData, error: growthError } = await supabaseAdmin
    .from(GROWTH_TABLE)
    .select('growth_points')
    .eq('user_id', userId);

  const totalPoints = (growthData || []).reduce((sum, e) => sum + (e.growth_points || 0), 0);

  // Count active and resolved vallis
  const activeVallis = await valliModel.countActive(userId);
  const resolvedVallis = await valliModel.countResolved(userId);

  // Calculate level
  const levelInfo = calculateGrowthLevel(totalPoints);
  const growthPercentage = calculateGrowthPercentage(totalPoints, levelInfo);

  // Upsert valli_state
  const { error } = await supabaseAdmin
    .from(STATE_TABLE)
    .upsert({
      user_id: userId,
      total_points: totalPoints,
      active_vallis: activeVallis,
      resolved_vallis: resolvedVallis,
      growth_level: levelInfo.level,
      growth_percentage: growthPercentage,
      severity: levelInfo.status,
      last_updated: new Date().toISOString(),
    }, { onConflict: 'user_id' });

  if (error) {
    console.error('Failed to update valli state:', error.message);
  }
}

/**
 * Get the current valli state for a user.
 */
export async function getValliState(userId) {
  // Ensure state is up to date
  await updateValliState(userId);

  const { data, error } = await supabaseAdmin
    .from(STATE_TABLE)
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    // Return default state
    return {
      totalPoints: 0,
      activeVallis: 0,
      resolvedVallis: 0,
      growthLevel: 1,
      growthPercentage: 0,
      severity: 'SEED',
      label: 'Seed 🌱',
    };
  }

  const levelInfo = calculateGrowthLevel(data.total_points);

  // Get active reminders count
  const activeReminders = await reminderModel.countActive(userId);

  // Get warnings
  const warnings = await generateWarnings(userId);

  return {
    totalPoints: data.total_points,
    activeVallis: data.active_vallis,
    resolvedVallis: data.resolved_vallis,
    totalVallis: data.active_vallis + data.resolved_vallis,
    growthPoints: data.total_points,
    growthLevel: data.growth_level,
    growthPercentage: data.growth_percentage,
    severity: data.severity,
    label: levelInfo.label,
    activeReminders,
    warnings,
    lastUpdated: data.last_updated,
  };
}

/**
 * Get growth history for a user.
 */
export async function getGrowthHistory(userId, limit = 50) {
  const { data, error } = await supabaseAdmin
    .from(GROWTH_TABLE)
    .select('*')
    .eq('user_id', userId)
    .order('timestamp', { ascending: false })
    .limit(limit);

  if (error) throw new AppError(`Failed to fetch growth history: ${error.message}`, 500);
  return data;
}

/**
 * Generate active warnings for the user's dashboard.
 */
async function generateWarnings(userId) {
  const warnings = [];

  // Check for overdue reminders
  const overdueReminders = await supabaseAdmin
    .from('reminders')
    .select('*')
    .eq('user_id', userId)
    .eq('active', true)
    .lte('next_trigger', new Date().toISOString());

  if (overdueReminders.data && overdueReminders.data.length > 0) {
    warnings.push('Achan check-in pending');
  }

  // Check for active collisions (TIME_COLLISION vallis)
  const collisionVallis = await supabaseAdmin
    .from('vallis')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'ACTIVE')
    .eq('category', 'TIME_COLLISION');

  if (collisionVallis.count && collisionVallis.count > 0) {
    warnings.push(`${collisionVallis.count} responsibilities overlapping`);
  }

  // Check for late permission vallis
  const permissionVallis = await supabaseAdmin
    .from('vallis')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'ACTIVE')
    .eq('category', 'PERMISSION');

  if (permissionVallis.count && permissionVallis.count > 0) {
    warnings.push('Permission requested late');
  }

  return warnings;
}
