const db = require('../config/db');

// Get all food images with filters
exports.getFoodImages = async (req, res) => {
  try {
    const { category, is_favorite, is_special, is_fast_food, is_discounted } = req.query;
    
    let whereClauses = [];
    let params = [];
    
    if (category) {
      whereClauses.push('category = ?');
      params.push(category);
    }
    if (is_favorite !== undefined) {
      whereClauses.push('is_favorite = ?');
      params.push(is_favorite === 'true' ? 1 : 0);
    }
    if (is_special !== undefined) {
      whereClauses.push('is_special = ?');
      params.push(is_special === 'true' ? 1 : 0);
    }
    if (is_fast_food !== undefined) {
      whereClauses.push('is_fast_food = ?');
      params.push(is_fast_food === 'true' ? 1 : 0);
    }
    if (is_discounted !== undefined) {
      whereClauses.push('is_discounted = ?');
      params.push(is_discounted === 'true' ? 1 : 0);
    }
    
    const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
    
    const [rows] = await db.execute(
      `SELECT * FROM food_images ${whereSQL} ORDER BY display_order, created_at DESC`,
      params
    );
    
    res.status(200).json({
      status: 'success',
      data: rows
    });
  } catch (error) {
    console.error('Error fetching food images:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Get single food image by ID
exports.getFoodImageById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [rows] = await db.execute(
      'SELECT * FROM food_images WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Food image not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: rows[0]
    });
  } catch (error) {
    console.error('Error fetching food image:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Get all banner images
exports.getBannerImages = async (req, res) => {
  try {
    const { type } = req.query;
    
    let query = 'SELECT * FROM banner_images WHERE is_active = 1';
    let params = [];
    
    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }
    
    query += ' ORDER BY display_order, created_at DESC';
    
    const [rows] = await db.execute(query, params);
    
    res.status(200).json({
      status: 'success',
      data: rows
    });
  } catch (error) {
    console.error('Error fetching banner images:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Get all popular categories
exports.getPopularCategories = async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM popular_categories WHERE is_active = 1 ORDER BY display_order, name ASC'
    );
    
    res.status(200).json({
      status: 'success',
      data: rows
    });
  } catch (error) {
    console.error('Error fetching popular categories:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Get category by slug
exports.getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const [rows] = await db.execute(
      'SELECT * FROM popular_categories WHERE slug = ? AND is_active = 1',
      [slug]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Category not found'
      });
    }
    
    // Get food items for this category
    let foodItems = [];
    
    // Special handling for custom categories
    if (['favourite-foods', 'special-offers', 'fast-foods', 'discounted-foods'].includes(slug)) {
      let flagClause = '';
      if (slug === 'favourite-foods') flagClause = 'is_favorite = 1';
      else if (slug === 'special-offers') flagClause = 'is_special = 1';
      else if (slug === 'fast-foods') flagClause = 'is_fast_food = 1';
      else if (slug === 'discounted-foods') flagClause = 'is_discounted = 1';
      
      const [foodRows] = await db.execute(
        `SELECT * FROM food_images WHERE ${flagClause} AND is_available = 1 ORDER BY created_at DESC`
      );
      foodItems = foodRows;
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        category: rows[0],
        foodItems
      }
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Submit feedback
exports.submitFeedback = async (req, res) => {
  try {
    const { name, email, message, rating } = req.body;
    const userId = req.session?.userId || null;
    
    if (!name || !email || !message) {
      return res.status(400).json({
        status: 'error',
        message: 'Name, email, and message are required'
      });
    }
    
    const [result] = await db.execute(
      'INSERT INTO feedbacks (user_id, name, email, message, rating) VALUES (?, ?, ?, ?, ?)',
      [userId, name, email, message, rating || null]
    );
    
    res.status(201).json({
      status: 'success',
      message: 'Feedback submitted successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Get statistics
exports.getStatistics = async (req, res) => {
  try {
    const [ordersResult] = await db.execute('SELECT COUNT(*) as total FROM orders WHERE status != "cancelled"');
    const [avgRatingResult] = await db.execute('SELECT AVG(rating) as avg_rating FROM reviews');
    
    res.status(200).json({
      status: 'success',
      data: {
        totalOrders: ordersResult[0]?.total || 0,
        averageRating: parseFloat(avgRatingResult[0]?.avg_rating || 0).toFixed(1)
      }
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};
