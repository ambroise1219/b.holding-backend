const mongoose = require('mongoose');

const SaleSchema = new mongoose.Schema({
  dateVente: { type: Date, required: true },
  client: {
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    telephone: { type: String, required: true },
    email: { type: String, required: true }
  },
  vehicule: {
    marque: { type: String, required: true },
    modele: { type: String, required: true },
    annee: { type: Number, required: true },
    immatriculation: { type: String, required: true }
  },
  detailsVente: {
    prixVente: { type: Number, required: true },
    modeFinancement: { type: String, required: true, enum: ['Comptant', 'Crédit', 'Leasing'] },
    dureeFinancement: { type: Number },
    versementInitial: { type: Number }
  },
  vendeur: { type: String, required: true },
  commentaires: { type: String }
}, {
  timestamps: true
});

module.exports = mongoose.model('Sale', SaleSchema);