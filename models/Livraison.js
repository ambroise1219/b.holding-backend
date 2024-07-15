const mongoose = require('mongoose');

const livraisonSchema = new mongoose.Schema({
  numeroLivraison: {
    type: String,
    unique: true,
  },
  dateLivraison: {
    type: Date,
    required: true,
  },
  client: {
    type: String,
    required: true,
  },
  telephoneClient: {
    type: String,
    required: true,
  },
  adresseLivraison: {
    type: String,
    required: true,
  },
  typeColis: {
    type: String,
    required: true,
  },
  poids: {
    type: Number,
    required: true,
  },
  distance: {
    type: Number,
    required: true,
  },
  fraisLivraison: {
    type: Number,
    required: true,
  },
  statut: {
    type: String,
    enum: ['En attente', 'En cours', 'Livrée', 'Annulée'],
    default: 'En attente',
  },
  notes: String,
}, {
  timestamps: true
});

livraisonSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await this.constructor.countDocuments();
    this.numeroLivraison = `LIV-${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Livraison', livraisonSchema);
