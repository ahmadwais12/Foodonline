const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Protect routes - check if user is authenticated
exports.protect = async (req, res, next) => {
  try {
    // Check session first
    if (req.session && req.session.isAuthenticated && req.session.userId) {
      // Get user from session
      const [users] = await db.execute(
        'SELECT id, email, username, role FROM users WHERE id = ?',
        [req.session.userId]
      );

      if (users.length > 0) {
        req.user = users[0];
        next();
        return;
      }
    }

    // If no valid session, check JWT token
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Make sure token exists
    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authorized to access this route'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');

    // Check if user still exists
    const [users] = await db.execute(
      'SELECT id, email, username, role FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (users.length === 0) {
      return res.status(401).json({
        status: 'error',
        message: 'The user belonging to this token no longer exists'
      });
    }

    // Grant access to protected route
    req.user = users[0];
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({
      status: 'error',
      message: 'Not authorized to access this route'
    });
  }
};

// Restrict to specific roles
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to perform this action'
      });
    }
    next();
  };
};