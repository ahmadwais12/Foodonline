const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');

// Apply authentication to all cart routes
router.use(protect);

// Get user's cart
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Cart items retrieved successfully',
    data: {
      cart: {
        items: [],
        total: 0
      }
    }
  });
});

// Add item to cart
router.post('/items', (req, res) => {
  res.status(201).json({
    status: 'success',
    message: 'Item added to cart successfully'
  });
});

// Update cart item quantity
router.put('/items/:id', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Cart item updated successfully'
  });
});

// Remove item from cart
router.delete('/items/:id', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Item removed from cart successfully'
  });
});

// Clear cart
router.delete('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Cart cleared successfully'
  });
});

module.exports = router;