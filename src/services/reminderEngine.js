/**
 * Reminder Engine
 *
 * Manages the Achan Check-In Protocol and other reminders.
 * DPR Sections 23, 24, 25, 26, 27.
 *
 * Rules:
 * - Only activate for overnight activities where returned_home == false
 * - 5-hour interval between check-ins
 * - Escalating messages for missed check-ins
 * - Deactivate on return home
 */

import * as reminderModel from '../models/reminderModel.js';
import * as valliEngine from './valliEngine.js';

/**
 * Create an Achan check-in reminder for an overnight activity.
 *
 * @param {string} userId
 * @param {string} activityId
 * @param {string} startTime - Activity start time (first check-in = start + 5h)
 * @returns {Object|null} Created reminder or null if not needed
 */
export async function createAchanReminder(userId, activityId, startTime) {
  // Calculate first trigger: 5 hours after activity starts
  const firstTrigger = new Date(startTime);
  firstTrigger.setHours(firstTrigger.getHours() + 5);

  const reminder = await reminderModel.create(userId, {
    activityId,
    type: 'PARENT_CHECKIN',
    recipient: 'ACHAN',
    intervalHours: 5,
    nextTrigger: firstTrigger.toISOString(),
  });

  return {
    ...reminder,
    message: '📞 Achan Check-In Protocol activated. First check-in in 5 hours.',
  };
}

/**
 * Confirm a check-in — user has called Achan.
 *
 * @param {string} userId
 * @param {string} reminderId
 * @param {string} completedAt - When the call was made
 * @returns {Object} Updated reminder with next check-in time
 */
export async function confirmCheckIn(userId, reminderId, completedAt) {
  const reminder = await reminderModel.findById(userId, reminderId);

  if (!reminder.active) {
    return { ...reminder, message: 'This reminder is no longer active.' };
  }

  // Schedule next check-in: completed time + interval hours
  const nextTrigger = new Date(completedAt || new Date());
  nextTrigger.setHours(nextTrigger.getHours() + reminder.interval_hours);

  const updated = await reminderModel.update(reminderId, {
    lastCompleted: completedAt || new Date().toISOString(),
    lastTriggered: new Date().toISOString(),
    nextTrigger: nextTrigger.toISOString(),
    missedCount: 0, // Reset missed count on successful check-in
  });

  return {
    ...updated,
    status: 'COMPLETED',
    nextCheckIn: nextTrigger.toISOString(),
    message: '✅ Check-in confirmed. Achan protocol satisfied. Next check-in scheduled.',
  };
}

/**
 * Stop a reminder (e.g., user returned home).
 *
 * @param {string} userId
 * @param {string} reminderId
 * @param {string} reason - e.g., 'RETURNED_HOME'
 * @returns {Object} Deactivated reminder
 */
export async function stopReminder(userId, reminderId, reason = 'RETURNED_HOME') {
  const reminder = await reminderModel.findById(userId, reminderId);

  const updated = await reminderModel.update(reminderId, {
    active: false,
  });

  return {
    ...updated,
    active: false,
    reason,
    message: `Achan protocol deactivated. Reason: ${reason}.`,
  };
}

/**
 * Check for missed reminders and escalate.
 * Called by the cron job.
 *
 * @returns {Array} List of escalation results
 */
export async function checkMissedReminders() {
  const overdueReminders = await reminderModel.findOverdue();
  const results = [];

  for (const reminder of overdueReminders) {
    try {
      const result = await escalateReminder(reminder);
      results.push(result);
    } catch (err) {
      console.error(`Failed to escalate reminder ${reminder.id}:`, err.message);
    }
  }

  return results;
}

/**
 * Escalate a missed reminder — increment missed count, create COMMUNICATION Valli.
 *
 * @param {Object} reminder - The overdue reminder
 * @returns {Object} Escalation result
 */
export async function escalateReminder(reminder) {
  const newMissedCount = (reminder.missed_count || 0) + 1;

  // Schedule next trigger
  const nextTrigger = new Date();
  nextTrigger.setHours(nextTrigger.getHours() + reminder.interval_hours);

  // Update the reminder
  await reminderModel.update(reminder.id, {
    missedCount: newMissedCount,
    lastTriggered: new Date().toISOString(),
    nextTrigger: nextTrigger.toISOString(),
  });

  // Create a COMMUNICATION Valli for the missed check-in
  const severity = Math.min(3 + newMissedCount * 2, 10);
  const valli = await valliEngine.createValli(reminder.user_id, {
    activityId: reminder.activity_id,
    category: 'COMMUNICATION',
    title: `Missed Achan check-in #${newMissedCount}`,
    description: getEscalationMessage(newMissedCount),
    rawScore: severity * 5,
  });

  return {
    reminderId: reminder.id,
    missedCount: newMissedCount,
    escalationMessage: getEscalationMessage(newMissedCount),
    valliCreated: valli,
    nextTrigger: nextTrigger.toISOString(),
  };
}

/**
 * Get escalation message based on missed count.
 * DPR Section 25 — increasingly dramatic messages.
 */
export function getEscalationMessage(missedCount) {
  if (missedCount === 1) {
    return '📞 Achan Check — You haven\'t called Achan in 5 hours. Please call now.';
  }
  if (missedCount === 2) {
    return '⚠️ ACHAN VALLI — You REALLY should call Achan. This is not optional.';
  }
  if (missedCount === 3) {
    return '🚨 VALLI ESCALATION — Communication protocol has been neglected. The chedi is aware.';
  }
  if (missedCount === 4) {
    return '💀 CRITICAL COMMUNICATION FAILURE — Achan has not heard from you. The valli grows unchecked.';
  }
  return `💀💀 COMMUNICATION CATASTROPHE (${missedCount} missed) — At this point, the chedi has its own communication system.`;
}
