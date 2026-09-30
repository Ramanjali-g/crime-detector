import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getErrorMessage } from '../services/api.js';
import { EMAIL_PATTERN } from '../services/constants.js';
import { Field, Logo } from '../components/ui.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!EMAIL_PATTERN.test(form.email.trim())) next.email = 'Enter a valid email address.';
    if (!form.password) next.password = 'Enter your password.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;
    setLoading(true);
    try {
      await login(form.email.trim(), form.password);
      navigate(location.state?.from || '/dashboard', { replace: true });
    } catch (err) {
      setServerError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="card auth-card" onSubmit={onSubmit} noValidate>
        <Link to="/" aria-label="Crime Detector home"><Logo /></Link>
        <h1>Log in</h1>
        {serverError && <div className="alert alert-error" role="alert">{serverError}</div>}
        <Field label="Email" id="email" error={errors.email}>
          <input id="email" type="email" autoComplete="email" value={form.email} onChange={set('email')} aria-invalid={!!errors.email} />
        </Field>
        <Field label="Password" id="password" error={errors.password}>
          <input id="password" type="password" autoComplete="current-password" value={form.password} onChange={set('password')} aria-invalid={!!errors.password} />
        </Field>
        <button className="btn btn-primary btn-block" disabled={loading}>{loading ? 'Logging in…' : 'Log in'}</button>
        <p className="small center">New here? <Link to="/register">Create an account</Link></p>
      </form>
    </div>
  );
}
