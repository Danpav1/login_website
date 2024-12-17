// backend/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  // Get token from headers
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by ID from token
    const user = await User.findByPk(decoded.id, { attributes: ['id', 'name', 'email'] });

    if (!user) {
      return res.status(401).json({ message: 'Authorization denied. User not found.' });
    }

    // Attach user to request object
    req.user = user;

    // Proceed to next middleware or route handler
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    res.status(401).json({ message: 'Authorization denied. Token is invalid.' });
  }
};

module.exports = authMiddleware;

