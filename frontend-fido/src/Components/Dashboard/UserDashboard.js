
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UserDashboard() {

  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    fetch('/api/auth/status', {
      method: 'GET',
      credentials: 'include'
    })
      .then(async response => {
        if (!response.ok) {
          throw new Error('Unable to check authentication');
        }

        return response.json();
      })
      .then(data => {

        if (!data.authenticated) {
          navigate('/login');
          return;
        }

        setUser(data.username);
      })
      .catch(error => {
        console.error(error);
        navigate('/login');
      })
      .finally(() => {
        setLoading(false);
      });

  }, [navigate]);

  const logout = async () => {

    try {

      const response = await fetch('/logout', {
        method: 'POST',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      navigate('/');

    } catch (error) {
      console.error(error);
      alert('Unable to logout');
    }
  };

  if (loading) {
    return <h3>Loading dashboard...</h3>;
  }

  return (
    <div style={styles.page}>

      <div style={styles.card}>

        <h1>Welcome to DigiLocker</h1>

        <p>FIDO2 Authentication Successful!</p>

        <h2>Welcome, {user}</h2>

        <div style={styles.info}>
          <p>Authentication Method: Passkey</p>
          <p>Security: Public Key Cryptography</p>
          <p>Status: Authenticated</p>
        </div>

        <button style={styles.button} onClick={logout}>
          Logout
        </button>

      </div>

    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: "'Segoe UI', sans-serif",
    padding: '20px'
  },

  card: {
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '20px',
    padding: '45px',
    color: '#fff',
    textAlign: 'center',
    maxWidth: '500px',
    width: '100%',
    boxSizing: 'border-box'
  },

  info: {
    margin: '30px 0',
    padding: '15px',
    background: 'rgba(255,255,255,0.08)',
    borderRadius: '10px'
  },

  button: {
    width: '100%',
    padding: '14px',
    background: '#ef5350',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer'
  }
};
