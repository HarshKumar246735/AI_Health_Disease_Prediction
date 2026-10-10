import { Link } from 'react-router-dom';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import PageHeader from '../components/PageHeader.jsx';
import StatCard from '../components/StatCard.jsx';
import ChartCard from '../components/ChartCard.jsx';
import Button from '../components/Button.jsx';
import ErrorState from '../components/ErrorState.jsx';
import EmptyState from '../components/EmptyState.jsx';
import PredictionsTable from '../components/PredictionsTable.jsx';
import Skeleton from '../components/Skeleton.jsx';
import useFetch from '../hooks/useFetch.js';
import { useAuth } from '../context/AuthContext.jsx';
import { getRecent, getStats } from '../services/dashboardService.js';
import { firstName, shortDay } from '../utils/format.js';
import { BRAND_COLORS, RISK_COLORS } from '../utils/risk.js';

export default function Dashboard() {
  const { user } = useAuth();
  const stats = useFetch(getStats);
  const recent = useFetch(getRecent);
  const s = stats.data;
  const lastTwoWeeks = s ? s.history.reduce((sum, d) => sum + d.count, 0) : 0;

  if (stats.error) return <ErrorState message={stats.error} onRetry={stats.reload} />;

  return (
    <>
      <PageHeader
        title={`Welcome back, ${firstName(user?.name)}`}
        subtitle="Here is a summary of your health-risk assessments."
        action={<Button to="/assessment">Start assessment</Button>}
      />

      <div className="stat-grid">
        <StatCard label="Total assessments" value={s?.total} icon="layers" loading={stats.loading} />
        <StatCard label="High-risk results" value={s?.high} icon="alert" tone="red" loading={stats.loading} />
        <StatCard label="Low-risk results" value={s?.low} icon="check" tone="green" loading={stats.loading} />
        <StatCard label="Last 14 days" value={lastTwoWeeks} icon="clock" tone="amber" loading={stats.loading} />
      </div>

      <div className="grid-3">
        <ChartCard title="Assessment history" subtitle="Assessments per day, last 14 days" loading={stats.loading} empty={s && s.total === 0} emptyText="Run your first assessment to see your history here." className="span-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={s?.history} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="hist" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={BRAND_COLORS.blue} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={BRAND_COLORS.blue} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={BRAND_COLORS.grid} vertical={false} />
              <XAxis dataKey="date" tickFormatter={shortDay} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
              <Tooltip labelFormatter={shortDay} />
              <Area type="monotone" dataKey="count" name="Assessments" stroke={BRAND_COLORS.blue} strokeWidth={2.5} fill="url(#hist)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Risk distribution" loading={stats.loading} empty={s && s.total === 0}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={s?.riskDistribution} dataKey="value" nameKey="name" innerRadius="55%" outerRadius="80%" paddingAngle={2}>
                {s?.riskDistribution.map((r) => <Cell key={r.name} fill={RISK_COLORS[r.name]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <ul className="legend">
            {s?.riskDistribution.map((r) => (
              <li key={r.name}><i style={{ background: RISK_COLORS[r.name] }} />{r.name} ({r.value})</li>
            ))}
          </ul>
        </ChartCard>
      </div>

      <div className="grid-3">
        <ChartCard title="Assessments by condition" loading={stats.loading} empty={s && s.byDisease.length === 0} className="span-2" height={Math.max(220, (s?.byDisease.length || 0) * 38)}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={s?.byDisease} layout="vertical" margin={{ top: 0, right: 16, left: 8, bottom: 0 }}>
              <CartesianGrid stroke={BRAND_COLORS.grid} horizontal={false} />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="count" name="Assessments" fill={BRAND_COLORS.navy} radius={[0, 6, 6, 0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <section className="card quick-actions">
          <h3>Quick actions</h3>
          <Button to="/assessment">Start assessment</Button>
          <Button to="/history" variant="secondary">View history</Button>
          <Button to="/reports" variant="secondary">Download report</Button>
        </section>
      </div>

      <section className="card">
        <header className="card__head">
          <h3>Recent predictions</h3>
          <Link to="/history">View all</Link>
        </header>
        {recent.loading ? (
          <div className="skeleton-stack"><Skeleton height={44} /><Skeleton height={44} /><Skeleton height={44} /></div>
        ) : recent.error ? (
          <ErrorState message={recent.error} onRetry={recent.reload} />
        ) : recent.data.length === 0 ? (
          <EmptyState icon="heart" title="No assessments yet" text="Choose a condition and answer a few questions to get your first estimate." action={<Button to="/assessment">Start assessment</Button>} />
        ) : (
          <PredictionsTable items={recent.data} />
        )}
      </section>
    </>
  );
}
