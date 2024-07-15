const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  typeProduit: {
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
  }
});

const orderSchema = new mongoose.Schema({
  numeroCommande: {
    type: String,
    unique: true,
  },
  dateCommande: {
    type: Date,
    required: true,
    default: Date.now
  },
  client: {
    type: String,
    required: true
  },
  telephoneFournisseur: {
    type: String,
    required: true
  },
  adresseLivraison: {
    type: String,
    required: true
  },
  dateLivraison: {
    type: Date,
    required: true
  },
  produits: [productSchema],
  modePaiement: {
    type: String,
    required: true,
    enum: ['Espèces', 'Virement', 'Chèque']
  },
  statut: {
    type: String,
    required: true,
    enum: ['Livrée', 'En attente', 'Annulé']
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2); 
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const prefix = `CMD-${day}${month}${year}`;

    const lastOrder = await this.constructor.findOne(
      { numeroCommande: new RegExp(`^${prefix}`) },
      {},
      { sort: { 'numeroCommande': -1 } }
    );

    let sequentialNumber = 1;
    if (lastOrder) {
      const lastNumber = parseInt(lastOrder.numeroCommande.split('-')[2]);
      sequentialNumber = lastNumber + 1;
    }

    const idSuffix = this._id.toString().slice(-2).toUpperCase();
    this.numeroCommande = `${prefix}-${String(sequentialNumber).padStart(3, '0')}-${idSuffix}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);