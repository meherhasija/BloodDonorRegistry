import React from 'react';

const DeleteConfirmModal = ({ donor, isOpen, onClose, onConfirm, isDeleting }) => {
  if (!isOpen || !donor) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content modal-danger" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <span className="modal-icon text-red">⚠️</span>
            <h3>Confirm Deletion</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            &times;
          </button>
        </div>

        <div className="modal-body-confirm">
          <p>
            Are you sure you want to permanently delete donor record:
          </p>
          <div className="confirm-donor-card">
            <strong>{donor.fullName}</strong>
            <span>Blood Group: <span className="blood-tag-mini">{donor.bloodGroup}</span></span>
            <span>City: {donor.city}</span>
          </div>
          <p className="danger-warning-text">
            ⚠️ This action will permanently remove this record from the MongoDB Atlas database and cannot be undone.
          </p>
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => onConfirm(donor._id || donor.id)}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting from Database...' : 'Yes, Delete Record'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
