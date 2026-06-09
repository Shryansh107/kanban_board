import { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import KanbanColumn from './components/KanbanColumn';
import DeleteModal from './components/DeleteModal';
import FullscreenLoader from './components/FullscreenLoader';
import * as Icons from './assets/Icons';
import { LOADING_MESSAGES, COLUMNS } from './constants';
import {
  fetchTasksFromAPI,
  createTaskInAPI,
  updateTaskStatusInAPI,
  deleteTaskInAPI,
} from './utils/api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [draggingTaskId, setDraggingTaskId] = useState(null);
  const [draggedOverColumn, setDraggedOverColumn] = useState(null);
  const [dragEnabledTaskId, setDragEnabledTaskId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  
  // Typewriter Fullscreen Loader States
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [visibleLines, setVisibleLines] = useState([]);
  const [currentLineIdx, setCurrentLineIdx] = useState(0);
  const [typedText, setTypedText] = useState("");

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

  // Typewriter effect timer logic
  useEffect(() => {
    if (!isInitialLoad || !isLoading) return;

    if (currentLineIdx < LOADING_MESSAGES.length) {
      const fullText = LOADING_MESSAGES[currentLineIdx];
      let charIdx = 0;
      setTypedText("");

      const timer = setInterval(() => {
        setTypedText((prev) => prev + fullText.charAt(charIdx));
        charIdx++;
        if (charIdx >= fullText.length) {
          clearInterval(timer);
          setTimeout(() => {
            setVisibleLines((prev) => [...prev, fullText]);
            setCurrentLineIdx((prev) => prev + 1);
          }, 400);
        }
      }, 15);

      return () => clearInterval(timer);
    } else {
      const timer = setInterval(() => {
        setVisibleLines((prev) => [...prev, "CLOUD GATEWAY DELAYED... RETRYING DATA FEED PINGS... (SERVER STILL WAKING UP)"]);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [currentLineIdx, isInitialLoad, isLoading]);

  // Track initial load completion (dismisses immediately once tasks load or error occurs)
  useEffect(() => {
    if (isInitialLoad && !isLoading) {
      setIsInitialLoad(false);
    }
  }, [isLoading, isInitialLoad]);

  const fetchTasks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchTasksFromAPI();
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
      const createdTask = await createTaskInAPI(title);
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
      const updatedTask = await updateTaskStatusInAPI(id, nextStatus);
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
      await deleteTaskInAPI(id);
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
    setDragEnabledTaskId(null);
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

  return (
    <div className="app-layout">
      <Header />

      <main className="main-content" id="main-content">
        {/* Global Error Banner */}
        {error && (
          <div className="flash flash-danger" id="global-error-banner" role="alert">
            <Icons.ErrorIcon />
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
          {COLUMNS.map(column => (
            <KanbanColumn
              key={column.status}
              column={column}
              tasks={tasks.filter(t => t.status === column.status)}
              isLoading={isLoading}
              draggingTaskId={draggingTaskId}
              draggedOverColumn={draggedOverColumn}
              dragEnabledTaskId={dragEnabledTaskId}
              setDragEnabledTaskId={setDragEnabledTaskId}
              handleDragStart={handleDragStart}
              handleDragEnd={handleDragEnd}
              handleDragOver={handleDragOver}
              handleDragEnter={handleDragEnter}
              handleDragLeave={handleDragLeave}
              handleDrop={handleDrop}
              handleToggleTaskStatus={handleToggleTaskStatus}
              openDeleteConfirmation={openDeleteConfirmation}
            />
          ))}
        </div>
      </main>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        task={taskToDelete}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteTask}
      />

      <FullscreenLoader
        isInitialLoad={isInitialLoad}
        visibleLines={visibleLines}
        currentLineIdx={currentLineIdx}
        typedText={typedText}
        loadingMessagesLength={LOADING_MESSAGES.length}
      />
    </div>
  );
}

export default App;
