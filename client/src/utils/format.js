export const formatDate = (iso) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
export const formatDateTime = (iso) =>
  new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
export const shortDay = (iso) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
export const shortMonth = (ym) => new Date(`${ym}-01T00:00:00Z`).toLocaleDateString('en-GB', { month: 'short', timeZone: 'UTC' });
export const firstName = (name = '') => name.trim().split(' ')[0];

export const featureMap = (features) => Object.fromEntries((features || []).map((f) => [f.key, f]));

export function formatValue(feature, value) {
  if (!feature) return String(value);
  if (feature.type === 'boolean') return Number(value) === 1 ? 'Yes' : 'No';
  if (feature.type === 'select') {
    const option = (feature.options || []).find((o) => Math.abs(Number(o.value) - Number(value)) < 1e-9);
    return option ? option.label : String(value);
  }
  return `${value}${feature.unit ? ` ${feature.unit}` : ''}`;
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
