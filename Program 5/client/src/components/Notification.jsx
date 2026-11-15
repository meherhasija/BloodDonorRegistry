import React, { useEffect } from 'react';

const Notification = ({ type = 'info', message, onClose, duration = 4000 }) => {
  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!message) return null;

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };

  return (
    <div className={`notification-banner ${type}`} role="alert">
      <span className="notif-icon">{icons[type] || 'ℹ️'}</span>
      <span className="notif-message">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="notif-close-btn"
          aria-label="Close notification"
        >
          &times;
        </button>
      )}
    </div>
  );
};

export default Notification;
