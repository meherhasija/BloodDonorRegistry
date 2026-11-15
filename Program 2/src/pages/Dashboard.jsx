import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StatCard from '../components/StatCard';
import BloodGroupStats from '../components/BloodGroupStats';

/**
 * Dashboard Page Component
 * Demonstrates:
 * - Aggregating data from props
 * - React Router navigation (Link and useNavigate)
 * - Component composition (StatCard, BloodGroupStats)
 * - Conditional rendering for recent donor list
 */
const Dashboard = ({ donors = [] }) => {
  const navigate = useNavigate();

  // Metrics computation
  const totalDonors = donors.length;
  const availableDonors = donors.filter((d) => d.isAvailable).length;
  const unavailableDonors = totalDonors - availableDonors;
  const availabilityRate = totalDonors > 0 ? Math.round((availableDonors / totalDonors) * 100) : 0;

  // Recent donors preview (last 4 added)
  const recentDonors = [...donors].slice(-4).reverse();

  return (
    <div className="page-container dashboard-page">
      {/* Hero Welcome Banner */}
      <section className="dashboard-hero">
        <div className="hero-content">
          <div className="hero-badge">Full Stack Practical • Program 2 (CO3)</div>
          <h1 className="hero-title">Blood Donor Registry Dashboard</h1>
          <p className="hero-description">
            A centralized system for tracking blood donors, monitoring inventory availability,
            and facilitating rapid emergency donor dispatch across Karnataka.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary">
              <span className="btn-icon">➕</span>
              <span>Register New Donor</span>
            </Link>
            <Link to="/donors" className="btn btn-outline-white">
              <span className="btn-icon">📋</span>
              <span>Browse All Donors</span>
            </Link>
          </div>
        </div>
        <div className="hero-art">
          <div className="hero-art-circle">
            <span className="hero-big-drop">🩸</span>
          </div>
        </div>
      </section>

      {/* KPI Stats Grid */}
      <section className="stats-cards-grid">
        <StatCard
          title="Total Registered Donors"
          value={totalDonors}
          subtext="Active database records"
          icon="👥"
          theme="red"
        />
        <StatCard
          title="Available Donors"
          value={availableDonors}
          subtext={`${availabilityRate}% of total pool ready`}
          icon="✅"
          theme="green"
        />
        <StatCard
          title="Unavailable / Inactive"
          value={unavailableDonors}
          subtext="Cooling period or inactive"
          icon="⏳"
          theme="gray"
        />
        <StatCard
          title="Blood Types Tracked"
          value="8 Groups"
          subtext="A±, B±, AB±, O±"
          icon="🔬"
          theme="red"
        />
      </section>

      {/* Blood Group Breakdown */}
      <section className="dashboard-section">
        <BloodGroupStats
          donors={donors}
          onSelectGroup={(group) => {
            navigate(`/donors?group=${encodeURIComponent(group)}`);
          }}
        />
      </section>

      {/* Two Column Layout: Recent Donors Preview & Practical Info */}
      <div className="dashboard-two-col">
        {/* Recent Donors Table Preview */}
        <section className="dashboard-card flex-2">
          <div className="card-header-flex">
            <div>
              <h3 className="card-heading">Recently Registered Donors</h3>
              <p className="card-subheading">Latest donor entries in the registry</p>
            </div>
            <Link to="/donors" className="link-button">
              View All ({totalDonors}) →
            </Link>
          </div>

          {recentDonors.length === 0 ? (
            <div className="empty-state-mini">
              <p>No donors registered yet.</p>
              <Link to="/register" className="btn btn-primary btn-sm">
                Add First Donor
              </Link>
            </div>
          ) : (
            <div className="table-responsive-container">
              <table className="donor-table donor-table-compact">
                <thead>
                  <tr>
                    <th>Donor Name</th>
                    <th>Blood Group</th>
                    <th>City</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentDonors.map((donor) => (
                    <tr key={donor.id}>
                      <td>
                        <strong>{donor.fullName}</strong>
                        <div className="text-muted-xs">{donor.gender}, {donor.age} yrs</div>
                      </td>
                      <td>
                        <span className="blood-group-tag">{donor.bloodGroup}</span>
                      </td>
                      <td>📍 {donor.city}</td>
                      <td>
                        <span
                          className={`status-pill-mini ${donor.isAvailable ? 'available' : 'unavailable'}`}
                        >
                          {donor.isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Practical Reference & Quick Tips Card */}
        <section className="dashboard-card flex-1">
          <h3 className="card-heading">Donation Eligibility Criteria</h3>
          <p className="card-subheading">Key health guidelines for safe donation</p>

          <ul className="guidelines-list">
            <li>
              <span className="guide-icon">🎂</span>
              <div>
                <strong>Age Limit</strong>
                <p>Must be between 18 and 65 years of age.</p>
              </div>
            </li>
            <li>
              <span className="guide-icon">⚖️</span>
              <div>
                <strong>Weight Criteria</strong>
                <p>Minimum body weight must be 45–50 kg.</p>
              </div>
            </li>
            <li>
              <span className="guide-icon">⏱️</span>
              <div>
                <strong>Donation Interval</strong>
                <p>90 days (3 months) between whole blood donations.</p>
              </div>
            </li>
            <li>
              <span className="guide-icon">🩸</span>
              <div>
                <strong>Universal Donors</strong>
                <p><strong>O-Negative</strong> is the universal red cell donor.</p>
              </div>
            </li>
          </ul>

          <div className="card-notice-box">
            💡 <em>Note:</em> Records are automatically synchronized with browser <code>localStorage</code>.
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
