import { useState } from 'react';
import PageHeader from '../components/PageHeader.jsx';
import Input from '../components/Input.jsx';
import Select from '../components/Select.jsx';
import Button from '../components/Button.jsx';
import PredictionsTable from '../components/PredictionsTable.jsx';
import Pagination from '../components/Pagination.jsx';
import ErrorState from '../components/ErrorState.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import Skeleton from '../components/Skeleton.jsx';
import useFetch from '../hooks/useFetch.js';
import useDebounce from '../hooks/useDebounce.js';
import { useToast } from '../context/ToastContext.jsx';
import { DISEASES } from '../utils/diseases.js';
import { deletePrediction, listPredictions } from '../services/predictionService.js';
import { friendlyError } from '../utils/errors.js';

const RISKS = [{ value: 'Low', label: 'Low risk' }, { value: 'Moderate', label: 'Moderate risk' }, { value: 'High', label: 'High risk' }];
const SORTS = [{ value: 'newest', label: 'Newest first' }, { value: 'oldest', label: 'Oldest first' }, { value: 'probability', label: 'Highest probability' }];

export default function History() {
  const toast = useToast();
  const [filters, setFilters] = useState({ search: '', disease: '', risk: '', sort: 'newest' });
  const [page, setPage] = useState(1);
  const search = useDebounce(filters.search);
  const { data, loading, error, reload } = useFetch(
    () => listPredictions({ page, limit: 8, search, disease: filters.disease, risk: filters.risk, sort: filters.sort }),
    [page, search, filters.disease, filters.risk, filters.sort]
  );
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const setFilter = (key) => (e) => { setFilters((f) => ({ ...f, [key]: e.target.value })); setPage(1); };
  const hasFilters = filters.search || filters.disease || filters.risk;

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await deletePrediction(toDelete._id);
      toast.success('Assessment deleted.');
      setToDelete(null);
      reload();
    } catch (err) {
      toast.error(friendlyError(err));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <PageHeader title="My predictions" subtitle="Every assessment you have completed, saved in one place." action={<Button to="/assessment">New assessment</Button>} />

      <section className="card filters">
        <Input label="Search" icon="search" placeholder="Search by condition" value={filters.search} onChange={setFilter('search')} />
        <Select label="Condition" placeholder="All conditions" options={DISEASES.map((d) => ({ value: d.id, label: d.name }))} value={filters.disease} onChange={setFilter('disease')} />
        <Select label="Risk level" placeholder="All levels" options={RISKS} value={filters.risk} onChange={setFilter('risk')} />
        <Select label="Sort by" options={SORTS} value={filters.sort} onChange={setFilter('sort')} />
      </section>

      <section className="card">
        {error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : loading ? (
          <div className="skeleton-stack">{Array.from({ length: 5 }, (_, i) => <Skeleton key={i} height={46} />)}</div>
        ) : data.items.length === 0 ? (
          hasFilters ? (
            <EmptyState icon="search" title="No matching assessments" text="Try a different search or clear the filters." action={<Button variant="secondary" onClick={() => { setFilters({ search: '', disease: '', risk: '', sort: 'newest' }); setPage(1); }}>Clear filters</Button>} />
          ) : (
            <EmptyState icon="heart" title="No assessments yet" text="Your results will appear here after you complete an assessment." action={<Button to="/assessment">Start assessment</Button>} />
          )
        ) : (
          <>
            <PredictionsTable
              items={data.items}
              showStatus
              renderActions={(item) => <Button variant="ghost" className="danger-text" onClick={() => setToDelete(item)}>Delete</Button>}
            />
            <Pagination page={data.page} pages={data.pages} onChange={setPage} />
          </>
        )}
      </section>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete this assessment?"
        message={toDelete ? `Your ${toDelete.diseaseName} result will be permanently removed. This can't be undone.` : ''}
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}
