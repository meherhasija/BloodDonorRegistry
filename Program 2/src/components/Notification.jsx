import React, { useEffect } from 'react';

/**
 * Reusable Notification Toast Component
 * Props:
 * - notification: { message: string, type: 'success' | 'danger' | 'info' } | null
 * - onClose: Function to dismiss toast
 */
const Notification = ({ notification, onClose }) => {
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification, onClose]);

  if (!notification) return null;

  const { message, type = 'success' } = notification;

  const icons = {
    success: '✅',
    danger: '🗑️',
    info: 'ℹ️'
  };

  return (
    <aside className="toast-wrapper" aria-label="System notifications">
      <div className={`toast-card toast-${type}`} role="status" aria-live="polite">
        <span className="toast-icon">{icons[type] || '🔔'}</span>
        <span className="toast-message">{message}</span>
        <button
          type="button"
          onClick={onClose}
          className="toast-close-btn"
          aria-label="Dismiss notification"
        >
          ✕
        </button>
      </div>
    </aside>
  );
};

export default Notification;
