const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');

// Apply authentication to all review routes
router.use(protect);

// Get reviews for a restaurant
router.get('/restaurant/:restaurantId', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Restaurant reviews retrieved successfully',
    data: {
      reviews: []
    }
  });
});

// Add review for an order
router.post('/order/:orderId', (req, res) => {
  res.status(201).json({
    status: 'success',
    message: 'Review added successfully'
  });
});

// Update review
router.put('/:id', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Review updated successfully'
  });
});

// Delete review
router.delete('/:id', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Review deleted successfully'
  });
});

module.exports = router;