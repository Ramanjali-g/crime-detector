export const CRIME_TYPES = [
  { value: 'THEFT', label: 'Theft' },
  { value: 'HARASSMENT', label: 'Harassment' },
  { value: 'ASSAULT', label: 'Assault' },
  { value: 'BURGLARY', label: 'Burglary' },
  { value: 'VANDALISM', label: 'Vandalism' },
  { value: 'FRAUD', label: 'Fraud' },
  { value: 'CYBERCRIME', label: 'Cybercrime' },
  { value: 'OTHER', label: 'Other' },
];

export const STATUSES = [
  { value: 'SUBMITTED', label: 'Submitted' },
  { value: 'UNDER_REVIEW', label: 'Under review' },
  { value: 'RESOLVED', label: 'Resolved' },
];

export const typeLabel = (value) => CRIME_TYPES.find((t) => t.value === value)?.label ?? value;
export const statusLabel = (value) => STATUSES.find((s) => s.value === value)?.label ?? value;

export const EMERGENCY_NUMBERS = [
  { value: '112', label: '112 (India, EU)' },
  { value: '911', label: '911 (US, Canada)' },
  { value: '999', label: '999 (UK)' },
  { value: '000', label: '000 (Australia)' },
];

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_PATTERN = /^[+0-9()\-\s]{6,20}$/;

export function fmtDate(value) {
  if (!value) return '—';
  const date = new Date(value.length === 10 ? `${value}T00:00:00` : value);
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}
export const fmtDateTime = (iso) => (iso ? new Date(iso).toLocaleString() : '—');
export const fmtTime = (value) => (value ? value.slice(0, 5) : '—');
export const shortId = (id) => (id ? `#${id.slice(-6).toUpperCase()}` : '');

const localISO = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString();
export const todayISO = () => localISO(new Date()).slice(0, 10);
export const nowHM = () => localISO(new Date()).slice(11, 16);

export function getStoredNumber() {
  return localStorage.getItem('cd_emergency_number') || '112';
}
