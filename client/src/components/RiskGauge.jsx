import { RISK_COLORS } from '../utils/risk.js';

const ARC = Math.PI * 80;

export default function RiskGauge({ value, level, label = 'Estimated risk' }) {
  return (
    <svg viewBox="0 0 200 118" className="gauge" role="img" aria-label={`${label}: ${value} percent, ${level} risk`}>
      <path d="M20 100 A80 80 0 0 1 180 100" className="gauge__track" />
      <path
        d="M20 100 A80 80 0 0 1 180 100"
        className="gauge__value"
        style={{ '--arc': ARC, '--offset': ARC * (1 - Math.min(Math.max(value, 0), 100) / 100), stroke: RISK_COLORS[level] }}
      />
      <text x="100" y="86" textAnchor="middle" className="gauge__number">{value}%</text>
      <text x="100" y="106" textAnchor="middle" className="gauge__label">{label}</text>
    </svg>
  );
}
