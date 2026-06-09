import React from 'react';
import * as Icons from '../assets/Icons';

export default function TaskCard({
  task,
  draggingTaskId,
  dragEnabledTaskId,
  setDragEnabledTaskId,
  handleDragStart,
  handleDragEnd,
  handleToggleTaskStatus,
  openDeleteConfirmation,
}) {
  const isDragging = draggingTaskId === task.id;
  const isDraggable = dragEnabledTaskId === task.id;

  return (
    <div
      className={`task-item ${task.status === 'done' ? 'task-done' : ''} ${isDragging ? 'task-dragging' : ''}`}
      id={`task-${task.id}`}
      draggable={isDraggable}
      onDragStart={(e) => handleDragStart(e, task)}
      onDragEnd={handleDragEnd}
      onMouseLeave={() => setDragEnabledTaskId(null)}
    >
      <div
        className="task-grab-handle"
        title="Drag handle"
        onMouseDown={() => setDragEnabledTaskId(task.id)}
        onMouseUp={() => setDragEnabledTaskId(null)}
      >
        <Icons.Grabber />
      </div>

      <div className="task-content">
        <div className="task-header-row">
          <button
            type="button"
            className="task-status-btn"
            onClick={() => handleToggleTaskStatus(task.id, task.status)}
            title={task.status === 'todo' ? 'Mark as Done' : 'Move back to To Do'}
          >
            {task.status === 'todo' ? <Icons.TodoCardIcon /> : <Icons.DoneCardIcon />}
          </button>
          <span className="task-meta-id">kanban_board #{task.id}</span>
        </div>
        <div className="task-title">{task.title}</div>
      </div>

      <div className="task-actions">
        {task.status === 'todo' ? (
          <button
            type="button"
            className="btn-icon-action"
            onClick={() => handleToggleTaskStatus(task.id, task.status)}
            title="Move to Done"
            aria-label="Move task to Done"
          >
            <Icons.ArrowRight />
          </button>
        ) : (
          <button
            type="button"
            className="btn-icon-action"
            onClick={() => handleToggleTaskStatus(task.id, task.status)}
            title="Move back to To Do"
            aria-label="Move task back to To Do"
          >
            <Icons.ArrowLeft />
          </button>
        )}
        <button
          type="button"
          className="btn-icon-action btn-icon-delete"
          onClick={() => openDeleteConfirmation(task)}
          title="Delete task"
          aria-label={`Delete task "${task.title}"`}
        >
          <Icons.Trash />
        </button>
      </div>
    </div>
  );
}
