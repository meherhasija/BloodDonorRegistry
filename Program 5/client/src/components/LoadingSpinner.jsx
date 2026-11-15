import React from 'react';

const LoadingSpinner = ({ message = 'Loading donor data...' }) => {
  return (
    <div className="spinner-wrapper" role="status" aria-live="polite">
      <div className="pulsing-blood-drop">
        <svg viewBox="0 0 24 24" fill="#e03131" width="40" height="40">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        </svg>
      </div>
      <div className="loading-spinner"></div>
      <p className="spinner-message">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
