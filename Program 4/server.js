/**
 * Blood Donor Registry System - REST API
 * Program 4 - Full Stack Development Practical Assignment
 * Technology: Node.js, Express.js, JWT and bcrypt
 * Course Outcome: CO5
 */

require('dotenv').config();
const express = require('express');
const path = require('path');

// Import Middlewares
const requestLogger = require('./middleware/logger');
const authenticateToken = require('./middleware/authMiddleware');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

// Import Routes
const donorRoutes = require('./routes/donorRoutes');
const authRoutes = require('./routes/authRoutes');
const authController = require('./controllers/authController');

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 4000;

// ==========================================
// 1. GLOBAL MIDDLEWARE
// ==========================================

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Custom Request Logging Middleware
app.use(requestLogger);

// ==========================================
// 2. ROOT & HEALTH CHECK ROUTE
// ==========================================
app.get('/', (req, res) => {
  res.status(200).json({
    project: 'Blood Donor Registry System',
    program: 'Program 4 - REST API with Express.js, JWT and bcrypt',
    courseOutcome: 'CO5',
    status: 'Server is running',
    port: PORT,
    endpoints: {
      donors: {
        'GET /api/donors': 'Retrieve all registered donors (supports ?bloodGroup, ?city, ?availabilityStatus)',
        'GET /api/donors/:id': 'Retrieve a particular donor by ID',
        'POST /api/donors': 'Register a new donor (with input validation)',
        'PUT /api/donors/:id': 'Update an existing donor (with input validation)',
        'DELETE /api/donors/:id': 'Delete a donor by ID'
      },
      auth: {
        'POST /api/auth/register': 'Register a new user (password hashed with bcrypt)',
        'POST /api/auth/login': 'Verify credentials with bcrypt and return JWT token',
        'GET /api/protected': 'Access protected route (Requires Authorization: Bearer <token>)'
      }
    }
  });
});

// ==========================================
// 3. API ROUTES
// ==========================================

// Blood Donor CRUD Routes
app.use('/api/donors', donorRoutes);

// Authentication Routes (register, login)
app.use('/api/auth', authRoutes);

// Protected Route (Requires Valid JWT)
app.get('/api/protected', authenticateToken, authController.getProtected);

// ==========================================
// 4. ERROR HANDLING MIDDLEWARE
// ==========================================

// Catch-all 404 handler for undefined routes
app.use(notFoundHandler);

// Centralized error handling middleware
app.use(errorHandler);

// ==========================================
// 5. SERVER INITIALIZATION
// ==========================================
const server = app.listen(PORT, () => {
  console.log('====================================================');
  console.log(` Blood Donor Registry REST API Server Running`);
  console.log(` Port: ${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(` Base URL: http://localhost:${PORT}`);
  console.log('====================================================');
});

// Export app and server for programmatic testing
module.exports = { app, server };
