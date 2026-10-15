import React from 'react';

export default function DeleteModal({
  isOpen,
  task,
  onClose,
  onConfirm,
}) {
  if (!isOpen || !task) return null;

  return (
    <div className="modal-overlay" onClick={onClose} id="delete-modal-overlay">
      <div className="modal-container" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-header">
          <h3 className="modal-title" id="modal-title">Delete task?</h3>
          <button className="btn-icon-action" onClick={onClose} aria-label="Close dialog" title="Close dialog">
            &times;
          </button>
        </div>
        <div className="modal-body">
          <p>Are you sure you want to delete this task? This action cannot be undone.</p>
          <div className="modal-task-preview">
            <span className="task-meta-id">kanban_board #{task.id}</span>
            <div className="task-title-preview">{task.title}</div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm} id="confirm-delete-btn">
            Delete task
          </button>
        </div>
      </div>
    </div>
  );
}
