import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import useGeolocation from '../hooks/useGeolocation.js';
import { contactsApi, getErrorMessage, reportsApi } from '../services/api.js';
import { fmtDate, shortId, typeLabel } from '../services/constants.js';
import { getSafePlaces, PLACE_TYPES } from '../services/safePlaces.js';
import MapView from '../components/MapView.jsx';
import { EmptyState, ErrorState, PageHeader, Spinner, StatusBadge } from '../components/ui.jsx';

export default function Dashboard() {
  const { user } = useAuth();
  const geo = useGeolocation();
  const [reports, setReports] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [r, c] = await Promise.all([reportsApi.list(), contactsApi.list()]);
      setReports(r.data);
      setContacts(c.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { getSafePlaces(geo.coords).then(setPlaces); }, [geo.coords]);

  const stats = useMemo(() => {
    const count = (s) => reports.filter((r) => r.status === s).length;
    const byType = {};
    reports.forEach((r) => { byType[r.crimeType] = (byType[r.crimeType] || 0) + 1; });
    const top = Object.entries(byType).sort((a, b) => b[1] - a[1])[0];
    return {
      total: reports.length,
      submitted: count('SUBMITTED'),
      review: count('UNDER_REVIEW'),
      resolved: count('RESOLVED'),
      topType: top ? typeLabel(top[0]) : null,
    };
  }, [reports]);

  return (
    <>
      <PageHeader
        title={`Welcome, ${user?.name?.split(' ')[0] || 'there'}`}
        subtitle="Your safety overview"
        actions={
          <>
            <Link to="/report" className="btn btn-primary">Report an incident</Link>
            <Link to="/sos" className="btn btn-sos">SOS</Link>
          </>
        }
      />

      {error && <ErrorState message={error} onRetry={load} />}
      {loading ? <Spinner /> : (
        <>
          <div className="grid grid-4">
            <div className="card stat"><span className="stat-num">{stats.total}</span><span className="muted">Total reports</span></div>
            <div className="card stat"><span className="stat-num">{stats.submitted}</span><span className="muted">Submitted</span></div>
            <div className="card stat"><span className="stat-num">{stats.review}</span><span className="muted">Under review</span></div>
            <div className="card stat"><span className="stat-num">{stats.resolved}</span><span className="muted">Resolved</span></div>
          </div>

          <div className="grid grid-2 mt">
            <section className="card">
              <div className="card-head"><h2>Recent reports</h2><Link to="/reports">View all</Link></div>
              {reports.length === 0 ? (
                <EmptyState title="No reports yet" text="Reports you submit will appear here." action={<Link className="btn btn-primary btn-sm" to="/report">Write your first report</Link>} />
              ) : (
                <ul className="list">
                  {reports.slice(0, 4).map((r) => (
                    <li key={r.id}>
                      <Link to={`/reports/${r.id}`} className="list-link">
                        <span><strong>{typeLabel(r.crimeType)}</strong> <span className="muted">{shortId(r.id)} · {fmtDate(r.date)}</span><br /><span className="small muted">{r.location}</span></span>
                        <StatusBadge status={r.status} />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="card">
              <h2>Current location</h2>
              {geo.coords ? (
                <>
                  <p className="mono">{geo.coords.lat.toFixed(5)}, {geo.coords.lng.toFixed(5)} <span className="muted">(±{Math.round(geo.coords.accuracy)} m)</span></p>
                  <MapView lat={geo.coords.lat} lng={geo.coords.lng} title="Your current location" />
                </>
              ) : (
                <p className="muted">Location is off. Press the button to read it once. Nothing is tracked or stored.</p>
              )}
              {geo.error && <p className="field-error" role="alert">{geo.error}</p>}
              <button type="button" className="btn btn-ghost btn-sm mt-s" onClick={geo.request} disabled={geo.loading}>
                {geo.loading ? 'Finding you…' : geo.coords ? 'Refresh location' : 'Use my location'}
              </button>
            </section>
          </div>

          <div className="grid grid-3 mt">
            <section className="card">
              <h2>Safety information</h2>
              <ul className="plain">
                <li>Share your route with someone you trust when going out late.</li>
                <li>Stay on well-lit, busy paths where you can.</li>
                <li>Keep your phone charged and emergency contacts saved.</li>
              </ul>
              <p className="small muted">
                {stats.topType ? `Your most reported category: ${stats.topType} (from your own reports). ` : ''}
                No real-world crime statistics are shown in this prototype.
              </p>
            </section>

            <section className="card">
              <div className="card-head"><h2>Safe places</h2><Link to="/safe-places">See all</Link></div>
              <ul className="list">
                {places.slice(0, 3).map((p) => (
                  <li key={p.id} className="list-row">
                    <span><strong>{p.name}</strong><br /><span className="small muted">{PLACE_TYPES[p.type]}{p.distanceKm != null ? ` · ${p.distanceKm.toFixed(1)} km` : ''}</span></span>
                  </li>
                ))}
              </ul>
              <p className="small muted">Sample data for demonstration.</p>
            </section>

            <section className="card">
              <div className="card-head"><h2>Emergency contacts</h2><Link to="/contacts">Manage</Link></div>
              {contacts.length === 0 ? (
                <EmptyState title="No contacts saved" text="Add someone you trust." action={<Link className="btn btn-primary btn-sm" to="/contacts">Add a contact</Link>} />
              ) : (
                <ul className="list">
                  {contacts.slice(0, 3).map((c) => (
                    <li key={c.id} className="list-row">
                      <span><strong>{c.name}</strong> <span className="muted">· {c.relationship}</span><br /><a href={`tel:${c.phone}`}>{c.phone}</a></span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </>
      )}
    </>
  );
}
