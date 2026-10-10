import { Link } from 'react-router-dom';
import Logo from './Logo.jsx';
import { DISCLAIMER } from '../utils/diseases.js';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <Logo light />
          <p>Understand your health risks. Make informed decisions.</p>
        </div>
        <nav className="footer__cols" aria-label="Footer">
          <div>
            <h4>Product</h4>
            <a href="/#features">Features</a>
            <a href="/#diseases">Diseases</a>
            <a href="/#how-it-works">How it works</a>
          </div>
          <div>
            <h4>Company</h4>
            <a href="/#about">About</a>
            <Link to="/contact">Contact</Link>
          </div>
          <div>
            <h4>Legal</h4>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/disclaimer">Disclaimer</Link>
          </div>
        </nav>
      </div>
      <div className="container footer__bottom">
        <p>{DISCLAIMER}</p>
        <p>&copy; {new Date().getFullYear()} HealthPredict</p>
      </div>
    </footer>
  );
}
