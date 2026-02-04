const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { protect } = require('../middleware/auth.middleware');
const { validateOrder } = require('../middleware/validation.middleware');

// Protected routes
router.use(protect);

// Customer routes
router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrderById);
router.post('/', validateOrder, orderController.createOrder);
router.put('/:id/cancel', orderController.cancelOrder);

// Driver routes
router.put('/:id/status', orderController.updateOrderStatus);

module.exports = router;