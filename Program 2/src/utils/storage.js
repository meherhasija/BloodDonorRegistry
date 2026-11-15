// Storage utility for Blood Donor Registry
// Handles loading and saving donor records to browser localStorage

export const STORAGE_KEY = 'blood_donor_registry_records';

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const GENDERS = ['Male', 'Female', 'Other'];

export const INITIAL_DONORS = [
  {
    id: 1,
    fullName: 'Rahul Sharma',
    age: 28,
    gender: 'Male',
    bloodGroup: 'O+',
    phone: '9876543210',
    city: 'Bengaluru',
    isAvailable: true
  },
  {
    id: 2,
    fullName: 'Priya Nair',
    age: 24,
    gender: 'Female',
    bloodGroup: 'B+',
    phone: '9123456780',
    city: 'Mysuru',
    isAvailable: true
  },
  {
    id: 3,
    fullName: 'Amit Patel',
    age: 35,
    gender: 'Male',
    bloodGroup: 'A-',
    phone: '9898989898',
    city: 'Mangaluru',
    isAvailable: false
  },
  {
    id: 4,
    fullName: 'Sneha Kulkarni',
    age: 22,
    gender: 'Female',
    bloodGroup: 'AB+',
    phone: '9765432109',
    city: 'Hubballi',
    isAvailable: true
  },
  {
    id: 5,
    fullName: 'Vikram Singh',
    age: 42,
    gender: 'Male',
    bloodGroup: 'O-',
    phone: '9654321870',
    city: 'Bengaluru',
    isAvailable: false
  },
  {
    id: 6,
    fullName: 'Ananya Deshmukh',
    age: 29,
    gender: 'Female',
    bloodGroup: 'A+',
    phone: '9845012345',
    city: 'Belagavi',
    isAvailable: true
  },
  {
    id: 7,
    fullName: 'Mohammed Zeeshan',
    age: 31,
    gender: 'Male',
    bloodGroup: 'B-',
    phone: '9900112233',
    city: 'Shivamogga',
    isAvailable: true
  },
  {
    id: 8,
    fullName: 'Kavita Reddy',
    age: 26,
    gender: 'Female',
    bloodGroup: 'AB-',
    phone: '9448123456',
    city: 'Tumakuru',
    isAvailable: false
  }
];

/**
 * Load donors from localStorage or seed initial data
 * @returns {Array} List of donor objects
 */
export const getStoredDonors = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DONORS));
      return INITIAL_DONORS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_DONORS;
  } catch (error) {
    console.error('Error reading donors from localStorage:', error);
    return INITIAL_DONORS;
  }
};

/**
 * Save donors array to localStorage
 * @param {Array} donors 
 */
export const saveStoredDonors = (donors) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(donors));
  } catch (error) {
    console.error('Error saving donors to localStorage:', error);
  }
};
