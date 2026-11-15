const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateUserRegistration } = require('../middleware/validation');

/**
 * Routes for Authentication
 * Base URL: /api/auth
 */

// POST /api/auth/register - Register a new user
router.post('/register', validateUserRegistration, authController.register);

// POST /api/auth/login - Login user and issue JWT
router.post('/login', authController.login);

module.exports = router;
