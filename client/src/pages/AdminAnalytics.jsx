import PageHeader from '../components/PageHeader.jsx';
import ErrorState from '../components/ErrorState.jsx';
import useFetch from '../hooks/useFetch.js';
import { getAdminStats } from '../services/adminService.js';
import { AdminCharts } from './AdminDashboard.jsx';

export default function AdminAnalytics() {
  const { data, loading, error, reload } = useFetch(getAdminStats);
  if (error) return <ErrorState message={error} onRetry={reload} />;
  return (
    <>
      <PageHeader title="Analytics" subtitle="User growth, assessment activity, condition popularity and risk distribution." />
      <AdminCharts s={data} loading={loading} wide />
    </>
  );
}
