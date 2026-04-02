const mysql = require('mysql2/promise');

async function addMissingTables() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'online_resturant',
    multipleStatements: true
  });
  
  try {
    console.log('Adding missing tables...');
    
    const sql = `
    -- Food images table (for storing food/dish images)
    CREATE TABLE IF NOT EXISTS food_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        image_url TEXT NOT NULL,
        category VARCHAR(100),
        is_favorite BOOLEAN DEFAULT FALSE,
        is_special BOOLEAN DEFAULT FALSE,
        is_fast_food BOOLEAN DEFAULT FALSE,
        is_discounted BOOLEAN DEFAULT FALSE,
        discount_percentage INT DEFAULT 0,
        price DECIMAL(10,2) NOT NULL,
        description TEXT,
        ingredients TEXT,
        preparation_time VARCHAR(50),
        calories INT,
        is_available BOOLEAN DEFAULT TRUE,
        restaurant_id INT,
        display_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Banner/Background images table
    CREATE TABLE IF NOT EXISTS banner_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        image_url TEXT NOT NULL,
        type ENUM('hero', 'category', 'promotion', 'background') DEFAULT 'hero',
        link_url TEXT,
        display_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        start_date TIMESTAMP NULL,
        end_date TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

    -- Popular categories table
    CREATE TABLE IF NOT EXISTS popular_categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        image_url TEXT NOT NULL,
        description TEXT,
        display_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Feedback table
    CREATE TABLE IF NOT EXISTS feedbacks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        rating INT,
        status ENUM('pending', 'read', 'replied') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `;
    
    await connection.query(sql);
    console.log('✅ Missing tables created successfully!');
    
  } catch (error) {
    console.error('Error creating tables:', error.message);
  } finally {
    await connection.end();
  }
}

addMissingTables()
  .then(() => console.log('Table creation completed'))
  .catch(err => console.error('Table creation failed:', err));
