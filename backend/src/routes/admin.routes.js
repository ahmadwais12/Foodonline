const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth.middleware');
const adminController = require('../controllers/admin.controller');
const dashboardController = require('../controllers/dashboard.controller');

// Apply authentication and admin role restriction to all admin routes
router.use(protect);
router.use(restrictTo('admin'));

// Admin dashboard routes
router.get('/dashboard', dashboardController.getDashboardStats);

// Restaurant management routes
router.get('/restaurants', adminController.getRestaurants);
router.post('/restaurants', adminController.createRestaurant);
router.put('/restaurants/:id', adminController.updateRestaurant);
router.delete('/restaurants/:id', adminController.deleteRestaurant);

// Menu & categories management routes
router.get('/menu-items', adminController.getMenuItems);
router.post('/menu-items', adminController.createMenuItem);
router.put('/menu-items/:id', adminController.updateMenuItem);
router.delete('/menu-items/:id', adminController.deleteMenuItem);

// Orders management routes
router.get('/orders', adminController.getOrders);
router.put('/orders/:id/status', adminController.updateOrderStatus);

// Delivery drivers management routes
router.get('/drivers', adminController.getDrivers);
router.post('/drivers', adminController.createDriver);
router.put('/drivers/:id', adminController.updateDriver);
router.delete('/drivers/:id', adminController.deleteDriver);

// Users management routes
router.get('/users', adminController.getUsers);
router.put('/users/:id/role', adminController.updateUserRole);
router.delete('/users/:id', adminController.deleteUser);

// Coupons & discounts management routes
router.get('/coupons', adminController.getCoupons);
router.post('/coupons', adminController.createCoupon);
router.put('/coupons/:id', adminController.updateCoupon);
router.delete('/coupons/:id', adminController.deleteCoupon);

// Reports routes
router.get('/reports/sales', adminController.getSalesReport);
router.get('/reports/customers', adminController.getCustomerAnalytics);

// Settings routes
router.get('/settings', adminController.getSettings);
router.put('/settings', adminController.updateSettings);

module.exports = router;