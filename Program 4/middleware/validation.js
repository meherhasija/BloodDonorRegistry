/**
 * Input Validation Middleware
 * Validates donor registration and update input fields.
 */

const VALID_BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const VALID_GENDERS = ['male', 'female', 'other'];

/**
 * Validates donor payload for POST and PUT requests
 */
const validateDonor = (req, res, next) => {
  const {
    fullName,
    age,
    gender,
    bloodGroup,
    phoneNumber,
    city,
    availabilityStatus
  } = req.body;

  const errors = [];

  // 1. Required fields check
  if (!fullName || typeof fullName !== 'string' || fullName.trim() === '') {
    errors.push('Full Name is required and must be a valid string.');
  }

  // 2. Age validation (must be between 18 and 65 for blood donation eligibility)
  if (age === undefined || age === null || age === '') {
    errors.push('Age is required.');
  } else {
    const parsedAge = Number(age);
    if (!Number.isInteger(parsedAge) || parsedAge < 18 || parsedAge > 65) {
      errors.push('Age must be an integer between 18 and 65 years.');
    }
  }

  // 3. Gender validation
  if (!gender || typeof gender !== 'string' || !VALID_GENDERS.includes(gender.trim().toLowerCase())) {
    errors.push('Gender is required and must be Male, Female, or Other.');
  }

  // 4. Blood Group validation
  if (!bloodGroup || typeof bloodGroup !== 'string' || !VALID_BLOOD_GROUPS.includes(bloodGroup.trim().toUpperCase())) {
    errors.push(`Blood Group is required and must be one of: ${VALID_BLOOD_GROUPS.join(', ')}.`);
  }

  // 5. Phone Number validation (standard 10-digit mobile number)
  if (!phoneNumber) {
    errors.push('Phone Number is required.');
  } else {
    const cleanPhone = String(phoneNumber).trim();
    if (!/^\d{10}$/.test(cleanPhone)) {
      errors.push('Phone Number must be a valid 10-digit number.');
    }
  }

  // 6. City validation
  if (!city || typeof city !== 'string' || city.trim() === '') {
    errors.push('City is required and must be a valid string.');
  }

  // 7. Availability Status validation
  if (availabilityStatus === undefined || availabilityStatus === null || availabilityStatus === '') {
    errors.push("Availability Status is required ('Available' or 'Unavailable').");
  } else {
    const statusStr = String(availabilityStatus).trim().toLowerCase();
    if (statusStr !== 'available' && statusStr !== 'unavailable') {
      errors.push("Availability Status must be 'Available' or 'Unavailable'.");
    }
  }

  // If validation fails, return 400 Bad Request
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation Failed: ' + errors.join(' '),
      errors: errors
    });
  }

  // Sanitize / normalize fields on request body
  req.body.fullName = fullName.trim();
  req.body.age = Number(age);
  req.body.gender = gender.trim().charAt(0).toUpperCase() + gender.trim().slice(1).toLowerCase();
  req.body.bloodGroup = bloodGroup.trim().toUpperCase();
  req.body.phoneNumber = String(phoneNumber).trim();
  req.body.city = city.trim();
  req.body.availabilityStatus = String(availabilityStatus).trim().toLowerCase() === 'available' ? 'Available' : 'Unavailable';

  next();
};

/**
 * Validates user registration payload
 */
const validateUserRegistration = (req, res, next) => {
  const { username, password, email } = req.body;
  const errors = [];

  if (!username || typeof username !== 'string' || username.trim().length < 3) {
    errors.push('Username is required and must be at least 3 characters long.');
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    errors.push('Password is required and must be at least 6 characters long.');
  }

  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      errors.push('Invalid email format.');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation Failed: ' + errors.join(' '),
      errors: errors
    });
  }

  next();
};

module.exports = {
  validateDonor,
  validateUserRegistration
};
