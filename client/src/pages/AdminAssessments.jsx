import { useState } from 'react';
import PageHeader from '../components/PageHeader.jsx';
import Input from '../components/Input.jsx';
import Select from '../components/Select.jsx';
import Button from '../components/Button.jsx';
import Modal from '../components/Modal.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import Pagination from '../components/Pagination.jsx';
import ErrorState from '../components/ErrorState.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Skeleton from '../components/Skeleton.jsx';
import RiskBadge from '../components/RiskBadge.jsx';
import useFetch from '../hooks/useFetch.js';
import useDebounce from '../hooks/useDebounce.js';
import { useToast } from '../context/ToastContext.jsx';
import { deleteAdminAssessment, getAdminAssessment, getAdminAssessments } from '../services/adminService.js';
import { DISEASES } from '../utils/diseases.js';
import { featureMap, formatDateTime, formatValue } from '../utils/format.js';
import { friendlyError } from '../utils/errors.js';

const RISKS = [{ value: 'Low', label: 'Low risk' }, { value: 'Moderate', label: 'Moderate risk' }, { value: 'High', label: 'High risk' }];

function AssessmentDetail({ id }) {
  const { data, loading, error } = useFetch(() => getAdminAssessment(id), [id]);
  if (error) return <ErrorState message={error} />;
  if (loading) return <div className="skeleton-stack"><Skeleton height={24} /><Skeleton height={24} /><Skeleton height={120} /></div>;
  const { assessment: a, features } = data;
  const byKey = featureMap(features);
  return (
    <>
      <dl className="input-list">
        <div><dt>User</dt><dd>{a.userId ? `${a.userId.name} (${a.userId.email})` : 'Deleted user'}</dd></div>
        <div><dt>Condition</dt><dd>{a.diseaseName}</dd></div>
        <div><dt>Risk level</dt><dd><RiskBadge level={a.riskLevel} /></dd></div>
        <div><dt>Probability</dt><dd>{a.probability}%</dd></div>
        <div><dt>Date</dt><dd>{formatDateTime(a.createdAt)}</dd></div>
      </dl>
      <h3 className="card__subtitle">Input information</h3>
      <dl className="input-list">
        {Object.entries(a.inputData).map(([key, value]) => <div key={key}><dt>{byKey[key]?.label || key}</dt><dd>{formatValue(byKey[key], value)}</dd></div>)}
      </dl>
    </>
  );
}

export default function AdminAssessments() {
  const toast = useToast();
  const [filters, setFilters] = useState({ search: '', disease: '', risk: '' });
  const [page, setPage] = useState(1);
  const search = useDebounce(filters.search);
  const { data, loading, error, reload } = useFetch(() => getAdminAssessments({ page, limit: 10, search, disease: filters.disease, risk: filters.risk }), [page, search, filters.disease, filters.risk]);
  const [viewId, setViewId] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const setFilter = (key) => (e) => { setFilters((f) => ({ ...f, [key]: e.target.value })); setPage(1); };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteAdminAssessment(toDelete._id);
      toast.success('Assessment deleted.');
      setToDelete(null);
      reload();
    } catch (err) {
      toast.error(friendlyError(err));
    } finally {
      setDeleting(false);
    }
  };

  const who = (a) => (a.userId ? a.userId.name : 'Deleted user');

  return (
    <>
      <PageHeader title="Assessments" subtitle="Review assessments across all users and remove test or inappropriate records." />
      <section className="card filters filters--3">
        <Input label="Search" icon="search" placeholder="User or condition" value={filters.search} onChange={setFilter('search')} />
        <Select label="Condition" placeholder="All conditions" options={DISEASES.map((d) => ({ value: d.id, label: d.name }))} value={filters.disease} onChange={setFilter('disease')} />
        <Select label="Risk level" placeholder="All levels" options={RISKS} value={filters.risk} onChange={setFilter('risk')} />
      </section>
      <section className="card">
        {error ? <ErrorState message={error} onRetry={reload} /> : loading ? (
          <div className="skeleton-stack">{Array.from({ length: 6 }, (_, i) => <Skeleton key={i} height={46} />)}</div>
        ) : data.items.length === 0 ? (
          <EmptyState icon="search" title="No assessments found" text="Try different filters." />
        ) : (
          <>
            <div className="table-wrap table-only">
              <table className="table">
                <thead><tr><th>User</th><th>Condition</th><th>Risk level</th><th>Probability</th><th>Date</th><th><span className="sr-only">Actions</span></th></tr></thead>
                <tbody>
                  {data.items.map((a) => (
                    <tr key={a._id}>
                      <td><strong>{who(a)}</strong><br /><span className="muted small">{a.userId?.email}</span></td>
                      <td>{a.diseaseName}</td>
                      <td><RiskBadge level={a.riskLevel} /></td>
                      <td>{a.probability}%</td>
                      <td>{formatDateTime(a.createdAt)}</td>
                      <td className="table__actions">
                        <Button variant="ghost" onClick={() => setViewId(a._id)}>View</Button>
                        <Button variant="ghost" className="danger-text" onClick={() => setToDelete(a)}>Delete</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="cards-only">
              {data.items.map((a) => (
                <article key={a._id} className="prediction-card">
                  <div className="prediction-card__top"><strong>{a.diseaseName}</strong><RiskBadge level={a.riskLevel} /></div>
                  <p className="muted small">{who(a)} · {a.probability}%</p>
                  <div className="prediction-card__actions">
                    <Button variant="secondary" onClick={() => setViewId(a._id)}>View</Button>
                    <Button variant="ghost" className="danger-text" onClick={() => setToDelete(a)}>Delete</Button>
                  </div>
                </article>
              ))}
            </div>
            <Pagination page={data.page} pages={data.pages} onChange={setPage} />
          </>
        )}
      </section>
      <Modal open={Boolean(viewId)} title="Assessment details" onClose={() => setViewId(null)}>{viewId && <AssessmentDetail id={viewId} />}</Modal>
      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete this assessment?"
        message="This record will be permanently removed from the user's history."
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}
