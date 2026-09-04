/**
 * Permission Model
 * Database access functions for the permissions table.
 */

import { supabaseAdmin } from '../config/supabase.js';
import { AppError } from '../middleware/errorHandler.js';

const TABLE = 'permissions';

/**
 * Create a permission record.
 */
export async function create(userId, data) {
  const { data: permission, error } = await supabaseAdmin
    .from(TABLE)
    .insert({
      activity_id: data.activityId,
      user_id: userId,
      requested_at: data.requestedAt,
      required_by: data.requiredBy,
      destination: data.destination || null,
      district: data.district || null,
      state: data.state || null,
      distance_level: data.distanceLevel || 1,
      notice_days: data.noticeDays || 0,
      notice_score: data.noticeScore || 0,
      difficulty_score: data.difficultyScore || 0,
      status: data.status || 'PENDING',
    })
    .select()
    .single();

  if (error) throw new AppError(`Failed to create permission: ${error.message}`, 400);
  return permission;
}

/**
 * Find permission by activity ID.
 */
export async function findByActivity(userId, activityId) {
  const { data, error } = await supabaseAdmin
    .from(TABLE)
    .select('*')
    .eq('activity_id', activityId)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) throw new AppError('Permission record not found.', 404);
  return data;
}

/**
 * Update permission status.
 */
export async function updateStatus(userId, id, status) {
  const { data, error } = await supabaseAdmin
    .from(TABLE)
    .update({ status })
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw new AppError(`Failed to update permission: ${error.message}`, 400);
  return data;
}
