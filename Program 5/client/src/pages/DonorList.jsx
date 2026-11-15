import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import DonorTable from '../components/DonorTable';
import EditModal from '../components/EditModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import Notification from '../components/Notification';
import { fetchDonors, updateDonor, deleteDonor } from '../services/api';

const BLOOD_GROUPS = ['All', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const AVAILABILITY_OPTIONS = ['All', 'Available', 'Unavailable'];

const DonorList = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter states initialized from URL params if present
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState(searchParams.get('bloodGroup') || 'All');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || 'All');
  const [selectedAvailability, setSelectedAvailability] = useState(searchParams.get('availabilityStatus') || 'All');

  // Donors data state
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  // Modal states
  const [editingDonor, setEditingDonor] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [deletingDonor, setDeletingDonor] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load donors from backend API
  const loadDonors = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (selectedBloodGroup !== 'All') params.bloodGroup = selectedBloodGroup;
      if (selectedCity !== 'All') params.city = selectedCity;
      if (selectedAvailability !== 'All') params.availabilityStatus = selectedAvailability;

      const response = await fetchDonors(params);
      if (response && response.success) {
        setDonors(response.data || []);
      } else {
        throw new Error(response.message || 'Failed to fetch donors.');
      }
    } catch (err) {
      console.error('Error fetching donors:', err);
      setNotification({
        type: 'error',
        message: err.message || 'Failed to connect to the backend API.'
      });
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedBloodGroup, selectedCity, selectedAvailability]);

  // Load donors whenever filters change
  useEffect(() => {
    loadDonors();
  }, [loadDonors]);

  // Sync URL search params
  useEffect(() => {
    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (selectedBloodGroup !== 'All') params.bloodGroup = selectedBloodGroup;
    if (selectedCity !== 'All') params.city = selectedCity;
    if (selectedAvailability !== 'All') params.availabilityStatus = selectedAvailability;
    setSearchParams(params, { replace: true });
  }, [searchTerm, selectedBloodGroup, selectedCity, selectedAvailability, setSearchParams]);

  // Extract unique cities from currently fetched or registered donors
  const cityOptions = useMemo(() => {
    const citiesSet = new Set();
    donors.forEach((d) => {
      if (d.city && d.city.trim()) {
        citiesSet.add(d.city.trim());
      }
    });
    return ['All', ...Array.from(citiesSet).sort()];
  }, [donors]);

  // Handlers for Edit
  const handleOpenEdit = (donor) => {
    setEditingDonor(donor);
    setIsEditModalOpen(true);
  };

  const handleCloseEdit = () => {
    setEditingDonor(null);
    setIsEditModalOpen(false);
  };

  const handleSaveEdit = async (id, updatedData) => {
    setIsUpdating(true);
    try {
      const response = await updateDonor(id, updatedData);
      if (response && response.success) {
        setNotification({
          type: 'success',
          message: `Donor "${updatedData.fullName}" updated successfully in MongoDB!`
        });
        handleCloseEdit();
        // Refresh listing
        await loadDonors();
      } else {
        throw new Error(response.message || 'Failed to update donor.');
      }
    } catch (err) {
      console.error('Update failed:', err);
      setNotification({
        type: 'error',
        message: err.message || 'Failed to update donor record.'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Handlers for Delete
  const handleOpenDelete = (donor) => {
    setDeletingDonor(donor);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDelete = () => {
    setDeletingDonor(null);
    setIsDeleteModalOpen(false);
  };

  const handleConfirmDelete = async (id) => {
    setIsDeleting(true);
    try {
      const response = await deleteDonor(id);
      if (response && response.success) {
        setNotification({
          type: 'success',
          message: `Donor record deleted successfully from MongoDB!`
        });
        handleCloseDelete();
        // Refresh listing
        await loadDonors();
      } else {
        throw new Error(response.message || 'Failed to delete donor.');
      }
    } catch (err) {
      console.error('Delete failed:', err);
      setNotification({
        type: 'error',
        message: err.message || 'Failed to delete donor record.'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedBloodGroup('All');
    setSelectedCity('All');
    setSelectedAvailability('All');
  };

  return (
    <div className="page-container donors-page">
      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <span className="badge-pill">Directory</span>
          <h1 className="page-title">Donor Registry Directory</h1>
          <p className="page-subtitle">
            Search, filter, edit, and manage all verified blood donors registered in MongoDB Atlas.
          </p>
        </div>
        <div className="page-header-actions">
          <button
            className="btn btn-outline"
            onClick={loadDonors}
            disabled={loading}
            title="Refresh donor list from MongoDB"
          >
            {loading ? 'Refreshing...' : '🔄 Refresh List'}
          </button>
          <Link to="/register" className="btn btn-primary">
            ➕ Register New Donor
          </Link>
        </div>
      </div>

      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Filter and Search Bar Section */}
      <div className="filters-card">
        <div className="filter-controls-grid">
          {/* Search by Name / City */}
          <div className="filter-item search-box">
            <label htmlFor="search-input">Search Donor</label>
            <div className="search-input-wrap">
              <span className="search-icon">🔍</span>
              <input
                id="search-input"
                type="text"
                placeholder="Search by donor name or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className="clear-search-btn"
                  onClick={() => setSearchTerm('')}
                  aria-label="Clear search"
                >
                  &times;
                </button>
              )}
            </div>
          </div>

          {/* Blood Group Filter */}
          <div className="filter-item">
            <label htmlFor="blood-filter">Blood Group</label>
            <select
              id="blood-filter"
              value={selectedBloodGroup}
              onChange={(e) => setSelectedBloodGroup(e.target.value)}
            >
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg} value={bg}>
                  {bg === 'All' ? 'All Blood Groups' : bg}
                </option>
              ))}
            </select>
          </div>

          {/* City Filter */}
          <div className="filter-item">
            <label htmlFor="city-filter">City</label>
            <select
              id="city-filter"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              {cityOptions.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All Cities' : c}
                </option>
              ))}
            </select>
          </div>

          {/* Availability Status Filter */}
          <div className="filter-item">
            <label htmlFor="avail-filter">Availability</label>
            <select
              id="avail-filter"
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
            >
              {AVAILABILITY_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === 'All' ? 'All Statuses' : opt}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters */}
          <div className="filter-item filter-reset-item">
            <label>&nbsp;</label>
            <button
              className="btn btn-secondary btn-block"
              onClick={handleResetFilters}
              title="Reset all search & filter options"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Results Count Bar */}
        <div className="results-count-bar">
          <span>
            Showing <strong>{donors.length}</strong> {donors.length === 1 ? 'donor record' : 'donor records'}
          </span>
          {(searchTerm || selectedBloodGroup !== 'All' || selectedCity !== 'All' || selectedAvailability !== 'All') && (
            <span className="active-filters-tag">
              Filters applied • <button className="link-button" onClick={handleResetFilters}>Clear all</button>
            </span>
          )}
        </div>
      </div>

      {/* Donors Table */}
      <DonorTable
        donors={donors}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
        isLoading={loading}
      />

      {/* Edit Modal */}
      <EditModal
        donor={editingDonor}
        isOpen={isEditModalOpen}
        onClose={handleCloseEdit}
        onSave={handleSaveEdit}
        isSubmitting={isUpdating}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        donor={deletingDonor}
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default DonorList;
