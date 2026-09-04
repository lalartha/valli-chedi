import { Bell, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';

export default function Header({ title, subtitle }) {
  const { user, logout } = useAuth();
  const displayName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';

  return (
    <header className="header">
      <div className="header__greeting">
        <h1 className="header__title">{title || `Hey, ${displayName} 👋`}</h1>
        {subtitle && <p className="header__subtitle">{subtitle}</p>}
      </div>

      <div className="header__actions">
        <button className="header__notification" aria-label="Notifications">
          <Bell size={20} strokeWidth={2} />
        </button>

        <div className="header__user">
          <div className="header__avatar" aria-label="User menu">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="18" r="17" fill="var(--sap-green-light)" stroke="var(--sap-green-200)" strokeWidth="1" />
              <circle cx="18" cy="18" r="10" fill="var(--sap-green)" />
              <circle cx="15" cy="16" r="1.5" fill="var(--white)" />
              <circle cx="21" cy="16" r="1.5" fill="var(--white)" />
              <path d="M15 20 Q18 23 21 20" stroke="var(--white)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            </svg>
          </div>
          <ChevronDown size={14} className="header__chevron" />
        </div>
      </div>
    </header>
  );
}
