import React, { useEffect, useState } from 'react';
import { Home, Bell } from 'lucide-react';
import { useActivities, useUpdateActivity } from '../hooks/useActivities';
import { useReminders, useCheckIn } from '../hooks/useReminders';
import FamilyReminderCard from '../components/reminders/FamilyReminderCard';
import Loading from '../components/common/Loading';
import './FamilyCheckIn.css';

export default function FamilyCheckIn() {
  const { data: activitiesData, isLoading: actLoading } = useActivities();
  const { data: remindersData, isLoading: remLoading } = useReminders({ active: 'true' });
  const updateActivity = useUpdateActivity();
  const checkIn = useCheckIn();
  
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'granted') {
      setPermissionGranted(true);
    }
  }, []);

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) return;
    const permission = await Notification.requestPermission();
    if (permission === 'granted') setPermissionGranted(true);
  };

  if (actLoading || remLoading) return <Loading />;

  const activities = activitiesData?.activities || [];
  const reminders = remindersData?.reminders || [];
  
  // Filter for family reminders
  const familyReminders = reminders.filter(r => 
    r.type === 'ACHAN_CHECKIN' || 
    r.type === 'AMMA_CHECKIN' || 
    r.type === 'BROTHER_CHECKIN' ||
    r.type === 'PARENT_CHECKIN' || // Legacy fallback
    (r.type && r.type.includes('CHECKIN'))
  );

  // Find the active overnight activity (not returned home, not cancelled)
  const activeOvernightActivity = activities.find(a => a.overnight && !a.returned_home && a.status !== 'CANCELLED');

  const showProtocol = activeOvernightActivity || familyReminders.length > 0;

  const handleImHome = async () => {
    if (!activeOvernightActivity) return;
    await updateActivity.mutateAsync({
      id: activeOvernightActivity.id,
      data: { returnedHome: true }
    });
  };

  const handleNotificationFire = (reminder) => {
    if (permissionGranted) {
      new Notification('🌿 Valli Chedi', {
        body: `${reminder.recipient} check-in is due. Please call now.`,
        icon: '/favicon.ico',
      });
    }
  };

  return (
    <div className="family-checkin">
      <div className="family-checkin__header">
        <h1 className="family-checkin__title">FAMILY CHECK-IN PROTOCOL</h1>
        <p className="family-checkin__quote">
          "Apparently, being away requires maintaining civilization."
        </p>
      </div>

      {!permissionGranted && (
        <div className="family-checkin__empty" style={{ padding: '1rem', marginTop: 0, marginBottom: '2rem' }}>
          <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Bell size={18} /> Enable notifications to avoid angering the Chedi.
            <button onClick={requestNotificationPermission} style={{ marginLeft: '1rem', padding: '4px 12px', background: 'var(--sap-green)', color: 'white', borderRadius: '4px' }}>
              Enable
            </button>
          </p>
        </div>
      )}

      {showProtocol ? (
        <>
          <div className="family-checkin__trip">
            <h3>Active Trip</h3>
            <div className="family-checkin__trip-name">
              {activeOvernightActivity ? activeOvernightActivity.title : 'Overnight Family Check-in'}
            </div>
            <div className="family-checkin__trip-meta">
              {activeOvernightActivity
                ? `${activeOvernightActivity.location || activeOvernightActivity.district || 'Unknown location'} • Overnight`
                : 'Active Protocol'}
            </div>
          </div>

          <div className="family-checkin__grid">
            {familyReminders.map(reminder => (
              <FamilyReminderCard 
                key={reminder.id} 
                reminder={reminder} 
                onCheckIn={checkIn.mutateAsync}
                onNotificationFire={handleNotificationFire}
              />
            ))}
          </div>

          {activeOvernightActivity && (
            <div className="family-checkin__actions">
              <button 
                className="family-checkin__home-btn"
                onClick={handleImHome}
                disabled={updateActivity.isLoading}
              >
                <Home size={20} />
                {updateActivity.isLoading ? 'Processing...' : "I'm Home"}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="family-checkin__empty">
          <p>🏠 HOME</p>
          <br/>
          <p>Family Check-in Protocol deactivated.</p>
          <p>You survived the trip.</p>
        </div>
      )}
    </div>
  );
}
