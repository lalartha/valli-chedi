import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, MapPin, Moon } from 'lucide-react';
import Header from '../components/layout/Header';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Loading from '../components/common/Loading';
import EmptyState from '../components/common/EmptyState';
import ConsequenceWarningDialog from '../components/activities/ConsequenceWarningDialog';
import ConsequenceSummaryModal from '../components/activities/ConsequenceSummaryModal';
import { useActivities, useCreateActivity, usePreviewActivity } from '../hooks/useActivities';
import { getRandomActivityQuote } from '../utils/malayalamQuotes';
import './Activities.css';

const CATEGORIES = [
  'RESPONSIBILITY', 'COLLEGE', 'NSS', 'COMMUNITY',
  'MEETING', 'PERSONAL', 'TRAVEL', 'FAMILY', 'OTHER',
];

function ActivityCard({ activity }) {
  const navigate = useNavigate();

  return (
    <Card className="activity-card" hover padding="md">
      <div className="activity-card__header">
        <h3 className="activity-card__title">{activity.title}</h3>
        <Badge variant={activity.overnight ? 'overnight' : 'default'}>
          {activity.overnight ? 'Overnight' : activity.category}
        </Badge>
      </div>
      <div className="activity-card__details">
        {activity.location && (
          <span className="activity-card__detail">
            <MapPin size={14} /> {activity.location}
          </span>
        )}
        <span className="activity-card__detail">
          <Calendar size={14} />
          {new Date(activity.start_time).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric'
          })}
        </span>
        {activity.overnight && (
          <span className="activity-card__detail">
            <Moon size={14} /> Overnight
          </span>
        )}
      </div>
      <div className="activity-card__status">
        <Badge variant={activity.status === 'COMPLETED' ? 'success' : 'default'}>
          {activity.status}
        </Badge>
      </div>
    </Card>
  );
}

export default function Activities() {
  const [showForm, setShowForm] = useState(false);
  const { data, isLoading } = useActivities();
  const createMutation = useCreateActivity();
  const previewMutation = usePreviewActivity();

  // Modal states
  const [previewData, setPreviewData] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [createdActivityData, setCreatedActivityData] = useState(null);

  const [form, setForm] = useState({
    title: '', category: 'OTHER', startTime: '', endTime: '',
    location: '', district: '', state: 'Kerala',
    overnight: false, returnHomeTime: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await previewMutation.mutateAsync(form);
      const preview = response.preview;
      
      if (preview?.warning?.required) {
        setPreviewData(preview);
        setShowWarning(true);
      } else {
        await executeCreate(form);
      }
    } catch (err) {
      console.error("Preview failed", err);
    }
  };

  const executeCreate = async (formData) => {
    try {
      const response = await createMutation.mutateAsync(formData);
      setCreatedActivityData(response.formatted); // Assuming backend returns .formatted
      setShowWarning(false);
      setShowForm(false);
      setShowSummary(true);
      setForm({
        title: '', category: 'OTHER', startTime: '', endTime: '',
        location: '', district: '', state: 'Kerala',
        overnight: false, returnHomeTime: '',
      });
    } catch (err) {
      console.error("Create failed", err);
    }
  };

  const handleCancelWarning = () => {
    setShowWarning(false);
  };


  if (isLoading) return <Loading />;

  const activities = data?.activities || [];

  return (
    <div className="activities-page">
      <Header title="My Activities" subtitle="Everything you've been up to." />

      <div className="activities-page__actions">
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus size={16} />
          {showForm ? 'Cancel' : 'New Activity'}
        </Button>
      </div>

      {showForm && (
        <Card className="activities-page__form-card">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--terracotta-50, #fdf4f0)',
            border: '1px dashed var(--terracotta-300, #df957a)',
            borderRadius: '8px',
            padding: '8px 12px',
            marginBottom: '1rem',
            color: 'var(--terracotta-dark, #803018)',
            fontWeight: '600',
            fontSize: '0.9rem'
          }}>
            <span>👨‍🦳</span>
            <span>"{getRandomActivityQuote()}"</span>
          </div>
          <h3 className="activities-page__form-title">Create Activity</h3>
          <form className="activities-page__form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-field">
                <label>Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="What are you doing?"
                  required
                />
              </div>
              <div className="form-field">
                <label>Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label>Start Date/Time *</label>
                <input
                  type="datetime-local"
                  value={form.startTime}
                  onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                  required
                />
              </div>
              <div className="form-field">
                <label>End Date/Time</label>
                <input
                  type="datetime-local"
                  value={form.endTime}
                  onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label>Location</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="Where?"
                />
              </div>
              <div className="form-field">
                <label>District</label>
                <input
                  type="text"
                  value={form.district}
                  onChange={(e) => setForm({ ...form, district: e.target.value })}
                  placeholder="District"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field form-field--checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={form.overnight}
                    onChange={(e) => setForm({ ...form, overnight: e.target.checked })}
                  />
                  Overnight stay
                </label>
              </div>
              {form.overnight && (
                <div className="form-field">
                  <label>Expected Return Time</label>
                  <input
                    type="datetime-local"
                    value={form.returnHomeTime}
                    onChange={(e) => setForm({ ...form, returnHomeTime: e.target.value })}
                  />
                </div>
              )}
            </div>

            <div className="form-actions">
              <Button variant="outline" type="button" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button type="submit" loading={createMutation.isPending}>
                Create Activity
              </Button>
            </div>
          </form>
        </Card>
      )}

      {activities.length === 0 ? (
        <EmptyState
          icon="📅"
          title="No activities yet"
          message="Create your first activity and watch the vallis grow."
          action="Create Activity"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <div className="activities-page__list">
          {activities.map(activity => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      )}

      {showWarning && previewData && (
        <ConsequenceWarningDialog 
          preview={previewData} 
          onConfirm={() => executeCreate(form)} 
          onCancel={handleCancelWarning} 
        />
      )}

      {showSummary && createdActivityData && (
        <ConsequenceSummaryModal 
          data={createdActivityData} 
          onClose={() => setShowSummary(false)} 
        />
      )}
    </div>
  );
}
