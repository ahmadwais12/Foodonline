const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurant.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');
const { validateRestaurant } = require('../middleware/validation.middleware');

// Public routes
router.get('/categories', restaurantController.getCategories);
router.get('/categories/:id', restaurantController.getCategoryById);
router.get('/statistics', restaurantController.getStatistics);
router.get('/', restaurantController.getAllRestaurants);
router.get('/:id', restaurantController.getRestaurantById);
router.get('/:id/menu', restaurantController.getRestaurantMenu);
router.get('/:id/reviews', restaurantController.getRestaurantReviews);

// Protected routes (admin only)
router.use(protect);
router.use(restrictTo('admin'));

router.post('/', validateRestaurant, restaurantController.createRestaurant);
router.put('/:id', validateRestaurant, restaurantController.updateRestaurant);
router.delete('/:id', restaurantController.deleteRestaurant);

module.exports = router;