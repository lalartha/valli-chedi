/**
 * Activity Model
 * Database access functions for the activities table.
 */

import { supabaseAdmin } from '../config/supabase.js';
import { AppError } from '../middleware/errorHandler.js';

const TABLE = 'activities';

/**
 * Create a new activity.
 */
export async function create(userId, data) {
  const { data: activity, error } = await supabaseAdmin
    .from(TABLE)
    .insert({
      user_id: userId,
      title: data.title,
      category: data.category || 'OTHER',
      start_time: data.startTime,
      end_time: data.endTime || null,
      location: data.location || null,
      district: data.district || null,
      state: data.state || 'Kerala',
      overnight: data.overnight || false,
      return_home_time: data.returnHomeTime || null,
      returned_home: data.returnedHome || false,
      status: data.status || 'PLANNED',
    })
    .select()
    .single();

  if (error) throw new AppError(`Failed to create activity: ${error.message}`, 400);
  return activity;
}

/**
 * Find all activities for a user with optional filters.
 */
export async function findAll(userId, filters = {}) {
  let query = supabaseAdmin
    .from(TABLE)
    .select('*')
    .eq('user_id', userId)
    .order('start_time', { ascending: false });

  if (filters.category) {
    query = query.eq('category', filters.category);
  }
  if (filters.status) {
    query = query.eq('status', filters.status);
  }
  if (filters.limit) {
    query = query.limit(filters.limit);
  }
  if (filters.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 20) - 1);
  }

  const { data, error } = await query;
  if (error) throw new AppError(`Failed to fetch activities: ${error.message}`, 500);
  return data;
}

/**
 * Find a single activity by ID (scoped to user).
 */
export async function findById(userId, id) {
  const { data, error } = await supabaseAdmin
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (error) throw new AppError('Activity not found.', 404);
  return data;
}

/**
 * Update an activity (partial update).
 */
export async function update(userId, id, data) {
  // Build update object — only include provided fields
  const updateFields = {};
  if (data.title !== undefined) updateFields.title = data.title;
  if (data.category !== undefined) updateFields.category = data.category;
  if (data.startTime !== undefined) updateFields.start_time = data.startTime;
  if (data.endTime !== undefined) updateFields.end_time = data.endTime;
  if (data.location !== undefined) updateFields.location = data.location;
  if (data.district !== undefined) updateFields.district = data.district;
  if (data.state !== undefined) updateFields.state = data.state;
  if (data.overnight !== undefined) updateFields.overnight = data.overnight;
  if (data.returnHomeTime !== undefined) updateFields.return_home_time = data.returnHomeTime;
  if (data.returnedHome !== undefined) updateFields.returned_home = data.returnedHome;
  if (data.status !== undefined) updateFields.status = data.status;

  const { data: activity, error } = await supabaseAdmin
    .from(TABLE)
    .update(updateFields)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw new AppError(`Failed to update activity: ${error.message}`, 400);
  return activity;
}

/**
 * Soft-delete an activity (set status to CANCELLED).
 */
export async function remove(userId, id) {
  const { data, error } = await supabaseAdmin
    .from(TABLE)
    .update({ status: 'CANCELLED' })
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw new AppError(`Failed to delete activity: ${error.message}`, 400);
  return data;
}

/**
 * Find activities that overlap with a given time range.
 * Used by the Collision Engine.
 */
export async function findOverlapping(userId, startTime, endTime, excludeId = null) {
  let query = supabaseAdmin
    .from(TABLE)
    .select('*')
    .eq('user_id', userId)
    .neq('status', 'CANCELLED')
    .lt('start_time', endTime)
    .gt('end_time', startTime);

  if (excludeId) {
    query = query.neq('id', excludeId);
  }

  const { data, error } = await query;
  if (error) throw new AppError(`Failed to check overlapping activities: ${error.message}`, 500);
  return data || [];
}

/**
 * Count recent activities for a user within the last N days.
 */
export async function countRecent(userId, days = 7) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const { count, error } = await supabaseAdmin
    .from(TABLE)
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .neq('status', 'CANCELLED')
    .gte('start_time', since.toISOString());

  if (error) throw new AppError(`Failed to count recent activities: ${error.message}`, 500);
  return count || 0;
}
