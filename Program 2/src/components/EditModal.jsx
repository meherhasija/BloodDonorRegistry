import React, { useEffect } from 'react';
import DonorForm from './DonorForm';

/**
 * Reusable EditModal Component
 * Demonstrates:
 * - Conditional rendering (returns null when closed)
 * - Modal backdrop and dialog architecture
 * - Component composition (wraps DonorForm)
 * - Keyboard accessibility (ESC to close)
 */
const EditModal = ({ isOpen, donor, onClose, onSave }) => {
  // Close on ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Conditional rendering
  if (!isOpen || !donor) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-header">
          <div>
            <h3 id="modal-title" className="modal-title">
              ✏️ Edit Donor Record
            </h3>
            <p className="modal-subtitle">
              Updating details for <strong>{donor.fullName}</strong> (ID: #{donor.id})
            </p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          <DonorForm
            initialData={donor}
            onSubmit={(updatedData) => {
              onSave(updatedData);
              onClose();
            }}
            onCancel={onClose}
            isEditMode={true}
          />
        </div>
      </div>
    </div>
  );
};

export default EditModal;
