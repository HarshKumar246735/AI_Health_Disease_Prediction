import { Link } from 'react-router-dom';

export default function Logo({ light = false }) {
  return (
    <Link to="/" className={`logo ${light ? 'logo--light' : ''}`} aria-label="HealthPredict home">
      <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="8" fill={light ? '#ffffff' : '#0f3157'} />
        <path d="M5 17h5l3-7 4 13 3-8 2 2h5" fill="none" stroke={light ? '#0f3157' : '#3fd0a1'} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>HealthPredict</span>
    </Link>
  );
}
