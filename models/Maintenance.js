const mongoose = require('mongoose');

const MaintenanceSchema = new mongoose.Schema({
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  typeIntervention: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  kilometrage: {
    type: Number,
    required: true
  },
  cout: {
    type: Number,
    required: true
  },
  technicien: {
    type: String,
    required: true
  },
  pieceChangees: String,
  notes: String,
  prochaineMaintenance: Date,
  statut: {
    type: String,
    enum: ['Planifié', 'En cours', 'Terminé'],
    required: true
  },
  vidangeHuile: Boolean,
  vidangeFiltre: Boolean,
  visiteEffectuee: Boolean,
  visiteResultat: {
    type: String,
    enum: ['Passée', 'Échouée', 'En attente']
  },
  entretienFreins: Boolean,
  entretienPneus: Boolean,
  entretienBatterie: Boolean,
  imageVehicule: String,
  imagesAnnexes: [String]
}, {
  timestamps: true
});

module.exports = mongoose.model('Maintenance', MaintenanceSchema);