import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { EMERGENCY_NUMBERS, getStoredNumber } from '../services/constants.js';
import { PageHeader } from '../components/ui.jsx';
import { useToast } from '../context/ToastContext.jsx';

const PREF_KEY = 'cd_prefs';
const DEFAULT_PREFS = { statusAlerts: true, safetyTips: false };

function loadPrefs() {
  try {
    return { ...DEFAULT_PREFS, ...JSON.parse(localStorage.getItem(PREF_KEY) || '{}') };
  } catch {
    return DEFAULT_PREFS;
  }
}

export default function Settings() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [prefs, setPrefs] = useState(loadPrefs);
  const [number, setNumber] = useState(getStoredNumber);
  const [permission, setPermission] = useState('unknown');

  useEffect(() => {
    if (!navigator.permissions?.query) return undefined;
    let result;
    navigator.permissions.query({ name: 'geolocation' }).then((r) => {
      result = r;
      setPermission(r.state);
      r.onchange = () => setPermission(r.state);
    }).catch(() => {});
    return () => { if (result) result.onchange = null; };
  }, []);

  const togglePref = (key) => (e) => {
    const next = { ...prefs, [key]: e.target.checked };
    setPrefs(next);
    localStorage.setItem(PREF_KEY, JSON.stringify(next));
    toast.success('Preference saved on this device.');
  };

  const changeNumber = (e) => {
    setNumber(e.target.value);
    localStorage.setItem('cd_emergency_number', e.target.value);
    toast.success('Emergency number updated.');
  };

  const permissionText = {
    granted: 'Allowed. The app reads your location only when you press a location button.',
    denied: "Blocked. Change this in your browser's site settings. The app works without it.",
    prompt: 'Not decided yet. Your browser will ask the first time you press a location button.',
    unknown: 'Your browser did not report a status. It will ask when needed.',
  }[permission] ?? 'Your browser did not report a status.';

  return (
    <>
      <PageHeader title="Settings" />
      <div className="grid grid-2">
        <section className="card">
          <h2>Location</h2>
          <p><strong>Permission:</strong> {permissionText}</p>
          <p className="small muted">Crime Detector never tracks you in the background. Location is read once per button press and is only saved if you put it in a report.</p>
        </section>

        <section className="card">
          <h2>Notification preferences</h2>
          <label className="check"><input type="checkbox" checked={prefs.statusAlerts} onChange={togglePref('statusAlerts')} /> Tell me when a report status changes</label>
          <label className="check"><input type="checkbox" checked={prefs.safetyTips} onChange={togglePref('safetyTips')} /> Show occasional safety tips</label>
          <p className="small muted">Saved on this device only. This prototype does not send push or email notifications yet.</p>
        </section>

        <section className="card">
          <h2>SOS call number</h2>
          <div className="field">
            <label htmlFor="num">Number the SOS call button dials</label>
            <select id="num" value={number} onChange={changeNumber}>
              {EMERGENCY_NUMBERS.map((n) => <option key={n.value} value={n.value}>{n.label}</option>)}
            </select>
          </div>
        </section>

        <section className="card">
          <h2>Account</h2>
          <p><Link to="/profile">Edit name, email or password</Link></p>
          <button type="button" className="btn btn-danger" onClick={() => { logout(); navigate('/login'); }}>Log out</button>
        </section>
      </div>
    </>
  );
}
