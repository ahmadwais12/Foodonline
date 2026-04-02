const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
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
      // Update the existing admin user's role to admin and password
      const hashedPassword = await bcrypt.hash('wais@admin@1234', 10);
      await connection.execute(
        'UPDATE users SET role = ?, password = ? WHERE email = ?',
        ['admin', hashedPassword, 'ahmadwaissarwari@gmail.com']
      );
      console.log('Admin user role updated successfully!');
      console.log('Email: ahmadwaissarwari@gmail.com');
      console.log('Password: wais@admin@1234');
    } else {
      // Hash the password
      const hashedPassword = await bcrypt.hash('wais@admin@1234', 10);
      
      // Insert the new admin user
      const [result] = await connection.execute(
        'INSERT INTO users (email, password, username, role) VALUES (?, ?, ?, ?)',
        ['ahmadwaissarwari@gmail.com', hashedPassword, 'Ahmad Wais', 'admin']
      );
      
      console.log('Admin user created successfully with ID:', result.insertId);
      console.log('Email: ahmadwaissarwari@gmail.com');
      console.log('Password: wais@admin@1234');
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
