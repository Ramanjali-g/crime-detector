/**
 * Map provider abstraction. Today it uses the free OpenStreetMap embed (no API key, no library;
 * external dependency: openstreetmap.org). To switch to Leaflet, Mapbox or Google Maps later,
 * change only these functions or replace the MapView component.
 */
export function buildEmbedUrl(lat, lng, delta = 0.008) {
  const bbox = [lng - delta, lat - delta, lng + delta, lat + delta].join(',');
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
}

export function buildLink(lat, lng) {
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`;
}
