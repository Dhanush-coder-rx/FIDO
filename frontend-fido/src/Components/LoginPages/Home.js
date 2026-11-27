import { Link } from 'react-router-dom';

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
    fontFamily: "'Segoe UI', sans-serif",
    color: '#fff',
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 40px',
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '22px',
    fontWeight: '700',
    color: '#fff',
    textDecoration: 'none',
  },
  navLinks: { display: 'flex', gap: '12px' },
  loginBtn: {
    padding: '8px 22px',
    border: '2px solid #4fc3f7',
    borderRadius: '6px',
    color: '#4fc3f7',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '14px',
  },
  registerBtn: {
    padding: '8px 22px',
    background: '#4fc3f7',
    border: '2px solid #4fc3f7',
    borderRadius: '6px',
    color: '#0f2027',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '14px',
  },
  hero: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px 40px',
    textAlign: 'center',
  },
  heroIcon: { fontSize: '72px', marginBottom: '20px' },
  heroTitle: {
    fontSize: '42px',
    fontWeight: '800',
    marginBottom: '12px',
    background: 'linear-gradient(90deg, #4fc3f7, #81d4fa)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  heroSubtitle: {
    fontSize: '18px',
    color: 'rgba(255,255,255,0.7)',
    maxWidth: '520px',
    lineHeight: '1.6',
    marginBottom: '36px',
  },
  heroBtns: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  primaryBtn: {
    padding: '14px 36px',
    background: '#4fc3f7',
    color: '#0f2027',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '700',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  secondaryBtn: {
    padding: '14px 36px',
    border: '2px solid rgba(255,255,255,0.4)',
    color: '#fff',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '700',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  features: {
    display: 'flex',
    justifyContent: 'center',
    gap: '24px',
    padding: '60px 40px',
    flexWrap: 'wrap',
  },
  card: {
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '16px',
    padding: '32px 28px',
    width: '220px',
    textAlign: 'center',
    backdropFilter: 'blur(8px)',
  },
  cardIcon: { fontSize: '40px', marginBottom: '14px' },
  cardTitle: { fontSize: '16px', fontWeight: '700', marginBottom: '8px' },
  cardDesc: { fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.5' },
  footer: {
    textAlign: 'center',
    padding: '24px',
    color: 'rgba(255,255,255,0.4)',
    fontSize: '13px',
    borderTop: '1px solid rgba(255,255,255,0.08)',
  },
};

const features = [
  { icon: '🔐', title: 'FIDO2 Passkeys', desc: 'Passwordless login with biometrics & security keys' },
  { icon: '📄', title: 'Digital Documents', desc: 'Store and access your documents securely anytime' },
  { icon: '🛡️', title: 'Privacy First', desc: 'Your data is encrypted and fully under your control' },
  { icon: '⚡', title: 'Instant Verification', desc: 'Share verified credentials in seconds' },
];

export default function Home() {
  return (
    <div style={styles.page}>
      <nav style={styles.navbar}>
        <span style={styles.brand}>🪪 DigiLocker</span>
        <div style={styles.navLinks}>
          <Link to="/login" style={styles.loginBtn}>🔑 Login</Link>
          <Link to="/register" style={styles.registerBtn}>📝 Register</Link>
        </div>
      </nav>

      <div style={styles.hero}>
        <div style={styles.heroIcon}>🏛️</div>
        <h1 style={styles.heroTitle}>Your Digital Identity Vault</h1>
        <p style={styles.heroSubtitle}>
          Securely store, manage, and share your official documents with FIDO2-powered passwordless authentication.
        </p>
        <div style={styles.heroBtns}>
          <Link to="/register" style={styles.primaryBtn}>🚀 Get Started</Link>
          <Link to="/login" style={styles.secondaryBtn}>🔑 Sign In</Link>
        </div>
      </div>

      <div style={styles.features}>
        {features.map((f) => (
          <div key={f.title} style={styles.card}>
            <div style={styles.cardIcon}>{f.icon}</div>
            <div style={styles.cardTitle}>{f.title}</div>
            <div style={styles.cardDesc}>{f.desc}</div>
          </div>
        ))}
      </div>

      <footer style={styles.footer}>
        © {new Date().getFullYear()} DigiLocker · Powered by FIDO2 & Spring Security WebAuthn
      </footer>
    </div>
  );
}
