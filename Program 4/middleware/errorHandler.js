/**
 * Centralized Error Handling Middlewares
 */

/**
 * 404 Not Found Handler for undefined routes
 */
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Resource not found: Cannot ${req.method} ${req.originalUrl}`
  });
};

/**
 * Centralized Error Handler Middleware
 * Express recognizes error-handling middleware by exactly four arguments: (err, req, res, next)
 */
const errorHandler = (err, req, res, next) => {
  console.error('[Centralized Error Handler]:', err.message || err);

  // 1. JSON parsing syntax error
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'Malformed JSON payload in request body.'
    });
  }

  // 2. JWT related errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid authentication token.',
      error: err.message
    });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Authentication token has expired. Please log in again.',
      error: err.message
    });
  }

  // 3. Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: err.message || 'Validation error occurred.',
      errors: err.errors || []
    });
  }

  // 4. Default / custom status errors
  const statusCode = err.statusCode || (res.statusCode && res.statusCode !== 200 ? res.statusCode : 500);
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message: message
  });
};

module.exports = {
  notFoundHandler,
  errorHandler
};
