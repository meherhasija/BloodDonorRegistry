/**
 * Stats Routes
 * Route for retrieving donor statistics for dashboard.
 */

const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/donorController');

// /api/stats
router.get('/', getStats);

module.exports = router;
