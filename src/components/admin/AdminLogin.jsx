import { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

const ADMIN_PASS = 'skardu2024';

export default function AdminLogin({ onLogin }) {
  const [pass, setPass]       = useState('');
  const [show, setShow]       = useState(false);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (pass === ADMIN_PASS) {
        sessionStorage.setItem('admin_auth', '1');
        onLogin();
      } else {
        setError('Incorrect password. Please try again.');
        setPass('');
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="admin-login-bg">
      <div className="admin-login-card">
        <div className="admin-login-logo">
          <div className="admin-login-icon">
            <Lock size={32} color="white" />
          </div>
          <h1>Skardu <span>Explore</span></h1>
          <p>Admin Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="al-field">
            <label>Password</label>
            <div className="al-input-wrap">
              <input
                type={show ? 'text' : 'password'}
                value={pass}
                onChange={e => { setPass(e.target.value); setError(''); }}
                placeholder="Enter Admin password..."
                required
                autoFocus
              />
              <button type="button" className="al-eye" onClick={() => setShow(!show)}>
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {error && <p className="al-error">{error}</p>}
          </div>
          <button type="submit" className="al-btn" disabled={loading}>
            {loading ? 'Login...' : 'Login'}
          </button>
        </form>

        <p className="al-footer">© 2026 Skardu Explore</p>
      </div>
    </div>
  );
}
