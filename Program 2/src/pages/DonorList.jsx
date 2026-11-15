import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { BLOOD_GROUPS } from '../utils/storage';
import DonorTable from '../components/DonorTable';
import EditModal from '../components/EditModal';

/**
 * Donor Listing Page Component
 * Demonstrates:
 * - useState for search input, filters, sort order, and modal state
 * - useEffect and useSearchParams for synchronized URL query params
 * - useMemo for high-performance filtering and sorting
 * - Conditional rendering for modals, confirmation prompts, and empty lists
 * - Full CRUD operations: Read, Update, Delete
 */
const DonorList = ({ donors = [], onUpdateDonor, onDeleteDonor, onToggleStatus }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('ALL');
  const [availabilityFilter, setAvailabilityFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');

  // Edit Modal State
  const [editingDonor, setEditingDonor] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Delete Confirmation State
  const [donorToDelete, setDonorToDelete] = useState(null);

  // Synchronize URL query parameter (e.g. ?group=O+) from dashboard
  useEffect(() => {
    const groupParam = searchParams.get('group');
    if (groupParam && BLOOD_GROUPS.includes(groupParam)) {
      setSelectedBloodGroup(groupParam);
    }
  }, [searchParams]);

  // Handle Search Input Change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle Blood Group Filter Change
  const handleBloodGroupChange = (e) => {
    const value = e.target.value;
    setSelectedBloodGroup(value);
    if (value === 'ALL') {
      searchParams.delete('group');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ group: value });
    }
  };

  // Reset all filters and search term
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedBloodGroup('ALL');
    setAvailabilityFilter('ALL');
    setSortBy('newest');
    setSearchParams({});
  };

  // Filter and Sort donors with useMemo for optimal React performance
  const filteredDonors = useMemo(() => {
    return donors
      .filter((donor) => {
        // Search by Name, City or Phone
        const matchesSearch =
          donor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          donor.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          donor.phone.includes(searchTerm);

        // Filter by Blood Group
        const matchesBloodGroup =
          selectedBloodGroup === 'ALL' || donor.bloodGroup === selectedBloodGroup;

        // Filter by Availability
        const matchesAvailability =
          availabilityFilter === 'ALL' ||
          (availabilityFilter === 'AVAILABLE' && donor.isAvailable) ||
          (availabilityFilter === 'UNAVAILABLE' && !donor.isAvailable);

        return matchesSearch && matchesBloodGroup && matchesAvailability;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return b.id - a.id;
        if (sortBy === 'oldest') return a.id - b.id;
        if (sortBy === 'name') return a.fullName.localeCompare(b.fullName);
        if (sortBy === 'age-asc') return a.age - b.age;
        if (sortBy === 'age-desc') return b.age - a.age;
        return 0;
      });
  }, [donors, searchTerm, selectedBloodGroup, availabilityFilter, sortBy]);

  // Edit Handlers
  const handleOpenEdit = (donor) => {
    setEditingDonor(donor);
    setIsEditModalOpen(true);
  };

  const handleCloseEdit = () => {
    setEditingDonor(null);
    setIsEditModalOpen(false);
  };

  const handleSaveEdit = (updatedData) => {
    onUpdateDonor(updatedData);
  };

  // Delete Handlers
  const handleRequestDelete = (id, fullName) => {
    setDonorToDelete({ id, fullName });
  };

  const handleConfirmDelete = () => {
    if (donorToDelete) {
      onDeleteDonor(donorToDelete.id);
      setDonorToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDonorToDelete(null);
  };

  const isFilteringActive =
    searchTerm !== '' || selectedBloodGroup !== 'ALL' || availabilityFilter !== 'ALL';

  return (
    <div className="page-container donor-list-page">
      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Donor Directory</h1>
          <p className="page-subtitle">
            Search, filter, edit and manage verified blood donor records.
          </p>
        </div>
        <Link to="/register" className="btn btn-primary">
          <span className="btn-icon">➕</span>
          <span>Register Donor</span>
        </Link>
      </div>

      {/* Control Bar: Search, Filters and Sorting */}
      <div className="filter-controls-card">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by donor name, city, or phone..."
            className="search-input"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="search-clear-btn"
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        <div className="filters-row">
          {/* Blood Group Filter */}
          <div className="filter-item">
            <label htmlFor="bg-filter" className="filter-label">Blood Group:</label>
            <select
              id="bg-filter"
              value={selectedBloodGroup}
              onChange={handleBloodGroupChange}
              className="filter-select"
            >
              <option value="ALL">All Blood Groups</option>
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
          </div>

          {/* Availability Filter */}
          <div className="filter-item">
            <label htmlFor="avail-filter" className="filter-label">Status:</label>
            <select
              id="avail-filter"
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="filter-select"
            >
              <option value="ALL">All Statuses</option>
              <option value="AVAILABLE">Available Only</option>
              <option value="UNAVAILABLE">Unavailable Only</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="filter-item">
            <label htmlFor="sort-by" className="filter-label">Sort By:</label>
            <select
              id="sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name (A - Z)</option>
              <option value="age-asc">Age (Lowest First)</option>
              <option value="age-desc">Age (Highest First)</option>
            </select>
          </div>

          {/* Reset Filters button */}
          {isFilteringActive && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="btn btn-outline btn-sm reset-filter-btn"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Summary Bar */}
      <div className="results-summary-bar">
        <span className="results-count-text">
          Showing <strong>{filteredDonors.length}</strong> of <strong>{donors.length}</strong> registered donors
        </span>
        {isFilteringActive && (
          <span className="active-filters-tag">
            Active filters applied
          </span>
        )}
      </div>

      {/* Donor Table */}
      <div className="table-card">
        <DonorTable
          donors={filteredDonors}
          onEdit={handleOpenEdit}
          onDelete={handleRequestDelete}
          onToggleStatus={onToggleStatus}
          onResetFilters={handleResetFilters}
        />
      </div>

      {/* Edit Donor Modal */}
      <EditModal
        isOpen={isEditModalOpen}
        donor={editingDonor}
        onClose={handleCloseEdit}
        onSave={handleSaveEdit}
      />

      {/* Delete Confirmation Dialog */}
      {donorToDelete && (
        <div className="modal-backdrop" onClick={handleCancelDelete}>
          <div
            className="modal-container modal-danger"
            onClick={(e) => e.stopPropagation()}
            role="alertdialog"
            aria-modal="true"
          >
            <div className="modal-header">
              <h3 className="modal-title text-danger">⚠️ Confirm Donor Deletion</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={handleCancelDelete}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <p>
                Are you sure you want to delete donor record for{' '}
                <strong>{donorToDelete.fullName}</strong> (ID: #{donorToDelete.id})?
              </p>
              <p className="text-muted-sm">
                This action will remove the record from both state and localStorage.
              </p>
            </div>
            <div className="modal-actions">
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="btn btn-danger"
              >
                🗑️ Yes, Delete Donor
              </button>
              <button
                type="button"
                onClick={handleCancelDelete}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonorList;
