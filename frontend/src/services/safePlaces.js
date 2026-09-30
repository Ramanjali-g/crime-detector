/**
 * Safe places provider.
 * SAMPLE DATA ONLY: these are made-up entries placed at fixed offsets around the user's
 * location so the UI can be demonstrated. To use real data, replace getSafePlaces() with a call
 * to a places API (for example OpenStreetMap Overpass) that returns the same shape.
 */
export const PLACE_TYPES = {
  POLICE: 'Police station',
  HOSPITAL: 'Hospital',
  FIRE: 'Fire station',
  PUBLIC: 'Safe public place',
};

const SAMPLE_PLACES = [
  { id: 's1', name: 'Sample Police Station', type: 'POLICE', dLat: 0.006, dLng: 0.004, note: 'Staffed around the clock (sample).' },
  { id: 's2', name: 'Sample City Hospital', type: 'HOSPITAL', dLat: -0.005, dLng: 0.007, note: 'Emergency department (sample).' },
  { id: 's3', name: 'Sample Fire Station', type: 'FIRE', dLat: 0.009, dLng: -0.005, note: 'Fire and rescue (sample).' },
  { id: 's4', name: 'Sample Campus Security Desk', type: 'PUBLIC', dLat: -0.002, dLng: -0.003, note: 'Open late (sample).' },
  { id: 's5', name: 'Sample Public Library', type: 'PUBLIC', dLat: 0.003, dLng: -0.008, note: 'Staffed, well lit (sample).' },
  { id: 's6', name: 'Sample Community Hospital', type: 'HOSPITAL', dLat: -0.010, dLng: -0.006, note: 'Outpatient and emergency (sample).' },
];

function distanceKm(lat1, lng1, lat2, lng2) {
  const rad = (deg) => (deg * Math.PI) / 180;
  const a =
    Math.sin(rad(lat2 - lat1) / 2) ** 2 +
    Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(rad(lng2 - lng1) / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function getSafePlaces(center) {
  return SAMPLE_PLACES.map((place) => {
    if (!center) return { ...place, lat: null, lng: null, distanceKm: null };
    const lat = center.lat + place.dLat;
    const lng = center.lng + place.dLng;
    return { ...place, lat, lng, distanceKm: distanceKm(center.lat, center.lng, lat, lng) };
  }).sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
}
