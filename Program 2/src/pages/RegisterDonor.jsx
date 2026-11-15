import React from 'react';
import { useNavigate } from 'react-router-dom';
import DonorForm from '../components/DonorForm';

/**
 * Register Donor Page Component
 * Demonstrates:
 * - Form integration with parent state via callback props
 * - Navigation redirection using useNavigate() from React Router DOM
 */
const RegisterDonor = ({ onAddDonor }) => {
  const navigate = useNavigate();

  const handleFormSubmit = (donorData) => {
    onAddDonor(donorData);
    // Navigate to Donor List page so user can immediately see the new entry
    navigate('/donors');
  };

  return (
    <div className="page-container register-page">
      <div className="page-header">
        <div className="page-header-icon-wrap">
          <span>➕</span>
        </div>
        <div>
          <h1 className="page-title">Register Blood Donor</h1>
          <p className="page-subtitle">
            Fill in the donor details below to add a new record to the registry database.
          </p>
        </div>
      </div>

      <div className="register-layout-grid">
        {/* Main Form Card */}
        <div className="register-card">
          <div className="card-top-indicator">
            <span className="dot red"></span>
            <span className="text">All fields marked with (*) are required</span>
          </div>

          <DonorForm onSubmit={handleFormSubmit} isEditMode={false} />
        </div>

        {/* Side Information Panel */}
        <aside className="register-sidebar">
          <div className="info-card">
            <h3 className="info-card-title">🩸 Donor Registration Rules</h3>
            <ul className="info-rules-list">
              <li>
                <strong>Eligibility Age:</strong> Only donors aged 18 to 65 years are permitted.
              </li>
              <li>
                <strong>Phone Validation:</strong> Provide a valid 10-digit Indian mobile contact number.
              </li>
              <li>
                <strong>Accuracy:</strong> Ensure blood group matches official medical test records.
              </li>
              <li>
                <strong>Availability Toggle:</strong> Turn off availability if the donor has donated within the last 90 days.
              </li>
            </ul>
          </div>

          <div className="info-card highlight-card">
            <h4 className="info-card-title">💾 Persistent Storage</h4>
            <p className="text-sm">
              All registered donors are permanently saved in your browser's <code>localStorage</code>. Data persists even if you reload or close the tab.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default RegisterDonor;
