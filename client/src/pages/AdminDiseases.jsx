import PageHeader from '../components/PageHeader.jsx';
import ErrorState from '../components/ErrorState.jsx';
import Skeleton from '../components/Skeleton.jsx';
import Icon from '../components/Icon.jsx';
import useFetch from '../hooks/useFetch.js';
import { getAdminModels } from '../services/adminService.js';
import { formatDate } from '../utils/format.js';

export default function AdminDiseases() {
  const { data, loading, error, reload } = useFetch(getAdminModels);
  return (
    <>
      <PageHeader title="Diseases and models" subtitle="Model details for every supported condition." />
      <p className="callout"><Icon name="info" size={18} /> Metrics are measured on a held-out split of each public dataset. They do not represent real-world clinical accuracy.</p>
      <section className="card">
        {error ? <ErrorState message={error} onRetry={reload} /> : loading ? (
          <div className="skeleton-stack">{Array.from({ length: 6 }, (_, i) => <Skeleton key={i} height={46} />)}</div>
        ) : (
          <>
            {!data.mlServiceHealthy && <p className="form-alert" role="alert"><Icon name="alert" size={18} /> The ML service is not reachable right now.</p>}
            <div className="table-wrap">
              <table className="table table--wide">
                <thead><tr><th>Condition</th><th>Model</th><th>Dataset</th><th>Features</th><th>Trained</th><th>Accuracy</th><th>Recall</th><th>F1</th><th>ROC AUC</th></tr></thead>
                <tbody>
                  {data.models.map((m) => (
                    <tr key={m.id}>
                      <td><strong>{m.name}</strong></td>
                      {m.trained ? (
                        <>
                          <td>{m.modelType}</td><td>{m.dataset}</td><td>{m.featureCount}</td><td>{formatDate(m.trainedAt)}</td>
                          <td>{m.metrics.accuracy}</td><td>{m.metrics.recall}</td><td>{m.metrics.f1}</td><td>{m.metrics.rocAuc}</td>
                        </>
                      ) : (
                        <td colSpan={8}><span className="muted">Not trained yet. Run training/train_{m.id}.py in ml-service.</span></td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </>
  );
}
