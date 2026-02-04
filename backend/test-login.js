const bcrypt = require('bcryptjs');
const db = require('./src/config/db');

async function testLogin() {
  console.log('Testing login functionality...');
  
  try {
    // Find the admin user
    const [users] = await db.execute(
      'SELECT id, email, username, password, role FROM users WHERE email = ?',
      ['ahmadwaissarwari@gmail.com']
    );

    if (users.length === 0) {
      console.log('Admin user not found');
      return;
    }

    const user = users[0];
    console.log('User found:', user.email, 'with role:', user.role);

    // Test password verification
    const passwordMatch = await bcrypt.compare('ahmadwais12', user.password);
    console.log('Password verification result:', passwordMatch);

    if (passwordMatch) {
      console.log('Login should be successful');
    } else {
      console.log('Password does not match');
    }
  } catch (error) {
    console.error('Error during login test:', error);
  }
}

testLogin();