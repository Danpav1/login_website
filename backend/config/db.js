// backend/config/db.js
const { Sequelize } = require('sequelize');
const path = require('path');

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../database.sqlite'),
  logging: false, // Disable logging; enable if needed
});

// Test the connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('SQLite connected successfully.');
  } catch (err) {
    console.error('Unable to connect to the database:', err);
    process.exit(1); // Exit process with failure
  }
};

module.exports = { connectDB, sequelize };

