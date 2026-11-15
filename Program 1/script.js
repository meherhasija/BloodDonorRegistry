/**
 * ==============================================================================
 * Program 1: Blood Donor Registry System
 * Technology: HTML5, CSS3, Vanilla JavaScript (ES6+), Fetch API, JSON Server
 *
 * Designed for 3rd Year Full Stack Development Practical Examination
 * Demonstrates:
 *   - DOM Selection and Event Listeners
 *   - Client-side Form Validation
 *   - Asynchronous JavaScript with async / await
 *   - REST API CRUD operations (GET, POST, PUT, DELETE)
 *   - Real-time Search and Multi-criteria Filtering
 *   - UI State Management (Loading, Error, Success)
 * ==============================================================================
 */

// ==============================================================================
// 1. CONFIGURATION & STATE
// ==============================================================================

// Base URL for the JSON Server mock REST API
const API_URL = 'http://localhost:3000/donors';

// In-memory list to store all donors fetched from JSON Server
// This allows fast, combined client-side search & filtering
let allDonors = [];

// ==============================================================================
// 2. DOM ELEMENT REFERENCES
// ==============================================================================

// Form and Inputs
const donorForm = document.getElementById('donor-form');
const formHeading = document.getElementById('form-heading');
const submitBtn = document.getElementById('submit-btn');
const submitBtnText = document.getElementById('submit-btn-text');
const cancelBtn = document.getElementById('cancel-btn');

const donorIdInput = document.getElementById('donor-id');
const fullNameInput = document.getElementById('full-name');
const ageInput = document.getElementById('age');
const genderSelect = document.getElementById('gender');
const bloodGroupSelect = document.getElementById('blood-group');
const phoneInput = document.getElementById('phone');
const cityInput = document.getElementById('city');
const availabilitySelect = document.getElementById('availability');

// Error Message Spans
const errorFullName = document.getElementById('error-fullName');
const errorAge = document.getElementById('error-age');
const errorGender = document.getElementById('error-gender');
const errorBloodGroup = document.getElementById('error-bloodGroup');
const errorPhone = document.getElementById('error-phone');
const errorCity = document.getElementById('error-city');

// Search & Filter Controls
const searchInput = document.getElementById('search-input');
const filterBloodGroup = document.getElementById('filter-blood-group');
const filterCity = document.getElementById('filter-city');
const resetFilterBtn = document.getElementById('reset-filter-btn');

// Table & UI Feedback Elements
const donorsTbody = document.getElementById('donors-tbody');
const loadingSpinner = document.getElementById('loading-spinner');
const emptyState = document.getElementById('empty-state');
const alertBox = document.getElementById('alert-box');

// Stats Counters
const statTotal = document.getElementById('stat-total');
const statAvailable = document.getElementById('stat-available');
const statUnavailable = document.getElementById('stat-unavailable');

// ==============================================================================
// 3. APPLICATION INITIALIZATION & EVENT LISTENERS
// ==============================================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Fetch and display initial donors
  loadDonors();

  // 2. Form submission listener (handles both Add and Edit)
  donorForm.addEventListener('submit', handleFormSubmit);

  // 3. Cancel Edit button listener
  cancelBtn.addEventListener('click', resetForm);

  // 4. Live Search & Filter input listeners
  searchInput.addEventListener('input', applyFilters);
  filterBloodGroup.addEventListener('change', applyFilters);
  filterCity.addEventListener('input', applyFilters);

  // 5. Reset Filters button listener
  resetFilterBtn.addEventListener('click', resetFilters);

  // 6. Real-time validation clearance on user input
  fullNameInput.addEventListener('input', () => clearError(fullNameInput, errorFullName));
  ageInput.addEventListener('input', () => clearError(ageInput, errorAge));
  genderSelect.addEventListener('change', () => clearError(genderSelect, errorGender));
  bloodGroupSelect.addEventListener('change', () => clearError(bloodGroupSelect, errorBloodGroup));
  phoneInput.addEventListener('input', () => clearError(phoneInput, errorPhone));
  cityInput.addEventListener('input', () => clearError(cityInput, errorCity));

  // 7. Event Delegation for Edit & Delete buttons on Table Body
  donorsTbody.addEventListener('click', (event) => {
    const editBtn = event.target.closest('.btn-edit');
    const deleteBtn = event.target.closest('.btn-delete');

    if (editBtn) {
      const id = editBtn.getAttribute('data-id');
      startEditDonor(id);
    } else if (deleteBtn) {
      const id = deleteBtn.getAttribute('data-id');
      const name = deleteBtn.getAttribute('data-name');
      deleteDonor(id, name);
    }
  });
});

// ==============================================================================
// 4. FETCH API REST OPERATIONS (GET, POST, PUT, DELETE)
// ==============================================================================

/**
 * GET Method: Fetch all donors from JSON Server
 */
async function loadDonors() {
  showLoading(true);
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Failed to load donors: Server responded with status ${response.status}`);
    }

    const data = await response.json();
    allDonors = Array.isArray(data) ? data : [];

    // Render table and stats
    applyFilters();
    updateStats(allDonors);
  } catch (error) {
    console.error('API Error [loadDonors]:', error);
    showAlert(
      `Cannot connect to JSON Server (${error.message}). Please ensure 'npm run server' is running on port 3000.`,
      'error'
    );
    renderTable([]);
    updateStats([]);
  } finally {
    showLoading(false);
  }
}

/**
 * POST Method: Add a new donor record to JSON Server
 */
async function createDonor(donorData) {
  showLoading(true);
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(donorData)
    });

    if (!response.ok) {
      throw new Error(`Server returned ${response.status} when creating donor`);
    }

    const created = await response.json();
    showAlert(`Donor "${created.fullName}" registered successfully!`, 'success');

    // Reset form and reload fresh list from server
    resetForm();
    await loadDonors();
  } catch (error) {
    console.error('API Error [createDonor]:', error);
    showAlert(`Error adding donor: ${error.message}`, 'error');
  } finally {
    showLoading(false);
  }
}

/**
 * PUT Method: Update an existing donor record on JSON Server
 */
async function updateDonor(id, donorData) {
  showLoading(true);
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(donorData)
    });

    if (!response.ok) {
      throw new Error(`Server returned ${response.status} when updating donor`);
    }

    const updated = await response.json();
    showAlert(`Donor "${updated.fullName}" updated successfully!`, 'success');

    // Reset form to Add mode and reload list
    resetForm();
    await loadDonors();
  } catch (error) {
    console.error('API Error [updateDonor]:', error);
    showAlert(`Error updating donor: ${error.message}`, 'error');
  } finally {
    showLoading(false);
  }
}

/**
 * DELETE Method: Remove a donor record from JSON Server
 */
async function deleteDonor(id, donorName) {
  const isConfirmed = confirm(
    `Are you sure you want to delete donor "${donorName}" (ID: ${id})?\nThis action cannot be undone.`
  );

  if (!isConfirmed) return;

  showLoading(true);
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error(`Server returned ${response.status} when deleting donor`);
    }

    showAlert(`Donor "${donorName}" was deleted successfully.`, 'info');

    // If we were currently editing the deleted donor, reset the form
    if (donorIdInput.value === String(id)) {
      resetForm();
    }

    await loadDonors();
  } catch (error) {
    console.error('API Error [deleteDonor]:', error);
    showAlert(`Error deleting donor: ${error.message}`, 'error');
  } finally {
    showLoading(false);
  }
}

// ==============================================================================
// 5. FORM SUBMISSION & VALIDATION
// ==============================================================================

/**
 * Handle form submit for both "Add Donor" and "Update Donor"
 */
async function handleFormSubmit(event) {
  event.preventDefault();

  // Validate all inputs before proceeding
  const isValid = validateForm();
  if (!isValid) {
    return;
  }

  // Construct donor data payload
  const donorPayload = {
    fullName: fullNameInput.value.trim(),
    age: parseInt(ageInput.value, 10),
    gender: genderSelect.value,
    bloodGroup: bloodGroupSelect.value,
    phone: phoneInput.value.trim(),
    city: cityInput.value.trim(),
    isAvailable: availabilitySelect.value === 'true'
  };

  const editingId = donorIdInput.value;

  if (editingId) {
    // Edit mode -> Call PUT
    await updateDonor(editingId, donorPayload);
  } else {
    // Add mode -> Call POST
    await createDonor(donorPayload);
  }
}

/**
 * Comprehensive client-side form validation
 * Validates Name, Age (18-65), Gender, Blood Group, Phone (10 digits), City
 */
function validateForm() {
  let valid = true;

  // 1. Full Name: letters, spaces, 3-50 chars
  const nameVal = fullNameInput.value.trim();
  const nameRegex = /^[a-zA-Z\s]{3,50}$/;
  if (!nameVal) {
    showFieldError(fullNameInput, errorFullName, 'Full name is required.');
    valid = false;
  } else if (!nameRegex.test(nameVal)) {
    showFieldError(fullNameInput, errorFullName, 'Name must be 3-50 letters only.');
    valid = false;
  } else {
    clearError(fullNameInput, errorFullName);
  }

  // 2. Age: 18 to 65 (medical donor criteria)
  const ageVal = parseInt(ageInput.value, 10);
  if (!ageInput.value.trim()) {
    showFieldError(ageInput, errorAge, 'Age is required.');
    valid = false;
  } else if (isNaN(ageVal) || ageVal < 18 || ageVal > 65) {
    showFieldError(ageInput, errorAge, 'Donor age must be between 18 and 65.');
    valid = false;
  } else {
    clearError(ageInput, errorAge);
  }

  // 3. Gender
  if (!genderSelect.value) {
    showFieldError(genderSelect, errorGender, 'Please select a gender.');
    valid = false;
  } else {
    clearError(genderSelect, errorGender);
  }

  // 4. Blood Group
  if (!bloodGroupSelect.value) {
    showFieldError(bloodGroupSelect, errorBloodGroup, 'Please select a blood group.');
    valid = false;
  } else {
    clearError(bloodGroupSelect, errorBloodGroup);
  }

  // 5. Phone: exactly 10 digits, starting with 6, 7, 8, or 9
  const phoneVal = phoneInput.value.trim();
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phoneVal) {
    showFieldError(phoneInput, errorPhone, 'Phone number is required.');
    valid = false;
  } else if (!phoneRegex.test(phoneVal)) {
    showFieldError(phoneInput, errorPhone, 'Enter a valid 10-digit mobile number (starts with 6-9).');
    valid = false;
  } else {
    clearError(phoneInput, errorPhone);
  }

  // 6. City: letters & spaces, min 2 chars
  const cityVal = cityInput.value.trim();
  const cityRegex = /^[a-zA-Z\s]{2,30}$/;
  if (!cityVal) {
    showFieldError(cityInput, errorCity, 'City is required.');
    valid = false;
  } else if (!cityRegex.test(cityVal)) {
    showFieldError(cityInput, errorCity, 'City must contain at least 2 letters.');
    valid = false;
  } else {
    clearError(cityInput, errorCity);
  }

  return valid;
}

function showFieldError(inputElement, errorElement, message) {
  inputElement.classList.add('input-error');
  errorElement.textContent = message;
}

function clearError(inputElement, errorElement) {
  inputElement.classList.remove('input-error');
  if (errorElement) {
    errorElement.textContent = '';
  }
}

function clearAllErrors() {
  [fullNameInput, ageInput, genderSelect, bloodGroupSelect, phoneInput, cityInput].forEach((el) => {
    el.classList.remove('input-error');
  });
  [errorFullName, errorAge, errorGender, errorBloodGroup, errorPhone, errorCity].forEach((el) => {
    el.textContent = '';
  });
}

// ==============================================================================
// 6. EDIT & FORM RESET MODES
// ==============================================================================

/**
 * Populate form for editing an existing donor
 */
function startEditDonor(id) {
  const donor = allDonors.find((d) => String(d.id) === String(id));
  if (!donor) return;

  // Clear any existing validation errors
  clearAllErrors();

  // Populate form fields
  donorIdInput.value = donor.id;
  fullNameInput.value = donor.fullName;
  ageInput.value = donor.age;
  genderSelect.value = donor.gender;
  bloodGroupSelect.value = donor.bloodGroup;
  phoneInput.value = donor.phone;
  cityInput.value = donor.city;
  availabilitySelect.value = donor.isAvailable ? 'true' : 'false';

  // Update UI to "Edit Mode"
  formHeading.textContent = `Edit Donor: ${donor.fullName}`;
  submitBtnText.textContent = 'Update Donor';
  cancelBtn.classList.remove('hidden');

  // Smooth scroll to form for user convenience
  donorForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Reset form back to "Register New Donor" mode
 */
function resetForm() {
  donorForm.reset();
  donorIdInput.value = '';
  formHeading.textContent = 'Register New Donor';
  submitBtnText.textContent = 'Register Donor';
  cancelBtn.classList.add('hidden');
  clearAllErrors();
}

// ==============================================================================
// 7. RENDERING DONOR TABLE & METRICS
// ==============================================================================

/**
 * Render the list of donors into HTML table rows
 */
function renderTable(donors) {
  donorsTbody.innerHTML = '';

  if (donors.length === 0) {
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');

  donors.forEach((donor, index) => {
    const tr = document.createElement('tr');

    // Blood group badge
    const bloodBadge = `<span class="badge-blood">${escapeHtml(donor.bloodGroup)}</span>`;

    // Status badge (Available vs Unavailable)
    const statusBadge = donor.isAvailable
      ? `<span class="badge-status badge-available">Available</span>`
      : `<span class="badge-status badge-unavailable">Unavailable</span>`;

    // Phone link
    const phoneDisplay = `<a href="tel:${escapeHtml(donor.phone)}" class="donor-phone-link">${escapeHtml(donor.phone)}</a>`;

    tr.innerHTML = `
      <td>${index + 1}</td>
      <td class="donor-name-cell">${escapeHtml(donor.fullName)}</td>
      <td>${bloodBadge}</td>
      <td>${donor.age} yrs / ${escapeHtml(donor.gender)}</td>
      <td>${phoneDisplay}</td>
      <td>${escapeHtml(donor.city)}</td>
      <td>${statusBadge}</td>
      <td class="text-center">
        <div class="table-actions">
          <button 
            type="button" 
            class="btn btn-sm btn-edit" 
            data-id="${donor.id}"
            title="Edit donor details"
          >
            Edit
          </button>
          <button 
            type="button" 
            class="btn btn-sm btn-delete" 
            data-id="${donor.id}"
            data-name="${escapeHtml(donor.fullName)}"
            title="Delete donor"
          >
            Delete
          </button>
        </div>
      </td>
    `;

    donorsTbody.appendChild(tr);
  });
}

/**
 * Update the summary statistics cards
 */
function updateStats(donors) {
  const total = donors.length;
  const available = donors.filter((d) => d.isAvailable).length;
  const unavailable = total - available;

  statTotal.textContent = total;
  statAvailable.textContent = available;
  statUnavailable.textContent = unavailable;
}

// ==============================================================================
// 8. SEARCH & FILTER LOGIC
// ==============================================================================

/**
 * Filter donors in real-time by Name, Blood Group, and City
 */
function applyFilters() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const selectedGroup = filterBloodGroup.value;
  const cityTerm = filterCity.value.trim().toLowerCase();

  const filtered = allDonors.filter((donor) => {
    // 1. Search by Donor Name (case-insensitive)
    const matchesName = donor.fullName.toLowerCase().includes(searchTerm);

    // 2. Filter by Blood Group (exact match or ALL)
    const matchesGroup = selectedGroup === 'ALL' || donor.bloodGroup === selectedGroup;

    // 3. Filter by City (case-insensitive substring match)
    const matchesCity = !cityTerm || donor.city.toLowerCase().includes(cityTerm);

    return matchesName && matchesGroup && matchesCity;
  });

  renderTable(filtered);
}

/**
 * Reset all filter inputs to default
 */
function resetFilters() {
  searchInput.value = '';
  filterBloodGroup.value = 'ALL';
  filterCity.value = '';
  applyFilters();
}

// ==============================================================================
// 9. UI HELPERS & NOTIFICATIONS
// ==============================================================================

/**
 * Show a floating / banner alert box
 * @param {string} message
 * @param {'success'|'error'|'info'} type
 */
let alertTimeout = null;
function showAlert(message, type = 'info') {
  if (alertTimeout) {
    clearTimeout(alertTimeout);
  }

  alertBox.className = `alert alert-${type}`;
  alertBox.textContent = message;
  alertBox.classList.remove('hidden');

  // Auto-hide alert after 5 seconds
  alertTimeout = setTimeout(() => {
    alertBox.classList.add('hidden');
  }, 5000);
}

/**
 * Toggle loading spinner state
 */
function showLoading(isLoading) {
  if (isLoading) {
    loadingSpinner.classList.remove('hidden');
  } else {
    loadingSpinner.classList.add('hidden');
  }
}

/**
 * Basic HTML escaping helper to prevent XSS injection
 */
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Expose functions globally for debugging & viva demonstration
if (typeof window !== 'undefined') {
  window.startEditDonor = startEditDonor;
  window.deleteDonor = deleteDonor;
  window.loadDonors = loadDonors;
}
