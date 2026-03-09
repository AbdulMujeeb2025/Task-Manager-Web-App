import '../styles/Dashboard.css';

export default function MyTasks({ tasks = [], onDelete, onEdit }) {
  return (
    <div className="page-content">
      <h2>My Tasks - Full List</h2>
      <p>All your tasks will appear here:</p>
      
      {tasks.length === 0 ? (
        <div className="placeholder-box">
          <p>📋 No tasks yet. Add a task from the Dashboard!</p>
        </div>
      ) : (
        <div className="tasks-list">
          {tasks.map(task => (
            <div key={task._id} className="task-item">
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
                <button onClick={() => onEdit(task)} className="icon-btn edit-btn" aria-label="Edit">✏️</button>
                <button onClick={() => onDelete(task._id)} className="icon-btn delete-btn" aria-label="Delete">🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div style={{ marginTop: '30px' }}>
        <h3>Total Tasks: {tasks.length}</h3>
      </div>
    </div>
  );
}

