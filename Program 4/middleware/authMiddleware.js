const jwt = require('jsonwebtoken');

/**
 * Authentication Middleware
 * Verifies JWT token passed in the Authorization header (Bearer scheme)
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // Check if Authorization header is present
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authentication token provided. Please include Authorization header.'
    });
  }

  // Extract the token (supporting 'Bearer <token>' or raw token)
  let token = authHeader;
  if (authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7).trim();
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Bearer token is missing.'
    });
  }

  const secret = process.env.JWT_SECRET || 'blood_donor_registry_secret_key_2026_secure';

  // Verify the JWT token
  jwt.verify(token, secret, (err, decodedUser) => {
    if (err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token. Authentication failed.',
        error: err.message
      });
    }

    // Attach decoded token payload (e.g. user id, username, role) to req.user
    req.user = decodedUser;
    next();
  });
};

module.exports = authenticateToken;
