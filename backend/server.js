require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const satelliteRoutes = require('./routes/satelliteRoutes');
const missionRoutes = require('./routes/missionRoutes');
const debrisRoutes = require('./routes/debrisRoutes');
const collisionRoutes = require('./routes/collisionRoutes');
const telemetryRoutes = require('./routes/telemetryRoutes');
const alertRoutes = require('./routes/alertRoutes');
const logRoutes = require('./routes/logRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// Import models for seed check
const Satellite = require('./models/Satellite');
const seedDatabase = require('./seed/seedData');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.use('/api/satellites', satelliteRoutes);
app.use('/api/missions', missionRoutes);
app.use('/api/debris', debrisRoutes);
app.use('/api/collisions', collisionRoutes);
app.use('/api/telemetry', telemetryRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'OrbitalShield API is running', timestamp: new Date() });
});

// Error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    // Auto-seed if database is empty
    const count = await Satellite.countDocuments();
    if (count === 0) {
      console.log('📡 Empty database detected. Seeding demo data...');
      await seedDatabase();
    }

    app.listen(PORT, () => {
      console.log(`\n🚀 OrbitalShield API Server running on port ${PORT}`);
      console.log(`   Health: http://localhost:${PORT}/api/health`);
      console.log(`   Environment: ${process.env.NODE_ENV || 'development'}\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
