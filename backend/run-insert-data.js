const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function insertData() {
  console.log('Starting data insertion...');
  
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'online_resturant',
    multipleStatements: true
  });
  
  try {
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'insert-data-fixed.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('Executing SQL statements...');
    
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
    console.error('Error inserting data:', error.message);
    if (error.errno === 1062) {
      console.log('\n⚠️  Some records already exist. Use TRUNCATE TABLE first if you want to re-insert.');
    }
    throw error;
  } finally {
    await connection.end();
  }
}

// Run the insertion
insertData()
  .then(() => console.log('\n✅ Data insertion completed'))
  .catch(err => console.error('\n❌ Data insertion failed:', err));
