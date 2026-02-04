const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'ahmad@wais12', // Using the same password as in db.js
  database: process.env.DB_NAME || 'online_resturant',
  port: process.env.DB_PORT || 3306
};

async function createAdminUser() {
  console.log('Creating admin user...');
  
  const connection = await mysql.createConnection(dbConfig);
  
  try {
    // Check if admin user already exists
    const [existingAdmin] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      ['ahmadwaissarwari@gmail.com']
    );
    
    if (existingAdmin.length > 0) {
      console.log('Admin user already exists, updating...');
      // Update the existing admin user's role to admin
      await connection.execute(
        'UPDATE users SET role = ? WHERE email = ?',
        ['admin', 'ahmadwaissarwari@gmail.com']
      );
      console.log('Admin user role updated successfully!');
    } else {
      // Hash the password
      const hashedPassword = await bcrypt.hash('ahmadwais12', 10);
      
      // Insert the new admin user
      const [result] = await connection.execute(
        'INSERT INTO users (email, password, username, role) VALUES (?, ?, ?, ?)',
        ['ahmadwaissarwari@gmail.com', hashedPassword, 'ahmadadmin', 'admin']
      );
      
      console.log('Admin user created successfully with ID:', result.insertId);
    }
    
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

// Run the admin creation function
createAdminUser()
  .then(() => console.log('Admin user creation completed'))
  .catch(err => console.error('Admin user creation failed:', err));