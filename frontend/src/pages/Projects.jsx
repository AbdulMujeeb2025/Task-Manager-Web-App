
import { useState, useEffect } from 'react';
import '../styles/Dashboard.css';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', status: 'Planning' });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/projects', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const url = editingId 
        ? `http://localhost:4000/projects/${editingId}`
        : 'http://localhost:4000/projects';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

if (response.ok) {
        const data = await response.json();
        if (editingId) {
          setProjects(projects.map(p => p._id === editingId ? data : p));
          setMessage({ type: 'success', text: 'Project updated!' });
        } else {
          setProjects([data, ...projects]);
          setMessage({ type: 'success', text: 'Project added!' });
        }
        resetForm();
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.message || 'Error saving project' });
      }
    } catch (err) {
      console.error('Error saving project:', err);
      setMessage({ type: 'error', text: 'Error saving project. Is the server running?' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/projects/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        setProjects(projects.filter(p => p._id !== id));
        setMessage({ type: 'success', text: 'Project deleted!' });
      }
    } catch (err) {
      console.error('Error deleting project:', err);
    }
  };

  const handleEdit = (project) => {
    setEditingId(project._id);
    setFormData({ 
      name: project.name, 
      description: project.description || '', 
      status: project.status 
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: '', description: '', status: 'Planning' });
    setMessage({ type: '', text: '' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return '#4caf50';
      case 'In Progress': return '#2196f3';
      case 'On Hold': return '#ff9800';
      default: return '#9e9e9e';
    }
  };

  return (
    <div className="page-content">
      <h2>Projects</h2>
      <p>You can view all your projects here and create new projects.</p>

      {message.text && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}

      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="add-project-btn">
          + Add New Project
        </button>
      ) : (
        <div className="settings-section">
          <h3>{editingId ? 'Edit Project' : 'Create New Project'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="setting-item">
              <label>Project Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Project name"
                required
              />
            </div>
            <div className="setting-item">
              <label>Description (Optional)</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Project description"
              />
            </div>
            <div className="setting-item">
              <label>Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>
            <button type="submit" disabled={loading} className="add-project-btn">
              {loading ? 'Saving...' : editingId ? 'Update Project' : 'Create Project'}
            </button>
            <button type="button" onClick={resetForm} className="cancel-btn" style={{ marginLeft: '10px' }}>
              Cancel
            </button>
          </form>
        </div>
      )}

      {projects.length === 0 ? (
        <div className="placeholder-box">
          <p>📁 No projects yet. Add a new project!</p>
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map(project => (
            <div key={project._id} className="project-card">
              <h3>{project.name}</h3>
              {project.description && <p style={{ color: '#666', marginBottom: '10px' }}>{project.description}</p>}
              <div className="project-info">
                <span 
                  className="project-status" 
                  style={{ backgroundColor: getStatusColor(project.status), color: 'white' }}
                >
                  {project.status}
                </span>
              </div>
              <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                <button onClick={() => handleEdit(project)} className="icon-btn edit-btn">✏️ Edit</button>
                <button onClick={() => handleDelete(project._id)} className="delete-btn">🗑️ Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


