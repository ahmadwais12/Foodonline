const db = require('../config/db');

// Generate unique order number
const generateOrderNumber = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${timestamp}-${random}`;
};

// Get user orders
exports.getOrders = async (req, res) => {
  try {
    const [orders] = await db.execute(
      `SELECT o.*, r.name as restaurant_name, r.image_url as restaurant_image
       FROM orders o
       JOIN restaurants r ON o.restaurant_id = r.id
       WHERE o.user_id = ?
       ORDER BY o.created_at DESC`,
      [req.user.id]
    );

    res.status(200).json({
      status: 'success',
      data: {
        orders
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const [orders] = await db.execute(
      `SELECT o.*, r.name as restaurant_name, r.image_url as restaurant_image
       FROM orders o
       JOIN restaurants r ON o.restaurant_id = r.id
       WHERE o.id = ? AND o.user_id = ?`,
      [id, req.user.id]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      });
    }

    // Get order items
    const [orderItems] = await db.execute(
      'SELECT * FROM order_items WHERE order_id = ?',
      [id]
    );

    res.status(200).json({
      status: 'success',
      data: {
        order: {
          ...orders[0],
          items: orderItems
        }
      }
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Create order
exports.createOrder = async (req, res) => {
  try {
    const { restaurant_id, delivery_address, delivery_instructions, items, 
            subtotal, delivery_fee, tax, discount = 0, total, payment_method } = req.body;

    // Generate order number
    const order_number = generateOrderNumber();

    // Start transaction
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // Create order
      const [orderResult] = await connection.execute(
        `INSERT INTO orders 
         (order_number, user_id, restaurant_id, delivery_address, delivery_instructions,
          subtotal, delivery_fee, tax, discount, total, payment_method) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [order_number, req.user.id, restaurant_id, JSON.stringify(delivery_address), delivery_instructions,
         subtotal, delivery_fee, tax, discount, total, payment_method]
      );

      const orderId = orderResult.insertId;

      // Create order items
      for (const item of items) {
        await connection.execute(
          `INSERT INTO order_items 
           (order_id, menu_item_id, item_name, item_price, quantity, special_instructions) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [orderId, item.menu_item_id, item.item_name, item.item_price, item.quantity, item.special_instructions]
        );
      }

      // Commit transaction
      await connection.commit();

      // Get created order with items
      const [orders] = await db.execute(
        `SELECT o.*, r.name as restaurant_name, r.image_url as restaurant_image
         FROM orders o
         JOIN restaurants r ON o.restaurant_id = r.id
         WHERE o.id = ?`,
        [orderId]
      );

      const [orderItems] = await db.execute(
        'SELECT * FROM order_items WHERE order_id = ?',
        [orderId]
      );

      res.status(201).json({
        status: 'success',
        message: 'Order created successfully',
        data: {
          order: {
            ...orders[0],
            items: orderItems
          }
        }
      });
    } catch (error) {
      // Rollback transaction on error
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    // Check if order belongs to user and can be cancelled
    const [orders] = await db.execute(
      'SELECT status FROM orders WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      });
    }

    const order = orders[0];
    
    // Only allow cancellation for pending orders
    if (order.status !== 'pending') {
      return res.status(400).json({
        status: 'error',
        message: 'Order cannot be cancelled at this stage'
      });
    }

    const [result] = await db.execute(
      `UPDATE orders SET 
       status = 'cancelled', 
       cancelled_at = CURRENT_TIMESTAMP, 
       cancellation_reason = ?,
       updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [reason, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Order cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Update order status (for drivers/admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid status'
      });
    }

    // Update order status
    const [result] = await db.execute(
      `UPDATE orders SET 
       status = ?, 
       ${status}_at = CURRENT_TIMESTAMP,
       updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      });
    }

    // Log status change
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