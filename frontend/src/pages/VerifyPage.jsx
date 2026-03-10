import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/AuthPages.css';

export default function VerifyPage() {
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { token } = useParams();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(`http://localhost:4000/auth/verify/${token}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage('Your email has been verified successfully! Redirecting to login...');
          
          // Redirect to login page after 3 seconds
          setTimeout(() => {
            navigate('/login?verified=true');
          }, 3000);
        } else {
          setStatus('error');
          setMessage(data.message || 'Verification failed. The token may be invalid or expired.');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
        setMessage('Network error. Please try again later.');
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setStatus('error');
      setMessage('Invalid verification link.');
    }
  }, [token, navigate]);

  return (
    <div className="auth-container">
      <div className="auth-card">
        {status === 'verifying' && (
          <>
            <h2>Verifying Your Email</h2>
            <div className="loading-spinner">
              <p>Please wait while we verify your email...</p>
            </div>
          </>
        )}
        
        {status === 'success' && (
          <>
            <h2 style={{ color: '#28a745' }}>Email Verified!</h2>
            <div className="success-message">{message}</div>
            <p className="switch-auth">
              Redirecting to login... or{' '}
              <button 
                type="button" 
                onClick={() => navigate('/login?verified=true')}
                className="link-btn"
              >
                click here
              </button>
            </p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <h2 style={{ color: '#c00' }}>Verification Failed</h2>
            <div className="error-message">{message}</div>
            <p className="switch-auth">
              <button 
                type="button" 
                onClick={() => navigate('/login')}
                className="link-btn"
              >
                Go to Login
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

