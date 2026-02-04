const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth.middleware');

// Apply authentication and driver role restriction to all driver routes
router.use(protect);
router.use(restrictTo('driver'));

// Get new orders for driver
router.get('/orders/new', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'New orders for delivery',
    data: {
      orders: []
    }
  });
});

// Get active deliveries for driver
router.get('/orders/active', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Active deliveries',
    data: {
      orders: []
    }
  });
});

// Update delivery status
router.put('/orders/:id/status', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Order status updated successfully'
  });
});

// Update driver location
router.put('/location', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Location updated successfully'
  });
});

// Get delivery history
router.get('/orders/history', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Delivery history',
    data: {
      orders: []
    }
  });
});

// Get wallet/earnings information
router.get('/wallet', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Wallet information',
    data: {
      earnings: 0,
      balance: 0
    }
  });
});

module.exports = router;