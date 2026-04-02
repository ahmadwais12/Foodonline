const mysql = require('mysql2/promise');

async function createDatabase() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    multipleStatements: true  // Allow multiple statements
  });
  
  try {
    // Read schema file
    const fs = require('fs');
    const path = require('path');
    const schemaPath = path.join(__dirname, 'database', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute the entire schema at once
    await connection.query(schema);
    console.log('✅ Database schema created successfully');
    
  } catch (error) {
    console.error('Error creating database:', error.message);
    // Continue even if there are errors (tables might already exist)
  } finally {
    await connection.end();
  }
}

createDatabase()
  .then(() => console.log('Database setup completed'))
  .catch(err => console.error('Database setup failed:', err));
