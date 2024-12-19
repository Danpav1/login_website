// src/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB, sequelize } = require('./config/db');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Frontend address and port
  methods: ['GET', 'POST'],
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error' });
});

// Function to start the server
const startServer = async () => {
  try {
    await connectDB();

    // Sync models (create tables if they don't exist)
    await sequelize.sync({ alter: true });

    const PORT = process.env.PORT || 10000;
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    // Graceful Shutdown Function
    const gracefulShutdown = async (signal) => {
      console.log(`\nReceived ${signal}. Initiating graceful shutdown...`);

      // Stop accepting new connections
      server.close(async (err) => {
        if (err) {
          console.error('Error closing the server:', err);
          process.exit(1);
        }

        try {
          // Close the database connection
          await sequelize.close();
          console.log('Database connection closed.');

          console.log('Graceful shutdown complete. Exiting now.');
          process.exit(0);
        } catch (dbError) {
          console.error('Error closing the database connection:', dbError);
          process.exit(1);
        }
      });

      // Force shutdown after 10 seconds if not closed
      setTimeout(() => {
        console.error('Could not close connections in time, forcing shutdown.');
        process.exit(1);
      }, 10000);
    };

    // Listen for termination signals
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  } catch (error) {
    console.error('Failed to start the server:', error);
    process.exit(1);
  }
};

startServer();

