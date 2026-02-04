const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

// Database connection configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'ahmad@wais12', // Using the password from the config
  database: 'online_resturant'
};

async function createAdminUser() {
  let connection;
  
  try {
    // Create database connection
    connection = await mysql.createConnection(dbConfig);
    
    // Check if user already exists
    const [existingUsers] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      ['ahmad.wais.sarwari786@gmail.com']
    );
    
    if (existingUsers.length > 0) {
      console.log('Admin user already exists. Updating role to admin...');
      
      // Update user role to admin
      await connection.execute(
        'UPDATE users SET role = ? WHERE email = ?',
        ['admin', 'ahmad.wais.sarwari786@gmail.com']
      );
      
      console.log('User role updated to admin successfully!');
      return;
    }
    
    // Hash the password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash('Wais@1234', saltRounds);
    
    // Create admin user
    const [result] = await connection.execute(
      'INSERT INTO users (email, password, username, role) VALUES (?, ?, ?, ?)',
      ['ahmad.wais.sarwari786@gmail.com', hashedPassword, 'Ahmad Wais', 'admin']
    );
    
    console.log('Admin user created successfully!');
    console.log('User ID:', result.insertId);
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the function
createAdminUser();