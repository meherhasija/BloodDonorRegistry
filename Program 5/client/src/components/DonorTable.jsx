import React from 'react';

const DonorTable = ({ donors = [], onEdit, onDelete, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="table-loading-container">
        <div className="loading-spinner"></div>
        <p>Fetching donor records from database...</p>
      </div>
    );
  }

  if (donors.length === 0) {
    return (
      <div className="table-empty-state">
        <div className="empty-icon">🩸</div>
        <h3>No Donor Records Found</h3>
        <p>No donors match your current search and filter criteria, or the database is currently empty.</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="table-responsive-wrapper">
      <table className="donor-table">
        <thead>
          <tr>
            <th>Donor Name</th>
            <th>Blood Group</th>
            <th>Age / Gender</th>
            <th>Contact Phone</th>
            <th>City</th>
            <th>Status</th>
            <th>Registered</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {donors.map((donor) => {
            const donorId = donor._id || donor.id;
            const isAvailable = donor.availabilityStatus === 'Available';

            return (
              <tr key={donorId} className="donor-row">
                <td className="donor-name-cell">
                  <div className="avatar-circle">
                    {donor.fullName ? donor.fullName.charAt(0).toUpperCase() : 'D'}
                  </div>
                  <div>
                    <span className="donor-name-text">{donor.fullName}</span>
                    <span className="donor-id-sub">ID: {donorId.slice(-6)}</span>
                  </div>
                </td>
                <td>
                  <span className="blood-tag">{donor.bloodGroup}</span>
                </td>
                <td className="donor-demographics">
                  <span>{donor.age} yrs</span>
                  <span className="dot-divider">•</span>
                  <span>{donor.gender}</span>
                </td>
                <td>
                  <a href={`tel:${donor.phoneNumber}`} className="phone-link" title="Call Donor">
                    📞 {donor.phoneNumber}
                  </a>
                </td>
                <td>
                  <span className="city-pill">📍 {donor.city}</span>
                </td>
                <td>
                  <span className={`status-pill ${isAvailable ? 'status-available' : 'status-unavailable'}`}>
                    <span className="status-dot"></span>
                    {donor.availabilityStatus}
                  </span>
                </td>
                <td className="date-cell">
                  {formatDate(donor.createdAt)}
                </td>
                <td className="actions-cell">
                  <button
                    className="action-btn edit-btn"
                    onClick={() => onEdit(donor)}
                    title="Edit Donor Details"
                    aria-label={`Edit ${donor.fullName}`}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => onDelete(donor)}
                    title="Delete Donor Record"
                    aria-label={`Delete ${donor.fullName}`}
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DonorTable;
