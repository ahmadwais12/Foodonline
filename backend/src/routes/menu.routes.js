const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menu.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');
const { validateMenuItem } = require('../middleware/validation.middleware');

// Public routes
router.get('/restaurant/:restaurantId', menuController.getMenuItems);
router.get('/:id', menuController.getMenuItemById);
router.get('/popular', menuController.getPopularItems);
router.get('/special-offers', menuController.getSpecialOffers);
router.get('/fast-food', menuController.getFastFoodItems);
router.get('/discounted', menuController.getDiscountedItems);
router.get('/category/:category', menuController.getMenuItemsByCategory);
router.get('/search', menuController.searchMenuItems);

// Protected routes (admin only)
router.use(protect);
router.use(restrictTo('admin'));

router.post('/', validateMenuItem, menuController.createMenuItem);
router.put('/:id', validateMenuItem, menuController.updateMenuItem);
router.delete('/:id', menuController.deleteMenuItem);

module.exports = router;