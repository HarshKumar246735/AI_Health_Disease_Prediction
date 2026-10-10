import Skeleton from './Skeleton.jsx';

export default function ChartCard({ title, subtitle, loading, empty, emptyText = 'No data yet.', height = 260, children, className = '' }) {
  return (
    <section className={`card chart-card ${className}`}>
      <header>
        <h3>{title}</h3>
        {subtitle && <p>{subtitle}</p>}
      </header>
      <div className="chart-card__body" style={{ height }}>
        {loading ? <Skeleton height="100%" radius={12} /> : empty ? <p className="chart-card__empty">{emptyText}</p> : children}
      </div>
    </section>
  );
}
