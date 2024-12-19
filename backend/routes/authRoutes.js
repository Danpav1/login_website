// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticate = require('../middlewares/authMiddleware');

// Public Routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/home')

// Protected Route
router.get('/dashboard', authenticate, authController.dashboard);

// Additional Protected Routes (if any) should use the 'authenticate' middleware
// Example:
// router.get('/profile', authenticate, authController.profile);

module.exports = router;

