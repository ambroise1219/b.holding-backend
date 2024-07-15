const mongoose = require('mongoose');

const stockPouletSchema = new mongoose.Schema({
  race: {
    type: String,
    required: true
  },
  quantite: {
    type: Number,
    required: true,
    min: 0
  },
  poids: {
    type: Number,
    required: true,
    min: 0
  },
  dateArrivee: {
    type: Date,
    required: true,
    default: Date.now
  },
  fournisseur: {
    type: String,
    required: true
  },
  prixUnitaire: {
    type: Number,
    required: true,
    min: 0
  },
  statut: {
    type: String,
    required: true,
    enum: ['En stock', 'Vendu', 'Perdu']
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('StockPoulet', stockPouletSchema);