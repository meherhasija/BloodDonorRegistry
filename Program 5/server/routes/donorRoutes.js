/**
 * Donor Routes
 * Defines REST API routes for donor management.
 */

const express = require('express');
const router = express.Router();
const {
  getAllDonors,
  getDonorById,
  createDonor,
  updateDonor,
  deleteDonor
} = require('../controllers/donorController');

// /api/donors
router.route('/')
  .get(getAllDonors)
  .post(createDonor);

// /api/donors/:id
router.route('/:id')
  .get(getDonorById)
  .put(updateDonor)
  .delete(deleteDonor);

module.exports = router;
