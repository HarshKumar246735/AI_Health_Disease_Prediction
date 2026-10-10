import { Navigate, useSearchParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import DiseaseCard from '../components/DiseaseCard.jsx';
import ErrorState from '../components/ErrorState.jsx';
import Skeleton from '../components/Skeleton.jsx';
import useFetch from '../hooks/useFetch.js';
import { getDiseases } from '../services/diseaseService.js';

export default function AssessmentSelect() {
  const [params] = useSearchParams();
  const { data, loading, error, reload } = useFetch(getDiseases);

  // Links from the landing page use /assessment?disease=heart
  if (params.get('disease')) return <Navigate to={`/assessment/${params.get('disease')}`} replace />;

  return (
    <>
      <PageHeader title="New assessment" subtitle="Choose a condition. Each assessment asks only for the information its model needs." />
      {error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : (
        <div className="disease-grid disease-grid--app">
          {loading
            ? Array.from({ length: 6 }, (_, i) => <Skeleton key={i} height={210} radius={18} />)
            : data.map((d) => <DiseaseCard key={d.id} disease={d} parameterCount={d.featureCount} to={`/assessment/${d.id}`} />)}
        </div>
      )}
    </>
  );
}
