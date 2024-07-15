const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
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

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://dashboard-58shx55uj-ambroises-projects-be2c50f6.vercel.app',
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

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} request to ${req.url}`);
  next();
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));

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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// 404 Route
app.use((req, res, next) => {
  res.status(404).send("Sorry, can't find that!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});