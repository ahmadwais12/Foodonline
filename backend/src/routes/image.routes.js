const express = require('express');
const router = express.Router();
const imageController = require('../controllers/image.controller');

// Food images routes
router.get('/food-images', imageController.getFoodImages);
router.get('/food-images/:id', imageController.getFoodImageById);

// Banner images routes
router.get('/banners', imageController.getBannerImages);

// Popular categories routes
router.get('/categories', imageController.getPopularCategories);
router.get('/categories/:slug', imageController.getCategoryBySlug);

// Feedback route
router.post('/feedback', imageController.submitFeedback);

// Statistics route
router.get('/statistics', imageController.getStatistics);

module.exports = router;
