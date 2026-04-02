const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'ahmad@wais12',
  database: process.env.DB_NAME || 'online_resturant',
  port: process.env.DB_PORT || 3306
};

async function createAdminUser() {
  console.log('Creating second admin user...');
  
  const connection = await mysql.createConnection(dbConfig);
  
  try {
    // Check if admin user already exists
    const [existingAdmin] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      ['ahmad.wais.sarwari786@gmail.com']
    );
    
    if (existingAdmin.length > 0) {
      console.log('Second admin user already exists, updating...');
      // Update the existing admin user's role to admin and password
      const hashedPassword = await bcrypt.hash('Wais@1234', 10);
      await connection.execute(
        'UPDATE users SET role = ?, password = ?, username = ? WHERE email = ?',
        ['admin', hashedPassword, 'Ahmad wais', 'ahmad.wais.sarwari786@gmail.com']
      );
      console.log('Second admin user role updated successfully!');
    } else {
      // Hash the password
      const hashedPassword = await bcrypt.hash('Wais@1234', 10);
      
      // Insert the new admin user
      const [result] = await connection.execute(
        'INSERT INTO users (email, password, username, role) VALUES (?, ?, ?, ?)',
        ['ahmad.wais.sarwari786@gmail.com', hashedPassword, 'Ahmad wais', 'admin']
      );
      
      console.log('Second admin user created successfully with ID:', result.insertId);
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
  .then(() => console.log('Second admin user creation completed'))
  .catch(err => console.error('Second admin user creation failed:', err));
