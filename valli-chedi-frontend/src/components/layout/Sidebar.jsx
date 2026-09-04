import { NavLink } from 'react-router-dom';
import {
  Home, Activity, Link2, Bell, BarChart3, Settings
} from 'lucide-react';
import './Sidebar.css';

const NAV_ITEMS = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/activities', icon: Activity, label: 'My Activities' },
  { path: '/valli-chain', icon: Link2, label: 'Valli Chain' },
  { path: '/reminders', icon: Bell, label: 'Reminders', badge: true },
  { path: '/stats', icon: BarChart3, label: 'Stats' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

const MASCOT_QUOTES = [
  'I just grow.\nYou decide.',
  'One responsibility\nat a time they said.\nThey lied.',
  'Permission granted.\nConsequences pending.',
  'Not my fault\nyou\'re outside\nthe district.',
  'One Valli?\nThat\'s cute.',
  'The work isn\'t\nthe Valli.\nEverything after is.',
];

export default function Sidebar({ reminderCount = 0 }) {
  const randomQuote = MASCOT_QUOTES[Math.floor(Math.random() * MASCOT_QUOTES.length)];

  return (
    <aside className="sidebar" aria-label="Main navigation">
      {/* Logo */}
      <div className="sidebar__logo">
        <div className="sidebar__logo-icon">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="18" fill="var(--sap-green-light)" />
            <path d="M20 32c0-8-4-12-8-14 2 0 4 1 6 3 0-4 1-8 4-12 2 4 3 8 3 12 2-2 4-3 6-3-4 2-8 6-8 14h-3z" fill="var(--sap-green)" />
            <circle cx="17" cy="18" r="1.5" fill="var(--brown)" />
            <circle cx="23" cy="18" r="1.5" fill="var(--brown)" />
            <path d="M18 22c1 1 3 1 4 0" stroke="var(--brown)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          </svg>
        </div>
        <div className="sidebar__logo-text">
          <span className="sidebar__logo-title">VALLI<br/>CHEDI</span>
          <span className="sidebar__logo-tagline">Permission granted.<br/>Consequences pending.</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar__nav">
        {NAV_ITEMS.map(({ path, icon: Icon, label, badge }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
            }
          >
            <Icon size={18} strokeWidth={2} />
            <span>{label}</span>
            {badge && reminderCount > 0 && (
              <span className="sidebar__badge">{reminderCount}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Mascot */}
      <div className="sidebar__mascot">
        <div className="sidebar__speech-bubble">
          <p>{randomQuote}</p>
        </div>
        <div className="sidebar__mascot-character">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            {/* Pot */}
            <path d="M18 48 L22 58 L42 58 L46 48 Z" fill="var(--brown)" />
            <path d="M16 44 L48 44 L46 48 L18 48 Z" fill="var(--brown-dark)" />
            {/* Body */}
            <ellipse cx="32" cy="38" rx="12" ry="10" fill="var(--sap-green)" />
            {/* Face */}
            <circle cx="28" cy="36" r="2" fill="var(--brown-dark)" />
            <circle cx="36" cy="36" r="2" fill="var(--brown-dark)" />
            <path d="M29 40 Q32 43 35 40" stroke="var(--brown-dark)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            {/* Leaf */}
            <path d="M32 28 Q38 22 34 16 Q28 22 32 28Z" fill="var(--sap-green-dark)" />
          </svg>
        </div>
      </div>
    </aside>
  );
}
