const mongoose = require('mongoose');

const RentalSchema = new mongoose.Schema({
  client: { type: String, required: true },
  vehicle: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  amount: { type: Number, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Rental', RentalSchema);