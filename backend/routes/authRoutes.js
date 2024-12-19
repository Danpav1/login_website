// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticate = require('../middlewares/authMiddleware');

// Registration Route
router.post('/register', authController.register);

// Login Route
router.post('/login', authController.login);

// Dashboard Route (Protected)
router.get('/dashboard', authenticate, authController.dashboard);

// Forgot Password Route
router.post('/forgot-password', authController.forgotPassword);

// Reset Password Route
router.post('/reset-password', authController.resetPassword);

module.exports = router;
