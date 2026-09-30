import shield from '../assets/shield.svg';
import { statusLabel } from '../services/constants.js';

export function Logo({ size = 28 }) {
  return (
    <span className="logo">
      <img src={shield} alt="" width={size} height={size} />
      <span>Crime Detector</span>
    </span>
  );
}

export function Spinner({ label = 'Loading…' }) {
  return (
    <div className="center-block" role="status">
      <span className="spinner" aria-hidden="true" />
      <span className="muted">{label}</span>
    </div>
  );
}

export function EmptyState({ title, text, action }) {
  return (
    <div className="empty">
      <h3>{title}</h3>
      {text && <p className="muted">{text}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="alert alert-error" role="alert">
      <span>{message}</span>
      {onRetry && (
        <button type="button" className="btn btn-ghost btn-sm" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

export function StatusBadge({ status }) {
  return <span className={`badge badge-${status?.toLowerCase()}`}>{statusLabel(status)}</span>;
}

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="page-header">
      <div>
        <h1>{title}</h1>
        {subtitle && <p className="muted">{subtitle}</p>}
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </div>
  );
}

export function Field({ label, id, error, hint, children }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {children}
      {hint && <p className="hint">{hint}</p>}
      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
