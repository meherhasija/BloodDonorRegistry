import React from 'react';
import { BLOOD_GROUPS } from '../utils/storage';

/**
 * Reusable BloodGroupStats Component
 * Computes and renders real-time blood group breakdown
 * Props:
 * - donors: Array of all registered donors
 * - onSelectGroup: Optional callback when user clicks a blood group to filter
 */
const BloodGroupStats = ({ donors = [], onSelectGroup }) => {
  // Aggregate statistics per blood group
  const stats = BLOOD_GROUPS.map((group) => {
    const matchingDonors = donors.filter((d) => d.bloodGroup === group);
    const availableCount = matchingDonors.filter((d) => d.isAvailable).length;
    return {
      group,
      total: matchingDonors.length,
      available: availableCount,
      percentage: donors.length > 0 ? Math.round((matchingDonors.length / donors.length) * 100) : 0
    };
  });

  return (
    <div className="blood-group-stats-section">
      <div className="section-header-row">
        <div>
          <h3 className="section-title">Blood Group Inventory & Availability</h3>
          <p className="section-subtitle">Real-time donor distribution across all 8 major blood types</p>
        </div>
      </div>

      <div className="blood-groups-grid">
        {stats.map(({ group, total, available, percentage }) => (
          <div
            key={group}
            className={`blood-group-card ${total > 0 ? 'has-donors' : 'no-donors'}`}
            onClick={() => onSelectGroup && onSelectGroup(group)}
            role={onSelectGroup ? 'button' : undefined}
            tabIndex={onSelectGroup ? 0 : undefined}
            title={onSelectGroup ? `Filter donors by ${group}` : `${group} statistics`}
          >
            <div className="bg-card-header">
              <span className="blood-type-badge">{group}</span>
              <span className="bg-total-badge">{total} {total === 1 ? 'Donor' : 'Donors'}</span>
            </div>

            <div className="bg-card-body">
              <div className="bg-stat-row">
                <span className="bg-metric-label">Available now:</span>
                <span className={`bg-metric-val ${available > 0 ? 'text-green' : 'text-muted'}`}>
                  {available}
                </span>
              </div>

              {/* Visual distribution bar */}
              <div className="bg-progress-track">
                <div
                  className="bg-progress-fill"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <div className="bg-share-text">{percentage}% of total registry</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BloodGroupStats;
