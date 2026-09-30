import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useGeolocation from '../hooks/useGeolocation.js';
import { contactsApi, getErrorMessage } from '../services/api.js';
import { getStoredNumber } from '../services/constants.js';
import { buildLink } from '../services/mapProvider.js';
import MapView from '../components/MapView.jsx';
import { ErrorState, PageHeader } from '../components/ui.jsx';

export default function SOS() {
  const geo = useGeolocation();
  const [active, setActive] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState('');
  const emergencyNumber = getStoredNumber();

  useEffect(() => {
    contactsApi.list().then((r) => setContacts(r.data)).catch((e) => setError(getErrorMessage(e)));
  }, []);

  const activate = () => {
    setActive(true);
    geo.request();
  };

  const locationText = geo.coords
    ? `I need help. My location: ${buildLink(geo.coords.lat.toFixed(5), geo.coords.lng.toFixed(5))}`
    : 'I need help. Please call me.';

  return (
    <>
      <PageHeader title="SOS" />
      <div className="alert alert-warn sos-warning" role="alert">
        <strong>This prototype does not contact police or emergency services.</strong> Nothing is sent automatically.
        To reach help, use the call button below on your own phone.
      </div>

      <div className="sos-stage">
        <a className="sos-call" href={`tel:${emergencyNumber}`}>Call {emergencyNumber}</a>
        <p className="small muted">Opens your phone's dialer. Change the number in <Link to="/settings">Settings</Link>.</p>
        {!active && (
          <button type="button" className="sos-button" onClick={activate}>
            <span>SOS</span>
            <small>Show my location and contacts</small>
          </button>
        )}
      </div>

      {active && (
        <div className="grid grid-2">
          <section className="card">
            <h2>Your location</h2>
            {geo.loading && <p className="muted">Finding your location…</p>}
            {geo.coords && (
              <>
                <p className="mono big">{geo.coords.lat.toFixed(5)}, {geo.coords.lng.toFixed(5)}</p>
                <p className="small muted">Accuracy about {Math.round(geo.coords.accuracy)} m</p>
                <MapView lat={geo.coords.lat} lng={geo.coords.lng} title="Your current location" />
              </>
            )}
            {geo.error && (
              <>
                <p className="field-error" role="alert">{geo.error}</p>
                <button type="button" className="btn btn-ghost btn-sm" onClick={geo.request}>Try again</button>
              </>
            )}
          </section>

          <section className="card">
            <h2>Your contacts</h2>
            {error && <ErrorState message={error} />}
            {contacts.length === 0 && !error ? (
              <p className="muted">No contacts saved. <Link to="/contacts">Add one</Link>.</p>
            ) : (
              <ul className="list">
                {contacts.map((c) => (
                  <li key={c.id} className="list-row">
                    <span><strong>{c.name}</strong> <span className="muted">· {c.relationship}</span><br />{c.phone}</span>
                    <span className="row">
                      <a className="btn btn-primary btn-sm" href={`tel:${c.phone}`}>Call</a>
                      <a className="btn btn-ghost btn-sm" href={`sms:${c.phone}?body=${encodeURIComponent(locationText)}`}>Text location</a>
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <p className="small muted">"Text location" opens your own messaging app with a draft. You still press send.</p>
          </section>
        </div>
      )}
    </>
  );
}
