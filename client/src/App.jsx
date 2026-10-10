import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ComingSoon from './pages/ComingSoon.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AssessmentSelect from './pages/AssessmentSelect.jsx';
import AssessmentForm from './pages/AssessmentForm.jsx';
import PredictionDetail from './pages/PredictionDetail.jsx';
import History from './pages/History.jsx';
import Insights from './pages/Insights.jsx';
import Reports from './pages/Reports.jsx';
import Profile from './pages/Profile.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminUsers from './pages/AdminUsers.jsx';
import AdminAssessments from './pages/AdminAssessments.jsx';
import AdminDiseases from './pages/AdminDiseases.jsx';
import AdminAnalytics from './pages/AdminAnalytics.jsx';
import AdminSettings from './pages/AdminSettings.jsx';
import StaticPage from './pages/StaticPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import AppLayout from './components/AppLayout.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout variant="user" />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/assessment" element={<AssessmentSelect />} />
          <Route path="/assessment/:id" element={<AssessmentForm />} />
          <Route path="/predictions/:id" element={<PredictionDetail />} />
          <Route path="/history" element={<History />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      <Route element={<AdminRoute />}>
        <Route element={<AppLayout variant="admin" />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/assessments" element={<AdminAssessments />} />
          <Route path="/admin/diseases" element={<AdminDiseases />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>
      </Route>

      <Route path="/privacy" element={<StaticPage page="privacy" />} />
      <Route path="/terms" element={<StaticPage page="terms" />} />
      <Route path="/disclaimer" element={<StaticPage page="disclaimer" />} />
      <Route path="/contact" element={<StaticPage page="contact" />} />
      <Route path="*" element={<ComingSoon title="Page not found" notFound />} />
    </Routes>
  );
}
