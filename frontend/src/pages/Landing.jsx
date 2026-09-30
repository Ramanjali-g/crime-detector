import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Logo } from '../components/ui.jsx';

export default function Landing() {
  const { user } = useAuth();
  return (
    <div className="landing">
      <header className="landing-nav">
        <Logo />
        <nav aria-label="Account" className="row">
          {user ? (
            <Link className="btn btn-primary btn-sm" to="/dashboard">Open dashboard</Link>
          ) : (
            <>
              <Link className="btn btn-ghost btn-sm" to="/login">Log in</Link>
              <Link className="btn btn-primary btn-sm" to="/register">Register</Link>
            </>
          )}
        </nav>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <h1>Write down what happened. Know where help is.</h1>
          <p className="lead">
            Crime Detector is a student project for keeping your own record of safety incidents,
            saving emergency contacts and finding your way to help quickly.
          </p>
          <div className="row">
            <Link className="btn btn-primary" to={user ? '/dashboard' : '/register'}>Get started</Link>
            {!user && <Link className="btn btn-ghost" to="/login">Log in</Link>}
          </div>
        </div>
        <aside className="hero-card card" aria-label="What this prototype does">
          <h2>What it does</h2>
          <ul className="ticks">
            <li>Saves your incident reports with place, time and an optional photo</li>
            <li>Keeps your emergency contacts one tap away</li>
            <li>Shows your coordinates so you can tell someone where you are</li>
          </ul>
          <h2>What it does not do</h2>
          <ul className="crosses">
            <li>Send reports to the police</li>
            <li>Call or alert emergency services</li>
            <li>Predict crime or judge anyone</li>
          </ul>
        </aside>
      </section>

      <section className="info" aria-labelledby="safety-heading">
        <h2 id="safety-heading">Safety information</h2>
        <div className="grid grid-3">
          <article className="card">
            <h3>In immediate danger</h3>
            <p>Call your local emergency number first (112 in India and the EU, 911 in the US and Canada, 999 in the UK). Use this app afterwards.</p>
          </article>
          <article className="card">
            <h3>Reporting to the authorities</h3>
            <p>To start an official case, contact your local police or an official reporting portal. This app only keeps your own notes.</p>
          </article>
          <article className="card">
            <h3>Your location, your choice</h3>
            <p>Location is read only when you press a button. It is never tracked in the background.</p>
          </article>
        </div>
      </section>

      <footer className="landing-foot">
        <p className="small">Academic prototype. Not a police, emergency or official reporting service.</p>
      </footer>
    </div>
  );
}
