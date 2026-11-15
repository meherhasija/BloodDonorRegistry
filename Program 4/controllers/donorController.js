const fs = require('fs');
const path = require('path');

const DONORS_FILE = path.join(__dirname, '..', 'data', 'donors.json');

/**
 * Helper to safely read donors from JSON file
 */
const readDonorsFromFile = () => {
  try {
    if (!fs.existsSync(DONORS_FILE)) {
      fs.writeFileSync(DONORS_FILE, JSON.stringify([], null, 2), 'utf8');
      return [];
    }
    const data = fs.readFileSync(DONORS_FILE, 'utf8');
    if (!data.trim()) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading donors file:', error.message);
    throw new Error('Could not read donor data storage.');
  }
};

/**
 * Helper to safely write donors to JSON file
 */
const writeDonorsToFile = (donors) => {
  try {
    fs.writeFileSync(DONORS_FILE, JSON.stringify(donors, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing donors file:', error.message);
    throw new Error('Could not persist donor data storage.');
  }
};

/**
 * GET /api/donors
 * Retrieve all registered donors (with optional query filters: bloodGroup, city, availabilityStatus)
 */
const getAllDonors = (req, res, next) => {
  try {
    let donors = readDonorsFromFile();

    const { bloodGroup, city, availabilityStatus } = req.query;

    if (bloodGroup) {
      donors = donors.filter(
        (d) => d.bloodGroup.toUpperCase() === bloodGroup.trim().toUpperCase()
      );
    }
    if (city) {
      donors = donors.filter(
        (d) => d.city.toLowerCase() === city.trim().toLowerCase()
      );
    }
    if (availabilityStatus) {
      donors = donors.filter(
        (d) => d.availabilityStatus.toLowerCase() === availabilityStatus.trim().toLowerCase()
      );
    }

    res.status(200).json({
      success: true,
      count: donors.length,
      data: donors
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/donors/:id
 * Retrieve a single donor by ID
 */
const getDonorById = (req, res, next) => {
  try {
    const donors = readDonorsFromFile();
    const donorId = req.params.id;

    const donor = donors.find((d) => String(d.id) === String(donorId));

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: `Donor with ID ${donorId} not found.`
      });
    }

    res.status(200).json({
      success: true,
      data: donor
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/donors
 * Register a new donor
 */
const createDonor = (req, res, next) => {
  try {
    const donors = readDonorsFromFile();
    const {
      fullName,
      age,
      gender,
      bloodGroup,
      phoneNumber,
      city,
      availabilityStatus
    } = req.body;

    // Generate auto-incrementing ID
    const maxId = donors.reduce((max, d) => (d.id > max ? d.id : max), 0);
    const newId = maxId + 1;

    const newDonor = {
      id: newId,
      fullName,
      age,
      gender,
      bloodGroup,
      phoneNumber,
      city,
      availabilityStatus: availabilityStatus || 'Available'
    };

    donors.push(newDonor);
    writeDonorsToFile(donors);

    res.status(201).json({
      success: true,
      message: 'New blood donor registered successfully.',
      data: newDonor
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/donors/:id
 * Update an existing donor's details
 */
const updateDonor = (req, res, next) => {
  try {
    const donors = readDonorsFromFile();
    const donorId = req.params.id;

    const index = donors.findIndex((d) => String(d.id) === String(donorId));

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: `Donor with ID ${donorId} not found.`
      });
    }

    const {
      fullName,
      age,
      gender,
      bloodGroup,
      phoneNumber,
      city,
      availabilityStatus
    } = req.body;

    // Update fields while retaining the original ID
    donors[index] = {
      id: donors[index].id,
      fullName,
      age,
      gender,
      bloodGroup,
      phoneNumber,
      city,
      availabilityStatus
    };

    writeDonorsToFile(donors);

    res.status(200).json({
      success: true,
      message: `Donor with ID ${donorId} updated successfully.`,
      data: donors[index]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/donors/:id
 * Delete a donor by ID
 */
const deleteDonor = (req, res, next) => {
  try {
    const donors = readDonorsFromFile();
    const donorId = req.params.id;

    const index = donors.findIndex((d) => String(d.id) === String(donorId));

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: `Donor with ID ${donorId} not found.`
      });
    }

    const deletedDonor = donors.splice(index, 1)[0];
    writeDonorsToFile(donors);

    res.status(200).json({
      success: true,
      message: `Donor with ID ${donorId} deleted successfully.`,
      data: deletedDonor
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDonors,
  getDonorById,
  createDonor,
  updateDonor,
  deleteDonor
};
