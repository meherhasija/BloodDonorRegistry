import React from 'react';

/**
 * Reusable DonorTable Component
 * Demonstrates:
 * - Props receiving (donors, onEdit, onDelete, onToggleStatus)
 * - Conditional rendering (empty table state vs. populated table rows)
 * - Event handling for actions (Edit, Delete, Toggle Availability)
 */
const DonorTable = ({ donors = [], onEdit, onDelete, onToggleStatus, onResetFilters }) => {
  // Conditional rendering: Empty State
  if (donors.length === 0) {
    return (
      <div className="empty-state-card">
        <div className="empty-state-icon">🔍</div>
        <h4 className="empty-state-title">No Donors Found</h4>
        <p className="empty-state-message">
          No donor records matched your search query or filter selection.
        </p>
        {onResetFilters && (
          <button onClick={onResetFilters} className="btn btn-outline btn-sm">
            <span>Reset All Filters</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="table-responsive-container">
      <table className="donor-table">
        <thead>
          <tr>
            <th scope="col" className="th-id">#</th>
            <th scope="col">Donor Details</th>
            <th scope="col">Blood Group</th>
            <th scope="col">Contact</th>
            <th scope="col">City</th>
            <th scope="col">Availability</th>
            <th scope="col" className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {donors.map((donor, index) => (
            <tr key={donor.id} className="donor-row">
              {/* Index */}
              <td className="td-index">{index + 1}</td>

              {/* Name & Demographics */}
              <td className="td-name">
                <div className="donor-profile-summary">
                  <span className="donor-avatar">
                    {donor.gender === 'Female' ? '👩' : donor.gender === 'Male' ? '👨' : '🧑'}
                  </span>
                  <div>
                    <strong className="donor-fullname">{donor.fullName}</strong>
                    <div className="donor-meta-info">
                      {donor.age} yrs • {donor.gender}
                    </div>
                  </div>
                </div>
              </td>

              {/* Blood Group Badge */}
              <td className="td-blood-group">
                <span className="blood-group-tag">{donor.bloodGroup}</span>
              </td>

              {/* Phone with click-to-call link */}
              <td className="td-phone">
                <a href={`tel:${donor.phone}`} className="phone-link">
                  <span className="phone-icon">📞</span>
                  <span>{donor.phone}</span>
                </a>
              </td>

              {/* City */}
              <td className="td-city">
                <span className="city-pill">📍 {donor.city}</span>
              </td>

              {/* Availability Status Badge with Toggle */}
              <td className="td-status">
                <button
                  type="button"
                  onClick={() => onToggleStatus && onToggleStatus(donor.id)}
                  className={`status-pill ${donor.isAvailable ? 'status-pill-available' : 'status-pill-unavailable'}`}
                  title="Click to toggle availability status"
                >
                  <span className="status-indicator-dot"></span>
                  <span>{donor.isAvailable ? 'Available' : 'Unavailable'}</span>
                </button>
              </td>

              {/* Actions: Edit & Delete */}
              <td className="td-actions">
                <div className="action-buttons-group">
                  <button
                    type="button"
                    onClick={() => onEdit(donor)}
                    className="btn-action btn-action-edit"
                    title="Edit Donor Record"
                  >
                    <span className="btn-action-icon">✏️</span>
                    <span className="btn-action-label">Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(donor.id, donor.fullName)}
                    className="btn-action btn-action-delete"
                    title="Delete Donor Record"
                  >
                    <span className="btn-action-icon">🗑️</span>
                    <span className="btn-action-label">Delete</span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DonorTable;
