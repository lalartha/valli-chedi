import { NavLink } from 'react-router-dom';
import { Home, Activity, Link2, Bell, BarChart3 } from 'lucide-react';
import './MobileNav.css';

const NAV_ITEMS = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/activities', icon: Activity, label: 'Activities' },
  { path: '/valli-chain', icon: Link2, label: 'Chain' },
  { path: '/reminders', icon: Bell, label: 'Reminders' },
  { path: '/stats', icon: BarChart3, label: 'Stats' },
];

export default function MobileNav() {
  return (
    <nav className="mobile-nav" aria-label="Mobile navigation">
      {NAV_ITEMS.map(({ path, icon: Icon, label }) => (
        <NavLink
          key={path}
          to={path}
          end={path === '/'}
          className={({ isActive }) =>
            `mobile-nav__item ${isActive ? 'mobile-nav__item--active' : ''}`
          }
        >
          <Icon size={20} strokeWidth={2} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
