import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Logo from './Logo.jsx';
import Icon from './Icon.jsx';

export default function AppLayout({ variant = 'user' }) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="app-shell">
      <Sidebar variant={variant} open={open} onClose={() => setOpen(false)} />
      <div className="app-main">
        <header className="app-topbar">
          <button type="button" onClick={() => setOpen(true)} aria-label="Open navigation" aria-expanded={open}><Icon name="menu" size={22} /></button>
          <Logo />
        </header>
        <main className="app-content"><Outlet /></main>
      </div>
    </div>
  );
}
