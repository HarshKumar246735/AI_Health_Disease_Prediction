import PageHeader from '../components/PageHeader.jsx';
import ErrorState from '../components/ErrorState.jsx';
import Skeleton from '../components/Skeleton.jsx';
import useFetch from '../hooks/useFetch.js';
import { useAuth } from '../context/AuthContext.jsx';
import { getSystemInfo } from '../services/adminService.js';

export default function AdminSettings() {
  const { user } = useAuth();
  const { data, loading, error, reload } = useFetch(getSystemInfo);
  const dot = (ok) => <span className={`dot ${ok ? 'dot--ok' : 'dot--bad'}`} aria-hidden="true" />;
  return (
    <>
      <PageHeader title="Settings" subtitle="System status and your admin account." />
      <div className="grid-2">
        <section className="card">
          <h3>System status</h3>
          {error ? <ErrorState message={error} onRetry={reload} /> : loading ? (
            <div className="skeleton-stack"><Skeleton height={24} /><Skeleton height={24} /><Skeleton height={24} /></div>
          ) : (
            <dl className="input-list">
              <div><dt>Database</dt><dd>{dot(data.database === 'connected')}{data.database}</dd></div>
              <div><dt>ML service</dt><dd>{dot(data.mlService === 'reachable')}{data.mlService}</dd></div>
              <div><dt>Environment</dt><dd>{data.environment}</dd></div>
              <div><dt>Node.js</dt><dd>{data.node}</dd></div>
            </dl>
          )}
        </section>
        <section className="card">
          <h3>Your account</h3>
          <dl className="input-list">
            <div><dt>Name</dt><dd>{user.name}</dd></div>
            <div><dt>Email</dt><dd>{user.email}</dd></div>
            <div><dt>Role</dt><dd>Administrator</dd></div>
          </dl>
        </section>
      </div>
    </>
  );
}
