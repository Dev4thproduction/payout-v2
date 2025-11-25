import express from 'express';
import Distribution from '../Models/Distribution.js';

const router = express.Router();

// Get all distributions with optional month filtering
router.get('/', async (req, res) => {
  try {
    const { month } = req.query;
    let query = {};
    
    if (month) {
      query.month = month;
    }
    
    const distributions = await Distribution.find(query).sort({ month: -1, createdAt: -1 });
    res.json(distributions);
  } catch (err) {
    console.error('Error fetching distributions:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Add a new distribution
router.post('/', async (req, res) => {
  try {
    const newDistribution = new Distribution(req.body);
    const savedDistribution = await newDistribution.save();
    res.status(201).json(savedDistribution);
  } catch (err) {
    console.error('Error creating distribution:', err);
    res.status(400).json({ message: 'Error creating distribution', error: err.message });
  }
});

// Update multiple distributions (bulk save)
router.post('/bulk', async (req, res) => {
  try {
    const distributions = req.body;
    
    if (!Array.isArray(distributions)) {
      return res.status(400).json({ message: 'Expected an array of distributions' });
    }
    
    const savedDistributions = [];
    
    // Process each distribution in the array
    for (const dist of distributions) {
      if (dist._id) {
        // Update existing distribution
        const updated = await Distribution.findByIdAndUpdate(
          dist._id,
          { $set: dist },
          { new: true }
        );
        savedDistributions.push(updated);
      } else {
        // Create new distribution
        const newDistribution = new Distribution(dist);
        const saved = await newDistribution.save();
        savedDistributions.push(saved);
      }
    }
    
    res.status(200).json(savedDistributions);
  } catch (err) {
    console.error('Error saving distributions:', err);
    res.status(400).json({ message: 'Error saving distributions', error: err.message });
  }
});

// Get a single distribution
router.get('/:id', async (req, res) => {
  try {
    const distribution = await Distribution.findById(req.params.id);
    if (!distribution) {
      return res.status(404).json({ message: 'Distribution not found' });
    }
    res.json(distribution);
  } catch (err) {
    console.error('Error fetching distribution:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update a distribution
router.put('/:id', async (req, res) => {
  try {
    const updatedDistribution = await Distribution.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedDistribution) {
      return res.status(404).json({ message: 'Distribution not found' });
    }
    res.json(updatedDistribution);
  } catch (err) {
    console.error('Error updating distribution:', err);
    res.status(400).json({ message: 'Error updating distribution', error: err.message });
  }
});

// Delete a distribution
router.delete('/:id', async (req, res) => {
  try {
    const deletedDistribution = await Distribution.findByIdAndDelete(req.params.id);
    if (!deletedDistribution) {
      return res.status(404).json({ message: 'Distribution not found' });
    }
    res.json({ message: 'Distribution deleted successfully' });
  } catch (err) {
    console.error('Error deleting distribution:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get available months for filtering
router.get('/filters/months', async (req, res) => {
  try {
    const months = await Distribution.distinct('month');
    const sortedMonths = months.sort((a, b) => b.localeCompare(a)); // Sort descending
    res.json(sortedMonths);
  } catch (err) {
    console.error('Error fetching available months:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;