import { Link } from 'react-router-dom';
import RiskBadge from './RiskBadge.jsx';
import PredictionCard from './PredictionCard.jsx';
import { formatDate } from '../utils/format.js';

// Table on desktop, cards on small screens (switched in CSS). `renderActions(item)` adds per-row buttons.
export default function PredictionsTable({ items, renderActions, showStatus = false }) {
  return (
    <>
      <div className="table-wrap table-only">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Condition</th>
              <th scope="col">Risk level</th>
              <th scope="col">Probability</th>
              <th scope="col">Date</th>
              {showStatus && <th scope="col">Status</th>}
              <th scope="col"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                <td><strong>{item.diseaseName}</strong></td>
                <td><RiskBadge level={item.riskLevel} /></td>
                <td>{item.probability}%</td>
                <td>{formatDate(item.createdAt)}</td>
                {showStatus && <td><span className="status">Saved</span></td>}
                <td className="table__actions">
                  <Link to={`/predictions/${item._id}`} className="btn btn--ghost">View result</Link>
                  {renderActions?.(item)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="cards-only">
        {items.map((item) => (
          <PredictionCard
            key={item._id}
            item={item}
            actions={<><Link to={`/predictions/${item._id}`} className="btn btn--secondary">View</Link>{renderActions?.(item)}</>}
          />
        ))}
      </div>
    </>
  );
}
