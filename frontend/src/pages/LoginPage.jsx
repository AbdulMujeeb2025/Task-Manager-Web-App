import { useState, useEffect } from 'react';
import '../styles/AuthPages.css';

export default function LoginPage({ onLogin, onSwitchToSignup, onSwitchToForgotPassword, verificationStatus }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Show verification success message
  useEffect(() => {
    if (verificationStatus === 'success') {
      setMessage('Your email has been successfully verified. You can now log in.');
    }
  }, [verificationStatus]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:4000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      console.log('Login response:', data);
      
      if (response.ok) {
        const userData = {
          _id: data._id,
          name: data.name,
          email: data.email
        };
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(userData));
        onLogin(userData);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Task Manager - Login</h2>
        {message && <div className="success-message">{message}</div>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="switch-auth">
          Don't have an account? 
          <button type="button" onClick={onSwitchToSignup} className="link-btn">
            Sign up
          </button>
        </p>
        <p className="forgot-password">
          <button type="button" onClick={onSwitchToForgotPassword} className="link-btn">
            Forgot Password?
          </button>
        </p>
      </div>
    </div>
  );
}

