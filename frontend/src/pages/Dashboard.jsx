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
  const [teamMembers, setTeamMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('Medium');
  const [newTaskAssignedTo, setNewTaskAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPriority, setEditPriority] = useState('Medium');
  const [editAssignedTo, setEditAssignedTo] = useState('');
  const [editDueDate, setEditDueDate] = useState('');

  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  // Filter tasks based on search query
  const filteredTasks = tasks.filter(task => {
    const query = searchQuery.toLowerCase();
    return (
      task.title.toLowerCase().includes(query) ||
      (task.description && task.description.toLowerCase().includes(query))
    );
  });

  useEffect(() => {
    if (currentPage === 'dashboard' || currentPage === 'mytasks') {
      fetchTasks();
      fetchTeamMembers();
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

  const fetchTeamMembers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/user/all', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setTeamMembers(data);
      }
    } catch (err) {
      console.error('Error fetching team members:', err);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          title: newTaskTitle, 
          description: newTaskDescription,
          priority: newTaskPriority,
          assignedTo: newTaskAssignedTo || null,
          dueDate: dueDate || null 
        }),
      });

      if (response.ok) {
        const task = await response.json();
        // Fetch the full task with assigned user details
        const fullTaskResponse = await fetch(`http://localhost:4000/tasks/${task._id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const fullTask = fullTaskResponse.ok ? await fullTaskResponse.json() : task;
        setTasks([...tasks, fullTask]);
        setNewTaskTitle('');
        setNewTaskDescription('');
        setNewTaskPriority('Medium');
        setNewTaskAssignedTo('');
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

  const handleToggleComplete = async (task) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/tasks/${task._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          title: task.title, 
          description: task.description,
          priority: task.priority,
          assignedTo: task.assignedTo?._id || task.assignedTo || null,
          dueDate: task.dueDate, 
          completed: !task.completed 
        }),
      });

      if (response.ok) {
        const updated = await response.json();
        setTasks(tasks.map(t => (t._id === updated._id ? updated : t)));
      }
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const handleEditClick = (task) => {
    setEditingId(task._id);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setEditPriority(task.priority || 'Medium');
    setEditAssignedTo(task.assignedTo?._id || task.assignedTo || '');
    setEditDueDate(task.dueDate ? task.dueDate.split('T')[0] : '');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditDescription('');
    setEditPriority('Medium');
    setEditAssignedTo('');
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
        body: JSON.stringify({ 
          title: editTitle, 
          description: editDescription,
          priority: editPriority,
          assignedTo: editAssignedTo || null,
          dueDate: editDueDate || null 
        }),
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

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'High': return 'priority-high';
      case 'Medium': return 'priority-medium';
      case 'Low': return 'priority-low';
      default: return 'priority-medium';
    }
  };

  const getAssignedMemberName = (task) => {
    if (task.assignedTo) {
      return task.assignedTo.name || task.assignedTo;
    }
    return null;
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <section className="tasks-section">
            <h2>My Tasks</h2>
            
            {/* Statistics Cards */}
            <div className="stats-container">
              <div className="stat-card total-tasks">
                <div className="stat-icon">📋</div>
                <div className="stat-info">
                  <h3>Total Tasks</h3>
                  <p className="stat-number">{totalTasks}</p>
                </div>
              </div>
              <div className="stat-card completed-tasks">
                <div className="stat-icon">✅</div>
                <div className="stat-info">
                  <h3>Completed</h3>
                  <p className="stat-number">{completedTasks}</p>
                </div>
              </div>
              <div className="stat-card pending-tasks">
                <div className="stat-icon">⏳</div>
                <div className="stat-info">
                  <h3>Pending</h3>
                  <p className="stat-number">{pendingTasks}</p>
                </div>
              </div>
            </div>
            
            <form onSubmit={handleAddTask} className="add-task-form">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Task title..."
                className="task-title-input"
                aria-label="Task title"
              />
              <input
                type="text"
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                placeholder="Description (optional)..."
                className="task-description-input"
                aria-label="Task description"
              />
              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value)}
                className="task-priority-select"
                aria-label="Priority"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <select
                value={newTaskAssignedTo}
                onChange={(e) => setNewTaskAssignedTo(e.target.value)}
                className="task-assign-select"
                aria-label="Assign to"
              >
                <option value="">Assign to...</option>
                {teamMembers.map(member => (
                  <option key={member._id} value={member._id}>
                    {member.name}
                  </option>
                ))}
              </select>
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

            {/* Search Bar */}
            <div className="search-container">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="🔍 Search tasks by title or description..."
                className="search-input"
                aria-label="Search tasks"
              />
            </div>

            <div className="tasks-list">
              {tasks.length === 0 ? (
                <p className="no-tasks">No tasks yet. Add a new task!</p>
              ) : filteredTasks.length === 0 ? (
                <p className="no-tasks">No tasks found matching "{searchQuery}"</p>
              ) : (
                filteredTasks.map(task => (
                  <div key={task._id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                    {editingId === task._id ? (
                      <form onSubmit={handleUpdateTask} className="edit-form">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="task-input"
                          placeholder="Task title"
                        />
                        <input
                          type="text"
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className="task-input"
                          placeholder="Description"
                        />
                        <select
                          value={editPriority}
                          onChange={(e) => setEditPriority(e.target.value)}
                          className="task-priority-select"
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                        </select>
                        <select
                          value={editAssignedTo}
                          onChange={(e) => setEditAssignedTo(e.target.value)}
                          className="task-assign-select"
                        >
                          <option value="">Unassigned</option>
                          {teamMembers.map(member => (
                            <option key={member._id} value={member._id}>
                              {member.name}
                            </option>
                          ))}
                        </select>
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
                          <div className="task-header">
                            <label className="checkbox-container">
                              <input
                                type="checkbox"
                                checked={task.completed || false}
                                onChange={() => handleToggleComplete(task)}
                              />
                              <span className="checkmark"></span>
                            </label>
                            <div className="task-title-description">
                              <h3 className={task.completed ? 'task-title-completed' : ''}>{task.title}</h3>
                              {task.description && (
                                <p className="task-description">{task.description}</p>
                              )}
                            </div>
                          </div>
                          <div className="task-meta">
                            <span className={`priority-badge ${getPriorityClass(task.priority)}`}>
                              {task.priority || 'Medium'}
                            </span>
                            {getAssignedMemberName(task) && (
                              <span className="assigned-badge">
                                👤 {getAssignedMemberName(task)}
                              </span>
                            )}
                            <span className="task-date">Added: {new Date(task.createdAt).toLocaleDateString()}</span>
                            {task.dueDate && (
                              <span className="due-date">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                        <div className="task-controls">
                          {!task.completed && (
                            <button 
                              onClick={() => handleToggleComplete(task)} 
                              className="mark-complete-btn"
                              aria-label="Mark as completed"
                            >
                              ✓ Mark Complete
                            </button>
                          )}
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
          <span className="welcome">Welcome, {user?.name}!</span>
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

