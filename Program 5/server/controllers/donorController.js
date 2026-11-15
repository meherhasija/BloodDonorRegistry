/**
 * Donor Controller
 * Implements business logic and CRUD operations with MongoDB Atlas via Mongoose.
 */

const mongoose = require('mongoose');
const Donor = require('../models/Donor');

const ALL_BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

/**
 * Helper to validate MongoDB ObjectId
 */
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * @desc   Get all donors (supports optional search, bloodGroup, city, availability filters)
 * @route  GET /api/donors
 * @access Public
 */
const getAllDonors = async (req, res, next) => {
  try {
    const { search, bloodGroup, city, availabilityStatus } = req.query;

    const filter = {};

    // Search query matches name or city
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [{ fullName: searchRegex }, { city: searchRegex }];
    }

    // Filter by specific blood group
    if (bloodGroup && bloodGroup.trim() !== 'All' && bloodGroup.trim() !== '') {
      filter.bloodGroup = bloodGroup.trim().toUpperCase();
    }

    // Filter by city
    if (city && city.trim() !== 'All' && city.trim() !== '') {
      filter.city = new RegExp(`^${city.trim()}$`, 'i');
    }

    // Filter by availability status
    if (availabilityStatus && availabilityStatus.trim() !== 'All' && availabilityStatus.trim() !== '') {
      filter.availabilityStatus = availabilityStatus.trim();
    }

    const donors = await Donor.find(filter).sort({ createdAt: -1 });

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
 * @desc   Get single donor by ID
 * @route  GET /api/donors/:id
 * @access Public
 */
const getDonorById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid donor ID format: ${id}`
      });
    }

    const donor = await Donor.findById(id);

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: `Donor with ID ${id} not found.`
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
 * @desc   Register a new donor
 * @route  POST /api/donors
 * @access Public
 */
const createDonor = async (req, res, next) => {
  try {
    const { fullName, age, gender, bloodGroup, phoneNumber, city, availabilityStatus } = req.body;

    const donor = await Donor.create({
      fullName,
      age: Number(age),
      gender,
      bloodGroup: bloodGroup ? bloodGroup.toUpperCase() : undefined,
      phoneNumber,
      city,
      availabilityStatus: availabilityStatus || 'Available'
    });

    res.status(201).json({
      success: true,
      message: 'Donor registered successfully!',
      data: donor
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Update an existing donor
 * @route  PUT /api/donors/:id
 * @access Public
 */
const updateDonor = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid donor ID format: ${id}`
      });
    }

    const updateData = { ...req.body };
    if (updateData.age) {
      updateData.age = Number(updateData.age);
    }
    if (updateData.bloodGroup) {
      updateData.bloodGroup = updateData.bloodGroup.toUpperCase();
    }

    const updatedDonor = await Donor.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    if (!updatedDonor) {
      return res.status(404).json({
        success: false,
        message: `Donor with ID ${id} not found.`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Donor record updated successfully!',
      data: updatedDonor
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Delete a donor
 * @route  DELETE /api/donors/:id
 * @access Public
 */
const deleteDonor = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid donor ID format: ${id}`
      });
    }

    const deletedDonor = await Donor.findByIdAndDelete(id);

    if (!deletedDonor) {
      return res.status(404).json({
        success: false,
        message: `Donor with ID ${id} not found.`
      });
    }

    res.status(200).json({
      success: true,
      message: `Donor "${deletedDonor.fullName}" deleted successfully!`,
      data: deletedDonor
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get donor statistics for dashboard
 * @route  GET /api/stats
 * @access Public
 */
const getStats = async (req, res, next) => {
  try {
    // Total donors count
    const totalDonors = await Donor.countDocuments();

    // Available and Unavailable counts
    const availableDonors = await Donor.countDocuments({ availabilityStatus: 'Available' });
    const unavailableDonors = await Donor.countDocuments({ availabilityStatus: 'Unavailable' });

    // Blood group aggregation
    const groupAggregation = await Donor.aggregate([
      {
        $group: {
          _id: '$bloodGroup',
          count: { $sum: 1 },
          availableCount: {
            $sum: { $cond: [{ $eq: ['$availabilityStatus', 'Available'] }, 1, 0] }
          }
        }
      }
    ]);

    // Format blood group stats ensuring all 8 blood groups exist in output
    const bloodGroupStats = ALL_BLOOD_GROUPS.reduce((acc, bg) => {
      const found = groupAggregation.find(item => item._id === bg);
      acc[bg] = {
        total: found ? found.count : 0,
        available: found ? found.availableCount : 0
      };
      return acc;
    }, {});

    // Recent 5 donor registrations
    const recentDonors = await Donor.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('fullName bloodGroup city availabilityStatus createdAt');

    // Distinct cities list
    const cities = await Donor.distinct('city');

    res.status(200).json({
      success: true,
      data: {
        totalDonors,
        availableDonors,
        unavailableDonors,
        bloodGroupStats,
        recentDonors,
        cities: cities.sort()
      }
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
  deleteDonor,
  getStats
};
