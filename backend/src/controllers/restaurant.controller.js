const db = require('../config/db');

// Get statistics
exports.getStatistics = async (req, res) => {
  try {
    // Get total orders delivered
    const [ordersResult] = await db.execute(
      'SELECT COUNT(*) as total_orders FROM orders WHERE status = "delivered"'
    );
    
    // Get average rating
    const [ratingResult] = await db.execute(
      'SELECT AVG(rating) as avg_rating FROM reviews'
    );
    
    res.status(200).json({
      status: 'success',
      data: {
        totalOrders: ordersResult[0].total_orders,
        averageRating: ratingResult[0].avg_rating ? parseFloat(ratingResult[0].avg_rating).toFixed(1) : 0
      }
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const [categories] = await db.execute(
      'SELECT * FROM categories ORDER BY display_order, name'
    );
    
    res.status(200).json({
      status: 'success',
      data: {
        categories
      }
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Get category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [categories] = await db.execute(
      'SELECT * FROM categories WHERE id = ?',
      [id]
    );
    
    if (categories.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Category not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        category: categories[0]
      }
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Get all restaurants
exports.getAllRestaurants = async (req, res) => {
  try {
    const { category, search, minRating, sortBy = 'rating', order = 'DESC' } = req.query;
    
    let query = `
      SELECT r.*, c.name as category_name 
      FROM restaurants r 
      LEFT JOIN categories c ON r.category_id = c.id 
      WHERE r.is_active = TRUE
    `;
    const params = [];

    if (category) {
      query += ' AND r.category_id = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND (r.name LIKE ? OR r.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (minRating) {
      query += ' AND r.rating >= ?';
      params.push(minRating);
    }

    // Add sorting
    const allowedSortColumns = ['rating', 'delivery_time', 'delivery_fee', 'created_at'];
    const allowedOrderValues = ['ASC', 'DESC'];
    
    if (allowedSortColumns.includes(sortBy) && allowedOrderValues.includes(order.toUpperCase())) {
      query += ` ORDER BY r.${sortBy} ${order.toUpperCase()}`;
    } else {
      query += ' ORDER BY r.rating DESC';
    }

    const [restaurants] = await db.execute(query, params);

    res.status(200).json({
      status: 'success',
      data: {
        restaurants
      }
    });
  } catch (error) {
    console.error('Get restaurants error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Get restaurant by ID
exports.getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;

    const [restaurants] = await db.execute(
      `SELECT r.*, c.name as category_name 
       FROM restaurants r 
       LEFT JOIN categories c ON r.category_id = c.id 
       WHERE r.id = ? AND r.is_active = TRUE`,
      [id]
    );

    if (restaurants.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Restaurant not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        restaurant: restaurants[0]
      }
    });
  } catch (error) {
    console.error('Get restaurant error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Get restaurant menu
exports.getRestaurantMenu = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if restaurant exists and is active
    const [restaurants] = await db.execute(
      'SELECT id FROM restaurants WHERE id = ? AND is_active = TRUE',
      [id]
    );

    if (restaurants.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Restaurant not found'
      });
    }

    const [menuItems] = await db.execute(
      'SELECT * FROM menu_items WHERE restaurant_id = ? AND is_available = TRUE ORDER BY category, name',
      [id]
    );

    res.status(200).json({
      status: 'success',
      data: {
        menuItems
      }
    });
  } catch (error) {
    console.error('Get restaurant menu error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Get restaurant reviews
exports.getRestaurantReviews = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if restaurant exists and is active
    const [restaurants] = await db.execute(
      'SELECT id FROM restaurants WHERE id = ? AND is_active = TRUE',
      [id]
    );

    if (restaurants.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Restaurant not found'
      });
    }

    const [reviews] = await db.execute(
      `SELECT r.*, u.username, u.avatar_url 
       FROM reviews r 
       JOIN users u ON r.user_id = u.id 
       WHERE r.restaurant_id = ? 
       ORDER BY r.created_at DESC`,
      [id]
    );

    res.status(200).json({
      status: 'success',
      data: {
        reviews
      }
    });
  } catch (error) {
    console.error('Get restaurant reviews error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Create restaurant (admin only)
exports.createRestaurant = async (req, res) => {
  try {
    const { name, slug, description, image_url, cover_image_url, category_id, delivery_time, 
            delivery_fee, min_order, address, phone, opening_hours } = req.body;

    const [result] = await db.execute(
      `INSERT INTO restaurants 
       (name, slug, description, image_url, cover_image_url, category_id, delivery_time, 
        delivery_fee, min_order, address, phone, opening_hours) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, slug, description, image_url, cover_image_url, category_id, delivery_time, 
       delivery_fee, min_order, address, phone, JSON.stringify(opening_hours)]
    );

    const restaurantId = result.insertId;

    const [restaurants] = await db.execute(
      `SELECT r.*, c.name as category_name 
       FROM restaurants r 
       LEFT JOIN categories c ON r.category_id = c.id 
       WHERE r.id = ?`,
      [restaurantId]
    );

    res.status(201).json({
      status: 'success',
      message: 'Restaurant created successfully',
      data: {
        restaurant: restaurants[0]
      }
    });
  } catch (error) {
    console.error('Create restaurant error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Update restaurant (admin only)
exports.updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description, image_url, cover_image_url, category_id, delivery_time, 
            delivery_fee, min_order, address, phone, opening_hours, is_active } = req.body;

    const [result] = await db.execute(
      `UPDATE restaurants SET 
       name = ?, slug = ?, description = ?, image_url = ?, cover_image_url = ?, category_id = ?, 
       delivery_time = ?, delivery_fee = ?, min_order = ?, address = ?, phone = ?, 
       opening_hours = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [name, slug, description, image_url, cover_image_url, category_id, delivery_time, 
       delivery_fee, min_order, address, phone, JSON.stringify(opening_hours), is_active, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Restaurant not found'
      });
    }

    const [restaurants] = await db.execute(
      `SELECT r.*, c.name as category_name 
       FROM restaurants r 
       LEFT JOIN categories c ON r.category_id = c.id 
       WHERE r.id = ?`,
      [id]
    );

    res.status(200).json({
      status: 'success',
      message: 'Restaurant updated successfully',
      data: {
        restaurant: restaurants[0]
      }
    });
  } catch (error) {
    console.error('Update restaurant error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Delete restaurant (admin only)
exports.deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.execute(
      'UPDATE restaurants SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Restaurant not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Restaurant deactivated successfully'
    });
  } catch (error) {
    console.error('Delete restaurant error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};