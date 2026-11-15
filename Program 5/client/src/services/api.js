/**
 * API Service for Blood Donor Registry
 * Connects React frontend to Express.js REST API backend.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Helper to process Fetch API responses
 */
const handleResponse = async (response) => {
  let data;
  try {
    data = await response.json();
  } catch (err) {
    throw new Error(`Server returned status ${response.status} with non-JSON response.`);
  }

  if (!response.ok) {
    const errorMsg =
      (data && data.message) ||
      (data && data.errors && data.errors.join(', ')) ||
      `Request failed with status ${response.status}`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

/**
 * Fetch all donors with optional filtering parameters
 * @param {Object} params - { search, bloodGroup, city, availabilityStatus }
 */
export const fetchDonors = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.search) query.append('search', params.search);
  if (params.bloodGroup && params.bloodGroup !== 'All') query.append('bloodGroup', params.bloodGroup);
  if (params.city && params.city !== 'All') query.append('city', params.city);
  if (params.availabilityStatus && params.availabilityStatus !== 'All') query.append('availabilityStatus', params.availabilityStatus);

  const queryString = query.toString();
  const url = `${API_BASE_URL}/donors${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json'
    }
  });
  return handleResponse(response);
};

/**
 * Fetch a single donor by ID
 * @param {string} id 
 */
export const fetchDonorById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/donors/${id}`, {
    headers: {
      'Accept': 'application/json'
    }
  });
  return handleResponse(response);
};

/**
 * Register a new donor
 * @param {Object} donorData 
 */
export const createDonor = async (donorData) => {
  const response = await fetch(`${API_BASE_URL}/donors`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(donorData)
  });
  return handleResponse(response);
};

/**
 * Update an existing donor record
 * @param {string} id 
 * @param {Object} donorData 
 */
export const updateDonor = async (id, donorData) => {
  const response = await fetch(`${API_BASE_URL}/donors/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(donorData)
  });
  return handleResponse(response);
};

/**
 * Delete a donor record by ID
 * @param {string} id 
 */
export const deleteDonor = async (id) => {
  const response = await fetch(`${API_BASE_URL}/donors/${id}`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json'
    }
  });
  return handleResponse(response);
};

/**
 * Fetch dashboard statistics
 */
export const fetchStats = async () => {
  const response = await fetch(`${API_BASE_URL}/stats`, {
    headers: {
      'Accept': 'application/json'
    }
  });
  return handleResponse(response);
};
