// src/config/email.js
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

// Destructure SMTP configuration from environment variables
const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_SECURE,
  SMTP_USER,
  SMTP_PASS,
  EMAIL_FROM,
} = process.env;

// Debug Logs to Confirm Configuration
console.log('SMTP Configuration:');
console.log(`Host: ${SMTP_HOST}`);
console.log(`Port: ${SMTP_PORT}`);
console.log(`Secure: ${SMTP_SECURE}`);
console.log(`User: ${SMTP_USER}`);
console.log(`Email From: ${EMAIL_FROM}`);

// Validate essential SMTP configurations
if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !EMAIL_FROM) {
  console.error('Error: Missing essential SMTP configuration in .env file.');
  process.exit(1);
}

// Create the Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: SMTP_HOST, // 'smtp.gmail.com' for Gmail
  port: parseInt(SMTP_PORT, 10), // 587
  secure: SMTP_SECURE === 'true', // false for port 587
  auth: {
    user: SMTP_USER, // 'danpav1projects@gmail.com'
    pass: SMTP_PASS, // Your Gmail App Password
  },
  // Enable debug and logger for detailed logs
  debug: true,
  logger: true,
});

// Verify the transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Email transporter configuration error:', error);
  } else {
    console.log('Email transporter is ready.');
  }
});

module.exports = transporter;
