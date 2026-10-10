import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo.jsx';
import Button from './Button.jsx';
import Icon from './Icon.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const LINKS = [
  { label: 'Home', href: '#top' },
  { label: 'Features', href: '#features' },
  { label: 'Diseases', href: '#diseases' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'About', href: '#about' },
];

export default function Navbar() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <header className={`navbar ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="navbar__inner container">
        <Logo />
        <nav className={`navbar__links ${open ? 'is-open' : ''}`} aria-label="Main">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
          ))}
          <div className="navbar__actions navbar__actions--mobile">
            {user ? (
              <Button to="/dashboard">Open dashboard</Button>
            ) : (
              <>
                <Button to="/login" variant="secondary">Login</Button>
                <Button to="/register">Get started</Button>
              </>
            )}
          </div>
        </nav>
        <div className="navbar__actions navbar__actions--desktop">
          {user ? (
            <Button to="/dashboard">Open dashboard</Button>
          ) : (
            <>
              <Link to="/login" className="navbar__login">Login</Link>
              <Button to="/register">Get started</Button>
            </>
          )}
        </div>
        <button type="button" className="navbar__burger" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label={open ? 'Close menu' : 'Open menu'}>
          <Icon name={open ? 'x' : 'menu'} size={22} />
        </button>
      </div>
    </header>
  );
}
