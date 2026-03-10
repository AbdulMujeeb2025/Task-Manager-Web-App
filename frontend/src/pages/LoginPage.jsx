import { useState, useEffect } from 'react';
import '../styles/AuthPages.css';

export default function LoginPage({ onLogin, onSwitchToSignup, onSwitchToForgotPassword, verificationStatus }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [emailNotVerified, setEmailNotVerified] = useState(false);

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
    setEmailNotVerified(false);
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
        // Check if email is not verified
        if (data.message && data.message.includes('not verified')) {
          setEmailNotVerified(true);
        }
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!formData.email) {
      setError('Please enter your email address to resend verification.');
      return;
    }

    setResendLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:4000/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setEmailNotVerified(false);
      } else {
        setError(data.message || 'Failed to resend verification email.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error(err);
    } finally {
      setResendLoading(false);
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
        
        {emailNotVerified && (
          <button 
            type="button" 
            className="resend-verification-btn"
            onClick={handleResendVerification}
            disabled={resendLoading}
          >
            {resendLoading ? 'Sending...' : 'Resend Verification Email'}
          </button>
        )}
        
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

