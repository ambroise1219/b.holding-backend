const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const https = require('https');
const compression = require('compression');
const morgan = require('morgan');
const winston = require('winston');
require('dotenv').config();

const rentalRoutes = require('./routes/rentals');
const vehicleRoutes = require('./routes/vehicles');
const saleRoutes = require('./routes/sales');
const maintenanceRoutes = require('./routes/maintenances');
const stockPouletsRoutes = require('./routes/stock-poulets');
const ventesPouletsRoutes = require('./routes/ventes-poulets');
const orderRoutes = require('./routes/orders');
const livraisonRoutes = require('./routes/livraisons');

const app = express();

// Logger configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://bholding.vercel.app',
      'http://localhost:3000',
      'https://b-holding-backend.onrender.com'
    ];
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(compression()); // Add compression
app.use(morgan('tiny')); // Add efficient logging
app.use(express.static('public', { maxAge: '1h' })); // Cache static responses

// Custom logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`, { 
    ip: req.ip, 
    userAgent: req.get('User-Agent') 
  });
  next();
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  poolSize: 10 // Increase connection pool for better performance
}).then(() => logger.info('Connected to MongoDB'))
  .catch(err => logger.error('Could not connect to MongoDB', err));

// Reconnect to MongoDB if disconnected
mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected. Attempting to reconnect...');
  mongoose.connect(process.env.MONGODB_URI, { autoReconnect: true });
});

// Routes
app.use('/api/rentals', rentalRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/maintenances', maintenanceRoutes);
app.use('/api/stock-poulets', stockPouletsRoutes);
app.use('/api/ventes-poulets', ventesPouletsRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/livraisons', livraisonRoutes);

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server test route works' });
});

// Ping route
app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// 404 Route
app.use((req, res) => {
  res.status(404).json({ message: "Sorry, can't find that!" });
});

const PORT = process.env.PORT || 10000;
const server = app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
  logger.info(`Server URL: https://b-holding-backend.onrender.com`);
});

// Keep the server alive
function keepAlive() {
  https.get('https://b-holding-backend.onrender.com/ping', (resp) => {
    if (resp.statusCode === 200) {
      logger.info('Server kept alive at ' + new Date().toISOString());
    } else {
      logger.warn('Failed to keep server alive:', resp.statusCode);
    }
  }).on('error', (err) => {
    logger.error('Error in keep-alive ping:', err.message);
  });
}

// Execute the keepAlive function every 14 minutes
const FOURTEEN_MINUTES = 14 * 60 * 1000;
setInterval(keepAlive, FOURTEEN_MINUTES);

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    mongoose.connection.close(false, () => {
      logger.info('MongoDB connection closed');
      process.exit(0);
    });
  });
});