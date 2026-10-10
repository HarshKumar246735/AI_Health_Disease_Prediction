const LABELS = { Low: 'Low risk', Moderate: 'Moderate risk', High: 'High risk' };

export default function RiskBadge({ level }) {
  return <span className={`risk-badge risk-badge--${String(level).toLowerCase()}`}>{LABELS[level] || level}</span>;
}
