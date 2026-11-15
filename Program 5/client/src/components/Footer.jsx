import React from 'react';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="blood-icon">🩸</span>
            <strong>Blood Donor Registry System</strong>
          </div>
          <p className="footer-tagline">
            Connecting generous donors with patients in urgent need. Every drop counts.
          </p>
        </div>

        <div className="footer-details">
          <div className="footer-item">
            <span className="detail-label">Course Outcome:</span>
            <span className="detail-value badge-co">CO6 (Full Stack Application)</span>
          </div>
          <div className="footer-item">
            <span className="detail-label">Stack:</span>
            <span className="detail-value">React.js • Node.js • Express • MongoDB Atlas</span>
          </div>
          <div className="footer-item">
            <span className="detail-label">Academic Program:</span>
            <span className="detail-value">Program 5 (Final Practical Assignment)</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Blood Donor Registry System. Built with MERN Stack.</p>
        <p className="emergency-notice">🚨 In an emergency, always contact local registered blood banks and hospitals.</p>
      </div>
    </footer>
  );
};

export default Footer;
