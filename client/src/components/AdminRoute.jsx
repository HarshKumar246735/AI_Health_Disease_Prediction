import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import PageLoader from './Loader.jsx';

// Client-side guard for UX only. The API enforces ADMIN authorization on every admin endpoint.
export default function AdminRoute() {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
