/**
 * Valli Model
 * Database access functions for the vallis and valli_events tables.
 */

import { supabaseAdmin } from '../config/supabase.js';
import { AppError } from '../middleware/errorHandler.js';

const TABLE = 'vallis';
const EVENTS_TABLE = 'valli_events';

/**
 * Create a new Valli record.
 */
export async function create(userId, data) {
  const { data: valli, error } = await supabaseAdmin
    .from(TABLE)
    .insert({
      user_id: userId,
      activity_id: data.activityId || null,
      parent_valli_id: data.parentValliId || null,
      category: data.category || 'OTHER',
      title: data.title,
      description: data.description || null,
      severity: data.severity || 1,
      growth_points: data.growthPoints || 0,
      status: 'ACTIVE',
    })
    .select()
    .single();

  if (error) throw new AppError(`Failed to create valli: ${error.message}`, 400);
  return valli;
}

/**
 * Create a Valli event (append-only log entry).
 */
export async function createEvent(valliId, eventType, description, points = 0) {
  const { data: event, error } = await supabaseAdmin
    .from(EVENTS_TABLE)
    .insert({
      valli_id: valliId,
      event_type: eventType,
      description,
      points,
    })
    .select()
    .single();

  if (error) throw new AppError(`Failed to create valli event: ${error.message}`, 400);
  return event;
}

/**
 * Find all Vallis for a user with optional filters.
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
  if (filters.category) {
    query = query.eq('category', filters.category);
  }
  if (filters.activityId) {
    query = query.eq('activity_id', filters.activityId);
  }
  if (filters.limit) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;
  if (error) throw new AppError(`Failed to fetch vallis: ${error.message}`, 500);
  return data;
}

/**
 * Find a single Valli by ID (scoped to user).
 */
export async function findById(userId, id) {
  const { data, error } = await supabaseAdmin
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (error) throw new AppError('Valli not found.', 404);
  return data;
}

/**
 * Update a Valli (partial update).
 */
export async function update(userId, id, data) {
  const updateFields = {};
  if (data.title !== undefined) updateFields.title = data.title;
  if (data.description !== undefined) updateFields.description = data.description;
  if (data.severity !== undefined) updateFields.severity = data.severity;
  if (data.status !== undefined) updateFields.status = data.status;
  if (data.resolvedAt !== undefined) updateFields.resolved_at = data.resolvedAt;

  const { data: valli, error } = await supabaseAdmin
    .from(TABLE)
    .update(updateFields)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw new AppError(`Failed to update valli: ${error.message}`, 400);
  return valli;
}

/**
 * Find all Vallis linked to a specific activity.
 */
export async function findByActivity(userId, activityId) {
  const { data, error } = await supabaseAdmin
    .from(TABLE)
    .select('*')
    .eq('user_id', userId)
    .eq('activity_id', activityId)
    .order('created_at', { ascending: true });

  if (error) throw new AppError(`Failed to fetch vallis by activity: ${error.message}`, 500);
  return data;
}

/**
 * Find the Valli chain — all Vallis linked via parent_valli_id.
 * Returns the root Valli and all descendants.
 */
export async function findChain(userId, valliId) {
  // First get the target valli
  const root = await findById(userId, valliId);

  // Walk up to find the root of the chain
  let chainRoot = root;
  while (chainRoot.parent_valli_id) {
    chainRoot = await findById(userId, chainRoot.parent_valli_id);
  }

  // Now get all descendants of the root
  const chain = [chainRoot];
  const visited = new Set([chainRoot.id]);
  const queue = [chainRoot.id];

  while (queue.length > 0) {
    const parentId = queue.shift();

    const { data: children, error } = await supabaseAdmin
      .from(TABLE)
      .select('*')
      .eq('user_id', userId)
      .eq('parent_valli_id', parentId);

    if (error) continue;

    for (const child of (children || [])) {
      if (!visited.has(child.id)) {
        visited.add(child.id);
        chain.push(child);
        queue.push(child.id);
      }
    }
  }

  return chain;
}

/**
 * Get events for a specific Valli.
 */
export async function getEvents(valliId) {
  const { data, error } = await supabaseAdmin
    .from(EVENTS_TABLE)
    .select('*')
    .eq('valli_id', valliId)
    .order('timestamp', { ascending: true });

  if (error) throw new AppError(`Failed to fetch valli events: ${error.message}`, 500);
  return data;
}

/**
 * Count active Vallis for a user.
 */
export async function countActive(userId) {
  const { count, error } = await supabaseAdmin
    .from(TABLE)
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'ACTIVE');

  if (error) return 0;
  return count || 0;
}

/**
 * Count resolved Vallis for a user.
 */
export async function countResolved(userId) {
  const { count, error } = await supabaseAdmin
    .from(TABLE)
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'RESOLVED');

  if (error) return 0;
  return count || 0;
}
