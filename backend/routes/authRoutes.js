// backend/routes/authRoutes.js
const express = require('express');
const { register, login } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', login);

// @route   GET /api/auth/dashboard
// @desc    Get dashboard data (protected)
// @access  Private
router.get('/dashboard', authMiddleware, (req, res) => {
  res.status(200).json({ message: 'You have logged in!' });
});

module.exports = router;

