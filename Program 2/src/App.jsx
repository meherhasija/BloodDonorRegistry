import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Notification from './components/Notification';
import Dashboard from './pages/Dashboard';
import RegisterDonor from './pages/RegisterDonor';
import DonorList from './pages/DonorList';
import { getStoredDonors, saveStoredDonors } from './utils/storage';
import './App.css';

/**
 * Root Application Component
 * Demonstrates:
 * - useState for central application state (donors array & toast notifications)
 * - useEffect for persisting donors to localStorage whenever state changes
 * - React Router DOM (BrowserRouter, Routes, Route, Navigate)
 * - Event handling passed down as props to child pages and components
 */
function App() {
  // Central donor state initialized from localStorage
  const [donors, setDonors] = useState(() => getStoredDonors());

  // Global notification toast state
  const [notification, setNotification] = useState(null);

  // Sync state changes to browser localStorage
  useEffect(() => {
    saveStoredDonors(donors);
  }, [donors]);

  // Helper to show dismissible notifications
  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
  };

  // Add new donor handler
  const handleAddDonor = (newDonorData) => {
    // Generate new unique ID
    const newId = donors.length > 0 ? Math.max(...donors.map((d) => d.id)) + 1 : 1;
    const createdDonor = {
      ...newDonorData,
      id: newId
    };

    setDonors((prev) => [createdDonor, ...prev]);
    showToast(`Donor "${createdDonor.fullName}" has been successfully registered!`, 'success');
  };

  // Update existing donor handler
  const handleUpdateDonor = (updatedDonorData) => {
    setDonors((prev) =>
      prev.map((d) => (d.id === updatedDonorData.id ? { ...d, ...updatedDonorData } : d))
    );
    showToast(`Donor record for "${updatedDonorData.fullName}" was updated successfully.`, 'success');
  };

  // Delete donor handler
  const handleDeleteDonor = (id) => {
    const donorToRemove = donors.find((d) => d.id === id);
    setDonors((prev) => prev.filter((d) => d.id !== id));
    showToast(
      donorToRemove
        ? `Donor record for "${donorToRemove.fullName}" has been removed.`
        : 'Donor record deleted.',
      'danger'
    );
  };

  // Toggle donor availability status handler
  const handleToggleStatus = (id) => {
    setDonors((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          const nextState = !d.isAvailable;
          showToast(
            `Status for ${d.fullName} set to: ${nextState ? 'Available' : 'Unavailable'}`,
            'info'
          );
          return { ...d, isAvailable: nextState };
        }
        return d;
      })
    );
  };

  const availableCount = donors.filter((d) => d.isAvailable).length;

  return (
    <Router>
      <div className="app-root">
        {/* Navigation Bar */}
        <Navbar totalDonors={donors.length} availableDonors={availableCount} />

        {/* Global Floating Toast Alert */}
        <Notification
          notification={notification}
          onClose={() => setNotification(null)}
        />

        {/* Dynamic Route Content */}
        <main className="app-main-content">
          <Routes>
            <Route path="/" element={<Dashboard donors={donors} />} />
            <Route
              path="/donors"
              element={
                <DonorList
                  donors={donors}
                  onUpdateDonor={handleUpdateDonor}
                  onDeleteDonor={handleDeleteDonor}
                  onToggleStatus={handleToggleStatus}
                />
              }
            />
            <Route
              path="/register"
              element={<RegisterDonor onAddDonor={handleAddDonor} />}
            />
            {/* Fallback to Dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Academic / College Practical Footer */}
        <footer className="app-footer">
          <div className="footer-inner">
            <div className="footer-left">
              <span className="footer-logo">🩸 LifeFlow Registry</span>
              <span className="footer-divider">•</span>
              <span className="footer-meta">Full Stack Development Practical — Program 2</span>
            </div>
            <div className="footer-right">
              <span className="footer-badge">Course Outcome: CO3</span>
              <span className="footer-tech">React 18 • React Router 6 • LocalStorage</span>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
