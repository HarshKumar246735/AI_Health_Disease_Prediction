import RiskBadge from './RiskBadge.jsx';

// Decorative product preview. The values are an illustration of the interface, not real results.
const ARC_LENGTH = Math.PI * 80;

export default function HeroVisual() {
  const value = 0.64;
  return (
    <figure className="hero-visual" aria-label="Illustration of a risk result screen">
      <div className="hero-visual__panel">
        <div className="hero-visual__head">
          <span>Heart Disease</span>
          <RiskBadge level="Moderate" />
        </div>
        <svg viewBox="0 0 200 118" className="gauge" role="img" aria-label="Example estimated risk gauge at 64 percent">
          <path d="M20 100 A80 80 0 0 1 180 100" className="gauge__track" />
          <path
            d="M20 100 A80 80 0 0 1 180 100"
            className="gauge__value"
            style={{ '--arc': ARC_LENGTH, '--offset': ARC_LENGTH * (1 - value) }}
          />
          <text x="100" y="86" textAnchor="middle" className="gauge__number">64%</text>
          <text x="100" y="106" textAnchor="middle" className="gauge__label">Estimated risk</text>
        </svg>
        <ul className="hero-visual__factors">
          <li><span>Blood pressure</span><i style={{ '--w': '72%' }} /></li>
          <li><span>Cholesterol</span><i style={{ '--w': '58%' }} /></li>
          <li><span>Max heart rate</span><i style={{ '--w': '34%' }} /></li>
        </ul>
      </div>
      <div className="hero-visual__note">
        <strong>Sample screen</strong>
        <span>Illustration only. Not a real result.</span>
      </div>
    </figure>
  );
}
