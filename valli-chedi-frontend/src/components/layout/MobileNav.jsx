import { NavLink, useLocation } from 'react-router-dom';
import { Home, Activity, Link2, Bell, BarChart3 } from 'lucide-react';
import { useReminders } from '../../hooks/useReminders';
import './MobileNav.css';

const BASE_NAV_ITEMS = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/activities', icon: Activity, label: 'Activities' },
  { path: '/valli-chain', icon: Link2, label: 'Chain' },
  // Reminders path is dynamic
  { path: '/stats', icon: BarChart3, label: 'Stats' },
];

export default function MobileNav() {
  const { data } = useReminders({ active: 'true' });
  const location = useLocation();
  
  const reminders = data?.reminders || [];
  const familyReminders = reminders.filter(r => 
    r.type.includes('CHECKIN')
  );
  
  // Count how many are due or late (next_trigger < now)
  const now = new Date().getTime();
  const dueCount = familyReminders.filter(r => {
    if (!r.next_trigger) return false;
    return new Date(r.next_trigger).getTime() <= now;
  }).length;

  const remindersPath = familyReminders.length > 0 ? '/family-checkin' : '/reminders';

  // Inject dynamic reminders item
  const navItems = [
    BASE_NAV_ITEMS[0],
    BASE_NAV_ITEMS[1],
    BASE_NAV_ITEMS[2],
    { 
      path: remindersPath, 
      icon: Bell, 
      label: 'Reminders',
      badge: dueCount > 0 ? dueCount : null
    },
    BASE_NAV_ITEMS[3],
  ];

  return (
    <nav className="mobile-nav" aria-label="Mobile navigation">
      {navItems.map(({ path, icon: Icon, label, badge }) => {
        const isActive = location.pathname === path || (path === '/family-checkin' && location.pathname === '/reminders');
        return (
          <NavLink
            key={label}
            to={path}
            className={`mobile-nav__item ${isActive ? 'mobile-nav__item--active' : ''}`}
          >
            <div style={{ position: 'relative' }}>
              <Icon size={20} strokeWidth={2} />
              {badge && (
                <span style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-10px',
                  background: 'var(--error-color)',
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  padding: '2px 6px',
                  borderRadius: '10px'
                }}>
                  {badge}
                </span>
              )}
            </div>
            <span>{label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
