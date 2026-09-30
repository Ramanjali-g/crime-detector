import { Link } from 'react-router-dom';
import { Logo } from '../components/ui.jsx';

export default function NotFound() {
  return (
    <div className="auth-page">
      <div className="card auth-card center">
        <Logo />
        <h1>Page not found</h1>
        <p className="muted">That address does not exist in Crime Detector.</p>
        <Link className="btn btn-primary" to="/">Go to the home page</Link>
      </div>
    </div>
  );
}
