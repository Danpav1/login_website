// backend/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user by ID
      const user = await User.findByPk(decoded.id);

      if (!user) {
        return res.status(401).json({ message: 'Unauthorized: User not found' });
      }

      // Attach user to request object
      req.user = user;
      next();
    } catch (error) {
      console.error('Authentication error:', error);
      res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
  } else {
    res.status(401).json({ message: 'Unauthorized: No token provided' });
  }
};

module.exports = authenticate;

