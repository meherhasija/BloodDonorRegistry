import React, { useState, useEffect } from 'react';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const GENDERS = ['Male', 'Female', 'Other'];

const EditModal = ({ donor, isOpen, onClose, onSave, isSubmitting }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: 'Male',
    bloodGroup: 'A+',
    phoneNumber: '',
    city: '',
    availabilityStatus: 'Available'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (donor) {
      setFormData({
        fullName: donor.fullName || '',
        age: donor.age || '',
        gender: donor.gender || 'Male',
        bloodGroup: donor.bloodGroup || 'A+',
        phoneNumber: donor.phoneNumber || '',
        city: donor.city || '',
        availabilityStatus: donor.availabilityStatus || 'Available'
      });
      setErrors({});
    }
  }, [donor]);

  if (!isOpen || !donor) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required.';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters.';
    }

    const ageNum = Number(formData.age);
    if (!formData.age || isNaN(ageNum)) {
      newErrors.age = 'Age is required.';
    } else if (ageNum < 18 || ageNum > 65) {
      newErrors.age = 'Donor age must be between 18 and 65.';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required.';
    } else if (!/^\+?[0-9\s-]{10,15}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = 'Enter a valid 10-digit phone number.';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSave(donor._id || donor.id, {
      ...formData,
      age: Number(formData.age)
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <span className="modal-icon">✏️</span>
            <h3>Edit Donor Details</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="edit-fullName">Full Name <span className="req">*</span></label>
            <input
              id="edit-fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g. John Doe"
              className={errors.fullName ? 'input-error' : ''}
            />
            {errors.fullName && <span className="field-error">{errors.fullName}</span>}
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="edit-age">Age (18 - 65) <span className="req">*</span></label>
              <input
                id="edit-age"
                name="age"
                type="number"
                min="18"
                max="65"
                value={formData.age}
                onChange={handleChange}
                placeholder="e.g. 28"
                className={errors.age ? 'input-error' : ''}
              />
              {errors.age && <span className="field-error">{errors.age}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="edit-gender">Gender <span className="req">*</span></label>
              <select
                id="edit-gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                {GENDERS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="edit-bloodGroup">Blood Group <span className="req">*</span></label>
              <select
                id="edit-bloodGroup"
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
              >
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="edit-availabilityStatus">Availability <span className="req">*</span></label>
              <select
                id="edit-availabilityStatus"
                name="availabilityStatus"
                value={formData.availabilityStatus}
                onChange={handleChange}
              >
                <option value="Available">Available for Donation</option>
                <option value="Unavailable">Currently Unavailable</option>
              </select>
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="edit-phoneNumber">Phone Number <span className="req">*</span></label>
              <input
                id="edit-phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="e.g. 9876543210"
                className={errors.phoneNumber ? 'input-error' : ''}
              />
              {errors.phoneNumber && <span className="field-error">{errors.phoneNumber}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="edit-city">City <span className="req">*</span></label>
              <input
                id="edit-city"
                name="city"
                type="text"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. Mumbai, New York"
                className={errors.city ? 'input-error' : ''}
              />
              {errors.city && <span className="field-error">{errors.city}</span>}
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving to Database...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
