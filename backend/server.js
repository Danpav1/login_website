// backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB, sequelize } = require('./config/db');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // React frontend address
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

// Connect to the database and sync models
const startServer = async () => {
  await connectDB();

  // Sync models (create tables if they don't exist)
  await sequelize.sync({ alter: true });

  const PORT = process.env.PORT || 10000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();

