import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import PageHeader from '../components/PageHeader.jsx';
import StatCard from '../components/StatCard.jsx';
import ChartCard from '../components/ChartCard.jsx';
import ErrorState from '../components/ErrorState.jsx';
import useFetch from '../hooks/useFetch.js';
import { getAdminStats } from '../services/adminService.js';
import { shortDay, shortMonth } from '../utils/format.js';
import { BRAND_COLORS, RISK_COLORS } from '../utils/risk.js';

export function AdminCharts({ s, loading, wide = false }) {
  const hasData = s && s.totalAssessments > 0;
  return (
    <div className={wide ? 'grid-2' : 'grid-3'}>
      <ChartCard title="Assessment activity" subtitle="Last 14 days" loading={loading} empty={s && !hasData} className={wide ? '' : 'span-2'}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={s?.activity} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid stroke={BRAND_COLORS.grid} vertical={false} />
            <XAxis dataKey="date" tickFormatter={shortDay} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
            <Tooltip labelFormatter={shortDay} />
            <Area type="monotone" dataKey="count" name="Assessments" stroke={BRAND_COLORS.blue} fill={BRAND_COLORS.blue} fillOpacity={0.12} strokeWidth={2.5} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard title="Risk distribution" loading={loading} empty={s && !hasData}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={s?.riskDistribution} dataKey="value" nameKey="name" innerRadius="55%" outerRadius="80%" paddingAngle={2}>
              {s?.riskDistribution.map((r) => <Cell key={r.name} fill={RISK_COLORS[r.name]} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <ul className="legend">{s?.riskDistribution.map((r) => <li key={r.name}><i style={{ background: RISK_COLORS[r.name] }} />{r.name} ({r.value})</li>)}</ul>
      </ChartCard>
      {wide && (
        <>
          <ChartCard title="User growth" subtitle="New users per month" loading={loading} empty={s && s.userGrowth.every((m) => m.count === 0)} emptyText="No new users in this period.">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={s?.userGrowth} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid stroke={BRAND_COLORS.grid} vertical={false} />
                <XAxis dataKey="month" tickFormatter={shortMonth} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip labelFormatter={shortMonth} />
                <Bar dataKey="count" name="New users" fill={BRAND_COLORS.green} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title="Condition popularity" loading={loading} empty={s && !hasData} height={Math.max(260, (s?.diseasePopularity.length || 0) * 36)}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={s?.diseasePopularity} layout="vertical" margin={{ top: 0, right: 16, left: 8, bottom: 0 }}>
                <CartesianGrid stroke={BRAND_COLORS.grid} horizontal={false} />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="count" name="Assessments" fill={BRAND_COLORS.navy} radius={[0, 6, 6, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const { data: s, loading, error, reload } = useFetch(getAdminStats);
  if (error) return <ErrorState message={error} onRetry={reload} />;
  return (
    <>
      <PageHeader title="Admin dashboard" subtitle="Platform activity at a glance." />
      <div className="stat-grid stat-grid--5">
        <StatCard label="Total users" value={s?.totalUsers} icon="user" loading={loading} />
        <StatCard label="Total assessments" value={s?.totalAssessments} icon="layers" tone="green" loading={loading} />
        <StatCard label="Today's assessments" value={s?.todayAssessments} icon="clock" tone="amber" loading={loading} />
        <StatCard label="High-risk assessments" value={s?.highRisk} icon="alert" tone="red" loading={loading} />
        <StatCard label="Active users (30 days)" value={s?.activeUsers} icon="chart" loading={loading} />
      </div>
      <AdminCharts s={s} loading={loading} />
    </>
  );
}
