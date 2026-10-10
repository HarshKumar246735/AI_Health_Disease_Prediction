import { Link } from 'react-router-dom';
import RiskBadge from './RiskBadge.jsx';
import { formatDate } from '../utils/format.js';

// Compact card used on mobile in place of table rows. `actions` is optional extra buttons.
export default function PredictionCard({ item, actions, to }) {
  return (
    <article className="prediction-card">
      <div className="prediction-card__top">
        <Link to={to || `/predictions/${item._id}`} className="prediction-card__title">{item.diseaseName}</Link>
        <RiskBadge level={item.riskLevel} />
      </div>
      <dl>
        <div><dt>Probability</dt><dd>{item.probability}%</dd></div>
        <div><dt>Date</dt><dd>{formatDate(item.createdAt)}</dd></div>
      </dl>
      {actions && <div className="prediction-card__actions">{actions}</div>}
    </article>
  );
}
