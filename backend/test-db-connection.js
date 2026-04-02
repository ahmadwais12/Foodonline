const mysql = require('mysql2/promise');

async function testConnection() {
  const passwords = ['', 'root', 'ahmad@wais12', 'password'];
  
  for (const pwd of passwords) {
    try {
      const conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: pwd || ''
      });
      console.log(`✅ Connected with password: "${pwd || '(empty)'}"`);
      
      const [rows] = await conn.query('SHOW DATABASES');
      console.log('Databases:', rows.map(r => r.Database));
      
      await conn.end();
      return pwd;
    } catch (e) {
      console.log(`❌ Password "${pwd || '(empty)'}" failed: ${e.message}`);
    }
  }
  return null;
}

testConnection()
  .then(pwd => {
    if (pwd !== null) {
      console.log(`\n✅ Working password found: "${pwd || '(empty)'}"`);
      console.log('Please update the .env file with this password.');
    } else {
      console.log('\n❌ No working password found. Please check MySQL configuration.');
    }
  });
