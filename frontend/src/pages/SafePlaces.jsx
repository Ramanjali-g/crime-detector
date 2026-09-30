import { useEffect, useState } from 'react';
import useGeolocation from '../hooks/useGeolocation.js';
import { getSafePlaces, PLACE_TYPES } from '../services/safePlaces.js';
import { buildLink } from '../services/mapProvider.js';
import MapView from '../components/MapView.jsx';
import { PageHeader } from '../components/ui.jsx';

const FILTERS = [['ALL', 'All'], ...Object.entries(PLACE_TYPES)];

export default function SafePlaces() {
  const geo = useGeolocation();
  const [places, setPlaces] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [selected, setSelected] = useState(null);

  useEffect(() => { getSafePlaces(geo.coords).then(setPlaces); }, [geo.coords]);

  const visible = places.filter((p) => filter === 'ALL' || p.type === filter);

  return (
    <>
      <PageHeader
        title="Safe places"
        subtitle="Police stations, hospitals, fire stations and public places."
        actions={<button type="button" className="btn btn-ghost" onClick={geo.request} disabled={geo.loading}>{geo.loading ? 'Finding you…' : 'Use my location'}</button>}
      />
      <div className="alert alert-warn" role="note">
        These entries are sample data for demonstration and are not real places. Search a real map for your area before you rely on any location.
      </div>
      {geo.error && <div className="alert alert-error" role="alert">{geo.error}</div>}

      <div className="row mb" role="group" aria-label="Filter by place type">
        {FILTERS.map(([value, label]) => (
          <button key={value} type="button" className={`chip ${filter === value ? 'chip-on' : ''}`} aria-pressed={filter === value} onClick={() => setFilter(value)}>{label}</button>
        ))}
      </div>

      <div className="grid grid-2">
        <ul className="list card">
          {visible.map((p) => (
            <li key={p.id} className="list-row">
              <span>
                <strong>{p.name}</strong><br />
                <span className="small muted">{PLACE_TYPES[p.type]}{p.distanceKm != null ? ` · ${p.distanceKm.toFixed(1)} km away` : ''}</span><br />
                <span className="small">{p.note}</span>
              </span>
              {p.lat != null && <button type="button" className="btn btn-ghost btn-sm" onClick={() => setSelected(p)}>Show on map</button>}
            </li>
          ))}
        </ul>
        <section className="card">
          {selected ? (
            <><h2>{selected.name}</h2><MapView lat={selected.lat} lng={selected.lng} title={selected.name} /></>
          ) : geo.coords ? (
            <><h2>Your location</h2><MapView lat={geo.coords.lat} lng={geo.coords.lng} title="Your location" />
              <p className="small"><a href={buildLink(geo.coords.lat, geo.coords.lng)} target="_blank" rel="noopener noreferrer">Search for real places nearby on OpenStreetMap</a></p></>
          ) : (
            <p className="muted">Press "Use my location" to see distances and a map. Without location the list still works.</p>
          )}
        </section>
      </div>
    </>
  );
}
