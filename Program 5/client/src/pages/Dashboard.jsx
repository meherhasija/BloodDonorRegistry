import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard';
import BloodGroupStats from '../components/BloodGroupStats';
import LoadingSpinner from '../components/LoadingSpinner';
import Notification from '../components/Notification';
import { fetchStats } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboardData = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const response = await fetchStats();
      if (response && response.success) {
        setStats(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch dashboard stats.');
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError(err.message || 'Could not connect to the backend server. Make sure MongoDB and Express server are running.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading dashboard statistics from MongoDB..." />;
  }

  const totalDonors = stats?.totalDonors || 0;
  const availableDonors = stats?.availableDonors || 0;
  const unavailableDonors = stats?.unavailableDonors || 0;
  const bloodGroupStats = stats?.bloodGroupStats || {};
  const recentDonors = stats?.recentDonors || [];

  return (
    <div className="page-container dashboard-page">
      {error && (
        <Notification
          type="error"
          message={error}
          onClose={() => setError(null)}
          duration={0}
        />
      )}

      {/* Hero Welcome Banner */}
      <section className="dashboard-hero">
        <div className="hero-text-wrap">
          <span className="badge-pill">Full Stack Blood Donor Registry</span>
          <h1 className="hero-title">Live Donor Management & Analytics</h1>
          <p className="hero-desc">
            Monitor blood inventory, track registered donors, and connect life-saving resources directly with hospitals and patients in real-time.
          </p>
        </div>
        <div className="hero-cta-group">
          <button
            className="btn btn-outline"
            onClick={() => loadDashboardData(true)}
            disabled={refreshing}
            title="Refresh latest stats from MongoDB Atlas"
          >
            {refreshing ? 'Refreshing...' : '🔄 Refresh Stats'}
          </button>
          <Link to="/register" className="btn btn-primary">
            ➕ Register New Donor
          </Link>
          <Link to="/donors" className="btn btn-secondary">
            📋 View All Donors
          </Link>
        </div>
      </section>

      {/* Top Level Metric Cards */}
      <section className="stats-cards-grid">
        <StatCard
          title="Total Registered Donors"
          value={totalDonors}
          icon="👥"
          subtitle="All-time verified donors in database"
          colorClass="card-red"
        />
        <StatCard
          title="Available Donors"
          value={availableDonors}
          icon="🟢"
          subtitle={`${totalDonors > 0 ? Math.round((availableDonors / totalDonors) * 100) : 0}% of total donor pool ready`}
          colorClass="card-green"
        />
        <StatCard
          title="Unavailable Donors"
          value={unavailableDonors}
          icon="⏳"
          subtitle="Currently resting or in deferral period"
          colorClass="card-amber"
        />
        <StatCard
          title="Blood Group Types"
          value={8}
          icon="🩸"
          subtitle="A+, A-, B+, B-, AB+, AB-, O+, O-"
          colorClass="card-blue"
        />
      </section>

      {/* Blood Group Breakdown Grid */}
      <BloodGroupStats
        stats={bloodGroupStats}
        totalDonors={totalDonors}
      />

      {/* Recent Donor Registrations Table */}
      <section className="recent-registrations-section">
        <div className="section-header-row">
          <div>
            <h2 className="section-title">Recent Registrations</h2>
            <p className="section-subtitle">Latest donors who joined the registry via Express API</p>
          </div>
          <Link to="/donors" className="link-see-all">
            View All Donors &rarr;
          </Link>
        </div>

        {recentDonors.length === 0 ? (
          <div className="empty-card">
            <p>No recent registrations yet. Click "Register New Donor" to add your first record!</p>
          </div>
        ) : (
          <div className="recent-table-wrapper">
            <table className="recent-table">
              <thead>
                <tr>
                  <th>Donor Name</th>
                  <th>Blood Group</th>
                  <th>City</th>
                  <th>Availability</th>
                  <th>Registered</th>
                </tr>
              </thead>
              <tbody>
                {recentDonors.map((donor) => (
                  <tr key={donor._id || donor.id}>
                    <td className="recent-name-cell">
                      <span className="recent-avatar">{donor.fullName.charAt(0)}</span>
                      <strong>{donor.fullName}</strong>
                    </td>
                    <td>
                      <span className="blood-tag">{donor.bloodGroup}</span>
                    </td>
                    <td>📍 {donor.city}</td>
                    <td>
                      <span
                        className={`status-pill ${
                          donor.availabilityStatus === 'Available'
                            ? 'status-available'
                            : 'status-unavailable'
                        }`}
                      >
                        {donor.availabilityStatus}
                      </span>
                    </td>
                    <td className="date-cell">
                      {new Date(donor.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
