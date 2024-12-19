const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const transporter = require('../config/email');
const { Op } = require('sequelize');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    console.log('Register request data:', req.body);
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    // Normalize email to ensure consistency
    const normalizedEmail = email.toLowerCase().trim();

    let user = await User.findOne({ where: { email: normalizedEmail } });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log('Login request data:', req.body);
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ where: { email: normalizedEmail } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

exports.dashboard = async (req, res) => {
  try {
    console.log('Dashboard request by user ID:', req.user.id);
    const user = req.user;
    res.json({
      message: `Welcome to your dashboard, ${user.name}!`,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error while fetching dashboard data' });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    console.log('Forgot Password request data:', req.body);
    if (!email) {
      return res.status(400).json({ message: 'Please provide your email address' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    console.log('Normalized email being searched:', normalizedEmail);

    // Debug: Log all users to see what exists
    const allUsers = await User.findAll();
    console.log('All Users in DB:', allUsers.map(u => ({ id: u.id, email: u.email })));

    const user = await User.findOne({ where: { email: normalizedEmail } });
    if (!user) {
      console.log('No user found with email:', normalizedEmail);
      return res.status(200).json({ message: 'If that email is registered, an OTP has been sent.' });
    }

    console.log(`User found: ${user.email}. Proceeding to send OTP.`);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOTP = otp;
    user.resetOTPExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    const mailOptions = {
      from: `"Your App Name" <${process.env.EMAIL_FROM}>`,
      to: user.email,
      subject: 'Password Reset OTP',
      text: `You requested a password reset. Your OTP is: ${otp}. It is valid for 10 minutes.`,
      html: `<p>You requested a password reset. Your OTP is: <strong>${otp}</strong>. It is valid for <strong>10 minutes</strong>.</p>`,
    };

    console.log('Attempting to send forgot password email...');
    await transporter.sendMail(mailOptions);
    console.log('Email for forgot password sent successfully.');

    res.status(200).json({ message: 'If that email is registered, an OTP has been sent.' });
  } catch (error) {
    console.error('Forgot Password error:', error);
    res.status(500).json({ message: 'An unexpected error occurred. Please try again.' });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    console.log('Reset Password request data:', req.body);
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'Invalid request' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({
      where: {
        email: normalizedEmail,
        resetOTP: otp,
        resetOTPExpires: { [Op.gt]: Date.now() },
      },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    user.password = hashedPassword;
    user.resetOTP = null;
    user.resetOTPExpires = null;
    await user.save();

    const mailOptions = {
      from: `"Danpav1 - User Auth. Project" <${process.env.EMAIL_FROM}>`,
      to: user.email,
      subject: 'Your Password Has Been Reset',
      text: `Hello,\n\nThis is a confirmation that the password for your account ${user.email} has just been changed.\n`,
      html: `<p>Hello,</p><p>This is a confirmation that the password for your account ${user.email} has just been changed.</p>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Your password has been successfully reset.' });
  } catch (error) {
    console.error('Reset Password error:', error);
    res.status(500).json({ message: 'An unexpected error occurred. Please try again.' });
  }
};
