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
  origin: [
    'https://dashboard-58shx55uj-ambroises-projects-be2c50f6.vercel.app',
    'http://localhost:3000' // Keep this for local development
  ],
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));