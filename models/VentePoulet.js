// ventePouletModel.js
const mongoose = require('mongoose');

const ventePouletSchema = new mongoose.Schema({
  dateVente: {
    type: Date,
    required: true,
    default: Date.now
  },
  client: {
    nom: {
      type: String,
      required: true
    },
    telephone: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    }
  },
  typePoulet: {
    type: String,
    required: true
  },
  quantite: {
    type: Number,
    required: true,
    min: 1
  },
  prixUnitaire: {
    type: Number,
    required: true,
    min: 0
  },
  montantTotal: {
    type: Number,
    required: true,
    min: 0
  },
  modePaiement: {
    type: String,
    required: true,
    enum: ['Espèces', 'Carte bancaire', 'Virement']
  },
  statut: {
    type: String,
    required: true,
    enum: ['Payé', 'En attente', 'Annulé']
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('VentePoulet', ventePouletSchema);