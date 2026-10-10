import { useState } from 'react';
import PageHeader from '../components/PageHeader.jsx';
import PredictionsTable from '../components/PredictionsTable.jsx';
import Pagination from '../components/Pagination.jsx';
import ErrorState from '../components/ErrorState.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Skeleton from '../components/Skeleton.jsx';
import Button from '../components/Button.jsx';
import useFetch from '../hooks/useFetch.js';
import { useToast } from '../context/ToastContext.jsx';
import { downloadReport, listPredictions } from '../services/predictionService.js';
import { downloadBlob } from '../utils/format.js';
import { friendlyError } from '../utils/errors.js';

export default function Reports() {
  const toast = useToast();
  const [page, setPage] = useState(1);
  const [busyId, setBusyId] = useState(null);
  const { data, loading, error, reload } = useFetch(() => listPredictions({ page, limit: 8 }), [page]);

  const download = async (item) => {
    setBusyId(item._id);
    try {
      downloadBlob(await downloadReport(item._id), `HealthPredict-${item.disease}.pdf`);
    } catch (err) {
      toast.error(friendlyError(err, "We couldn't create the report. Please try again."));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <>
      <PageHeader title="Reports" subtitle="Download a PDF report for any saved assessment to keep or share with your doctor." />
      <section className="card">
        {error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : loading ? (
          <div className="skeleton-stack">{Array.from({ length: 4 }, (_, i) => <Skeleton key={i} height={46} />)}</div>
        ) : data.items.length === 0 ? (
          <EmptyState icon="file" title="No reports yet" text="Complete an assessment and its report will be available here." action={<Button to="/assessment">Start assessment</Button>} />
        ) : (
          <>
            <PredictionsTable
              items={data.items}
              renderActions={(item) => <Button variant="secondary" loading={busyId === item._id} onClick={() => download(item)}>Download PDF</Button>}
            />
            <Pagination page={data.page} pages={data.pages} onChange={setPage} />
          </>
        )}
      </section>
    </>
  );
}
