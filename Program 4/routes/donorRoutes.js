const express = require('express');
const router = express.Router();
const donorController = require('../controllers/donorController');
const { validateDonor } = require('../middleware/validation');

/**
 * Routes for Blood Donor CRUD Operations
 * Base URL: /api/donors
 */

// GET /api/donors - Retrieve all registered donors
router.get('/', donorController.getAllDonors);

// GET /api/donors/:id - Retrieve a specific donor by ID
router.get('/:id', donorController.getDonorById);

// POST /api/donors - Register a new donor (with input validation)
router.post('/', validateDonor, donorController.createDonor);

// PUT /api/donors/:id - Update an existing donor (with input validation)
router.put('/:id', validateDonor, donorController.updateDonor);

// DELETE /api/donors/:id - Delete a donor by ID
router.delete('/:id', donorController.deleteDonor);

module.exports = router;
