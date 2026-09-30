import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getErrorMessage } from '../services/api.js';
import { EMAIL_PATTERN } from '../services/constants.js';
import { Field, Logo } from '../components/ui.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function Register() {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Enter your full name.';
    if (!EMAIL_PATTERN.test(form.email.trim())) next.email = 'Enter a valid email address.';
    if (form.password.length < 8) next.password = 'Use at least 8 characters.';
    if (form.confirm !== form.password) next.confirm = 'Passwords do not match.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form.name.trim(), form.email.trim(), form.password);
      toast.success('Account created. Welcome to Crime Detector.');
      navigate('/dashboard', { replace: true });
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
        <h1>Create your account</h1>
        {serverError && <div className="alert alert-error" role="alert">{serverError}</div>}
        <Field label="Full name" id="name" error={errors.name}>
          <input id="name" autoComplete="name" value={form.name} onChange={set('name')} aria-invalid={!!errors.name} />
        </Field>
        <Field label="Email" id="email" error={errors.email}>
          <input id="email" type="email" autoComplete="email" value={form.email} onChange={set('email')} aria-invalid={!!errors.email} />
        </Field>
        <Field label="Password" id="password" error={errors.password} hint="At least 8 characters.">
          <input id="password" type="password" autoComplete="new-password" value={form.password} onChange={set('password')} aria-invalid={!!errors.password} />
        </Field>
        <Field label="Confirm password" id="confirm" error={errors.confirm}>
          <input id="confirm" type="password" autoComplete="new-password" value={form.confirm} onChange={set('confirm')} aria-invalid={!!errors.confirm} />
        </Field>
        <button className="btn btn-primary btn-block" disabled={loading}>{loading ? 'Creating account…' : 'Create account'}</button>
        <p className="small center">Already registered? <Link to="/login">Log in</Link></p>
      </form>
    </div>
  );
}
