import React from 'react';
import TaskCard from './TaskCard';
import * as Icons from '../assets/Icons';

export default function KanbanColumn({
  column,
  tasks,
  isLoading,
  draggingTaskId,
  draggedOverColumn,
  dragEnabledTaskId,
  setDragEnabledTaskId,
  handleDragStart,
  handleDragEnd,
  handleDragOver,
  handleDragEnter,
  handleDragLeave,
  handleDrop,
  handleToggleTaskStatus,
  openDeleteConfirmation,
}) {
  const { status, title, description, skeletonCount } = column;
  const isDraggedOver = draggedOverColumn === status;

  return (
    <div
      className={`column-box ${isDraggedOver ? 'column-drag-over' : ''}`}
      id={`${status}-column`}
      onDragOver={handleDragOver}
      onDragEnter={(e) => handleDragEnter(e, status)}
      onDragLeave={handleDragLeave}
      onDrop={(e) => handleDrop(e, status)}
    >
      <div className="column-header">
        <div className="column-header-title-row">
          <div className="column-title-group">
            {status === 'todo' ? <Icons.TodoHeaderIcon /> : <Icons.DoneHeaderIcon />}
            <span className="column-title">{title}</span>
          </div>
        </div>
        <div className="column-description">{description}</div>
      </div>
      <div className="column-body">
        {isLoading && tasks.length === 0 ? (
          // Skeleton Loader
          Array.from({ length: skeletonCount }).map((_, i) => (
            <div className="task-item skeleton-card" key={`${status}-skeleton-${i}`}>
              <div className="task-grab-handle" style={{ opacity: 0.3 }}>
                <Icons.Grabber />
              </div>
              <div className="task-content">
                <div className="task-header-row">
                  <div className="skeleton-circle" />
                  <div className="skeleton-text skeleton-meta" />
                </div>
                <div className="skeleton-text skeleton-title" />
              </div>
            </div>
          ))
        ) : tasks.length === 0 ? (
          // Blank Slate
          <div className="blankslate">
            <Icons.EmptyStateIcon />
            <h3 className="blankslate-heading">
              {status === 'todo' ? 'No tasks to do' : 'No completed tasks'}
            </h3>
          </div>
        ) : (
          // Tasks List
          tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              draggingTaskId={draggingTaskId}
              dragEnabledTaskId={dragEnabledTaskId}
              setDragEnabledTaskId={setDragEnabledTaskId}
              handleDragStart={handleDragStart}
              handleDragEnd={handleDragEnd}
              handleToggleTaskStatus={handleToggleTaskStatus}
              openDeleteConfirmation={openDeleteConfirmation}
            />
          ))
        )}
      </div>
    </div>
  );
}
