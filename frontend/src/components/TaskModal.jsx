import { useState, useEffect } from 'react';

function TaskModal({ task, onSave, onClose }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('To Do');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setStatus(task.status || 'To Do');
      setPriority(task.priority || 'Medium');
      setDueDate(task.dueDate || '');
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      id: task?.id,
      title,
      description,
      status,
      priority,
      dueDate: dueDate || null
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass">
        <h2 style={{ marginBottom: '1.5rem', fontWeight: 600 }}>
          {task ? 'Edit Task' : 'New Task'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title <span style={{color: 'var(--danger)'}}>*</span></label>
            <input 
              type="text" 
              className="form-control" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              autoFocus
              required
            />
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea 
              className="form-control" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add some details..."
              rows={3}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Status</label>
              <select 
                className="form-control"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="To Do" style={{ color: 'black' }}>To Do</option>
                <option value="In Progress" style={{ color: 'black' }}>In Progress</option>
                <option value="Done" style={{ color: 'black' }}>Done</option>
              </select>
            </div>
            
            <div className="form-group" style={{ flex: 1 }}>
              <label>Priority</label>
              <select 
                className="form-control"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="Low" style={{ color: 'black' }}>Low</option>
                <option value="Medium" style={{ color: 'black' }}>Medium</option>
                <option value="High" style={{ color: 'black' }}>High</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Due Date</label>
            <input 
              type="date" 
              className="form-control" 
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              style={{ colorScheme: 'dark' }}
            />
          </div>
          
          <div className="modal-actions">
            <button type="button" onClick={onClose} style={{ padding: '0.5rem 1rem' }}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;
