const db = require('../config/db');

// Restaurant Management

// Get all restaurants
exports.getRestaurants = async (req, res) => {
  try {
    const [restaurants] = await db.execute(`
      SELECT r.*, c.name as category_name
      FROM restaurants r
      LEFT JOIN categories c ON r.category_id = c.id
      ORDER BY r.created_at DESC
    `);
    
    res.status(200).json({
      status: 'success',
      data: restaurants
    });
  } catch (error) {
    console.error('Get restaurants error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Create a new restaurant
exports.createRestaurant = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      image_url,
      cover_image_url,
      category_id,
      rating,
      total_reviews,
      delivery_time,
      delivery_fee,
      min_order,
      is_active,
      address,
      phone,
      opening_hours
    } = req.body;

    const [result] = await db.execute(`
      INSERT INTO restaurants (
        name, slug, description, image_url, cover_image_url, category_id, 
        rating, total_reviews, delivery_time, delivery_fee, min_order, 
        is_active, address, phone, opening_hours
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      name, slug, description, image_url, cover_image_url, category_id,
      rating, total_reviews, delivery_time, delivery_fee, min_order,
      is_active, address, phone, JSON.stringify(opening_hours)
    ]);

    res.status(201).json({
      status: 'success',
      message: 'Restaurant created successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Create restaurant error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Update restaurant
exports.updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Build dynamic update query
    const fields = [];
    const values = [];
    
    Object.keys(updates).forEach(key => {
      fields.push(`${key} = ?`);
      values.push(updates[key]);
    });
    
    if (updates.opening_hours) {
      values[values.indexOf(updates.opening_hours)] = JSON.stringify(updates.opening_hours);
    }
    
    fields.push('updated_at = NOW()');
    
    const query = `UPDATE restaurants SET ${fields.join(', ')} WHERE id = ?`;
    values.push(id);
    
    await db.execute(query, values);

    res.status(200).json({
      status: 'success',
      message: 'Restaurant updated successfully'
    });
  } catch (error) {
    console.error('Update restaurant error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Delete restaurant
exports.deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    
    await db.execute('DELETE FROM restaurants WHERE id = ?', [id]);

    res.status(200).json({
      status: 'success',
      message: 'Restaurant deleted successfully'
    });
  } catch (error) {
    console.error('Delete restaurant error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Menu Items Management

// Get all menu items
exports.getMenuItems = async (req, res) => {
  try {
    const [menuItems] = await db.execute(`
      SELECT mi.*, r.name as restaurant_name, c.name as category_name
      FROM menu_items mi
      LEFT JOIN restaurants r ON mi.restaurant_id = r.id
      ORDER BY mi.created_at DESC
    `);
    
    res.status(200).json({
      status: 'success',
      data: menuItems
    });
  } catch (error) {
    console.error('Get menu items error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Create a new menu item
exports.createMenuItem = async (req, res) => {
  try {
    const {
      restaurant_id,
      name,
      description,
      price,
      image_url,
      category,
      is_vegetarian,
      is_available
    } = req.body;

    const [result] = await db.execute(`
      INSERT INTO menu_items (
        restaurant_id, name, description, price, image_url, 
        category, is_vegetarian, is_available
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      restaurant_id, name, description, price, image_url,
      category, is_vegetarian, is_available
    ]);

    res.status(201).json({
      status: 'success',
      message: 'Menu item created successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Create menu item error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Update menu item
exports.updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Build dynamic update query
    const fields = [];
    const values = [];
    
    Object.keys(updates).forEach(key => {
      fields.push(`${key} = ?`);
      values.push(updates[key]);
    });
    
    fields.push('updated_at = NOW()');
    
    const query = `UPDATE menu_items SET ${fields.join(', ')} WHERE id = ?`;
    values.push(id);
    
    await db.execute(query, values);

    res.status(200).json({
      status: 'success',
      message: 'Menu item updated successfully'
    });
  } catch (error) {
    console.error('Update menu item error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Delete menu item
exports.deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    
    await db.execute('DELETE FROM menu_items WHERE id = ?', [id]);

    res.status(200).json({
      status: 'success',
      message: 'Menu item deleted successfully'
    });
  } catch (error) {
    console.error('Delete menu item error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Orders Management

// Get all orders
exports.getOrders = async (req, res) => {
  try {
    const [orders] = await db.execute(`
      SELECT o.*, r.name as restaurant_name, u.username as customer_name
      FROM orders o
      LEFT JOIN restaurants r ON o.restaurant_id = r.id
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `);
    
    res.status(200).json({
      status: 'success',
      data: orders
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Update order status
    await db.execute(
      'UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, id]
    );

    // Add to order status log
    await db.execute(
      'INSERT INTO order_status_log (order_id, status) VALUES (?, ?)',
      [id, status]
    );

    res.status(200).json({
      status: 'success',
      message: 'Order status updated successfully'
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Users Management

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const [users] = await db.execute(
      'SELECT id, email, username, role, created_at FROM users ORDER BY created_at DESC'
    );
    
    res.status(200).json({
      status: 'success',
      data: users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Update user role
exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    await db.execute(
      'UPDATE users SET role = ?, updated_at = NOW() WHERE id = ?',
      [role, id]
    );

    res.status(200).json({
      status: 'success',
      message: 'User role updated successfully'
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    await db.execute('DELETE FROM users WHERE id = ?', [id]);

    res.status(200).json({
      status: 'success',
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Drivers Management

// Get all drivers
exports.getDrivers = async (req, res) => {
  try {
    const [drivers] = await db.execute(`
      SELECT dd.*, u.username, u.email
      FROM delivery_drivers dd
      LEFT JOIN users u ON dd.user_id = u.id
      ORDER BY dd.created_at DESC
    `);
    
    res.status(200).json({
      status: 'success',
      data: drivers
    });
  } catch (error) {
    console.error('Get drivers error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Create a new driver
exports.createDriver = async (req, res) => {
  try {
    const { user_id, license_number, vehicle_type, vehicle_plate, is_active } = req.body;

    const [result] = await db.execute(`
      INSERT INTO delivery_drivers (user_id, license_number, vehicle_type, vehicle_plate, is_active)
      VALUES (?, ?, ?, ?, ?)
    `, [user_id, license_number, vehicle_type, vehicle_plate, is_active]);

    res.status(201).json({
      status: 'success',
      message: 'Driver created successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Create driver error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Update driver
exports.updateDriver = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Build dynamic update query
    const fields = [];
    const values = [];
    
    Object.keys(updates).forEach(key => {
      fields.push(`${key} = ?`);
      values.push(updates[key]);
    });
    
    fields.push('updated_at = NOW()');
    
    const query = `UPDATE delivery_drivers SET ${fields.join(', ')} WHERE id = ?`;
    values.push(id);
    
    await db.execute(query, values);

    res.status(200).json({
      status: 'success',
      message: 'Driver updated successfully'
    });
  } catch (error) {
    console.error('Update driver error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Delete driver
exports.deleteDriver = async (req, res) => {
  try {
    const { id } = req.params;
    
    await db.execute('DELETE FROM delivery_drivers WHERE id = ?', [id]);

    res.status(200).json({
      status: 'success',
      message: 'Driver deleted successfully'
    });
  } catch (error) {
    console.error('Delete driver error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Coupons Management

// Get all coupons
exports.getCoupons = async (req, res) => {
  try {
    const [coupons] = await db.execute(
      'SELECT * FROM coupons ORDER BY created_at DESC'
    );
    
    res.status(200).json({
      status: 'success',
      data: coupons
    });
  } catch (error) {
    console.error('Get coupons error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Create a new coupon
exports.createCoupon = async (req, res) => {
  try {
    const {
      code,
      description,
      discount_type,
      discount_value,
      min_order_value,
      max_discount,
      valid_from,
      valid_until,
      usage_limit
    } = req.body;

    const [result] = await db.execute(`
      INSERT INTO coupons (
        code, description, discount_type, discount_value, min_order_value,
        max_discount, valid_from, valid_until, usage_limit
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      code, description, discount_type, discount_value, min_order_value,
      max_discount, valid_from, valid_until, usage_limit
    ]);

    res.status(201).json({
      status: 'success',
      message: 'Coupon created successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Create coupon error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Update coupon
exports.updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Build dynamic update query
    const fields = [];
    const values = [];
    
    Object.keys(updates).forEach(key => {
      fields.push(`${key} = ?`);
      values.push(updates[key]);
    });
    
    fields.push('updated_at = NOW()');
    
    const query = `UPDATE coupons SET ${fields.join(', ')} WHERE id = ?`;
    values.push(id);
    
    await db.execute(query, values);

    res.status(200).json({
      status: 'success',
      message: 'Coupon updated successfully'
    });
  } catch (error) {
    console.error('Update coupon error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Delete coupon
exports.deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    
    await db.execute('DELETE FROM coupons WHERE id = ?', [id]);

    res.status(200).json({
      status: 'success',
      message: 'Coupon deleted successfully'
    });
  } catch (error) {
    console.error('Delete coupon error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Reports

// Get sales report
exports.getSalesReport = async (req, res) => {
  try {
    const { from, to } = req.query;
    
    let query = `
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as order_count,
        SUM(total) as total_revenue
      FROM orders 
      WHERE status = 'delivered'
    `;
    
    const params = [];
    if (from) {
      query += ' AND DATE(created_at) >= ?';
      params.push(from);
    }
    if (to) {
      query += ' AND DATE(created_at) <= ?';
      params.push(to);
    }
    
    query += ' GROUP BY DATE(created_at) ORDER BY date DESC';
    
    const [salesData] = await db.execute(query, params);
    
    res.status(200).json({
      status: 'success',
      data: salesData
    });
  } catch (error) {
    console.error('Get sales report error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Get customer analytics
exports.getCustomerAnalytics = async (req, res) => {
  try {
    // Get customer registration stats
    const [customerStats] = await db.execute(`
      SELECT 
        COUNT(*) as total_customers,
        COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as new_customers_30_days
      FROM users 
      WHERE role = 'customer'
    `);
    
    // Get order stats by customer
    const [orderStats] = await db.execute(`
      SELECT 
        u.username,
        COUNT(o.id) as total_orders,
        COALESCE(SUM(o.total), 0) as total_spent
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id
      WHERE u.role = 'customer'
      GROUP BY u.id
      ORDER BY total_spent DESC
      LIMIT 10
    `);
    
    res.status(200).json({
      status: 'success',
      data: {
        customerStats: customerStats[0],
        topCustomers: orderStats
      }
    });
  } catch (error) {
    console.error('Get customer analytics error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Settings

// Get system settings
exports.getSettings = async (req, res) => {
  try {
    const [settings] = await db.execute('SELECT * FROM settings');
    
    const settingsObj = {};
    settings.forEach(setting => {
      settingsObj[setting.key_name] = setting.value;
    });
    
    res.status(200).json({
      status: 'success',
      data: settingsObj
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Update system settings
exports.updateSettings = async (req, res) => {
  try {
    const updates = req.body;
    
    for (const [key, value] of Object.entries(updates)) {
      // Check if setting exists
      const [existing] = await db.execute(
        'SELECT id FROM settings WHERE key_name = ?',
        [key]
      );
      
      if (existing.length > 0) {
        // Update existing setting
        await db.execute(
          'UPDATE settings SET value = ?, updated_at = NOW() WHERE key_name = ?',
          [value, key]
        );
      } else {
        // Create new setting
        await db.execute(
          'INSERT INTO settings (key_name, value) VALUES (?, ?)',
          [key, value]
        );
      }
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Settings updated successfully'
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};