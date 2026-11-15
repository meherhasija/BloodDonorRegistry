const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const USERS_FILE = path.join(__dirname, '..', 'data', 'users.json');

/**
 * Helper to safely read users from JSON file
 */
const readUsersFromFile = () => {
  try {
    if (!fs.existsSync(USERS_FILE)) {
      fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2), 'utf8');
      return [];
    }
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    if (!data.trim()) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users file:', error.message);
    throw new Error('Could not read user data storage.');
  }
};

/**
 * Helper to safely write users to JSON file
 */
const writeUsersToFile = (users) => {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing users file:', error.message);
    throw new Error('Could not persist user data storage.');
  }
};

/**
 * POST /api/auth/register
 * Registers a new user and hashes password with bcrypt
 */
const register = async (req, res, next) => {
  try {
    const { username, password, email, fullName, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required.'
      });
    }

    const users = readUsersFromFile();

    // Check if user already exists
    const existingUser = users.find(
      (u) =>
        u.username.toLowerCase() === username.trim().toLowerCase() ||
        (email && u.email && u.email.toLowerCase() === email.trim().toLowerCase())
    );

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Username or email is already registered.'
      });
    }

    // Hash password with bcrypt (10 salt rounds) - never store plain text!
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const maxId = users.reduce((max, u) => (u.id > max ? u.id : max), 0);
    const newId = maxId + 1;

    const newUser = {
      id: newId,
      username: username.trim(),
      email: email ? email.trim() : `${username.trim()}@bloodregistry.org`,
      password: hashedPassword, // Storing only hashed password
      fullName: fullName ? fullName.trim() : username.trim(),
      role: role || 'user',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    writeUsersToFile(users);

    // Return safe user details (excluding password)
    const { password: _, ...safeUserDetails } = newUser;

    res.status(201).json({
      success: true,
      message: 'User registered successfully with hashed password.',
      data: safeUserDetails
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 * Verifies credentials, compares password with bcrypt, and signs a JWT
 */
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both username and password.'
      });
    }

    const users = readUsersFromFile();

    // Find user by username or email
    const user = users.find(
      (u) =>
        u.username.toLowerCase() === username.trim().toLowerCase() ||
        (u.email && u.email.toLowerCase() === username.trim().toLowerCase())
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password.'
      });
    }

    // Compare supplied password with bcrypt hashed password in database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password.'
      });
    }

    // Generate JWT token
    const secret = process.env.JWT_SECRET || 'blood_donor_registry_secret_key_2026_secure';
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    };

    const token = jwt.sign(payload, secret, { expiresIn: '1h' });

    res.status(200).json({
      success: true,
      message: 'Authentication successful. JWT generated.',
      token: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/protected
 * Protected route accessible only with valid JWT token
 */
const getProtected = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Access granted! You have reached the protected Blood Donor Registry route.',
    authenticatedUser: req.user
  });
};

module.exports = {
  register,
  login,
  getProtected
};
