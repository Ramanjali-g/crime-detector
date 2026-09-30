import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useGeolocation from '../hooks/useGeolocation.js';
import { aiApi, getErrorMessage, reportsApi } from '../services/api.js';
import { CRIME_TYPES, nowHM, todayISO, typeLabel } from '../services/constants.js';
import { Field, PageHeader } from '../components/ui.jsx';
import { useToast } from '../context/ToastContext.jsx';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export default function ReportCrime() {
  const navigate = useNavigate();
  const toast = useToast();
  const geo = useGeolocation();
  const [form, setForm] = useState({
    crimeType: '', description: '', location: '', latitude: '', longitude: '', date: todayISO(), time: nowHM(),
  });
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [suggestion, setSuggestion] = useState(null);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const previewUrl = useMemo(() => (image ? URL.createObjectURL(image) : null), [image]);
  useEffect(() => () => previewUrl && URL.revokeObjectURL(previewUrl), [previewUrl]);

  const useMyLocation = async () => {
    const c = await geo.request();
    if (c) {
      setForm((f) => ({
        ...f,
        latitude: c.lat.toFixed(6),
        longitude: c.lng.toFixed(6),
        location: f.location || `Near ${c.lat.toFixed(4)}, ${c.lng.toFixed(4)}`,
      }));
    }
  };

  const onImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return setImage(null);
    if (!file.type.startsWith('image/')) {
      setErrors((x) => ({ ...x, image: 'Choose an image file (JPG, PNG, GIF or WEBP).' }));
      return setImage(null);
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setErrors((x) => ({ ...x, image: 'The image is larger than 5 MB.' }));
      return setImage(null);
    }
    setErrors((x) => ({ ...x, image: undefined }));
    setImage(file);
  };

  const askSuggestion = async () => {
    if (form.description.trim().length < 10) return toast.info('Write a short description first.');
    try {
      const { data } = await aiApi.suggestCategory(form.description);
      setSuggestion(data);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const validate = () => {
    const next = {};
    if (!form.crimeType) next.crimeType = 'Choose a crime type.';
    if (form.description.trim().length < 10) next.description = 'Describe what happened in at least 10 characters.';
    if (!form.location.trim()) next.location = 'Enter where it happened.';
    if (form.latitude !== '' && (isNaN(form.latitude) || Math.abs(Number(form.latitude)) > 90)) next.latitude = 'Latitude must be between -90 and 90.';
    if (form.longitude !== '' && (isNaN(form.longitude) || Math.abs(Number(form.longitude)) > 180)) next.longitude = 'Longitude must be between -180 and 180.';
    if (!form.date) next.date = 'Choose the date.';
    else if (form.date > todayISO()) next.date = 'The date cannot be in the future.';
    if (!form.time) next.time = 'Choose the time.';
    if (errors.image) next.image = errors.image;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;
    setSubmitting(true);
    try {
      const { data } = await reportsApi.create(
        {
          crimeType: form.crimeType,
          description: form.description.trim(),
          location: form.location.trim(),
          latitude: form.latitude === '' ? null : Number(form.latitude),
          longitude: form.longitude === '' ? null : Number(form.longitude),
          date: form.date,
          time: form.time,
        },
        image
      );
      toast.success('Report saved.');
      navigate(`/reports/${data.id}`);
    } catch (err) {
      setServerError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader title="Report an incident" subtitle="This saves a record in this app only. It does not notify the police." />
      <form className="card form-wide" onSubmit={onSubmit} noValidate>
        {serverError && <div className="alert alert-error" role="alert">{serverError}</div>}

        <Field label="Crime type" id="crimeType" error={errors.crimeType}>
          <select id="crimeType" value={form.crimeType} onChange={set('crimeType')} aria-invalid={!!errors.crimeType}>
            <option value="">Select a type</option>
            {CRIME_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </Field>

        <Field label="Description" id="description" error={errors.description} hint={`${form.description.length}/2000`}>
          <textarea id="description" rows={5} maxLength={2000} value={form.description} onChange={set('description')} aria-invalid={!!errors.description} />
        </Field>
        <div className="row mb">
          <button type="button" className="btn btn-ghost btn-sm" onClick={askSuggestion}>Suggest a category</button>
          {suggestion && (
            <span className="small">
              Suggested: <strong>{typeLabel(suggestion.suggestedType)}</strong>{' '}
              <button type="button" className="link-btn" onClick={() => setForm((f) => ({ ...f, crimeType: suggestion.suggestedType }))}>Use it</button>
              <br /><span className="muted">{suggestion.disclaimer}</span>
            </span>
          )}
        </div>

        <Field label="Location" id="location" error={errors.location}>
          <input id="location" value={form.location} onChange={set('location')} placeholder="Street, building or landmark" aria-invalid={!!errors.location} />
        </Field>

        <div className="row mb">
          <button type="button" className="btn btn-ghost btn-sm" onClick={useMyLocation} disabled={geo.loading}>
            {geo.loading ? 'Finding you…' : 'Use current location'}
          </button>
          {geo.error && <span className="field-error" role="alert">{geo.error}</span>}
        </div>

        <div className="grid grid-2">
          <Field label="Latitude (optional)" id="latitude" error={errors.latitude}>
            <input id="latitude" inputMode="decimal" value={form.latitude} onChange={set('latitude')} aria-invalid={!!errors.latitude} />
          </Field>
          <Field label="Longitude (optional)" id="longitude" error={errors.longitude}>
            <input id="longitude" inputMode="decimal" value={form.longitude} onChange={set('longitude')} aria-invalid={!!errors.longitude} />
          </Field>
          <Field label="Date" id="date" error={errors.date}>
            <input id="date" type="date" max={todayISO()} value={form.date} onChange={set('date')} aria-invalid={!!errors.date} />
          </Field>
          <Field label="Time" id="time" error={errors.time}>
            <input id="time" type="time" value={form.time} onChange={set('time')} aria-invalid={!!errors.time} />
          </Field>
        </div>

        <Field label="Photo (optional)" id="image" error={errors.image} hint="JPG, PNG, GIF or WEBP, up to 5 MB.">
          <input id="image" type="file" accept="image/*" onChange={onImage} />
        </Field>
        {previewUrl && <img className="preview" src={previewUrl} alt="Selected upload preview" />}

        <div className="row mt-s">
          <button className="btn btn-primary" disabled={submitting}>{submitting ? 'Saving…' : 'Save report'}</button>
          <Link to="/reports" className="btn btn-ghost">Cancel</Link>
        </div>
      </form>
    </>
  );
}
