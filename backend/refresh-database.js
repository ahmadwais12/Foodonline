const mysql = require('mysql2/promise');

async function refreshDatabase() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    multipleStatements: true
  });
  
  try {
    console.log('Dropping existing database...');
    await connection.query('DROP DATABASE IF EXISTS online_resturant');
    
    console.log('Creating fresh database...');
    await connection.query('CREATE DATABASE online_resturant');
    
    // Read and execute schema
    const fs = require('fs');
    const path = require('path');
    const schemaPath = path.join(__dirname, 'database', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('Executing schema...');
    await connection.query(schema);
    
    console.log('✅ Database refreshed successfully with all tables!');
    
  } catch (error) {
    console.error('Error refreshing database:', error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

refreshDatabase()
  .then(() => console.log('Database refresh completed'))
  .catch(err => console.error('Database refresh failed:', err));
