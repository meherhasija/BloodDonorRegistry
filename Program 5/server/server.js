
/**
 * Blood Donor Registry System - REST API Server
 * Program 5 - Full Stack Development Practical Assignment
 * Technology: Node.js, Express.js, MongoDB Atlas, Mongoose, CORS
 * Course Outcome: CO6
 */

require('dns').setServers(['8.8.8.8', '8.8.4.4']);

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const donorRoutes = require('./routes/donorRoutes');
const statsRoutes = require('./routes/statsRoutes');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Database (only if not running under automated tests)
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

// ==========================================
// 1. CORS CONFIGURATION
// ==========================================
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  process.env.CLIENT_URL
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (such as mobile apps, Postman, curl, or server-to-server)
    if (!origin) return callback(null, true);

    // In production or development, check if origin is allowed or allow all if wild-carded
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
      return callback(null, true);
    }
    return callback(new Error('Blocked by CORS policy: Origin not allowed.'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// ==========================================
// 2. BODY PARSING MIDDLEWARE
// ==========================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple request logger for debugging
app.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  }
  next();
});

// ==========================================
// 3. ROOT & API HEALTH CHECK
// ==========================================
app.get('/', (req, res) => {
  res.status(200).json({
    project: 'Blood Donor Registry System',
    program: 'Program 5 - Full Stack MERN Application',
    courseOutcome: 'CO6',
    status: 'Server is running healthy',
    port: PORT,
    endpoints: {
      donors: {
        'GET /api/donors': 'Retrieve all registered donors (supports ?search, ?bloodGroup, ?city, ?availabilityStatus)',
        'GET /api/donors/:id': 'Retrieve a single donor by ID',
        'POST /api/donors': 'Register a new donor',
        'PUT /api/donors/:id': 'Update existing donor details',
        'DELETE /api/donors/:id': 'Delete donor record'
      },
      stats: {
        'GET /api/stats': 'Retrieve summary stats and blood group breakdown'
      }
    }
  });
});

// ==========================================
// 4. API ROUTES
// ==========================================
app.use('/api/donors', donorRoutes);
app.use('/api/stats', statsRoutes);

// ==========================================
// 5. ERROR HANDLING MIDDLEWARE
// ==========================================
app.use(notFoundHandler);
app.use(errorHandler);

// ==========================================
// 6. SERVER INITIALIZATION
// ==========================================
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`======================================================`);
    console.log(`Program 5 Backend Server running on port ${PORT}`);
    console.log(`REST API URL: http://localhost:${PORT}/api/donors`);
    console.log(`Statistics URL: http://localhost:${PORT}/api/stats`);
    console.log(`======================================================`);
  });
}

module.exports = app;
