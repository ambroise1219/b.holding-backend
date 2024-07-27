const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const compression = require('compression');
const helmet = require('helmet');
const https = require('https');
require('dotenv').config();

const routes = {
  rentals: require('./routes/rentals'),
  vehicles: require('./routes/vehicles'),
  sales: require('./routes/sales'),
  maintenances: require('./routes/maintenances'),
  stockPoulets: require('./routes/stock-poulets'),
  ventesPoulets: require('./routes/ventes-poulets'),
  orders: require('./routes/orders'),
  livraisons: require('./routes/livraisons')
};

const app = express();

// CORS configuration
const corsOptions = {
  origin: ['https://bholding.vercel.app', 'http://localhost:3000', 'https://b-holding-backend.onrender.com'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  });
}

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Routes
Object.entries(routes).forEach(([name, router]) => {
  app.use(`/api/${name}`, router);
});

// Test route
app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ 
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

// 404 Route
app.use((req, res) => {
  res.status(404).json({ message: "Sorry, can't find that!" });
});

// Determine if we're running on Render.com or locally
const isRender = process.env.RENDER === 'true';
const PORT = process.env.PORT || (isRender ? 10000 : 5000);

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Server URL: ${isRender ? 'https://b-holding-backend.onrender.com' : `http://localhost:${PORT}`}`);
});

if (isRender) {
  // Keep the server alive
  function keepAlive() {
    https.get('https://b-holding-backend.onrender.com/ping', (resp) => {
      if (resp.statusCode === 200) {
        console.log('Server kept alive at', new Date().toISOString());
      } else {
        console.log('Failed to keep server alive:', resp.statusCode);
      }
    }).on('error', (err) => {
      console.log('Error in keep-alive ping:', err.message);
    });
  }

  // Execute the keepAlive function every 14 minutes
  const FOURTEEN_MINUTES = 14 * 60 * 1000;
  setInterval(keepAlive, FOURTEEN_MINUTES);
}

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

module.exports = app;