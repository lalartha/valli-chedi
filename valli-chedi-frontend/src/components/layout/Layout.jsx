import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import './Layout.css';

export default function Layout({ reminderCount = 0 }) {
  return (
    <div className="layout">
      <Sidebar reminderCount={reminderCount} />
      <main className="layout__main">
        <div className="layout__content">
          <Outlet />
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
