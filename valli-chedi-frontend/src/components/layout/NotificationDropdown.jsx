import React, { useRef, useEffect } from 'react';
import { Bell, Check, Clock, AlertTriangle, ShieldCheck, X } from 'lucide-react';
import { useReminders, useCheckIn } from '../../hooks/useReminders';
import { useVallis } from '../../hooks/useVallis';
import './NotificationDropdown.css';

export default function NotificationDropdown({ isOpen, onClose }) {
  const dropdownRef = useRef(null);
  const { data: remindersData } = useReminders({ active: 'true' });
  const { data: vallisData } = useVallis({ status: 'ACTIVE' });
  const checkIn = useCheckIn();

  const reminders = remindersData?.reminders || [];
  const vallis = vallisData?.vallis || [];

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const now = new Date().getTime();
  const dueReminders = reminders.filter(r => {
    if (!r.next_trigger) return false;
    return new Date(r.next_trigger).getTime() <= now;
  });

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        new Notification('🌿 Valli Chedi', {
          body: 'Notifications enabled! We will alert you before Achan does.',
          icon: '/favicon.ico'
        });
      }
    }
  };

  return (
    <div className="notification-dropdown" ref={dropdownRef}>
      <div className="notification-dropdown__header">
        <div className="notification-dropdown__title">
          <Bell size={16} className="text-sap-green" />
          <span>Notifications</span>
          {dueReminders.length > 0 && (
            <span className="notification-dropdown__badge">{dueReminders.length} due</span>
          )}
        </div>
        <button className="notification-dropdown__close" onClick={onClose} aria-label="Close">
          <X size={14} />
        </button>
      </div>

      <div className="notification-dropdown__body">
        {/* Browser Permission Banner */}
        {typeof window !== 'undefined' && 'Notification' in window && Notification.permission !== 'granted' && (
          <div className="notification-banner">
            <div className="notification-banner__text">
              <strong>Push alerts disabled</strong>
              <span>Get notified on time before vallis multiply.</span>
            </div>
            <button className="notification-banner__btn" onClick={requestNotificationPermission}>
              Enable
            </button>
          </div>
        )}

        {/* Reminders List */}
        {reminders.length > 0 ? (
          <div className="notification-section">
            <span className="notification-section__label">Active Family Check-Ins</span>
            {reminders.map(r => {
              const isDue = r.next_trigger && new Date(r.next_trigger).getTime() <= now;
              return (
                <div key={r.id} className={`notification-item ${isDue ? 'notification-item--due' : ''}`}>
                  <div className="notification-item__icon">
                    {isDue ? <AlertTriangle size={15} color="#c05d3b" /> : <Clock size={15} color="#5a7d48" />}
                  </div>
                  <div className="notification-item__content">
                    <div className="notification-item__title">
                      {r.recipient || 'Achan'} Check-In
                      {isDue && <span className="notification-item__tag">DUE NOW</span>}
                    </div>
                    <div className="notification-item__meta">
                      {isDue ? 'Escalating danger — Call immediately!' : `Next in ${r.interval_hours}h interval`}
                    </div>
                  </div>
                  <button 
                    className="notification-item__action"
                    onClick={() => checkIn.mutate(r.id)}
                    title="Mark as Called"
                  >
                    <Check size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        ) : null}

        {/* High Severity Vallis Alert */}
        {vallis.length > 0 && (
          <div className="notification-section">
            <span className="notification-section__label">Active Consequences</span>
            {vallis.slice(0, 3).map(v => (
              <div key={v.id} className="notification-item">
                <div className="notification-item__icon">
                  <span style={{ fontSize: '14px' }}>🌿</span>
                </div>
                <div className="notification-item__content">
                  <div className="notification-item__title">{v.title}</div>
                  <div className="notification-item__meta">{v.category} • Severity {v.severity || 1}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {reminders.length === 0 && vallis.length === 0 && (
          <div className="notification-dropdown__empty">
            <ShieldCheck size={32} color="var(--sap-green)" />
            <p>All clear! The chedi is peacefully at rest.</p>
          </div>
        )}
      </div>
    </div>
  );
}
