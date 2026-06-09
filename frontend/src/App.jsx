import { useState, useEffect } from 'react';
import './App.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [draggingTaskId, setDraggingTaskId] = useState(null);
  const [draggedOverColumn, setDraggedOverColumn] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeDeleteModal();
      }
    };
    if (isDeleteModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDeleteModalOpen]);

  const fetchTasks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`);
      if (!response.ok) {
        throw new Error(`Failed to load tasks (HTTP ${response.status})`);
      }
      const data = await response.json();
      setTasks(data.sort((a, b) => b.id - a.id));
    } catch (err) {
      console.error(err);
      setError(err.message || 'Could not connect to the backend server. Verify the server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    const title = newTaskTitle.trim();
    if (!title) {
      setError('Task title cannot be empty.');
      return;
    }
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || `Failed to create task (HTTP ${response.status})`);
      }
      const createdTask = await response.json();
      setTasks(prev => [createdTask, ...prev]);
      setNewTaskTitle('');
    } catch (err) {
      setError(err.message || 'Failed to create task.');
    }
  };

  const handleToggleTaskStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'todo' ? 'done' : 'todo';

    // Optimistic UI update
    setTasks(prev =>
      prev.map(t => t.id === id ? { ...t, status: nextStatus } : t)
    );
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || `Failed to update task (HTTP ${response.status})`);
      }

      const updatedTask = await response.json();
      // Sync state with official response
      setTasks(prev => prev.map(t => t.id === id ? updatedTask : t));
    } catch (err) {
      setError(err.message || 'Failed to update task status.');
      // Revert optimistic update
      setTasks(prev =>
        prev.map(t => t.id === id ? { ...t, status: currentStatus } : t)
      );
    }
  };

  const openDeleteConfirmation = (task) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setTaskToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;
    const id = taskToDelete.id;
    const taskObj = taskToDelete;

    closeDeleteModal();

    // Optimistic UI update
    setTasks(prev => prev.filter(t => t.id !== id));
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || `Failed to delete task (HTTP ${response.status})`);
      }
    } catch (err) {
      setError(err.message || 'Failed to delete task.');
      // Revert optimistic update
      setTasks(prev => {
        if (prev.some(t => t.id === id)) return prev;
        return [...prev, taskObj];
      });
    }
  };

  // Drag and Drop Handlers
  const handleDragStart = (e, task) => {
    e.dataTransfer.setData('text/plain', task.id.toString());
    e.dataTransfer.effectAllowed = 'move';
    setDraggingTaskId(task.id);
  };

  const handleDragEnd = () => {
    setDraggingTaskId(null);
    setDraggedOverColumn(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragEnter = (e, columnStatus) => {
    e.preventDefault();
    setDraggedOverColumn(columnStatus);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDraggedOverColumn(null);
  };

  const handleDrop = async (e, targetStatus) => {
    e.preventDefault();
    setDraggedOverColumn(null);
    setDraggingTaskId(null);
    const taskIdStr = e.dataTransfer.getData('text/plain');
    if (!taskIdStr) return;

    const taskId = parseInt(taskIdStr, 10);
    const task = tasks.find(t => t.id === taskId);
    if (task && task.status !== targetStatus) {
      await handleToggleTaskStatus(taskId, task.status);
    }
  };

  // Group tasks
  const todoTasks = tasks.filter(t => t.status === 'todo');
  const doneTasks = tasks.filter(t => t.status === 'done');

  // Render SVG icons in-line to avoid loading external icons
  const Octicons = {
    TodoHeaderIcon: () => (
      <svg className="column-icon-todo" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" fill="none" stroke="#2da44e" strokeWidth="2">
        <circle cx="8" cy="8" r="6" />
      </svg>
    ),
    DoneHeaderIcon: () => (
      <svg className="column-icon-done" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" fill="none" stroke="#a371f7" strokeWidth="2">
        <circle cx="8" cy="8" r="6" />
      </svg>
    ),
    TodoCardIcon: () => (
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" fill="none" stroke="#2da44e" strokeWidth="2">
        <circle cx="8" cy="8" r="6" />
        <circle cx="8" cy="8" r="2" fill="#2da44e" />
      </svg>
    ),
    DoneCardIcon: () => (
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" fill="none" stroke="#a371f7" strokeWidth="2">
        <circle cx="8" cy="8" r="6" />
        <path d="M5.5 8l1.5 1.5 3.5-3.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    Trash: () => (
      <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
        <path d="M11 1.75V3h2.25a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75ZM4.496 6.675a.75.75 0 1 0-1.492.15l.66 6.6A1.75 1.75 0 0 0 5.405 15h5.19c.9 0 1.652-.681 1.741-1.576l.66-6.6a.75.75 0 0 0-1.492-.149l-.66 6.6a.25.25 0 0 1-.249.225h-5.19a.25.25 0 0 1-.249-.225l-.66-6.6Z" />
      </svg>
    ),
    Logo: () => (
      <svg viewBox="0 0 16 16" width="20" height="20" aria-hidden="true">
        <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
      </svg>
    ),
    Sun: () => (
      <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
        <path d="M8 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm0-1.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm0-8a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 8 2.5Zm0 8a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 8 10.5Zm-5-3a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5A.75.75 0 0 1 3 7.5Zm8 0a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75ZM4.22 4.22a.75.75 0 0 1 1.06 0l1.06 1.06a.75.75 0 0 1-1.06 1.06L4.22 5.28a.75.75 0 0 1 0-1.06Zm6.36 6.36a.75.75 0 0 1 1.06 0l1.06 1.06a.75.75 0 1 1-1.06 1.06l-1.06-1.06a.75.75 0 0 1 0-1.06Zm-6.36 6.36a.75.75 0 0 1 0-1.06l1.06-1.06a.75.75 0 1 1 1.06 1.06l-1.06 1.06a.75.75 0 0 1-1.06 0Zm6.36-12.72a.75.75 0 0 1 0-1.06l1.06-1.06a.75.75 0 1 1 1.06 1.06l-1.06 1.06a.75.75 0 0 1-1.06 0Z" />
      </svg>
    ),
    Moon: () => (
      <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
        <path d="M9.598 1.591a.75.75 0 0 1 .785-.175 7 7 0 1 1-8.967 8.967.75.75 0 0 1 .961-.96 5.5 5.5 0 0 0 7.046-7.046.75.75 0 0 1 .175-.786Z" />
      </svg>
    ),
    ErrorIcon: () => (
      <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
        <path d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16ZM8 4a.905.905 0 0 0-.9.9v4a.9.9 0 0 0 1.8 0v-4A.905.905 0 0 0 8 4Zm0 7a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z" />
      </svg>
    ),
    EmptyStateIcon: () => (
      <svg viewBox="0 0 24 24" width="32" height="32" aria-hidden="true">
        <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2Zm0 16H5V5h14v14ZM17 12H7v-2h10v2Zm-4 4H7v-2h6v2Zm4-8H7V6h10v2Z" />
      </svg>
    ),
    Kebab: () => (
      <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
        <path d="M8 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3ZM1.5 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm13 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z" />
      </svg>
    ),
    Plus: () => (
      <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
        <path d="M7.75 2a.75.75 0 0 1 .75.75V7h4.25a.75.75 0 0 1 0 1.5H8.5v4.25a.75.75 0 0 1-1.5 0V8.5H2.75a.75.75 0 0 1 0-1.5H7V2.75A.75.75 0 0 1 7.75 2Z" />
      </svg>
    ),
    ArrowLeft: () => (
      <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
        <path d="M7.78 12.53a.75.75 0 0 1-1.06 0L2.47 8.28a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 1.06L4.06 7.5h10.75a.75.75 0 0 1 0 1.5H4.06l3.72 3.72a.75.75 0 0 1 0 1.06Z" />
      </svg>
    ),
    ArrowRight: () => (
      <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
        <path d="M8.22 2.97a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 8 8.22 4.28a.75.75 0 0 1 0-1.06Z" />
        <path d="M12.5 8H1.75a.75.75 0 0 1 0-1.5h10.75a.75.75 0 0 1 0 1.5Z" />
      </svg>
    )
  };

  return (
    <div className="app-layout">
      {/* GitHub Product-like Top Header */}
      <header className="header" id="app-header">
        <div className="header-brand">
          <Octicons.Logo />
          <span>Kanban Board</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="main-content" id="main-content">


        {/* Global Error Banner */}
        {error && (
          <div className="flash flash-danger" id="global-error-banner" role="alert">
            <Octicons.ErrorIcon />
            <div style={{ flex: 1 }}>{error}</div>
            <button
              className="btn-icon-delete"
              onClick={() => setError(null)}
              title="Dismiss error"
              style={{ color: 'inherit' }}
            >
              &times;
            </button>
          </div>
        )}

        {/* Toolbar: New Task form */}
        <form className="toolbar" onSubmit={handleCreateTask} id="new-task-form">
          <input
            type="text"
            className="input"
            placeholder="Create a new task..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            disabled={isLoading && tasks.length === 0}
            id="new-task-input"
            aria-label="New task title"
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!newTaskTitle.trim() || (isLoading && tasks.length === 0)}
            id="new-task-submit-btn"
          >
            Add Task
          </button>
        </form>

        {/* Kanban Board columns side-by-side */}
        <div className="kanban-board" id="kanban-board">
          {/* TO DO COLUMN */}
          <div
            className={`column-box ${draggedOverColumn === 'todo' ? 'column-drag-over' : ''}`}
            id="todo-column"
            onDragOver={handleDragOver}
            onDragEnter={(e) => handleDragEnter(e, 'todo')}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, 'todo')}
          >
            <div className="column-header">
              <div className="column-header-title-row">
                <div className="column-title-group">
                  <Octicons.TodoHeaderIcon />
                  <span className="column-title">Todo</span>
                </div>
              </div>
              <div className="column-description">This item hasn't been started</div>
            </div>
            <div className="column-body">
              {isLoading && tasks.length === 0 ? (
                // Skeleton Loader
                Array.from({ length: 3 }).map((_, i) => (
                  <div className="skeleton-row" key={`todo-skeleton-${i}`}>
                    <div className="task-left">
                      <div className="skeleton-btn" />
                      <div>
                        <div className="skeleton-text skeleton-text-main" />
                        <div className="skeleton-text skeleton-text-sub" />
                      </div>
                    </div>
                    <div className="skeleton-btn" />
                  </div>
                ))
              ) : todoTasks.length === 0 ? (
                // Blank Slate
                <div className="blankslate">
                  <Octicons.EmptyStateIcon />
                  <h3 className="blankslate-heading">No tasks to do</h3>
                  <p className="blankslate-text">Create a task using the input box above to get started.</p>
                </div>
              ) : (
                // Tasks List
                todoTasks.map(task => (
                  <div
                    className={`task-item ${draggingTaskId === task.id ? 'task-dragging' : ''}`}
                    key={task.id}
                    id={`task-${task.id}`}
                    draggable={true}
                    onDragStart={(e) => handleDragStart(e, task)}
                    onDragEnd={handleDragEnd}
                  >
                    <div className="task-header-row">
                      <button
                        type="button"
                        className="task-status-btn"
                        onClick={() => handleToggleTaskStatus(task.id, task.status)}
                        title="Mark as Done"
                      >
                        <Octicons.TodoCardIcon />
                      </button>
                      <span className="task-meta-id">kanban_board #{task.id}</span>
                    </div>
                    <div className="task-title">{task.title}</div>

                    <div className="task-actions">
                      <button
                        type="button"
                        className="btn-icon-action"
                        onClick={() => handleToggleTaskStatus(task.id, task.status)}
                        title="Move to Done"
                        aria-label="Move task to Done"
                      >
                        <Octicons.ArrowRight />
                      </button>
                      <button
                        type="button"
                        className="btn-icon-action btn-icon-delete"
                        onClick={() => openDeleteConfirmation(task)}
                        title="Delete task"
                        aria-label={`Delete task "${task.title}"`}
                      >
                        <Octicons.Trash />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* DONE COLUMN */}
          <div
            className={`column-box ${draggedOverColumn === 'done' ? 'column-drag-over' : ''}`}
            id="done-column"
            onDragOver={handleDragOver}
            onDragEnter={(e) => handleDragEnter(e, 'done')}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, 'done')}
          >
            <div className="column-header">
              <div className="column-header-title-row">
                <div className="column-title-group">
                  <Octicons.DoneHeaderIcon />
                  <span className="column-title">Done</span>
                </div>
              </div>
              <div className="column-description">This has been completed</div>
            </div>
            <div className="column-body">
              {isLoading && tasks.length === 0 ? (
                // Skeleton Loader
                Array.from({ length: 2 }).map((_, i) => (
                  <div className="skeleton-row" key={`done-skeleton-${i}`}>
                    <div className="task-left">
                      <div className="skeleton-btn" />
                      <div>
                        <div className="skeleton-text skeleton-text-main" />
                        <div className="skeleton-text skeleton-text-sub" />
                      </div>
                    </div>
                    <div className="skeleton-btn" />
                  </div>
                ))
              ) : doneTasks.length === 0 ? (
                // Blank Slate
                <div className="blankslate">
                  <Octicons.EmptyStateIcon />
                  <h3 className="blankslate-heading">No completed tasks</h3>
                  <p className="blankslate-text">Check a task in the "To Do" column to mark it as completed.</p>
                </div>
              ) : (
                // Tasks List
                doneTasks.map(task => (
                  <div
                    className={`task-item task-done ${draggingTaskId === task.id ? 'task-dragging' : ''}`}
                    key={task.id}
                    id={`task-${task.id}`}
                    draggable={true}
                    onDragStart={(e) => handleDragStart(e, task)}
                    onDragEnd={handleDragEnd}
                  >
                    <div className="task-header-row">
                      <button
                        type="button"
                        className="task-status-btn"
                        onClick={() => handleToggleTaskStatus(task.id, task.status)}
                        title="Move back to To Do"
                      >
                        <Octicons.DoneCardIcon />
                      </button>
                      <span className="task-meta-id">kanban_board #{task.id}</span>
                    </div>
                    <div className="task-title">{task.title}</div>

                    <div className="task-actions">
                      <button
                        type="button"
                        className="btn-icon-action"
                        onClick={() => handleToggleTaskStatus(task.id, task.status)}
                        title="Move back to To Do"
                        aria-label="Move task back to To Do"
                      >
                        <Octicons.ArrowLeft />
                      </button>
                      <button
                        type="button"
                        className="btn-icon-action btn-icon-delete"
                        onClick={() => openDeleteConfirmation(task)}
                        title="Delete task"
                        aria-label={`Delete task "${task.title}"`}
                      >
                        <Octicons.Trash />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* GitHub-like Page Footer */}
      <footer className="footer" id="app-footer">
        <span>&copy; 2026 kanban-task-manager</span>
        <a href="#github-spec" className="link" onClick={(e) => { e.preventDefault(); alert("GitHub Theme Match design spec version 1.0.0 is applied."); }}>
          Design Spec
        </a>
        <a href="#about" className="link" onClick={(e) => { e.preventDefault(); alert("Mini Kanban Board homework assignment built with Node + Express & React."); }}>
          About
        </a>
      </footer>

      {/* Delete Confirmation Modal Overlay */}
      {isDeleteModalOpen && taskToDelete && (
        <div className="modal-overlay" onClick={closeDeleteModal} id="delete-modal-overlay">
          <div className="modal-container" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className="modal-header">
              <h3 className="modal-title" id="modal-title">Delete task?</h3>
              <button className="btn-icon-action" onClick={closeDeleteModal} aria-label="Close dialog" title="Close dialog">
                &times;
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this task? This action cannot be undone.</p>
              <div className="modal-task-preview">
                <span className="task-meta-id">kanban_board #{taskToDelete.id}</span>
                <div className="task-title-preview">{taskToDelete.title}</div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn" onClick={closeDeleteModal}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDeleteTask} id="confirm-delete-btn">
                Delete task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
