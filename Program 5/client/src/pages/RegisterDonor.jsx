import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Notification from '../components/Notification';
import { createDonor } from '../services/api';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const GENDERS = ['Male', 'Female', 'Other'];

const initialFormData = {
  fullName: '',
  age: '',
  gender: 'Male',
  bloodGroup: 'A+',
  phoneNumber: '',
  city: '',
  availabilityStatus: 'Available'
};

const RegisterDonor = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

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
      newErrors.fullName = 'Full name must be at least 2 characters long.';
    }

    const ageNum = Number(formData.age);
    if (!formData.age || isNaN(ageNum)) {
      newErrors.age = 'Age is required.';
    } else if (ageNum < 18 || ageNum > 65) {
      newErrors.age = 'Eligible donor age must be between 18 and 65 years.';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Contact phone number is required.';
    } else if (!/^\+?[0-9\s-]{10,15}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit mobile number.';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City name is required.';
    } else if (formData.city.trim().length < 2) {
      newErrors.city = 'City must be at least 2 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      setNotification({
        type: 'warning',
        message: 'Please resolve form validation errors before submitting.'
      });
      return;
    }

    setIsSubmitting(true);
    setNotification(null);

    try {
      const payload = {
        ...formData,
        age: Number(formData.age)
      };

      const result = await createDonor(payload);

      if (result && result.success) {
        setNotification({
          type: 'success',
          message: `Donor "${formData.fullName}" registered successfully in MongoDB Atlas!`
        });
        setFormData(initialFormData);
        setErrors({});
      } else {
        throw new Error(result.message || 'Failed to register donor.');
      }
    } catch (err) {
      console.error('Registration failed:', err);
      setNotification({
        type: 'error',
        message: err.message || 'Failed to save donor record to MongoDB database.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container register-page">
      <div className="register-layout-grid">
        {/* Left Side: Form Container */}
        <div className="form-card-container">
          <div className="form-card-header">
            <div className="form-header-badge">🩸 Registration Portal</div>
            <h1 className="form-card-title">Register Blood Donor</h1>
            <p className="form-card-subtitle">
              Join the life-saving network. Fill in the donor's accurate medical and contact details below.
            </p>
          </div>

          {notification && (
            <Notification
              type={notification.type}
              message={notification.message}
              onClose={() => setNotification(null)}
            />
          )}

          <form onSubmit={handleSubmit} className="donor-registration-form" noValidate>
            {/* Full Name */}
            <div className="form-group">
              <label htmlFor="fullName">
                Full Name <span className="req">*</span>
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="e.g. Alexander Fleming"
                value={formData.fullName}
                onChange={handleChange}
                className={errors.fullName ? 'input-error' : ''}
              />
              {errors.fullName && <span className="field-error">{errors.fullName}</span>}
            </div>

            {/* Age & Gender Row */}
            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="age">
                  Age (18-65) <span className="req">*</span>
                </label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  min="18"
                  max="65"
                  placeholder="e.g. 25"
                  value={formData.age}
                  onChange={handleChange}
                  className={errors.age ? 'input-error' : ''}
                />
                {errors.age && <span className="field-error">{errors.age}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="gender">
                  Gender <span className="req">*</span>
                </label>
                <select
                  id="gender"
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

            {/* Blood Group & Availability Row */}
            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="bloodGroup">
                  Blood Group <span className="req">*</span>
                </label>
                <select
                  id="bloodGroup"
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
                <label htmlFor="availabilityStatus">
                  Availability Status <span className="req">*</span>
                </label>
                <select
                  id="availabilityStatus"
                  name="availabilityStatus"
                  value={formData.availabilityStatus}
                  onChange={handleChange}
                >
                  <option value="Available">Available for Donation</option>
                  <option value="Unavailable">Currently Unavailable</option>
                </select>
              </div>
            </div>

            {/* Phone Number & City Row */}
            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="phoneNumber">
                  Contact Phone Number <span className="req">*</span>
                </label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={errors.phoneNumber ? 'input-error' : ''}
                />
                {errors.phoneNumber && <span className="field-error">{errors.phoneNumber}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="city">
                  City / Location <span className="req">*</span>
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  placeholder="e.g. Mumbai, Bangalore"
                  value={formData.city}
                  onChange={handleChange}
                  className={errors.city ? 'input-error' : ''}
                />
                {errors.city && <span className="field-error">{errors.city}</span>}
              </div>
            </div>

            {/* Submit & Reset Buttons */}
            <div className="form-button-group">
              <button
                type="submit"
                className="btn btn-primary btn-large"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="btn-spinner"></span>
                    Saving to MongoDB...
                  </>
                ) : (
                  '🩸 Complete Registration'
                )}
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setFormData(initialFormData);
                  setErrors({});
                  setNotification(null);
                }}
                disabled={isSubmitting}
              >
                Reset Form
              </button>

              <Link to="/donors" className="btn btn-outline">
                View All Donors &rarr;
              </Link>
            </div>
          </form>
        </div>

        {/* Right Side: Educational & Eligibility Info Card */}
        <aside className="eligibility-sidebar">
          <div className="info-card">
            <h3 className="info-title">📋 Donor Eligibility Criteria</h3>
            <ul className="info-checklist">
              <li>
                <span className="check-icon">✓</span>
                <span><strong>Age:</strong> Must be between 18 and 65 years old.</span>
              </li>
              <li>
                <span className="check-icon">✓</span>
                <span><strong>Weight:</strong> Minimum weight of 45–50 kg.</span>
              </li>
              <li>
                <span className="check-icon">✓</span>
                <span><strong>Hemoglobin:</strong> Normal levels (at least 12.5 g/dL).</span>
              </li>
              <li>
                <span className="check-icon">✓</span>
                <span><strong>Interval:</strong> At least 3 months (90 days) between donations.</span>
              </li>
              <li>
                <span className="check-icon">✓</span>
                <span><strong>Health:</strong> Free from active fever, cold, or chronic infections.</span>
              </li>
            </ul>
          </div>

          <div className="info-card info-card-tinted">
            <h3 className="info-title">💡 Why Register?</h3>
            <p>
              1 donation can save up to <strong>3 lives</strong>. By storing donor information securely in MongoDB Atlas, emergency medical centers can quickly find compatible donors during critical operations.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default RegisterDonor;
