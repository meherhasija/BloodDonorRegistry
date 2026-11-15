/**
 * Database Configuration & Connection
 * Connects the Express backend to MongoDB Atlas using Mongoose.
 */

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;

    if (!uri || uri.includes('<username>') || uri.includes('<password>')) {
      console.warn('\n======================================================');
      console.warn('⚠️  MONGODB_URI is not configured with valid credentials!');
      console.warn('Please update "server/.env" with your actual MongoDB Atlas');
      console.warn('connection string to persist data to the cloud.');
      console.warn('Example: MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/blood_donor_registry');
      console.warn('======================================================\n');
    }

    const conn = await mongoose.connect(uri || 'mongodb://127.0.0.1:27017/blood_donor_registry');

    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host} (${conn.connection.name})`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('Make sure your MongoDB Atlas cluster is active, IP whitelist allows 0.0.0.0/0, and credentials are correct.');
    // Don't kill process in test environment, but exit in production/dev
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
    throw error;
  }
};

module.exports = connectDB;
