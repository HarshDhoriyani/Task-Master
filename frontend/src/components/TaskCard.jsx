import { Draggable } from '@hello-pangea/dnd';

function TaskCard({ task, index, onEdit, onDelete }) {
  
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'var(--danger)';
      case 'Medium': return 'var(--warning, #f59e0b)';
      case 'Low': return 'var(--success)';
      default: return 'var(--text-muted)';
    }
  };

  const isOverdue = (dateStr) => {
    if (!dateStr) return false;
    const due = new Date(dateStr);
    const today = new Date();
    today.setHours(0,0,0,0);
    return due < today;
  };

  return (
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div 
          className="task-card glass"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            opacity: snapshot.isDragging ? 0.9 : 1,
            boxShadow: snapshot.isDragging ? '0 10px 25px -5px rgba(0, 0, 0, 0.5)' : undefined,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <div className="task-title">{task.title}</div>
            <span className="priority-badge" style={{ backgroundColor: getPriorityColor(task.priority) + '33', color: getPriorityColor(task.priority) }}>
              {task.priority || 'Medium'}
            </span>
          </div>
          
          {task.description && <div className="task-desc" style={{ marginBottom: '0.75rem' }}>{task.description}</div>}
          
          {task.dueDate && (
            <div className="task-desc" style={{ color: isOverdue(task.dueDate) ? 'var(--danger)' : 'var(--text-muted)' }}>
              <svg style={{ width: '12px', height: '12px', display: 'inline', marginRight: '4px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              Due: {task.dueDate}
            </div>
          )}
          
          <div className="task-actions">
            <button className="btn-icon" onClick={(e) => { e.stopPropagation(); onEdit(task); }}>Edit</button>
            <button className="btn-icon btn-danger" onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}>Del</button>
          </div>
        </div>
      )}
    </Draggable>
  );
}

export default TaskCard;
