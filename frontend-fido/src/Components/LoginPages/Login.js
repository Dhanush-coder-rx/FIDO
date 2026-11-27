import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API = '';

function base64urlToBuffer(value) {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
  return Uint8Array.from(atob(padded), c => c.charCodeAt(0));
}

export default function Login() {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setStatus('info');
      setMessage('Preparing passkey authentication...');

      if (!window.PublicKeyCredential) {
        throw new Error('Your browser does not support WebAuthn.');
      }

      // Step 1: Get CSRF token
      const csrfRes = await fetch(`${API}/api/csrf`)
        .catch(() => { throw new Error('Cannot reach server. Is the backend running on port 8080?'); });
      if (!csrfRes.ok) throw new Error('CSRF endpoint returned ' + csrfRes.status);
      const csrf = await csrfRes.json();

      // Step 2: Get credential IDs for this username
      const credRes = await fetch(`${API}/api/webauthn/login/options`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrf.token,
        },
        body: JSON.stringify({ username: username.trim() }),
      });
      const credData = await credRes.json();
      if (!credRes.ok) throw new Error(credData.error || 'User not found.');

      // Step 3: Get authentication options from Spring WebAuthn
      const optionsRes = await fetch(`${API}/webauthn/authenticate/options`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'X-CSRF-TOKEN': csrf.token },
      });
      if (!optionsRes.ok) throw new Error('Unable to get authentication options.');
      const options = await optionsRes.json();

      options.challenge = base64urlToBuffer(options.challenge);

      // Restrict to this user's credentials only
      options.allowCredentials = credData.credentialIds.map(id => ({
        type: 'public-key',
        id: base64urlToBuffer(id),
      }));

      setMessage('Please verify using your passkey...');

      // Step 4: Prompt authenticator
      const credential = await navigator.credentials.get({ publicKey: options });
      if (!credential) throw new Error('Passkey authentication was cancelled.');

      // Step 5: Send assertion to backend
      const loginRes = await fetch(`${API}/login/webauthn`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrf.token,
        },
        body: JSON.stringify(credential.toJSON()),
      });
      if (!loginRes.ok) throw new Error('Passkey authentication failed.');

      const result = await loginRes.json();
      if (result.authenticated) {
        setStatus('success');
        setMessage('Login successful! Redirecting...');
        setTimeout(() => navigate('/user-dashboard'), 1000);
      } else {
        throw new Error('Authentication was not confirmed.');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
      setMessage(error.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const alertColor = status === 'success' ? '#2e7d32' : status === 'error' ? '#c62828' : '#01579b';

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.icon}>🔑</div>
        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>Enter your username to sign in with your passkey</p>

        <form onSubmit={handleLogin}>
          <input
            style={styles.input}
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
          />
          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? '⏳ Authenticating...' : '🔑 Login with Passkey'}
          </button>
        </form>

        {message && (
          <div style={{ ...styles.alert, background: alertColor }}>
            {message}
          </div>
        )}

        <div style={styles.divider}>Don't have a passkey?</div>
        <Link to="/register" style={styles.link}>📝 Register Passkey</Link>
        <br />
        <Link to="/" style={styles.back}>← Back to Home</Link>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Segoe UI', sans-serif",
  },
  card: {
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '20px',
    padding: '48px 40px',
    width: '100%',
    maxWidth: '400px',
    backdropFilter: 'blur(12px)',
    color: '#fff',
    textAlign: 'center',
  },
  icon: { fontSize: '52px', marginBottom: '12px' },
  title: { fontSize: '26px', fontWeight: '800', marginBottom: '6px' },
  subtitle: { fontSize: '14px', color: 'rgba(255,255,255,0.55)', marginBottom: '32px' },
  input: {
    width: '100%',
    padding: '12px 16px',
    marginBottom: '16px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'rgba(255,255,255,0.08)',
    color: '#fff',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  btn: {
    width: '100%',
    padding: '14px',
    background: '#4fc3f7',
    color: '#0f2027',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '16px',
    cursor: 'pointer',
  },
  alert: {
    marginTop: '16px',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#fff',
  },
  divider: { margin: '24px 0 12px', color: 'rgba(255,255,255,0.3)', fontSize: '13px' },
  link: { color: '#4fc3f7', textDecoration: 'none', fontWeight: '600' },
  back: {
    display: 'inline-block',
    marginTop: '16px',
    color: 'rgba(255,255,255,0.5)',
    textDecoration: 'none',
    fontSize: '13px',
  },
};
