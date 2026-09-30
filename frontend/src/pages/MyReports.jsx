import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getErrorMessage, reportsApi } from '../services/api.js';
import { fmtDate, fmtDateTime, fmtTime, shortId, typeLabel } from '../services/constants.js';
import { EmptyState, ErrorState, PageHeader, Spinner, StatusBadge } from '../components/ui.jsx';

export default function MyReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setReports((await reportsApi.list()).data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <>
      <PageHeader
        title="My reports"
        subtitle="Statuses are labels inside this app. They do not mean the police have seen a report."
        actions={<Link to="/report" className="btn btn-primary">New report</Link>}
      />
      {error && <ErrorState message={error} onRetry={load} />}
      {loading ? <Spinner /> : reports.length === 0 && !error ? (
        <div className="card"><EmptyState title="No reports yet" text="When you save a report it shows up here." action={<Link className="btn btn-primary btn-sm" to="/report">Write a report</Link>} /></div>
      ) : (
        <div className="card table-wrap">
          <table>
            <thead>
              <tr><th>Report ID</th><th>Type</th><th>Location</th><th>Date</th><th>Time</th><th>Status</th><th>Created</th><th><span className="sr-only">Actions</span></th></tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id}>
                  <td className="mono">{shortId(r.id)}</td>
                  <td><strong>{typeLabel(r.crimeType)}</strong><br /><span className="small muted clamp">{r.description}</span></td>
                  <td>{r.location}</td>
                  <td>{fmtDate(r.date)}</td>
                  <td>{fmtTime(r.time)}</td>
                  <td><StatusBadge status={r.status} /></td>
                  <td className="small">{fmtDateTime(r.createdAt)}</td>
                  <td><Link to={`/reports/${r.id}`}>Open</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
