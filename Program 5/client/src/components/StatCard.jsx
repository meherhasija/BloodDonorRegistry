import React from 'react';

const StatCard = ({ title, value, icon, subtitle, colorClass = 'card-red' }) => {
  return (
    <div className={`stat-card ${colorClass}`}>
      <div className="stat-card-header">
        <span className="stat-title">{title}</span>
        <div className="stat-icon-bubble">{icon}</div>
      </div>
      <div className="stat-card-body">
        <h3 className="stat-number">{value ?? 0}</h3>
        {subtitle && <p className="stat-subtitle">{subtitle}</p>}
      </div>
    </div>
  );
};

export default StatCard;
