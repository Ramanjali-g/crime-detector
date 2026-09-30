import { buildEmbedUrl, buildLink } from '../services/mapProvider.js';

export default function MapView({ lat, lng, title = 'Map showing the selected location' }) {
  if (lat == null || lng == null) return null;
  return (
    <div className="map">
      <iframe title={title} src={buildEmbedUrl(lat, lng)} loading="lazy" referrerPolicy="no-referrer" />
      <a href={buildLink(lat, lng)} target="_blank" rel="noopener noreferrer" className="map-link">
        Open larger map (OpenStreetMap)
      </a>
    </div>
  );
}
