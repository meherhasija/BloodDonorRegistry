import React, { useState, useEffect } from 'react';
import { BLOOD_GROUPS, GENDERS } from '../utils/storage';

/**
 * Reusable DonorForm Component
 * Used for both registering new donors and editing existing donors
 * Demonstrates:
 * - useState for form state and error validation state
 * - useEffect for synchronizing initialData when editing
 * - Event handling (onChange, onSubmit, onReset)
 * - Conditional rendering for error messages and dynamic button labels
 */
const DonorForm = ({ initialData = null, onSubmit, onCancel, isEditMode = false }) => {
  // State for form fields
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: 'Male',
    bloodGroup: 'O+',
    phone: '',
    city: '',
    isAvailable: true
  });

  // State for validation error messages
  const [errors, setErrors] = useState({});

  // Populate form if initialData is provided (Edit Mode)
  useEffect(() => {
    if (initialData) {
      setFormData({
        fullName: initialData.fullName || '',
        age: initialData.age ? String(initialData.age) : '',
        gender: initialData.gender || 'Male',
        bloodGroup: initialData.bloodGroup || 'O+',
        phone: initialData.phone || '',
        city: initialData.city || '',
        isAvailable: initialData.isAvailable !== undefined ? initialData.isAvailable : true
      });
      setErrors({});
    }
  }, [initialData]);

  // Handle input changes dynamically
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: fieldValue
    }));

    // Clear specific field error as user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Comprehensive Form Validation
  const validateForm = () => {
    const newErrors = {};

    // 1. Full Name validation
    const nameTrimmed = formData.fullName.trim();
    if (!nameTrimmed) {
      newErrors.fullName = 'Full Name is required.';
    } else if (nameTrimmed.length < 3) {
      newErrors.fullName = 'Name must be at least 3 characters long.';
    } else if (!/^[A-Za-z\s.]+$/.test(nameTrimmed)) {
      newErrors.fullName = 'Name must contain only alphabetic characters and spaces.';
    }

    // 2. Age validation (Standard medical blood donation criteria: 18 - 65 years)
    const ageNum = Number(formData.age);
    if (!formData.age || isNaN(ageNum)) {
      newErrors.age = 'Age is required.';
    } else if (!Number.isInteger(ageNum)) {
      newErrors.age = 'Age must be a whole number.';
    } else if (ageNum < 18 || ageNum > 65) {
      newErrors.age = 'Donor age must be between 18 and 65 years.';
    }

    // 3. Gender validation
    if (!formData.gender) {
      newErrors.gender = 'Please select a gender.';
    }

    // 4. Blood Group validation
    if (!formData.bloodGroup || !BLOOD_GROUPS.includes(formData.bloodGroup)) {
      newErrors.bloodGroup = 'Please select a valid blood group.';
    }

    // 5. Phone Number validation (Standard 10-digit mobile number)
    const phoneClean = formData.phone.trim();
    if (!phoneClean) {
      newErrors.phone = 'Phone number is required.';
    } else if (!/^[6-9]\d{9}$/.test(phoneClean)) {
      newErrors.phone = 'Enter a valid 10-digit mobile number starting with 6, 7, 8 or 9.';
    }

    // 6. City validation
    const cityTrimmed = formData.city.trim();
    if (!cityTrimmed) {
      newErrors.city = 'City is required.';
    } else if (cityTrimmed.length < 2) {
      newErrors.city = 'City name must be at least 2 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const payload = {
        fullName: formData.fullName.trim(),
        age: parseInt(formData.age, 10),
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        phone: formData.phone.trim(),
        city: formData.city.trim(),
        isAvailable: Boolean(formData.isAvailable)
      };

      if (initialData && initialData.id) {
        payload.id = initialData.id;
      }

      onSubmit(payload);

      // If not in edit mode, clear the form after submission
      if (!isEditMode) {
        setFormData({
          fullName: '',
          age: '',
          gender: 'Male',
          bloodGroup: 'O+',
          phone: '',
          city: '',
          isAvailable: true
        });
        setErrors({});
      }
    }
  };

  // Reset form handler
  const handleReset = () => {
    if (initialData) {
      setFormData({
        fullName: initialData.fullName || '',
        age: initialData.age ? String(initialData.age) : '',
        gender: initialData.gender || 'Male',
        bloodGroup: initialData.bloodGroup || 'O+',
        phone: initialData.phone || '',
        city: initialData.city || '',
        isAvailable: initialData.isAvailable !== undefined ? initialData.isAvailable : true
      });
    } else {
      setFormData({
        fullName: '',
        age: '',
        gender: 'Male',
        bloodGroup: 'O+',
        phone: '',
        city: '',
        isAvailable: true
      });
    }
    setErrors({});
  };

  return (
    <form className="donor-form" onSubmit={handleSubmit} noValidate>
      {/* Full Name */}
      <div className="form-group">
        <label htmlFor="fullName" className="form-label">
          Full Name <span className="required-asterisk">*</span>
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="e.g. Ramesh Kumar"
          className={`form-input ${errors.fullName ? 'input-error' : ''}`}
        />
        {errors.fullName && <p className="error-text">{errors.fullName}</p>}
      </div>

      {/* Row: Age and Gender */}
      <div className="form-row">
        <div className="form-group flex-1">
          <label htmlFor="age" className="form-label">
            Age (Years) <span className="required-asterisk">*</span>
          </label>
          <input
            type="number"
            id="age"
            name="age"
            min="18"
            max="65"
            value={formData.age}
            onChange={handleChange}
            placeholder="18 - 65"
            className={`form-input ${errors.age ? 'input-error' : ''}`}
          />
          {errors.age && <p className="error-text">{errors.age}</p>}
        </div>

        <div className="form-group flex-1">
          <label htmlFor="gender" className="form-label">
            Gender <span className="required-asterisk">*</span>
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className={`form-select ${errors.gender ? 'input-error' : ''}`}
          >
            {GENDERS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
          {errors.gender && <p className="error-text">{errors.gender}</p>}
        </div>
      </div>

      {/* Row: Blood Group and Phone */}
      <div className="form-row">
        <div className="form-group flex-1">
          <label htmlFor="bloodGroup" className="form-label">
            Blood Group <span className="required-asterisk">*</span>
          </label>
          <select
            id="bloodGroup"
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            className={`form-select ${errors.bloodGroup ? 'input-error' : ''}`}
          >
            {BLOOD_GROUPS.map((bg) => (
              <option key={bg} value={bg}>
                {bg}
              </option>
            ))}
          </select>
          {errors.bloodGroup && <p className="error-text">{errors.bloodGroup}</p>}
        </div>

        <div className="form-group flex-1">
          <label htmlFor="phone" className="form-label">
            Phone Number <span className="required-asterisk">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            maxLength="10"
            value={formData.phone}
            onChange={handleChange}
            placeholder="10-digit mobile number"
            className={`form-input ${errors.phone ? 'input-error' : ''}`}
          />
          {errors.phone && <p className="error-text">{errors.phone}</p>}
        </div>
      </div>

      {/* City */}
      <div className="form-group">
        <label htmlFor="city" className="form-label">
          City / Location <span className="required-asterisk">*</span>
        </label>
        <input
          type="text"
          id="city"
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="e.g. Bengaluru, Mysuru, Hubballi"
          className={`form-input ${errors.city ? 'input-error' : ''}`}
        />
        {errors.city && <p className="error-text">{errors.city}</p>}
      </div>

      {/* Availability Status Checkbox / Toggle */}
      <div className="form-group">
        <label className="form-label">Availability Status</label>
        <div className="availability-toggle-card">
          <label className="toggle-label-wrapper">
            <input
              type="checkbox"
              id="isAvailable"
              name="isAvailable"
              checked={formData.isAvailable}
              onChange={handleChange}
              className="toggle-checkbox"
            />
            <span className="toggle-custom-slider"></span>
            <span className="toggle-text-status">
              {formData.isAvailable ? (
                <span className="status-text-active">
                  <strong className="status-badge-inline available">Available</strong> - Ready to donate immediately upon request
                </span>
              ) : (
                <span className="status-text-inactive">
                  <strong className="status-badge-inline unavailable">Unavailable</strong> - Temporarily inactive or recovering
                </span>
              )}
            </span>
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="form-actions-row">
        <button type="submit" className="btn btn-primary">
          <span className="btn-icon">{isEditMode ? '💾' : '➕'}</span>
          <span>{isEditMode ? 'Update Donor Record' : 'Register Donor'}</span>
        </button>

        <button type="button" onClick={handleReset} className="btn btn-outline">
          <span>{isEditMode ? 'Revert Changes' : 'Reset Form'}</span>
        </button>

        {isEditMode && onCancel && (
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            <span>Cancel</span>
          </button>
        )}
      </div>
    </form>
  );
};

export default DonorForm;
