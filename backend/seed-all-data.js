const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function truncateAndInsert() {
  console.log('Truncating tables and inserting fresh data...');
  
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'online_resturant',
    multipleStatements: true
  });
  
  try {
    // Disable foreign key checks
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    
    // Truncate all tables in reverse dependency order
    console.log('Clearing existing data...');
    await connection.query(`
      TRUNCATE TABLE refresh_tokens;
      TRUNCATE TABLE settings;
      TRUNCATE TABLE notifications;
      TRUNCATE TABLE user_favorites;
      TRUNCATE TABLE reviews;
      TRUNCATE TABLE applied_coupons;
      TRUNCATE TABLE coupons;
      TRUNCATE TABLE payment_transactions;
      TRUNCATE TABLE payments;
      TRUNCATE TABLE driver_locations;
      TRUNCATE TABLE user_addresses;
      TRUNCATE TABLE order_status_log;
      TRUNCATE TABLE order_items;
      TRUNCATE TABLE orders;
      TRUNCATE TABLE delivery_drivers;
      TRUNCATE TABLE cart_items;
      TRUNCATE TABLE cart;
      TRUNCATE TABLE menu_item_options;
      TRUNCATE TABLE menu_items;
      TRUNCATE TABLE restaurant_branches;
      TRUNCATE TABLE restaurants;
      TRUNCATE TABLE categories;
      TRUNCATE TABLE roles;
      TRUNCATE TABLE users;
    `);
    
    // Re-enable foreign key checks
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');
    
    console.log('✅ Tables cleared successfully');
    
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'insert-data-fixed.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('Inserting new data...');
    
    // Execute the entire SQL file
    await connection.query(sql);
    
    console.log('✅ Data inserted successfully!');
    console.log('\nSummary:');
    console.log('- 10 users created');
    console.log('- 10 roles created');
    console.log('- 10 categories created');
    console.log('- 10 restaurants created');
    console.log('- 10 restaurant branches created');
    console.log('- 10 menu items created');
    console.log('- 10 menu item options created');
    console.log('- 10 carts created');
    console.log('- 10 cart items created');
    console.log('- 10 delivery drivers created');
    console.log('- 10 orders created');
    console.log('- 10 order items created');
    console.log('- 10 order status logs created');
    console.log('- 10 user addresses created');
    console.log('- 10 driver locations created');
    console.log('- 10 payments created');
    console.log('- 10 payment transactions created');
    console.log('- 10 coupons created');
    console.log('- 10 applied coupons created');
    console.log('- 10 reviews created');
    console.log('- 10 user favorites created');
    console.log('- 10 notifications created');
    console.log('- 10 settings created');
    console.log('- 10 refresh tokens created');
    
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

// Run the truncate and insert
truncateAndInsert()
  .then(() => console.log('\n✅ Database seeding completed successfully!'))
  .catch(err => console.error('\n❌ Database seeding failed:', err));
