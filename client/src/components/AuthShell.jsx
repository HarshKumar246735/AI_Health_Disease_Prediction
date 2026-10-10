import Logo from './Logo.jsx';
import Icon from './Icon.jsx';
import { DISCLAIMER } from '../utils/diseases.js';

// Split layout shared by Login and Register. The brand panel collapses on small screens.
export default function AuthShell({ title, subtitle, children }) {
  return (
    <div className="auth">
      <aside className="auth__panel">
        <Logo light />
        <div className="auth__pitch">
          <h2>Understand your health risks. Make informed decisions.</h2>
          <p>Ten conditions, one place to run assessments, review history and download reports.</p>
        </div>
        <p className="auth__disclaimer"><Icon name="shield" size={16} /> {DISCLAIMER}</p>
      </aside>
      <main className="auth__main">
        <div className="auth__card">
          <div className="auth__mobile-logo"><Logo /></div>
          <h1>{title}</h1>
          <p className="auth__sub">{subtitle}</p>
          {children}
        </div>
      </main>
    </div>
  );
}
