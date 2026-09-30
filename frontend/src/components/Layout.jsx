import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Logo } from './ui.jsx';

const NAV_ITEMS = [
  ['/dashboard', 'Dashboard'],
  ['/report', 'Report a crime'],
  ['/reports', 'My reports'],
  ['/safe-places', 'Safe places'],
  ['/contacts', 'Emergency contacts'],
  ['/sos', 'SOS'],
  ['/profile', 'Profile'],
  ['/settings', 'Settings'],
];

export default function Layout() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => setOpen(false), [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="shell">
      <a className="skip-link" href="#main">Skip to content</a>

      <header className="topbar">
        <Logo size={24} />
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          aria-expanded={open}
          aria-controls="sidebar"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </header>

      <aside id="sidebar" className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-brand"><Logo /></div>
        <nav aria-label="Main">
          {NAV_ITEMS.map(([to, label]) => (
            <NavLink key={to} to={to} end className={({ isActive }) => `nav-link ${to === '/sos' ? 'nav-sos' : ''} ${isActive ? 'active' : ''}`}>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-foot">
          <p className="small">Signed in as<br /><strong>{user?.name}</strong></p>
          <button type="button" className="btn btn-ghost btn-sm" onClick={handleLogout}>Log out</button>
        </div>
      </aside>
      {open && <div className="scrim" onClick={() => setOpen(false)} aria-hidden="true" />}

      <main id="main" className="main">
        <div className="notice-bar" role="note">
          Prototype only. Crime Detector does not contact police or emergency services. In danger, call your local emergency number.
        </div>
        <Outlet />
      </main>
    </div>
  );
}
