/**
 * Reminder Model
 * Database access functions for the reminders table.
 */

import { supabaseAdmin } from '../config/supabase.js';
import { AppError } from '../middleware/errorHandler.js';

const TABLE = 'reminders';

/**
 * Create a new reminder.
 */
export async function create(userId, data) {
  const { data: reminder, error } = await supabaseAdmin
    .from(TABLE)
    .insert({
      user_id: userId,
      activity_id: data.activityId || null,
      type: data.type || 'PARENT_CHECKIN',
      recipient: data.recipient || 'ACHAN',
      interval_hours: data.intervalHours || 5,
      next_trigger: data.nextTrigger,
      active: true,
    })
    .select()
    .single();

  if (error) throw new AppError(`Failed to create reminder: ${error.message}`, 400);
  return reminder;
}

/**
 * Find all reminders for a user.
 */
export async function findAll(userId, filters = {}) {
  let query = supabaseAdmin
    .from(TABLE)
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (filters.active !== undefined) {
    query = query.eq('active', filters.active);
  }
  if (filters.type) {
    query = query.eq('type', filters.type);
  }

  const { data, error } = await query;
  if (error) throw new AppError(`Failed to fetch reminders: ${error.message}`, 500);
  return data;
}

/**
 * Find a single reminder by ID.
 */
export async function findById(userId, id) {
  const { data, error } = await supabaseAdmin
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (error) throw new AppError('Reminder not found.', 404);
  return data;
}

/**
 * Update a reminder.
 */
export async function update(id, data) {
  const updateFields = {};
  if (data.nextTrigger !== undefined) updateFields.next_trigger = data.nextTrigger;
  if (data.lastTriggered !== undefined) updateFields.last_triggered = data.lastTriggered;
  if (data.lastCompleted !== undefined) updateFields.last_completed = data.lastCompleted;
  if (data.missedCount !== undefined) updateFields.missed_count = data.missedCount;
  if (data.active !== undefined) updateFields.active = data.active;

  const { data: reminder, error } = await supabaseAdmin
    .from(TABLE)
    .update(updateFields)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new AppError(`Failed to update reminder: ${error.message}`, 400);
  return reminder;
}

/**
 * Find all overdue active reminders (next_trigger is in the past).
 */
export async function findOverdue() {
  const now = new Date().toISOString();

  const { data, error } = await supabaseAdmin
    .from(TABLE)
    .select('*')
    .eq('active', true)
    .lte('next_trigger', now);

  if (error) {
    console.error('Failed to find overdue reminders:', error.message);
    return [];
  }
  return data || [];
}

/**
 * Deactivate all reminders for a specific activity.
 */
export async function deactivateByActivity(activityId) {
  const { error } = await supabaseAdmin
    .from(TABLE)
    .update({ active: false })
    .eq('activity_id', activityId)
    .eq('active', true);

  if (error) {
    console.error('Failed to deactivate reminders:', error.message);
  }
}

/**
 * Count active reminders for a user.
 */
export async function countActive(userId) {
  const { count, error } = await supabaseAdmin
    .from(TABLE)
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('active', true);

  if (error) return 0;
  return count || 0;
}
