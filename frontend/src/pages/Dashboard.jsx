import { useState, useEffect } from 'react';
import '../styles/Dashboard.css';
import Sidebar from '../components/Sidebar';
import MyTasks from './MyTasks';
import Projects from './Projects';
import Team from './Team';
import Calendar from './Calendar';
import Settings from './Settings';

export default function Dashboard({ user, onLogout, onUpdateUser, darkMode, onDarkModeChange }) {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDueDate, setEditDueDate] = useState('');

  useEffect(() => {
    if (currentPage === 'dashboard' || currentPage === 'mytasks') {
      fetchTasks();
    }
  }, [currentPage]);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/tasks', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newTask, dueDate: dueDate || null }),
      });

      if (response.ok) {
        const task = await response.json();
        setTasks([...tasks, task]);
        setNewTask('');
        setDueDate('');
      }
    } catch (err) {
      console.error('Error adding task:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/tasks/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        setTasks(tasks.filter(task => task._id !== id));
      }
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const handleEditClick = (task) => {
    setEditingId(task._id);
    setEditTitle(task.title);
    setEditDueDate(task.dueDate ? task.dueDate.split('T')[0] : '');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditDueDate('');
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    if (!editTitle.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/tasks/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title: editTitle, dueDate: editDueDate || null }),
      });

      if (response.ok) {
        const updated = await response.json();
        setTasks(tasks.map(t => (t._id === updated._id ? updated : t)));
        handleCancelEdit();
      }
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <section className="tasks-section">
            <h2>Meri Tasks</h2>
            
            <form onSubmit={handleAddTask} className="add-task-form">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Naya task add karo..."
                className="task-input"
              />
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="due-input"
                aria-label="Due date"
              />
              <button type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'Add Task'}
              </button>
            </form>

            <div className="tasks-list">
              {tasks.length === 0 ? (
                <p className="no-tasks">Koi task nahi hai. Ek naya task add karo!</p>
              ) : (
                tasks.map(task => (
                  <div key={task._id} className="task-item">
                    {editingId === task._id ? (
                      <form onSubmit={handleUpdateTask} className="edit-form">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="task-input"
                        />
                        <input
                          type="date"
                          value={editDueDate}
                          onChange={(e) => setEditDueDate(e.target.value)}
                          className="due-input"
                        />
                        <div className="task-controls">
                          <button type="submit" className="save-btn">Save</button>
                          <button type="button" onClick={handleCancelEdit} className="cancel-btn">Cancel</button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <div className="task-content">
                          <h3>{task.title}</h3>
                          <div className="meta-row">
                            <span className="task-date">Added: {new Date(task.createdAt).toLocaleDateString()}</span>
                            {task.dueDate && (
                              <span className="due-date">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                        <div className="task-controls">
                          <button onClick={() => handleEditClick(task)} className="icon-btn edit-btn" aria-label="Edit">✏️</button>
                          <button onClick={() => handleDeleteTask(task._id)} className="icon-btn delete-btn" aria-label="Delete">🗑️</button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>
        );
      case 'mytasks':
        return (
          <MyTasks 
            tasks={tasks} 
            onDelete={handleDeleteTask}
            onEdit={handleEditClick}
          />
        );
      case 'projects':
        return <Projects />;
      case 'team':
        return <Team />;
      case 'calendar':
        return <Calendar />;
      case 'settings':
        return <Settings 
          user={user} 
          onUpdateUser={(updatedUser) => {
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
          }}
          onDarkModeChange={onDarkModeChange}
          darkMode={darkMode}
        />;
      default:
        return null;
    }
  };

  return (
    <div className="app-layout">
      <header className="top-navbar">
        <h1>Task Manager</h1>
        <div className="user-info">
          <span className="welcome">Shukriya, {user?.name}!</span>
          <button onClick={onLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <div className="main-container">
        <Sidebar activePage={currentPage} onNavigate={setCurrentPage} />
        
        <main className="dashboard-main">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

