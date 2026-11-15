import React from 'react';
import { NavLink, Link } from 'react-router-dom';

/**
 * Reusable Navbar Component
 * Props:
 * - totalDonors: number of total registered donors
 * - availableDonors: number of currently available donors
 */
const Navbar = ({ totalDonors, availableDonors }) => {
  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        {/* Brand / Logo */}
        <Link to="/" className="navbar-brand">
          <div className="brand-icon-wrapper">
            <span className="brand-drop-icon">🩸</span>
          </div>
          <div className="brand-text">
            <span className="brand-title">LifeFlow</span>
            <span className="brand-subtitle">Blood Donor Registry</span>
          </div>
        </Link>

        {/* Live Status Indicators */}
        <div className="navbar-stats-preview">
          <div className="nav-stat-chip">
            <span className="nav-stat-dot available"></span>
            <span className="nav-stat-label">Available:</span>
            <span className="nav-stat-value">{availableDonors}</span>
          </div>
          <div className="nav-stat-chip">
            <span className="nav-stat-label">Total Donors:</span>
            <span className="nav-stat-value">{totalDonors}</span>
          </div>
        </div>

        {/* Navigation Links using React Router NavLink */}
        <nav className="navbar-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `nav-link ${isActive ? 'nav-link-active' : ''}`
            }
          >
            <span className="nav-icon">📊</span>
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/donors"
            className={({ isActive }) =>
              `nav-link ${isActive ? 'nav-link-active' : ''}`
            }
          >
            <span className="nav-icon">📋</span>
            <span>Donor List</span>
          </NavLink>

          <NavLink
            to="/register"
            className={({ isActive }) =>
              `nav-link nav-link-cta ${isActive ? 'nav-link-active' : ''}`
            }
          >
            <span className="nav-icon">➕</span>
            <span>Register Donor</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
