import React from 'react';
import { useNavigate } from 'react-router-dom';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const BloodGroupStats = ({ stats = {}, totalDonors = 0 }) => {
  const navigate = useNavigate();

  const handleGroupClick = (group) => {
    navigate(`/donors?bloodGroup=${encodeURIComponent(group)}`);
  };

  return (
    <div className="blood-groups-section">
      <div className="section-header-row">
        <div>
          <h2 className="section-title">Blood Group Inventory & Statistics</h2>
          <p className="section-subtitle">Real-time availability of donors categorized by ABO and Rh factor</p>
        </div>
      </div>

      <div className="blood-groups-grid">
        {BLOOD_GROUPS.map((group) => {
          const groupData = stats[group] || { total: 0, available: 0 };
          const total = groupData.total || 0;
          const available = groupData.available || 0;
          const percentage = totalDonors > 0 ? Math.round((total / totalDonors) * 100) : 0;

          return (
            <div
              key={group}
              className={`blood-group-card ${available > 0 ? 'has-available' : 'zero-available'}`}
              onClick={() => handleGroupClick(group)}
              title={`Click to view all ${group} donors`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handleGroupClick(group);
              }}
            >
              <div className="blood-group-badge-circle">
                <span className="blood-symbol">{group}</span>
              </div>

              <div className="blood-group-info">
                <div className="group-counts">
                  <span className="total-donors-text">
                    <strong>{total}</strong> {total === 1 ? 'Donor' : 'Donors'}
                  </span>
                  <span className={`avail-badge ${available > 0 ? 'badge-green' : 'badge-gray'}`}>
                    {available} Available
                  </span>
                </div>

                <div className="progress-bar-bg">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${percentage}%` }}
                    title={`${percentage}% of total donor pool`}
                  ></div>
                </div>

                <div className="group-card-footer">
                  <span className="percentage-text">{percentage}% of pool</span>
                  <span className="view-link-text">Filter &rarr;</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BloodGroupStats;
