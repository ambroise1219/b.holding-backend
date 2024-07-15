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
      'https://dashboard-eight-smoky-78.vercel.app/',
      'http://localhost:3000',
      'https://b-holding-backend.onrender.com',
      process.env.PROJECT_DOMAIN ? `https://${process.env.PROJECT_DOMAIN}.glitch.me` : null
    ].filter(Boolean);

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Server URL: ${process.env.PROJECT_DOMAIN ? `https://${process.env.PROJECT_DOMAIN}.glitch.me` : 'http://localhost:' + PORT}`);
});

// Keep the server alive
setInterval(() => {
  console.log("Keeping the server alive...");
}, 280000); // Ping every 4 minutes and 40 seconds