/**
 * Home Debt Model
 * Database access functions for the home_debt table.
 * "A deliberately humorous representation of pending household responsibilities."
 */

import { supabaseAdmin } from '../config/supabase.js';
import { AppError } from '../middleware/errorHandler.js';

const TABLE = 'home_debt';

/**
 * Create a home debt entry.
 */
export async function create(userId, data) {
  const { data: debt, error } = await supabaseAdmin
    .from(TABLE)
    .insert({
      user_id: userId,
      activity_id: data.activityId || null,
      reason: data.reason,
      points: data.points || 1,
      status: 'PENDING',
    })
    .select()
    .single();

  if (error) throw new AppError(`Failed to create home debt: ${error.message}`, 400);
  return debt;
}

/**
 * Find all home debts for a user.
 */
export async function findAll(userId, filters = {}) {
  let query = supabaseAdmin
    .from(TABLE)
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (filters.status) {
    query = query.eq('status', filters.status);
  }

  const { data, error } = await query;
  if (error) throw new AppError(`Failed to fetch home debts: ${error.message}`, 500);
  return data;
}

/**
 * Find a single home debt by ID.
 */
export async function findById(userId, id) {
  const { data, error } = await supabaseAdmin
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (error) throw new AppError('Home debt not found.', 404);
  return data;
}

/**
 * Resolve a home debt.
 */
export async function resolve(userId, id) {
  const { data, error } = await supabaseAdmin
    .from(TABLE)
    .update({
      status: 'RESOLVED',
      resolved_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', userId)
    .eq('status', 'PENDING')
    .select()
    .single();

  if (error) throw new AppError(`Failed to resolve home debt: ${error.message}`, 400);
  return data;
}

/**
 * Count pending home debts for a user.
 */
export async function countPending(userId) {
  const { count, error } = await supabaseAdmin
    .from(TABLE)
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'PENDING');

  if (error) return 0;
  return count || 0;
}

/**
 * Sum pending home debt points for a user.
 */
export async function sumPendingPoints(userId) {
  const { data, error } = await supabaseAdmin
    .from(TABLE)
    .select('points')
    .eq('user_id', userId)
    .eq('status', 'PENDING');

  if (error) return 0;
  return (data || []).reduce((sum, d) => sum + (d.points || 0), 0);
}
