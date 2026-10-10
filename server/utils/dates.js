// Helpers for time-series charts: always return a point for every day/month, even when the count is zero.
const dayKey = (d) => d.toISOString().slice(0, 10);

exports.lastDays = (n) => {
  const days = [];
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  for (let i = n - 1; i >= 0; i -= 1) days.push(new Date(today.getTime() - i * 86400000));
  return days;
};

exports.fillDays = (rows, n) =>
  exports.lastDays(n).map((d) => ({ date: dayKey(d), count: rows.find((r) => r._id === dayKey(d))?.count || 0 }));

exports.lastMonths = (n) => {
  const months = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i -= 1) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    months.push(d.toISOString().slice(0, 7));
  }
  return months;
};

exports.fillMonths = (rows, n) =>
  exports.lastMonths(n).map((m) => ({ month: m, count: rows.find((r) => r._id === m)?.count || 0 }));
