const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');

// Get all sales
router.get('/', async (req, res) => {
  try {
    console.log('Fetching all sales');
    const sales = await Sale.find();
    console.log(`Found ${sales.length} sales`);
    res.json(sales);
  } catch (error) {
    console.error('Error fetching all sales:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get a specific sale
router.get('/:id', async (req, res) => {
  try {
    console.log(`Attempting to fetch sale with ID: ${req.params.id}`);
    const sale = await Sale.findById(req.params.id);
    if (!sale) {
      console.log(`No sale found with ID: ${req.params.id}`);
      return res.status(404).json({ message: 'Vente non trouvée' });
    }
    console.log(`Successfully found sale for vehicle: ${sale.vehicule.marque} ${sale.vehicule.modele}`);
    res.json(sale);
  } catch (error) {
    console.error(`Error fetching sale with ID ${req.params.id}:`, error);
    res.status(500).json({ message: error.message });
  }
});

// Create a new sale
router.post('/', async (req, res) => {
  const sale = new Sale(req.body);
  try {
    console.log('Creating new sale:', req.body);
    const newSale = await sale.save();
    console.log('New sale created:', newSale);
    res.status(201).json(newSale);
  } catch (error) {
    console.error('Error creating new sale:', error);
    res.status(400).json({ message: error.message });
  }
});

// Update a sale
router.put('/:id', async (req, res) => {
  try {
    console.log(`Updating sale with ID: ${req.params.id}`);
    const updatedSale = await Sale.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedSale) {
      console.log(`Sale with ID ${req.params.id} not found for update`);
      return res.status(404).json({ message: 'Vente non trouvée' });
    }
    console.log('Sale updated:', updatedSale);
    res.json(updatedSale);
  } catch (error) {
    console.error('Error updating sale:', error);
    res.status(400).json({ message: error.message });
  }
});

// Delete a sale
router.delete('/:id', async (req, res) => {
  try {
    console.log(`Deleting sale with ID: ${req.params.id}`);
    const deletedSale = await Sale.findByIdAndDelete(req.params.id);
    if (!deletedSale) {
      console.log(`Sale with ID ${req.params.id} not found for deletion`);
      return res.status(404).json({ message: 'Vente non trouvée' });
    }
    console.log('Sale deleted');
    res.json({ message: 'Vente supprimée' });
  } catch (error) {
    console.error('Error deleting sale:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;