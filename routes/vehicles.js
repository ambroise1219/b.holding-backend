const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');

// Route de test
router.get('/test', (req, res) => {
  console.log('Test route accessed');
  res.json({ message: 'Test route works' });
});

// Get all vehicles
router.get('/', async (req, res) => {
  try {
    console.log('Fetching all vehicles');
    const vehicles = await Vehicle.find();
    console.log(`Found ${vehicles.length} vehicles`);
    res.json(vehicles);
  } catch (error) {
    console.error('Error fetching all vehicles:', error);
    res.status(500).json({ message: error.message });
  }
});
// Specific Vehicle
router.get('/:id', async (req, res) => {
  try {
    console.log(`Attempting to fetch vehicle with ID: ${req.params.id}`);
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      console.log(`No vehicle found with ID: ${req.params.id}`);
      return res.status(404).json({ message: 'Véhicule non trouvé' });
    }
    console.log(`Successfully found vehicle: ${vehicle.name}`);
    res.json(vehicle);
  } catch (error) {
    console.error(`Error fetching vehicle with ID ${req.params.id}:`, error);
    res.status(500).json({ message: error.message });
  }
});

// Create a new vehicle
router.post('/', async (req, res) => {
  const vehicle = new Vehicle(req.body);
  try {
    console.log('Creating new vehicle:', req.body);
    const newVehicle = await vehicle.save();
    console.log('New vehicle created:', newVehicle);
    res.status(201).json(newVehicle);
  } catch (error) {
    console.error('Error creating new vehicle:', error);
    res.status(400).json({ message: error.message });
  }
});

// Update a vehicle
router.put('/:id', async (req, res) => {
  try {
    console.log(`Updating vehicle with ID: ${req.params.id}`);
    const updatedVehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedVehicle) {
      console.log(`Vehicle with ID ${req.params.id} not found for update`);
      return res.status(404).json({ message: 'Véhicule non trouvé' });
    }
    console.log('Vehicle updated:', updatedVehicle);
    res.json(updatedVehicle);
  } catch (error) {
    console.error('Error updating vehicle:', error);
    res.status(400).json({ message: error.message });
  }
});

// Delete a vehicle
router.delete('/:id', async (req, res) => {
  try {
    console.log(`Deleting vehicle with ID: ${req.params.id}`);
    const deletedVehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!deletedVehicle) {
      console.log(`Vehicle with ID ${req.params.id} not found for deletion`);
      return res.status(404).json({ message: 'Véhicule non trouvé' });
    }
    console.log('Vehicle deleted');
    res.json({ message: 'Vehicle deleted' });
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;