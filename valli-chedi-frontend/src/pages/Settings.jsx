import { LogOut } from 'lucide-react';
import Header from '../components/layout/Header';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useAuth } from '../contexts/AuthContext';
import './Settings.css';

export default function Settings() {
  const { user, logout } = useAuth();

  return (
    <div className="settings-page">
      <Header title="Settings" subtitle="Configure your chedi." />

      <Card className="settings-card" padding="md">
        <h3 className="settings-card__title">Account</h3>
        <div className="settings-card__info">
          <div className="settings-card__row">
            <span className="settings-card__label">Email</span>
            <span className="settings-card__value">{user?.email || 'N/A'}</span>
          </div>
          <div className="settings-card__row">
            <span className="settings-card__label">User ID</span>
            <span className="settings-card__value settings-card__value--mono">
              {user?.id?.slice(0, 8) || 'N/A'}...
            </span>
          </div>
        </div>
      </Card>

      <Card className="settings-card" padding="md">
        <h3 className="settings-card__title">About Valli Chedi</h3>
        <p className="settings-card__text">
          A beautifully designed dashboard for a plant that should not be this large.
        </p>
        <p className="settings-card__text settings-card__text--tagline">
          Permission granted. Consequences pending. 🌿
        </p>
      </Card>

      <div className="settings-page__actions">
        <Button variant="danger" onClick={logout}>
          <LogOut size={16} />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
