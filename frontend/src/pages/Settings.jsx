import '../styles/Dashboard.css';
import { useState, useEffect } from 'react';

export default function Settings({ user, onUpdateUser, onDarkModeChange, darkMode }) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [notifications, setNotifications] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    // Load user data
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));
    }
    
    // Load dark mode preference from localStorage
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    if (savedDarkMode !== darkMode) {
      onDarkModeChange(savedDarkMode);
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    // Validate password if trying to change
    if (formData.newPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        setMessage({ type: 'error', text: 'New passwords do not match' });
        setLoading(false);
        return;
      }
      if (!formData.currentPassword) {
        setMessage({ type: 'error', text: 'Please enter current password to change password' });
        setLoading(false);
        return;
      }
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          currentPassword: formData.currentPassword || undefined,
          newPassword: formData.newPassword || undefined
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        
        // Update user in localStorage and App state
        localStorage.setItem('user', JSON.stringify(data));
        if (onUpdateUser) {
          onUpdateUser(data);
        }
        
        // Clear password fields
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update profile' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDarkModeToggle = (e) => {
    const isDark = e.target.checked;
    onDarkModeChange(isDark);
    localStorage.setItem('darkMode', isDark);
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:4000/user/profile', {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.reload();
        } else {
          alert('Failed to delete account');
        }
      } catch (err) {
        console.error(err);
        alert('Error deleting account');
      }
    }
  };

  return (
    <div className="page-content">
      <h2>Settings</h2>
      <p>You can change your account settings here:</p>
      
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
      
      <div className="settings-section">
        <h3>Account Settings</h3>
        <form onSubmit={handleSubmit}>
          <div className="setting-item">
            <label>Name</label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />
          </div>
          <div className="setting-item">
            <label>Email</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>
          
          <div className="setting-divider">
            <h4>Change Password (Optional)</h4>
          </div>
          
          <div className="setting-item">
            <label>Current Password</label>
            <input 
              type="password" 
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder="Enter current password"
            />
          </div>
          <div className="setting-item">
            <label>New Password</label>
            <input 
              type="password" 
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Enter new password"
            />
          </div>
          <div className="setting-item">
            <label>Confirm New Password</label>
            <input 
              type="password" 
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
            />
          </div>
          
          <button type="submit" className="save-btn" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      <div className="settings-section">
        <h3>Preferences</h3>
        <div className="setting-toggle">
          <label>
            <input 
              type="checkbox" 
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
            />
            Email Notifications
          </label>
        </div>
        <div className="setting-toggle">
          <label>
            <input 
              type="checkbox" 
              checked={darkMode}
              onChange={handleDarkModeToggle}
            />
            Dark Mode
          </label>
        </div>
      </div>

      <div className="settings-section danger-zone">
        <h3>Danger Zone</h3>
        <p className="danger-text">This action cannot be undone after deleting your account.</p>
        <button onClick={handleDeleteAccount} className="delete-account-btn">
          Delete Account
        </button>
      </div>
    </div>
  );
}

