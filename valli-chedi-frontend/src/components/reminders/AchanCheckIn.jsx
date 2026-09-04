import { useState, useEffect } from 'react';
import { Phone, Check } from 'lucide-react';
import Card, { CardTitle } from '../common/Card';
import Button from '../common/Button';
import { useCheckIn } from '../../hooks/useReminders';
import './AchanCheckIn.css';

function formatCountdown(targetDate) {
  const now = new Date();
  const target = new Date(targetDate);
  const diff = Math.max(0, target - now);

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return {
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
    isOverdue: diff === 0 && target < now,
    totalMs: diff,
  };
}

function timeAgo(dateString) {
  if (!dateString) return 'Never';
  const now = new Date();
  const date = new Date(dateString);
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ${Math.floor((diff % 3600) / 60)}m ago`;
  return `${Math.floor(diff / 86400)} day(s) ago`;
}

export default function AchanCheckIn({ reminder }) {
  const [countdown, setCountdown] = useState(formatCountdown(reminder?.next_trigger));
  const checkInMutation = useCheckIn();

  useEffect(() => {
    if (!reminder?.next_trigger) return;

    const timer = setInterval(() => {
      setCountdown(formatCountdown(reminder.next_trigger));
    }, 1000);

    return () => clearInterval(timer);
  }, [reminder?.next_trigger]);

  if (!reminder || !reminder.active) return null;

  const handleCheckIn = () => {
    checkInMutation.mutate(reminder.id);
  };

  return (
    <Card className={`achan-checkin ${countdown.isOverdue ? 'achan-checkin--overdue' : ''}`}>
      <CardTitle icon={<Phone size={14} />}>Achan Check-in</CardTitle>

      <div className="achan-checkin__content">
        <p className="achan-checkin__label">Next check-in in</p>
        <div className="achan-checkin__countdown">
          <span className="achan-checkin__time">
            {countdown.hours}h {countdown.minutes}m
          </span>
        </div>

        <p className="achan-checkin__last">
          Last check-in: {timeAgo(reminder.last_completed)}
        </p>

        <Button
          variant="primary"
          fullWidth
          onClick={handleCheckIn}
          loading={checkInMutation.isPending}
          className="achan-checkin__btn"
        >
          <Check size={16} />
          I Called Achan ✓
        </Button>

        <p className="achan-checkin__interval">
          Every {reminder.interval_hours || 5} hours. Or else...
        </p>
      </div>
    </Card>
  );
}
