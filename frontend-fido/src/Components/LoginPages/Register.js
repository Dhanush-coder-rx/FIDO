import { useState } from 'react';
import { Link } from 'react-router-dom';

const API = '';

function base64urlToBuffer(value) {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
  return Uint8Array.from(atob(padded), c => c.charCodeAt(0));
}

export default function Register() {
  const [username, setUsername] = useState('');
  const [label, setLabel] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setStatus('info');
      setMessage('Creating account...');

      if (!window.PublicKeyCredential) {
        throw new Error('Your browser does not support WebAuthn.');
      }

      // Step 1: Get CSRF token
      const csrfRes = await fetch(`${API}/api/csrf`)
        .catch(() => { throw new Error('Cannot reach server. Is the backend running on port 8080?'); });
      if (!csrfRes.ok) throw new Error('CSRF endpoint returned ' + csrfRes.status);
      const csrf = await csrfRes.json();

      // Step 2: Create user account (username only) — session is established by backend
      const signupRes = await fetch(`${API}/api/users/register`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrf.token,
        },
        body: JSON.stringify({ username: username.trim() }),
      });
      const signupData = await signupRes.json();
      console.log('Step 2 /api/users/register:', signupRes.status, signupData);
      if (!signupRes.ok) throw new Error(signupData.error || 'Account creation failed.');

      setMessage('Preparing passkey registration...');

      // Step 3: Get registration options (session already authenticated from step 2)
      const optionsRes = await fetch(`${API}/webauthn/register/options`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'X-CSRF-TOKEN': csrf.token },
      });
      const optionsText = await optionsRes.text();
      console.log('Step 3 /webauthn/register/options:', optionsRes.status, optionsText);
      if (!optionsRes.ok) throw new Error(`Registration options failed (${optionsRes.status}): ${optionsText}`);
      const options = JSON.parse(optionsText);

      options.challenge = base64urlToBuffer(options.challenge);
      options.user.id = base64urlToBuffer(options.user.id);
      if (options.excludeCredentials) {
        options.excludeCredentials = options.excludeCredentials.map(item => ({
          ...item,
          id: base64urlToBuffer(item.id),
        }));
      }

      setMessage('Please verify your identity on your device...');

      // Step 4: Create passkey via browser
      const credential = await navigator.credentials.create({ publicKey: options });
      if (!credential) throw new Error('Passkey registration was cancelled.');

      // Step 5: Send credential to backend
      const regRes = await fetch(`${API}/webauthn/register`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrf.token,
        },
        body: JSON.stringify({
          publicKey: {
            credential: credential.toJSON(),
            label: label.trim(),
          },
        }),
      });
      if (!regRes.ok) throw new Error('Passkey registration failed.');

      const result = await regRes.json();
      if (result.success) {
        setStatus('success');
        setMessage(`✅ Account created! You can now sign in as "${username}" using your passkey.`);
        setUsername('');
        setLabel('');
      } else {
        throw new Error('Registration was not confirmed.');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
      setMessage(error.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const alertColor = status === 'success' ? '#2e7d32' : status === 'error' ? '#c62828' : '#01579b';

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.icon}>🪪</div>
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>No password needed — your device is your key</p>

        <form onSubmit={handleRegister}>
          <input
            style={styles.input}
            type="text"
            placeholder="Choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
          />
          <input
            style={styles.input}
            type="text"
            placeholder="Device name (e.g. MacBook Touch ID)"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            required
          />
          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? '⏳ Registering...' : '🚀 Create Account & Register Passkey'}
          </button>
        </form>

        {message && (
          <div style={{ ...styles.alert, background: alertColor }}>
            {message}
          </div>
        )}

        <div style={styles.divider}>Already have an account?</div>
        <Link to="/login" style={styles.link}>🔑 Sign In with Passkey</Link>
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
    maxWidth: '420px',
    backdropFilter: 'blur(12px)',
    color: '#fff',
    textAlign: 'center',
  },
  icon: { fontSize: '52px', marginBottom: '12px' },
  title: { fontSize: '26px', fontWeight: '800', marginBottom: '6px' },
  subtitle: { fontSize: '13px', color: 'rgba(255,255,255,0.55)', marginBottom: '28px' },
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
    fontSize: '15px',
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
