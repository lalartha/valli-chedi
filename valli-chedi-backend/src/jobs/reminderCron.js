/**
 * Reminder Cron Job
 *
 * Runs every 5 minutes to check for overdue reminders.
 * When a reminder's next_trigger has passed without a check-in,
 * it escalates by creating a COMMUNICATION Valli and bumping missed_count.
 */

import cron from 'node-cron';
import * as reminderEngine from '../services/reminderEngine.js';

let cronJob = null;

/**
 * Start the reminder cron job.
 * Runs every 5 minutes.
 */
export function startReminderCron() {
  // Run every 5 minutes
  cronJob = cron.schedule('*/5 * * * *', async () => {
    try {
      const results = await reminderEngine.checkMissedReminders();

      if (results.length > 0) {
        console.log(`🌿 Reminder Cron: ${results.length} missed check-in(s) escalated.`);
        for (const r of results) {
          console.log(`   📞 Reminder ${r.reminderId}: missed #${r.missedCount} — ${r.escalationMessage}`);
        }
      }
    } catch (err) {
      console.error('🚨 Reminder Cron Error:', err.message);
    }
  });

  console.log('⏰ Reminder cron job started (every 5 minutes).');
}

/**
 * Stop the reminder cron job.
 */
export function stopReminderCron() {
  if (cronJob) {
    cronJob.stop();
    console.log('⏰ Reminder cron job stopped.');
  }
}
