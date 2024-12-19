// src/config/database.js
const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

const storagePath = process.env.DATABASE_STORAGE
  ? path.resolve(__dirname, '../../', process.env.DATABASE_STORAGE)
  : path.join(__dirname, '../../database.sqlite');

console.log('Using SQLite storage at:', storagePath); // Debugging line

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: storagePath,
  logging: false, // Disable logging; set to console.log to enable
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('SQLite connected successfully.');
  } catch (err) {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
  }
};

module.exports = { connectDB, sequelize };
