import { useCallback, useEffect, useState } from 'react';
import { contactsApi, getErrorMessage } from '../services/api.js';
import { PHONE_PATTERN } from '../services/constants.js';
import { EmptyState, ErrorState, Field, PageHeader, Spinner } from '../components/ui.jsx';
import { useToast } from '../context/ToastContext.jsx';

const EMPTY = { name: '', phone: '', relationship: '' };

export default function EmergencyContacts() {
  const toast = useToast();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setContacts((await contactsApi.list()).data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const reset = () => { setForm(EMPTY); setEditingId(null); setErrors({}); };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Enter a name.';
    if (!PHONE_PATTERN.test(form.phone.trim())) next.phone = 'Enter a valid phone number.';
    if (!form.relationship.trim()) next.relationship = 'Enter the relationship.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = { name: form.name.trim(), phone: form.phone.trim(), relationship: form.relationship.trim() };
      if (editingId) {
        await contactsApi.update(editingId, payload);
        toast.success('Contact updated.');
      } else {
        await contactsApi.create(payload);
        toast.success('Contact added.');
      }
      reset();
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const edit = (c) => {
    setEditingId(c.id);
    setForm({ name: c.name, phone: c.phone, relationship: c.relationship });
    setErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const remove = async (c) => {
    if (!window.confirm(`Delete ${c.name}?`)) return;
    try {
      await contactsApi.remove(c.id);
      toast.success('Contact deleted.');
      if (editingId === c.id) reset();
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <>
      <PageHeader title="Emergency contacts" subtitle="People you can call or text from the SOS screen." />
      <div className="grid grid-2">
        <form className="card" onSubmit={onSubmit} noValidate>
          <h2>{editingId ? 'Edit contact' : 'Add a contact'}</h2>
          <Field label="Name" id="c-name" error={errors.name}><input id="c-name" value={form.name} onChange={set('name')} aria-invalid={!!errors.name} /></Field>
          <Field label="Phone number" id="c-phone" error={errors.phone}><input id="c-phone" type="tel" value={form.phone} onChange={set('phone')} aria-invalid={!!errors.phone} /></Field>
          <Field label="Relationship" id="c-rel" error={errors.relationship}><input id="c-rel" value={form.relationship} onChange={set('relationship')} placeholder="Parent, friend, roommate…" aria-invalid={!!errors.relationship} /></Field>
          <div className="row">
            <button className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : editingId ? 'Save changes' : 'Add contact'}</button>
            {editingId && <button type="button" className="btn btn-ghost" onClick={reset}>Cancel</button>}
          </div>
        </form>

        <section className="card">
          <h2>Your contacts</h2>
          {error && <ErrorState message={error} onRetry={load} />}
          {loading ? <Spinner /> : contacts.length === 0 && !error ? (
            <EmptyState title="No contacts yet" text="Add at least one person you trust." />
          ) : (
            <ul className="list">
              {contacts.map((c) => (
                <li key={c.id} className="list-row">
                  <span><strong>{c.name}</strong> <span className="muted">· {c.relationship}</span><br /><a href={`tel:${c.phone}`}>{c.phone}</a></span>
                  <span className="row">
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => edit(c)}>Edit</button>
                    <button type="button" className="btn btn-danger btn-sm" onClick={() => remove(c)}>Delete</button>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
