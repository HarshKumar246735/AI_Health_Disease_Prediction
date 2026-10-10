import { NavLink, useNavigate } from 'react-router-dom';
import Logo from './Logo.jsx';
import Icon from './Icon.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const USER_NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: 'chart' },
  { to: '/assessment', label: 'New assessment', icon: 'heart' },
  { to: '/history', label: 'My predictions', icon: 'clock' },
  { to: '/insights', label: 'Health insights', icon: 'info' },
  { to: '/reports', label: 'Reports', icon: 'file' },
  { to: '/profile', label: 'Profile', icon: 'user' },
];

const ADMIN_NAV = [
  { to: '/admin', label: 'Dashboard', icon: 'chart', end: true },
  { to: '/admin/users', label: 'Users', icon: 'user' },
  { to: '/admin/assessments', label: 'Assessments', icon: 'clock' },
  { to: '/admin/diseases', label: 'Diseases', icon: 'layers' },
  { to: '/admin/analytics', label: 'Analytics', icon: 'gauge' },
  { to: '/admin/settings', label: 'Settings', icon: 'shield' },
];

export default function Sidebar({ variant, open, onClose }) {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const items = variant === 'admin' ? ADMIN_NAV : USER_NAV;

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <>
      {open && <div className="sidebar-scrim" onClick={onClose} aria-hidden="true" />}
      <aside className={`sidebar ${open ? 'is-open' : ''}`} aria-label={variant === 'admin' ? 'Admin navigation' : 'Main navigation'}>
        <div className="sidebar__brand">
          <Logo light />
          {variant === 'admin' && <span className="sidebar__tag">Admin</span>}
        </div>
        <nav className="sidebar__nav">
          {items.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => `sidebar__link ${isActive ? 'is-active' : ''}`}>
              <Icon name={item.icon} size={19} />
              {item.label}
            </NavLink>
          ))}
          {variant === 'admin' && (
            <NavLink to="/dashboard" className="sidebar__link"><Icon name="arrow" size={19} />Back to app</NavLink>
          )}
          {variant !== 'admin' && isAdmin && (
            <NavLink to="/admin" className="sidebar__link"><Icon name="shield" size={19} />Admin area</NavLink>
          )}
        </nav>
        <div className="sidebar__foot">
          <div className="sidebar__user">
            <span className="avatar" aria-hidden="true">{user?.name?.[0]?.toUpperCase()}</span>
            <div>
              <strong>{user?.name}</strong>
              <span>{user?.email}</span>
            </div>
          </div>
          <button type="button" className="sidebar__logout" onClick={handleLogout}><Icon name="arrow" size={18} />Logout</button>
        </div>
      </aside>
    </>
  );
}
