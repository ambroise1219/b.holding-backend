const express = require('express');
const router = express.Router();
const Rental = require('../models/Rental');

// Obtenir toutes les locations
router.get('/', async (req, res) => {
  try {
    const rentals = await Rental.find();
    res.json(rentals);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des locations', error: error.message });
  }
});

// Obtenir une location spécifique
router.get('/:id', async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) {
      return res.status(404).json({ message: 'Location non trouvée' });
    }
    res.json(rental);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de la location', error: error.message });
  }
});

// Créer une nouvelle location
router.post('/', async (req, res) => {
  try {
    const newRental = new Rental(req.body);
    const savedRental = await newRental.save();
    res.status(201).json(savedRental);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la création de la location', error: error.message });
  }
});

// Mettre à jour une location
router.put('/:id', async (req, res) => {
  try {
    const updatedRental = await Rental.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedRental) {
      return res.status(404).json({ message: 'Location non trouvée' });
    }
    res.json(updatedRental);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la mise à jour de la location', error: error.message });
  }
});

// Supprimer une location
router.delete('/:id', async (req, res) => {
  try {
    const rental = await Rental.findByIdAndDelete(req.params.id);
    if (!rental) {
      return res.status(404).json({ message: 'Location non trouvée' });
    }
    res.json({ message: 'Location supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de la location', error: error.message });
  }
});

module.exports = router;