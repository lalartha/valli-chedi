import { Phone, Check, Square } from 'lucide-react';
import Header from '../components/layout/Header';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Loading from '../components/common/Loading';
import EmptyState from '../components/common/EmptyState';
import { ACHAN_SCORE_REMARK } from '../utils/malayalamQuotes';
import { useReminders, useCheckIn, useStopReminder } from '../hooks/useReminders';
import './Reminders.css';

function timeUntil(dateString) {
  if (!dateString) return 'N/A';
  const now = new Date();
  const target = new Date(dateString);
  const diff = Math.max(0, target - now);
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export default function Reminders() {
  const { data, isLoading } = useReminders();
  const checkInMutation = useCheckIn();
  const stopMutation = useStopReminder();

  if (isLoading) return <Loading />;

  const reminders = data?.reminders || [];
  const active = reminders.filter(r => r.active);
  const completed = reminders.filter(r => !r.active);

  return (
    <div className="reminders-page">
      <Header title="Reminders" subtitle="Nobody needs you every five hours. Yet." />

      <div className="reminders-page__achan-remark">
        <div className="reminders-page__achan-header">
          <span className="reminders-page__achan-tag">👨‍🦳 Achan's Verdict</span>
        </div>
        <p className="reminders-page__achan-quote">"{ACHAN_SCORE_REMARK}"</p>
      </div>

      <h3 className="reminders-page__section-title">
        Active Reminders ({active.length})
      </h3>

      {active.length === 0 ? (
        <EmptyState
          icon="🔔"
          message="Nobody needs you every five hours. Yet."
        />
      ) : (
        <div className="reminders-page__list">
          {active.map(reminder => (
            <Card key={reminder.id} className="reminder-card" padding="md">
              <div className="reminder-card__header">
                <div className="reminder-card__icon">
                  <Phone size={18} />
                </div>
                <div className="reminder-card__info">
                  <h4>{reminder.recipient} Check-In</h4>
                  <span>Every {reminder.interval_hours} hours</span>
                </div>
                <Badge variant="warning">Active</Badge>
              </div>

              <div className="reminder-card__countdown">
                <span className="reminder-card__label">Next:</span>
                <span className="reminder-card__time">{timeUntil(reminder.next_trigger)}</span>
              </div>

              {reminder.missed_count > 0 && (
                <p className="reminder-card__missed">
                  Missed: {reminder.missed_count} times
                </p>
              )}

              <div className="reminder-card__actions">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => checkInMutation.mutate(reminder.id)}
                  loading={checkInMutation.isPending}
                >
                  <Check size={14} /> Called
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => stopMutation.mutate({ id: reminder.id, reason: 'RETURNED_HOME' })}
                  loading={stopMutation.isPending}
                >
                  <Square size={14} /> Stop
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {completed.length > 0 && (
        <>
          <h3 className="reminders-page__section-title" style={{ marginTop: 'var(--space-2xl)' }}>
            Completed ({completed.length})
          </h3>
          <div className="reminders-page__list">
            {completed.map(reminder => (
              <Card key={reminder.id} className="reminder-card reminder-card--completed" padding="md">
                <div className="reminder-card__header">
                  <div className="reminder-card__icon reminder-card__icon--completed">
                    <Phone size={18} />
                  </div>
                  <div className="reminder-card__info">
                    <h4>{reminder.recipient} Check-In</h4>
                    <span>Completed</span>
                  </div>
                  <Badge variant="success">Done</Badge>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
