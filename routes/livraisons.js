const express = require('express');
const router = express.Router();
const Livraison = require('../models/Livraison');

// Middleware pour récupérer une livraison par ID
async function getLivraison(req, res, next) {
  let livraison;
  try {
    livraison = await Livraison.findById(req.params.id);
    if (livraison == null) {
      return res.status(404).json({ message: 'Livraison non trouvée' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.livraison = livraison;
  next();
}

// GET toutes les livraisons
router.get('/', async (req, res) => {
  try {
    const livraisons = await Livraison.find();
    res.json(livraisons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST une nouvelle livraison
router.post('/', async (req, res) => {
  const livraison = new Livraison(req.body);
  try {
    const newLivraison = await livraison.save();
    res.status(201).json(newLivraison);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET une livraison spécifique
router.get('/:id', getLivraison, (req, res) => {
  res.json(res.livraison);
});

// UPDATE une livraison
router.put('/:id', getLivraison, async (req, res) => {
  Object.assign(res.livraison, req.body);
  try {
    const updatedLivraison = await res.livraison.save();
    res.json(updatedLivraison);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE une livraison
router.delete('/:id', getLivraison, async (req, res) => {
  try {
    await res.livraison.deleteOne();
    res.json({ message: 'Livraison supprimée' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
