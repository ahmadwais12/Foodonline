const db = require('../config/db');

// Get menu items by restaurant
exports.getMenuItems = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    // Check if restaurant exists and is active
    const [restaurants] = await db.execute(
      'SELECT id FROM restaurants WHERE id = ? AND is_active = TRUE',
      [restaurantId]
    );

    if (restaurants.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Restaurant not found'
      });
    }

    const [menuItems] = await db.execute(
      'SELECT * FROM menu_items WHERE restaurant_id = ? AND is_available = TRUE ORDER BY category, name',
      [restaurantId]
    );

    res.status(200).json({
      status: 'success',
      data: {
        menuItems
      }
    });
  } catch (error) {
    console.error('Get menu items error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Get menu item by ID
exports.getMenuItemById = async (req, res) => {
  try {
    const { id } = req.params;

    const [menuItems] = await db.execute(
      'SELECT * FROM menu_items WHERE id = ? AND is_available = TRUE',
      [id]
    );

    if (menuItems.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Menu item not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        menuItem: menuItems[0]
      }
    });
  } catch (error) {
    console.error('Get menu item error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Create menu item (admin only)
exports.createMenuItem = async (req, res) => {
  try {
    const { restaurant_id, name, description, price, image_url, category, is_vegetarian } = req.body;

    const [result] = await db.execute(
      `INSERT INTO menu_items 
       (restaurant_id, name, description, price, image_url, category, is_vegetarian) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [restaurant_id, name, description, price, image_url, category, is_vegetarian || false]
    );

    const menuItemId = result.insertId;

    const [menuItems] = await db.execute(
      'SELECT * FROM menu_items WHERE id = ?',
      [menuItemId]
    );

    res.status(201).json({
      status: 'success',
      message: 'Menu item created successfully',
      data: {
        menuItem: menuItems[0]
      }
    });
  } catch (error) {
    console.error('Create menu item error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Update menu item (admin only)
exports.updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, image_url, category, is_vegetarian, is_available } = req.body;

    const [result] = await db.execute(
      `UPDATE menu_items SET 
       name = ?, description = ?, price = ?, image_url = ?, category = ?, 
       is_vegetarian = ?, is_available = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [name, description, price, image_url, category, is_vegetarian || false, is_available, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Menu item not found'
      });
    }

    const [menuItems] = await db.execute(
      'SELECT * FROM menu_items WHERE id = ?',
      [id]
    );

    res.status(200).json({
      status: 'success',
      message: 'Menu item updated successfully',
      data: {
        menuItem: menuItems[0]
      }
    });
  } catch (error) {
    console.error('Update menu item error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Delete menu item (admin only)
exports.deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.execute(
      'UPDATE menu_items SET is_available = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Menu item not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Menu item deactivated successfully'
    });
  } catch (error) {
    console.error('Delete menu item error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Search menu items
exports.searchMenuItems = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({
        status: 'error',
        message: 'Search query is required'
      });
    }

    const [menuItems] = await db.execute(
      `SELECT * FROM menu_items 
       WHERE is_available = TRUE 
       AND (name LIKE ? OR description LIKE ? OR category LIKE ?)
       ORDER BY name`,
      [`%${q}%`, `%${q}%`, `%${q}%`]
    );

    res.status(200).json({
      status: 'success',
      data: {
        menuItems
      }
    });
  } catch (error) {
    console.error('Search menu items error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Get popular menu items
exports.getPopularItems = async (req, res) => {
  try {
    const [menuItems] = await db.execute(
      `SELECT * FROM menu_items 
       WHERE is_available = TRUE 
       ORDER BY RAND() 
       LIMIT 12`
    );

    res.status(200).json({
      status: 'success',
      data: {
        menuItems
      }
    });
  } catch (error) {
    console.error('Get popular items error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Get special offers
exports.getSpecialOffers = async (req, res) => {
  try {
    const [menuItems] = await db.execute(
      `SELECT * FROM menu_items 
       WHERE is_available = TRUE 
       AND price > 15
       ORDER BY price DESC 
       LIMIT 12`
    );

    res.status(200).json({
      status: 'success',
      data: {
        menuItems
      }
    });
  } catch (error) {
    console.error('Get special offers error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Get fast food items
exports.getFastFoodItems = async (req, res) => {
  try {
    const [menuItems] = await db.execute(
      `SELECT * FROM menu_items 
       WHERE is_available = TRUE 
       AND (category LIKE '%Fast Food%' OR category LIKE '%Burger%' OR category LIKE '%Pizza%' OR category LIKE '%Sandwich%')
       ORDER BY name 
       LIMIT 12`
    );

    res.status(200).json({
      status: 'success',
      data: {
        menuItems
      }
    });
  } catch (error) {
    console.error('Get fast food items error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Get discounted items
exports.getDiscountedItems = async (req, res) => {
  try {
    const [menuItems] = await db.execute(
      `SELECT * FROM menu_items 
       WHERE is_available = TRUE 
       AND price < 10
       ORDER BY price ASC 
       LIMIT 12`
    );

    res.status(200).json({
      status: 'success',
      data: {
        menuItems
      }
    });
  } catch (error) {
    console.error('Get discounted items error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Get menu items by category
exports.getMenuItemsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    const [menuItems] = await db.execute(
      `SELECT * FROM menu_items 
       WHERE is_available = TRUE 
       AND category = ?
       ORDER BY name`,
      [category]
    );

    res.status(200).json({
      status: 'success',
      data: {
        menuItems
      }
    });
  } catch (error) {
    console.error('Get menu items by category error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};