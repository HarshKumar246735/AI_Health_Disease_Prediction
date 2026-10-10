import Icon from './Icon.jsx';
import Skeleton from './Skeleton.jsx';

export default function StatCard({ label, value, icon, tone = 'blue', loading = false }) {
  return (
    <div className="stat-card">
      <span className={`stat-card__icon stat-card__icon--${tone}`}><Icon name={icon} size={20} /></span>
      <div>
        <p className="stat-card__label">{label}</p>
        {loading ? <Skeleton width={56} height={28} /> : <p className="stat-card__value">{value}</p>}
      </div>
    </div>
  );
}
