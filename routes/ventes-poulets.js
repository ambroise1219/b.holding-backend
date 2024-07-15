// ventePouletRoutes.js
const express = require('express');
const router = express.Router();
const VentePoulet = require('../models/VentePoulet');

// GET toutes les ventes de poulets
router.get('/', async (req, res) => {
  try {
    const ventes = await VentePoulet.find();
    res.json(ventes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST une nouvelle vente de poulets
router.post('/', async (req, res) => {
  const vente = new VentePoulet(req.body);
  try {
    const newVente = await vente.save();
    res.status(201).json(newVente);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET une vente de poulets spécifique
router.get('/:id', getVente, (req, res) => {
  res.json(res.vente);
});

// PUT (update) une vente de poulets
router.put('/:id', getVente, async (req, res) => {
  Object.assign(res.vente, req.body);
  try {
    const updatedVente = await res.vente.save();
    res.json(updatedVente);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE une vente de poulets
router.delete('/:id', async (req, res) => {
  try {
    const vente = await VentePoulet.findByIdAndDelete(req.params.id);
    if (!vente) {
      return res.status(404).json({ message: 'Vente non trouvée' });
    }
    res.json({ message: 'Vente supprimée avec succès', vente });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de la vente', error: error.message });
  }
});

// Middleware function pour obtenir une vente par ID
async function getVente(req, res, next) {
  try {
    const vente = await VentePoulet.findById(req.params.id);
    if (vente == null) {
      return res.status(404).json({ message: 'Vente non trouvée' });
    }
    res.vente = vente;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports = router;