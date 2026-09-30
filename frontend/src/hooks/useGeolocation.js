import { useCallback, useState } from 'react';

const MESSAGES = {
  1: 'Location permission was denied. You can still use the app and type a place by hand.',
  2: 'Your location is unavailable right now. Try again or type a place by hand.',
  3: 'Finding your location took too long. Try again.',
};

/**
 * One-shot location lookup, only when request() is called (from a button click).
 * Nothing is tracked in the background and nothing is sent to the server.
 */
export default function useGeolocation() {
  const [coords, setCoords] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | loading | granted | denied | error | unsupported
  const [error, setError] = useState('');

  const request = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setStatus('unsupported');
      setError('Your browser does not support location.');
      return Promise.resolve(null);
    }
    setStatus('loading');
    setError('');
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const result = { lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy };
          setCoords(result);
          setStatus('granted');
          resolve(result);
        },
        (err) => {
          setStatus(err.code === 1 ? 'denied' : 'error');
          setError(MESSAGES[err.code] || 'Could not get your location.');
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    });
  }, []);

  return { coords, status, error, loading: status === 'loading', request };
}
