import { useState, useEffect } from 'react';
import '../styles/Dashboard.css';

const API_URL = 'http://localhost:4000';

export default function Team() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', role: '', email: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  
  // View Profile modal state
  const [viewMember, setViewMember] = useState(null);
  
  // Edit member state
  const [editMemberId, setEditMemberId] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', role: '', email: '' });

  // Fetch team members from backend
  const fetchTeamMembers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/team`);
      
      if (response.ok) {
        const data = await response.json();
        setTeamMembers(data);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  // Load team members on component mount
  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleEditInputChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim() || !formData.role.trim() || !formData.email.trim()) {
      setError('All fields are required');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/team`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setTeamMembers([...teamMembers, data]);
        setFormData({ name: '', role: '', email: '' });
        setShowForm(false);
      } else {
        setError(data.message || 'Failed to add team member');
      }
    } catch (error) {
      console.error('Error adding team member:', error);
      setError('Failed to add team member. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({ name: '', role: '', email: '' });
    setError('');
  };

  // View Profile functions
  const handleViewProfile = (member) => {
    setViewMember(member);
  };

  const closeViewProfile = () => {
    setViewMember(null);
  };

  // Edit functions
  const handleEditClick = (member) => {
    setEditMemberId(member._id);
    setEditFormData({ name: member.name, role: member.role, email: member.email });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!editFormData.name.trim() || !editFormData.role.trim() || !editFormData.email.trim()) {
      setError('All fields are required');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editFormData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/team/${editMemberId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editFormData)
      });

      const data = await response.json();

      if (response.ok) {
        setTeamMembers(teamMembers.map(member => 
          member._id === editMemberId 
            ? { ...member, name: editFormData.name, role: editFormData.role, email: editFormData.email }
            : member
        ));
        setEditMemberId(null);
        setEditFormData({ name: '', role: '', email: '' });
        setError('');
      } else {
        setError(data.message || 'Failed to update team member');
      }
    } catch (error) {
      console.error('Error updating team member:', error);
      setError('Failed to update team member. Please try again.');
    }
  };

  const handleEditCancel = () => {
    setEditMemberId(null);
    setEditFormData({ name: '', role: '', email: '' });
    setError('');
  };

  // Delete function
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this team member?')) {
      try {
        const response = await fetch(`${API_URL}/api/team/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          setTeamMembers(teamMembers.filter(member => member._id !== id));
        }
      } catch (error) {
        console.error('Error deleting team member:', error);
        setError('Failed to delete team member. Please try again.');
      }
    }
  };

  if (initialLoading) {
    return (
      <div className="page-content">
        <h2>Team Members</h2>
        <p>Loading team members...</p>
      </div>
    );
  }

  return (
    <div className="page-content">
      <h2>Team Members</h2>
      <p>You can view your team members here:</p>

      {showForm ? (
        <div className="settings-section">
          <h3>Add New Team Member</h3>
          <form onSubmit={handleSubmit}>
            <div className="setting-item">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter name"
                required
              />
            </div>
            <div className="setting-item">
              <label>Role</label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                placeholder="Enter role (e.g., Developer, Designer)"
                required
              />
            </div>
            <div className="setting-item">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email address"
                required
              />
            </div>
            {error && <div className="message error">{error}</div>}
            <button type="submit" disabled={loading} className="add-team-btn">
              {loading ? 'Adding...' : 'Add Member'}
            </button>
            <button type="button" onClick={handleCancel} className="cancel-btn" style={{ marginLeft: '10px' }}>
              Cancel
            </button>
          </form>
        </div>
      ) : (
        <button onClick={() => setShowForm(true)} className="add-team-btn">+ Add Team Member</button>
      )}

      <div className="team-grid">
        {teamMembers.length === 0 ? (
          <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#666' }}>
            No team members found. Add your first team member above.
          </p>
        ) : (
          teamMembers.map(member => (
            <div key={member._id} className="team-card">
              {editMemberId === member._id ? (
                // Edit Form
                <form onSubmit={handleEditSubmit} style={{ width: '100%' }}>
                  <div className="setting-item">
                    <label>Name</label>
                    <input
                      type="text"
                      name="name"
                      value={editFormData.name}
                      onChange={handleEditInputChange}
                      placeholder="Enter name"
                      required
                    />
                  </div>
                  <div className="setting-item">
                    <label>Role</label>
                    <input
                      type="text"
                      name="role"
                      value={editFormData.role}
                      onChange={handleEditInputChange}
                      placeholder="Enter role"
                      required
                    />
                  </div>
                  <div className="setting-item">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editFormData.email}
                      onChange={handleEditInputChange}
                      placeholder="Enter email"
                      required
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button type="submit" className="save-btn">Save</button>
                    <button type="button" onClick={handleEditCancel} className="cancel-btn">Cancel</button>
                  </div>
                </form>
              ) : (
                // Display Member
                <>
                  <div className="team-avatar">{member.name.charAt(0)}</div>
                  <h3>{member.name}</h3>
                  <p className="team-role">{member.role}</p>
                  <p className="team-email">{member.email}</p>
                  <div className="team-actions">
                    <button onClick={() => handleViewProfile(member)} className="icon-btn view-btn" title="View Profile">👁️</button>
                    <button onClick={() => handleEditClick(member)} className="icon-btn edit-btn" title="Edit">✏️</button>
                    <button onClick={() => handleDelete(member._id)} className="icon-btn delete-btn" title="Delete">🗑️</button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* View Profile Modal */}
      {viewMember && (
        <div className="modal-overlay" onClick={closeViewProfile}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeViewProfile}>&times;</button>
            <h3>Team Member Profile</h3>
            <div className="profile-details">
              <div className="profile-avatar-large">{viewMember.name.charAt(0)}</div>
              <div className="profile-info">
                <div className="profile-field">
                  <label>Name:</label>
                  <span>{viewMember.name}</span>
                </div>
                <div className="profile-field">
                  <label>Role:</label>
                  <span>{viewMember.role}</span>
                </div>
                <div className="profile-field">
                  <label>Email:</label>
                  <span>{viewMember.email}</span>
                </div>
              </div>
            </div>
            <button onClick={closeViewProfile} className="add-team-btn" style={{ marginTop: '20px', width: '100%' }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

