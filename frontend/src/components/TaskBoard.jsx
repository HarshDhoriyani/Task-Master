import { useState, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { DragDropContext } from '@hello-pangea/dnd';
import TaskColumn from './TaskColumn';
import TaskModal from './TaskModal';

const COLUMNS = ['To Do', 'In Progress', 'Done'];

function TaskBoard({ tasks, fetchTasks, setTasks }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('All');

  const handleOpenModal = (task = null) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingTask(null);
    setIsModalOpen(false);
  };

  const saveTask = async (taskData) => {
    const isEditing = !!taskData.id;
    const url = isEditing 
      ? `http://localhost:3001/api/tasks/${taskData.id}` 
      : 'http://localhost:3001/api/tasks';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save task');
      }
      
      toast.success(isEditing ? 'Task updated!' : 'Task created!');
      fetchTasks();
      handleCloseModal();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      const response = await fetch(`http://localhost:3001/api/tasks/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete task');
      toast.success('Task deleted');
      fetchTasks();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;
    
    const newStatus = destination.droppableId;
    const taskId = parseInt(draggableId, 10);
    const draggedTask = tasks.find(t => t.id === taskId);
    
    // Optimistic UI update
    const newTasks = tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t);
    setTasks(newTasks);
    
    // Server update
    try {
      const response = await fetch(`http://localhost:3001/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: newStatus, 
          title: draggedTask.title, 
          description: draggedTask.description,
          priority: draggedTask.priority,
          dueDate: draggedTask.dueDate
        })
      });
      if (!response.ok) throw new Error('Failed to move task');
    } catch (error) {
      toast.error('Error moving task: ' + error.message);
      fetchTasks();
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = (task.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            task.description?.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesPriority = filterPriority === 'All' || task.priority === filterPriority;
      return matchesSearch && matchesPriority;
    });
  }, [tasks, searchQuery, filterPriority]);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Done').length;
  const progressPercent = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <>
      <div className="dashboard glass">
        <div className="dashboard-stats">
          <div>
            <h3>Progress</h3>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
            </div>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{progressPercent}% Completed</span>
          </div>
        </div>
        
        <div className="dashboard-controls">
          <input 
            type="text" 
            placeholder="Search tasks..." 
            className="form-control search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select 
            className="form-control filter-select"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="All" style={{color:'black'}}>All Priorities</option>
            <option value="High" style={{color:'black'}}>High</option>
            <option value="Medium" style={{color:'black'}}>Medium</option>
            <option value="Low" style={{color:'black'}}>Low</option>
          </select>
          <button className="btn-primary" onClick={() => handleOpenModal()}>
            + Add Task
          </button>
        </div>
      </div>
      
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="kanban-board">
          {COLUMNS.map(columnStatus => (
            <TaskColumn 
              key={columnStatus} 
              title={columnStatus} 
              tasks={filteredTasks.filter(t => t.status === columnStatus)}
              onEdit={handleOpenModal}
              onDelete={deleteTask}
            />
          ))}
        </div>
      </DragDropContext>

      {isModalOpen && (
        <TaskModal 
          task={editingTask} 
          onSave={saveTask} 
          onClose={handleCloseModal} 
        />
      )}
    </>
  );
}

export default TaskBoard;
