import Header from '../components/layout/Header';
import ValliScore from '../components/valli/ValliScore';
import ValliChedi from '../components/valli/ValliChedi';
import GrowthLevel from '../components/valli/GrowthLevel';
import ValliList from '../components/valli/ValliList';
import AchanCheckIn from '../components/reminders/AchanCheckIn';
import NextEvent from '../components/activities/NextEvent';
import WisdomBar from '../components/common/WisdomBar';
import Loading from '../components/common/Loading';
import ValliDebt from '../components/valli/ValliDebt';
import { useValliState } from '../hooks/useValliState';
import { useVallis } from '../hooks/useVallis';
import { useActivities } from '../hooks/useActivities';
import { useReminders } from '../hooks/useReminders';
import './Dashboard.css';

export default function Dashboard() {
  const { data: valliState, isLoading: stateLoading, error: stateError } = useValliState();
  const { data: vallisData } = useVallis({ status: 'ACTIVE' });
  const { data: activitiesData } = useActivities({ limit: 5 });
  const { data: remindersData } = useReminders({ active: 'true' });

  if (stateLoading) return <Loading />;

  if (stateError) {
    return (
      <div className="dashboard__error">
        <p>🌿 The chedi lost connection to reality.</p>
        <button onClick={() => window.location.reload()}>Try again</button>
      </div>
    );
  }

  const state = valliState || {};
  const vallis = vallisData?.vallis || [];
  const activities = activitiesData?.activities || [];
  const reminders = remindersData?.reminders || [];

  // Find next upcoming activity
  const now = new Date();
  const nextActivity = activities
    .filter(a => new Date(a.start_time) > now && a.status !== 'CANCELLED')
    .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))[0];

  // Find active Achan reminder
  const achanReminder = reminders.find(
    r => r.type === 'PARENT_CHECKIN' && r.active
  );

  return (
    <div className="dashboard">
      <Header
        title={`Hey, ${state.userName || 'there'} 👋`}
        subtitle="Let's see what vallis you've grown today."
      />

      <div className="dashboard__grid">
        {/* Left column — Score + Plant */}
        <div className="dashboard__left">
          <div className="dashboard__score-plant">
            <ValliScore
              totalPoints={state.growthPoints || state.totalPoints || 0}
              severity={state.severity || 'SEED'}
            />
            <ValliChedi
              growthLevel={state.growthLevel || 1}
              growthPercentage={state.growthPercentage || 0}
              severity={state.severity || 'SEED'}
            />
          </div>
        </div>

        {/* Right column — Achan + Next Event */}
        <div className="dashboard__right">
          {achanReminder && (
            <AchanCheckIn reminder={achanReminder} />
          )}
          {nextActivity && (
            <NextEvent activity={nextActivity} />
          )}
          {!achanReminder && !nextActivity && (
            <div className="dashboard__right-empty">
              <p>🌱 Nothing urgent.<br/>The chedi is resting.</p>
            </div>
          )}
          <ValliDebt />
        </div>

        {/* Bottom left — Active Vallis */}
        <div className="dashboard__bottom-left">
          <ValliList
            vallis={vallis}
            totalCount={state.activeVallis || vallis.length}
          />
        </div>

        {/* Bottom right — Growth Level */}
        <div className="dashboard__bottom-right">
          <GrowthLevel
            growthLevel={state.growthLevel || 1}
            growthPercentage={state.growthPercentage || 0}
          />
        </div>
      </div>

      <WisdomBar />
    </div>
  );
}
