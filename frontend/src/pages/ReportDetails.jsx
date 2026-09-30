import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { API_URL, getErrorMessage, reportsApi } from '../services/api.js';
import { fmtDate, fmtDateTime, fmtTime, STATUSES, typeLabel } from '../services/constants.js';
import MapView from '../components/MapView.jsx';
import { ErrorState, PageHeader, Spinner, StatusBadge } from '../components/ui.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function ReportDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setReport((await reportsApi.get(id)).data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const changeStatus = async (e) => {
    setBusy(true);
    try {
      const { data } = await reportsApi.update(id, {
        crimeType: report.crimeType,
        description: report.description,
        location: report.location,
        latitude: report.latitude,
        longitude: report.longitude,
        date: report.date,
        time: report.time,
        status: e.target.value,
      });
      setReport(data);
      toast.success('Status updated.');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!window.confirm('Delete this report? This cannot be undone.')) return;
    setBusy(true);
    try {
      await reportsApi.remove(id);
      toast.success('Report deleted.');
      navigate('/reports');
    } catch (err) {
      toast.error(getErrorMessage(err));
      setBusy(false);
    }
  };

  if (loading) return <Spinner />;
  if (error) return (<><PageHeader title="Report details" /><ErrorState message={error} onRetry={load} /><Link to="/reports">Back to my reports</Link></>);

  return (
    <>
      <PageHeader
        title={`${typeLabel(report.crimeType)} report`}
        subtitle={`ID ${report.id}`}
        actions={<Link to="/reports" className="btn btn-ghost">Back</Link>}
      />
      <div className="grid grid-2">
        <section className="card">
          <dl className="details">
            <dt>Status</dt><dd><StatusBadge status={report.status} /></dd>
            <dt>Description</dt><dd className="prewrap">{report.description}</dd>
            <dt>Location</dt><dd>{report.location}</dd>
            {report.latitude != null && report.longitude != null && (<><dt>Coordinates</dt><dd className="mono">{report.latitude}, {report.longitude}</dd></>)}
            <dt>Date and time</dt><dd>{fmtDate(report.date)} at {fmtTime(report.time)}</dd>
            <dt>Created</dt><dd>{fmtDateTime(report.createdAt)}</dd>
            <dt>Last updated</dt><dd>{fmtDateTime(report.updatedAt)}</dd>
          </dl>

          <div className="field">
            <label htmlFor="status">Change status</label>
            <select id="status" value={report.status} onChange={changeStatus} disabled={busy}>
              {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            <p className="hint">Prototype note: you can set this yourself. It is only a label in this app.</p>
          </div>
          <button type="button" className="btn btn-danger btn-sm" onClick={remove} disabled={busy}>Delete report</button>
        </section>

        <section className="card">
          {report.imageUrl && (<><h2>Photo</h2><img className="preview" src={`${API_URL}${report.imageUrl}`} alt="Uploaded evidence for this report" /></>)}
          {report.latitude != null && report.longitude != null ? (
            <><h2>Where it happened</h2><MapView lat={report.latitude} lng={report.longitude} title="Report location" /></>
          ) : !report.imageUrl && <p className="muted">No photo or coordinates were added to this report.</p>}
        </section>
      </div>
    </>
  );
}
