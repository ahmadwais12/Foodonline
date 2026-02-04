const db = require('../config/db');

// Get admin dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    // Get total revenue
    const [revenueResult] = await db.execute(
      'SELECT COALESCE(SUM(total), 0) as totalRevenue FROM orders WHERE status = "delivered"'
    );
    const totalRevenue = revenueResult[0].totalRevenue || 0;

    // Get total orders
    const [ordersResult] = await db.execute(
      'SELECT COUNT(*) as totalOrders FROM orders'
    );
    const totalOrders = ordersResult[0].totalOrders || 0;

    // Get total customers
    const [customersResult] = await db.execute(
      'SELECT COUNT(*) as totalCustomers FROM users WHERE role = "customer"'
    );
    const totalCustomers = customersResult[0].totalCustomers || 0;

    // Get total restaurants
    const [restaurantsResult] = await db.execute(
      'SELECT COUNT(*) as totalRestaurants FROM restaurants WHERE is_active = TRUE'
    );
    const totalRestaurants = restaurantsResult[0].totalRestaurants || 0;

    // Get today's orders
    const [todayOrdersResult] = await db.execute(
      "SELECT COUNT(*) as todayOrders FROM orders WHERE DATE(created_at) = CURDATE()"
    );
    const todayOrders = todayOrdersResult[0].todayOrders || 0;

    // Get weekly orders
    const [weeklyOrdersResult] = await db.execute(
      "SELECT COUNT(*) as weeklyOrders FROM orders WHERE YEARWEEK(created_at, 1) = YEARWEEK(CURDATE(), 1)"
    );
    const weeklyOrders = weeklyOrdersResult[0].weeklyOrders || 0;

    // Get monthly orders
    const [monthlyOrdersResult] = await db.execute(
      "SELECT COUNT(*) as monthlyOrders FROM orders WHERE YEAR(created_at) = YEAR(CURDATE()) AND MONTH(created_at) = MONTH(CURDATE())"
    );
    const monthlyOrders = monthlyOrdersResult[0].monthlyOrders || 0;

    // Get active users
    const [activeUsersResult] = await db.execute(
      "SELECT COUNT(*) as activeUsers FROM users WHERE role = 'customer' AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)"
    );
    const activeUsers = activeUsersResult[0].activeUsers || 0;

    // Get active restaurants
    const [activeRestaurantsResult] = await db.execute(
      "SELECT COUNT(*) as activeRestaurants FROM restaurants WHERE is_active = TRUE"
    );
    const activeRestaurants = activeRestaurantsResult[0].activeRestaurants || 0;

    // Get order status counts
    const [orderStatuses] = await db.execute(
      `SELECT status, COUNT(*) as count
       FROM orders
       GROUP BY status`
    );

    // Calculate pending, completed, and cancelled orders
    let pendingOrders = 0;
    let completedOrders = 0;
    let cancelledOrders = 0;

    orderStatuses.forEach(status => {
      if (status.status === 'Pending' || status.status === 'Processing') {
        pendingOrders += status.count;
      } else if (status.status === 'Completed' || status.status === 'Delivered') {
        completedOrders += status.count;
      } else if (status.status === 'Cancelled') {
        cancelledOrders += status.count;
      }
    });

    // Get recent orders
    const [recentOrders] = await db.execute(
      `SELECT o.*, r.name as restaurant_name, u.username as customer_name
       FROM orders o
       LEFT JOIN restaurants r ON o.restaurant_id = r.id
       LEFT JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC
       LIMIT 10`
    );

    // Get top restaurants by order count
    const [topRestaurants] = await db.execute(
      `SELECT r.name, COUNT(o.id) as order_count, COALESCE(SUM(o.total), 0) as revenue
       FROM restaurants r
       LEFT JOIN orders o ON r.id = o.restaurant_id AND o.status = 'delivered'
       WHERE r.is_active = TRUE
       GROUP BY r.id, r.name
       ORDER BY order_count DESC
       LIMIT 10`
    );

    // Get delivery riders data
    const [deliveryRiders] = await db.execute(`
      SELECT 
        dd.id,
        u.username as name,
        CASE 
          WHEN dd.is_active = 1 THEN 'Online'
          ELSE 'Offline'
        END as status,
        COALESCE((SELECT COUNT(*) FROM orders WHERE delivery_driver_id = dd.id AND status = 'delivered'), 0) as orders_completed,
        COALESCE((SELECT SUM(total * 0.1) FROM orders WHERE delivery_driver_id = dd.id AND status = 'delivered'), 0) as earnings
      FROM delivery_drivers dd
      LEFT JOIN users u ON dd.user_id = u.id
      LIMIT 10
    `);

    // Get recent notifications (system alerts) - using placeholder data since no notifications table exists
    const [notificationResults] = await db.execute(`
      SELECT
        '1' as id,
        'New Order Received' as title,
        'Order #ORD001 has been placed' as message,
        'info' as type,
        NOW() as created_at,
        FALSE as read
      UNION ALL
      SELECT
        '2' as id,
        'Order Status Update' as title,
        'Order #ORD002 is now out for delivery' as message,
        'warning' as type,
        NOW() as created_at,
        FALSE as read
      UNION ALL
      SELECT
        '3' as id,
        'Low Inventory Alert' as title,
        'Restaurant "Pizza Palace" has low inventory' as message,
        'alert' as type,
        NOW() as created_at,
        FALSE as read
      LIMIT 10
    `);
    const notifications = notificationResults || [];

    res.status(200).json({
      status: 'success',
      data: {
        stats: {
          totalRevenue: parseFloat(totalRevenue),
          totalOrders,
          totalCustomers,
          totalRestaurants,
          todayOrders,
          weeklyOrders,
          monthlyOrders,
          activeUsers,
          activeRestaurants,
          pendingOrders,
          completedOrders,
          cancelledOrders
        },
        recentOrders: recentOrders,
        topRestaurants: topRestaurants,
        orderStatuses: orderStatuses,
        deliveryRiders: deliveryRiders,
        notifications: notifications
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};