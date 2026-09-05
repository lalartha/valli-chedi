import { useState } from 'react';
import { Bell, ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useReminders } from '../../hooks/useReminders';
import NotificationDropdown from './NotificationDropdown';
import './Header.css';

export default function Header({ title, subtitle }) {
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { data: remindersData } = useReminders({ active: 'true' });

  const displayName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Arthalal';
  const reminders = remindersData?.reminders || [];
  const now = new Date().getTime();
  const dueCount = reminders.filter(r => r.next_trigger && new Date(r.next_trigger).getTime() <= now).length;

  return (
    <header className="header">
      <div className="header__greeting">
        <h1 className="header__title">{title || `Hey, ${displayName} 👋`}</h1>
        {subtitle && <p className="header__subtitle">{subtitle}</p>}
      </div>

      <div className="header__actions">
        <div style={{ position: 'relative' }}>
          <button 
            className={`header__notification ${showNotifications ? 'header__notification--active' : ''}`} 
            aria-label="Notifications"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
          >
            <Bell size={20} strokeWidth={2} />
            {dueCount > 0 && (
              <span className="header__notification-badge">{dueCount}</span>
            )}
          </button>

          <NotificationDropdown 
            isOpen={showNotifications} 
            onClose={() => setShowNotifications(false)} 
          />
        </div>

        <div style={{ position: 'relative' }}>
          <div 
            className="header__user" 
            aria-label="User menu"
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
          >
            <div className="header__avatar">
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

          {showUserMenu && (
            <div className="header__user-menu">
              <div className="header__user-info">
                <span className="header__user-name">{displayName}</span>
                <span className="header__user-email">{user?.email || 'test@vallichedi.dev'}</span>
              </div>
              <button className="header__logout-btn" onClick={logout}>
                <LogOut size={14} />
                <span>Log out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
