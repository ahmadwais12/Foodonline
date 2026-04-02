const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env') });

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'online_resturant',
  port: process.env.DB_PORT || 3306,
  multipleStatements: true
};

async function syncDatabase() {
  let connection;
  try {
    console.log('Connecting to MySQL...');
    // Create connection without database first to ensure it exists
    const baseConn = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      port: dbConfig.port,
      multipleStatements: true
    });

    console.log(`Creating database ${dbConfig.database} if it doesn't exist...`);
    await baseConn.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    await baseConn.end();

    // Now connect to the actual database
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to database.');

    // 1. Read and execute schema.sql
    console.log('Reading schema.sql...');
    const schemaPath = path.join(__dirname, 'database', 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('Executing schema.sql...');
    await connection.query(schemaSql);
    console.log('Schema synchronized successfully.');

    // 2. Read and execute insertdata.txt
    console.log('Reading insertdata.txt...');
    const dataPath = path.join(__dirname, '..', 'insertdata.txt');
    let dataSql = fs.readFileSync(dataPath, 'utf8');
    
    // Clean up the SQL data
    // Remove USE statement if present as we're already connected
    dataSql = dataSql.replace(/USE\s+\w+;/gi, '');
    
    // Fix NOW() and intervals if they cause issues in some versions, but standard MySQL should be fine
    
    console.log('Inserting data from insertdata.txt...');
    // Execute line by line or in chunks if it's too large
    const statements = dataSql.split(';').filter(s => s.trim() !== '');
    
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i].trim();
      if (stmt) {
        try {
          await connection.query(stmt);
        } catch (err) {
          console.warn(`Warning executing statement ${i + 1}:`, err.message);
          // Continue if it's a duplicate entry error
          if (!err.message.includes('Duplicate entry')) {
            // throw err; // Uncomment if you want to stop on all errors
          }
        }
      }
    }
    
    console.log('Data insertion completed.');

  } catch (error) {
    console.error('Error during database synchronization:', error);
  } finally {
    if (connection) await connection.end();
  }
}

syncDatabase();
