const express = require('express');
const router = express.Router();
const Maintenance = require('../models/Maintenance');
const Vehicle = require('../models/Vehicle');

// Get all maintenances
router.get('/', async (req, res) => {
  try {
    const maintenances = await Maintenance.find().populate('vehicle', 'name licensePlate');
    res.json(maintenances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific maintenance
router.get('/:id', async (req, res) => {
  try {
    const maintenance = await Maintenance.findById(req.params.id).populate('vehicle', 'name licensePlate');
    if (!maintenance) return res.status(404).json({ message: 'Maintenance not found' });
    res.json(maintenance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new maintenance
router.post('/', async (req, res) => {
  const maintenance = new Maintenance(req.body);
  try {
    const vehicle = await Vehicle.findById(req.body.vehicle);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    
    const newMaintenance = await maintenance.save();
    res.status(201).json(newMaintenance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a maintenance
router.put('/:id', async (req, res) => {
  try {
    const maintenance = await Maintenance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!maintenance) return res.status(404).json({ message: 'Maintenance not found' });
    res.json(maintenance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a maintenance
router.delete('/:id', async (req, res) => {
  try {
    const maintenance = await Maintenance.findByIdAndDelete(req.params.id);
    if (!maintenance) return res.status(404).json({ message: 'Maintenance not found' });
    res.json({ message: 'Maintenance deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;