import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { getErrorMessage, usersApi } from '../services/api.js';
import { EMAIL_PATTERN, fmtDateTime } from '../services/constants.js';
import { Field, PageHeader } from '../components/ui.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function Profile() {
  const { user, setUser } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({ name: user.name, email: user.email, newPassword: '' });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!form.name.trim()) next.name = 'Enter your name.';
    if (!EMAIL_PATTERN.test(form.email.trim())) next.email = 'Enter a valid email address.';
    if (form.newPassword && form.newPassword.length < 8) next.newPassword = 'Use at least 8 characters.';
    setErrors(next);
    if (Object.keys(next).length) return;

    setSaving(true);
    try {
      const { data } = await usersApi.update({
        name: form.name.trim(),
        email: form.email.trim(),
        newPassword: form.newPassword || null,
      });
      setUser(data);
      setForm((f) => ({ ...f, newPassword: '' }));
      toast.success('Profile saved.');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader title="Profile" />
      <div className="grid grid-2">
        <form className="card" onSubmit={onSubmit} noValidate>
          <h2>Edit details</h2>
          <Field label="Name" id="p-name" error={errors.name}><input id="p-name" value={form.name} onChange={set('name')} aria-invalid={!!errors.name} /></Field>
          <Field label="Email" id="p-email" error={errors.email}><input id="p-email" type="email" value={form.email} onChange={set('email')} aria-invalid={!!errors.email} /></Field>
          <Field label="New password (optional)" id="p-pw" error={errors.newPassword} hint="Leave empty to keep your current password.">
            <input id="p-pw" type="password" autoComplete="new-password" value={form.newPassword} onChange={set('newPassword')} aria-invalid={!!errors.newPassword} />
          </Field>
          <button className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button>
        </form>
        <section className="card">
          <h2>Account</h2>
          <dl className="details">
            <dt>Name</dt><dd>{user.name}</dd>
            <dt>Email</dt><dd>{user.email}</dd>
            <dt>Member since</dt><dd>{fmtDateTime(user.createdAt)}</dd>
            <dt>Last updated</dt><dd>{fmtDateTime(user.updatedAt)}</dd>
          </dl>
        </section>
      </div>
    </>
  );
}
