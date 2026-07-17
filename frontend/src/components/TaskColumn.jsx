import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';

function TaskColumn({ title, tasks, onEdit, onDelete }) {
  return (
    <div className="kanban-column glass">
      <div className="column-header">
        <span>{title}</span>
        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          {tasks.length}
        </span>
      </div>
      
      <Droppable droppableId={title}>
        {(provided, snapshot) => (
          <div 
            className={`column-content ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '1rem', 
              minHeight: '150px',
              flex: 1,
              transition: 'background-color 0.2s ease',
              borderRadius: '8px',
              backgroundColor: snapshot.isDraggingOver ? 'rgba(255,255,255,0.05)' : 'transparent'
            }}
          >
            {tasks.map((task, index) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                index={index}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
            {provided.placeholder}
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem', padding: '2rem 0' }}>
                No tasks here
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}

export default TaskColumn;
