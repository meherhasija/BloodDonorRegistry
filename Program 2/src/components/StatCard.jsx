import React from 'react';

/**
 * Reusable StatCard Component
 * Demonstrates Props passing in React
 * Props:
 * - title: Card label
 * - value: Number or text to display prominently
 * - subtext: Context or secondary info
 * - icon: Emoji or icon representation
 * - theme: 'red' | 'green' | 'blue' | 'gray' for accent coloring
 */
const StatCard = ({ title, value, subtext, icon, theme = 'red' }) => {
  return (
    <div className={`stat-card stat-card-${theme}`}>
      <div className="stat-card-header">
        <span className="stat-card-title">{title}</span>
        <div className="stat-card-icon-bubble">{icon}</div>
      </div>
      <div className="stat-card-body">
        <h3 className="stat-card-value">{value}</h3>
        {subtext && <p className="stat-card-subtext">{subtext}</p>}
      </div>
    </div>
  );
};

export default StatCard;
