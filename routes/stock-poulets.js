const express = require('express');
const router = express.Router();
const StockPoulet = require('../models/StockPoulet');

// GET tous les stocks de poulets
router.get('/', async (req, res) => {
  try {
    const stocks = await StockPoulet.find();
    res.json(stocks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST un nouveau stock de poulets
router.post('/', async (req, res) => {
  const stock = new StockPoulet({
    race: req.body.race,
    quantite: req.body.quantite,
    poids: req.body.poids,
    dateArrivee: req.body.dateArrivee,
    fournisseur: req.body.fournisseur,
    prixUnitaire: req.body.prixUnitaire,
    statut: req.body.statut,
    notes: req.body.notes
  });
try {
    const newStock = await stock.save();
    res.status(201).json(newStock);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET un stock de poulets spécifique
router.get('/:id', getStock, (req, res) => {
  res.json(res.stock);
});

// PUT (update) un stock de poulets
router.put('/:id', getStock, async (req, res) => {
  if (req.body.race != null) {
    res.stock.race = req.body.race;
  }
  if (req.body.quantite != null) {
    res.stock.quantite = req.body.quantite;
  }
  if (req.body.poids != null) {
    res.stock.poids = req.body.poids;
  }
  if (req.body.dateArrivee != null) {
    res.stock.dateArrivee = req.body.dateArrivee;
  }
  if (req.body.fournisseur != null) {
    res.stock.fournisseur = req.body.fournisseur;
  }
  if (req.body.prixUnitaire != null) {
    res.stock.prixUnitaire = req.body.prixUnitaire;
  }
  if (req.body.statut != null) {
    res.stock.statut = req.body.statut;
  }
  if (req.body.notes != null) {
    res.stock.notes = req.body.notes;
  }
  try {
    const updatedStock = await res.stock.save();
    res.json(updatedStock);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE un stock de poulets
router.delete('/:id', getStock, async (req, res) => {
  try {
    await StockPoulet.deleteOne({ _id: req.params.id });
    res.json({ message: 'Stock de poulets supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware function pour obtenir un stock par ID
async function getStock(req, res, next) {
  let stock;
  try {
    stock = await StockPoulet.findById(req.params.id);
    if (stock == null) {
      return res.status(404).json({ message: 'Stock non trouvé' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.stock = stock;
  next();
}
module.exports = router;