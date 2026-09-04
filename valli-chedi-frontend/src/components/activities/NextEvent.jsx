import { Calendar, MapPin } from 'lucide-react';
import Card, { CardTitle } from '../common/Card';
import Badge from '../common/Badge';
import './NextEvent.css';

function formatTimeUntil(dateString) {
  if (!dateString) return '';
  const now = new Date();
  const date = new Date(dateString);
  const diff = Math.max(0, date - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) return `${days} Day${days > 1 ? 's' : ''}`;
  if (hours > 0) return `${hours} Hour${hours > 1 ? 's' : ''}`;
  return 'Soon';
}

function formatPermissionTiming(requestedAt, startTime) {
  if (!requestedAt || !startTime) return null;
  const requested = new Date(requestedAt);
  const start = new Date(startTime);
  const diff = Math.floor((start - requested) / (1000 * 60 * 60 * 24));

  if (diff <= 0) return 'Same day';
  return `${diff} day${diff > 1 ? 's' : ''} before`;
}

export default function NextEvent({ activity }) {
  if (!activity) return null;

  const timeUntil = formatTimeUntil(activity.start_time);
  const location = [activity.location, activity.district].filter(Boolean).join(' • ');

  return (
    <Card className="next-event">
      <CardTitle icon={<Calendar size={14} />}>Next Event</CardTitle>

      <div className="next-event__content">
        <h3 className="next-event__title">{activity.title}</h3>

        {location && (
          <div className="next-event__location">
            <MapPin size={14} />
            <span>{location}</span>
            {timeUntil && <span>• {timeUntil}</span>}
          </div>
        )}

        <div className="next-event__tags">
          {activity.overnight && <Badge variant="overnight">Overnight</Badge>}
          {activity.category && (
            <Badge variant="default">{activity.category}</Badge>
          )}
        </div>

        {activity.permission_requested_at && (
          <div className="next-event__permission">
            <div className="next-event__permission-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="8" fill="var(--sap-green-light)" />
                <circle cx="10" cy="10" r="5" fill="var(--sap-green)" />
                <circle cx="10" cy="8" r="1" fill="var(--white)" />
                <path d="M9 11 Q10 13 11 11" stroke="var(--white)" strokeWidth="0.8" strokeLinecap="round" fill="none" />
              </svg>
            </div>
            <div>
              <span className="next-event__permission-label">Permission asked:</span>
              <span className="next-event__permission-time">
                {formatPermissionTiming(activity.permission_requested_at, activity.start_time) || 'Unknown'}
              </span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
