const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  available: { type: Boolean, default: true },
  licensePlate: { type: String, unique: true, required: true }, // Ajout de licensePlate
  specs: {
    engine: String,
    power: String,
    transmission: String,
    fuelType: String,
    fuelConsumption: String,
    acceleration: String,
    seats: Number,
    payloadCapacity: String,
    groundClearance: String,
    loadVolume: String,
    trunkCapacity: String,
    features: [String]
  },
  additionalImages: [String]
}, {
  timestamps: true
});

module.exports = mongoose.model('Vehicle', VehicleSchema);
