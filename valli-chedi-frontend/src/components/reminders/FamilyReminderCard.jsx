import { useState, useEffect, useRef } from 'react';
import { Phone, Check, AlertTriangle, AlertCircle } from 'lucide-react';
import Card from '../common/Card';

function getReminderState(nextTrigger) {
  if (!nextTrigger) return 'UPCOMING';
  const now = new Date().getTime();
  const trigger = new Date(nextTrigger).getTime();
  const diffSec = Math.floor((trigger - now) / 1000);

  if (diffSec > 0) return 'UPCOMING';
  if (diffSec > -1800) return 'DUE'; // Up to 30 mins late
  if (diffSec > -7200) return 'LATE'; // Up to 2 hours late
  if (diffSec > -14400) return 'MISSED'; // Up to 4 hours late
  return 'DANGER'; // > 4 hours late
}

function formatTimeRemaining(nextTrigger) {
  if (!nextTrigger) return '00h 00m';
  const now = new Date().getTime();
  const trigger = new Date(nextTrigger).getTime();
  const diffSec = Math.floor(Math.abs(trigger - now) / 1000);
  
  const h = Math.floor(diffSec / 3600);
  const m = Math.floor((diffSec % 3600) / 60);
  return `${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m`;
}

function timeSince(dateString) {
  if (!dateString) return 'Never';
  const now = new Date();
  const date = new Date(dateString);
  const diffSec = Math.floor((now - date) / 1000);

  if (diffSec < 60) return 'just now';
  const h = Math.floor(diffSec / 3600);
  const m = Math.floor((diffSec % 3600) / 60);
  
  if (h > 0) return `${h}h ${m}m ago`;
  return `${m}m ago`;
}

export default function FamilyReminderCard({ reminder, onCheckIn, onNotificationFire }) {
  const [state, setState] = useState(() => getReminderState(reminder.next_trigger));
  const [timeRemaining, setTimeRemaining] = useState(() => formatTimeRemaining(reminder.next_trigger));
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const lastState = useRef(state);

  useEffect(() => {
    // Update live countdown every minute
    const interval = setInterval(() => {
      const newState = getReminderState(reminder.next_trigger);
      setState(newState);
      setTimeRemaining(formatTimeRemaining(reminder.next_trigger));

      // Trigger notification if it just became DUE
      if (newState === 'DUE' && lastState.current === 'UPCOMING') {
        if (onNotificationFire) {
          onNotificationFire(reminder);
        }
      }
      lastState.current = newState;
    }, 60000); // every minute to save renders

    // Also update immediately if reminder prop changes
    const newState = getReminderState(reminder.next_trigger);
    setState(newState);
    setTimeRemaining(formatTimeRemaining(reminder.next_trigger));

    return () => clearInterval(interval);
  }, [reminder, onNotificationFire]);

  const handleCheckIn = async () => {
    try {
      setIsCheckingIn(true);
      await onCheckIn(reminder.id);
    } finally {
      setIsCheckingIn(false);
    }
  };

  const recipientLabel = reminder.recipient || 'Family';
  
  let Icon = Phone;
  if (state === 'LATE') Icon = AlertCircle;
  if (state === 'MISSED' || state === 'DANGER') Icon = AlertTriangle;

  const isOverdue = state !== 'UPCOMING';

  return (
    <Card className={`family-reminder family-reminder--${state.toLowerCase()}`} padding="lg">
      <div className="family-reminder__header">
        <Icon size={20} className="family-reminder__icon" />
        <span className="family-reminder__recipient">{recipientLabel}</span>
        <span className="family-reminder__status-badge">{state}</span>
      </div>

      <div className="family-reminder__time-block">
        <div className="family-reminder__time-label">
          {isOverdue ? 'Time since due' : 'Next check-in'}
        </div>
        <div className="family-reminder__time-value">
          {isOverdue && '-'} {timeRemaining}
        </div>
      </div>

      <div className="family-reminder__last-checkin">
        Last check-in: {timeSince(reminder.last_completed)}
      </div>

      <button
        className="family-reminder__action"
        onClick={handleCheckIn}
        disabled={isCheckingIn}
      >
        <Check size={18} />
        {isCheckingIn ? 'Calling...' : `I Called ${recipientLabel}`}
      </button>

      <div className="family-reminder__footer">
        Every {reminder.interval_hours} hours
      </div>
    </Card>
  );
}
