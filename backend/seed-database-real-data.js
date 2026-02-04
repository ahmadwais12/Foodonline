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

async function seedDatabase() {
  console.log('Starting database seeding with real data...');
  
  const connection = await mysql.createConnection(dbConfig);
  
  try {
    // Clear existing data (with proper foreign key constraint handling)
    console.log('Clearing existing data...');
    await connection.execute('SET FOREIGN_KEY_CHECKS = 0'); // Disable foreign key checks temporarily
    
    // Clear only the tables that exist in the database, in the correct order
    await connection.execute('TRUNCATE TABLE user_favorites');
    await connection.execute('TRUNCATE TABLE reviews');
    await connection.execute('TRUNCATE TABLE user_addresses');
    await connection.execute('TRUNCATE TABLE order_items');
    await connection.execute('TRUNCATE TABLE orders');
    await connection.execute('TRUNCATE TABLE menu_items');
    await connection.execute('TRUNCATE TABLE restaurants');
    await connection.execute('TRUNCATE TABLE coupons');
    await connection.execute('TRUNCATE TABLE users');
    await connection.execute('TRUNCATE TABLE roles');
    await connection.execute('TRUNCATE TABLE categories');
    await connection.execute('TRUNCATE TABLE notifications');
    await connection.execute('TRUNCATE TABLE settings');
    await connection.execute('TRUNCATE TABLE refresh_tokens');
    await connection.execute('TRUNCATE TABLE delivery_drivers');
    await connection.execute('TRUNCATE TABLE driver_locations');
    
    await connection.execute('SET FOREIGN_KEY_CHECKS = 1'); // Re-enable foreign key checks
    
    // Real data for each table
    const realData = {
      categories: [
        { name: 'Fast Food', slug: 'fast-food', image_url: 'https://via.placeholder.com/300x200?text=Fast+Food' },
        { name: 'Pizza', slug: 'pizza', image_url: 'https://via.placeholder.com/300x200?text=Pizza' },
        { name: 'Burgers', slug: 'burgers', image_url: 'https://via.placeholder.com/300x200?text=Burgers' },
        { name: 'Chinese', slug: 'chinese', image_url: 'https://via.placeholder.com/300x200?text=Chinese' },
        { name: 'Italian', slug: 'italian', image_url: 'https://via.placeholder.com/300x200?text=Italian' },
        { name: 'Mexican', slug: 'mexican', image_url: 'https://via.placeholder.com/300x200?text=Mexican' },
        { name: 'Healthy', slug: 'healthy', image_url: 'https://via.placeholder.com/300x200?text=Healthy' },
        { name: 'Desserts', slug: 'desserts', image_url: 'https://via.placeholder.com/300x200?text=Desserts' },
        { name: 'Seafood', slug: 'seafood', image_url: 'https://via.placeholder.com/300x200?text=Seafood' },
        { name: 'Vegetarian', slug: 'vegetarian', image_url: 'https://via.placeholder.com/300x200?text=Vegetarian' }
      ],
      
      users: [
        { email: 'ahmadwaissarwari@gmail.com', password: 'ahmadwais12', username: 'ahmadadmin', role: 'admin' },
        { email: 'john.doe@example.com', password: 'password123', username: 'johndoe', role: 'customer' },
        { email: 'jane.smith@example.com', password: 'password123', username: 'janesmith', role: 'customer' },
        { email: 'mike.johnson@example.com', password: 'password123', username: 'mikej', role: 'customer' },
        { email: 'sarah.wilson@example.com', password: 'password123', username: 'sarahw', role: 'customer' },
        { email: 'david.brown@example.com', password: 'password123', username: 'davidb', role: 'customer' },
        { email: 'lisa.davis@example.com', password: 'password123', username: 'lisad', role: 'customer' },
        { email: 'tom.miller@example.com', password: 'password123', username: 'tomm', role: 'customer' },
        { email: 'amy.garcia@example.com', password: 'password123', username: 'amyg', role: 'customer' },
        { email: 'chris.lee@example.com', password: 'password123', username: 'chrisl', role: 'customer' }
      ],
      
      restaurants: [
        { name: 'Burger Palace', slug: 'burger-palace', description: 'Best burgers in town with fresh ingredients', image_url: 'https://via.placeholder.com/600x400?text=Burger+Palace', cover_image_url: 'https://via.placeholder.com/1200x400?text=Burger+Palace+Cover', category_id: 3, rating: 4.5, total_reviews: 120, delivery_time: '25-35 min', delivery_fee: 2.99, min_order: 10.00, address: '123 Main St, City Center', phone: '(555) 123-4567' },
        { name: 'Pizza Corner', slug: 'pizza-corner', description: 'Authentic Italian pizza made with love', image_url: 'https://via.placeholder.com/600x400?text=Pizza+Corner', cover_image_url: 'https://via.placeholder.com/1200x400?text=Pizza+Corner+Cover', category_id: 2, rating: 4.7, total_reviews: 95, delivery_time: '30-40 min', delivery_fee: 3.99, min_order: 15.00, address: '456 Oak Ave, Downtown', phone: '(555) 234-5678' },
        { name: 'Taco Fiesta', slug: 'taco-fiesta', description: 'Delicious Mexican tacos and burritos', image_url: 'https://via.placeholder.com/600x400?text=Taco+Fiesta', cover_image_url: 'https://via.placeholder.com/1200x400?text=Taco+Fiesta+Cover', category_id: 6, rating: 4.3, total_reviews: 87, delivery_time: '20-30 min', delivery_fee: 1.99, min_order: 8.00, address: '789 Pine St, West Side', phone: '(555) 345-6789' },
        { name: 'Sushi Master', slug: 'sushi-master', description: 'Fresh sushi and Japanese cuisine', image_url: 'https://via.placeholder.com/600x400?text=Sushi+Master', cover_image_url: 'https://via.placeholder.com/1200x400?text=Sushi+Master+Cover', category_id: 9, rating: 4.8, total_reviews: 142, delivery_time: '40-50 min', delivery_fee: 4.99, min_order: 20.00, address: '321 Elm St, East District', phone: '(555) 456-7890' },
        { name: 'Healthy Eats', slug: 'healthy-eats', description: 'Organic and healthy meal options', image_url: 'https://via.placeholder.com/600x400?text=Healthy+Eats', cover_image_url: 'https://via.placeholder.com/1200x400?text=Healthy+Eats+Cover', category_id: 7, rating: 4.6, total_reviews: 76, delivery_time: '25-35 min', delivery_fee: 2.49, min_order: 12.00, address: '654 Maple Ave, North Side', phone: '(555) 567-8901' },
        { name: 'Seafood Delight', slug: 'seafood-delight', description: 'Fresh seafood from the ocean', image_url: 'https://via.placeholder.com/600x400?text=Seafood+Delight', cover_image_url: 'https://via.placeholder.com/1200x400?text=Seafood+Delight+Cover', category_id: 9, rating: 4.4, total_reviews: 103, delivery_time: '35-45 min', delivery_fee: 5.99, min_order: 25.00, address: '987 Beach Blvd, Waterfront', phone: '(555) 678-9012' },
        { name: 'Chinese Garden', slug: 'chinese-garden', description: 'Authentic Chinese cuisine', image_url: 'https://via.placeholder.com/600x400?text=Chinese+Garden', cover_image_url: 'https://via.placeholder.com/1200x400?text=Chinese+Garden+Cover', category_id: 4, rating: 4.2, total_reviews: 89, delivery_time: '30-40 min', delivery_fee: 3.49, min_order: 12.00, address: '147 Cherry St, Chinatown', phone: '(555) 789-0123' },
        { name: 'Veggie Delight', slug: 'veggie-delight', description: 'Delicious vegetarian and vegan options', image_url: 'https://via.placeholder.com/600x400?text=Veggie+Delight', cover_image_url: 'https://via.placeholder.com/1200x400?text=Veggie+Delight+Cover', category_id: 10, rating: 4.5, total_reviews: 67, delivery_time: '20-30 min', delivery_fee: 2.99, min_order: 10.00, address: '258 Spruce St, Green District', phone: '(555) 890-1234' },
        { name: 'Italian Pasta House', slug: 'italian-pasta-house', description: 'Authentic Italian pasta and more', image_url: 'https://via.placeholder.com/600x400?text=Italian+Pasta+House', cover_image_url: 'https://via.placeholder.com/1200x400?text=Italian+Pasta+House+Cover', category_id: 5, rating: 4.7, total_reviews: 115, delivery_time: '35-45 min', delivery_fee: 3.99, min_order: 15.00, address: '369 Cedar Ave, Little Italy', phone: '(555) 901-2345' },
        { name: 'Sweet Treats', slug: 'sweet-treats', description: 'Delicious desserts and pastries', image_url: 'https://via.placeholder.com/600x400?text=Sweet+Treats', cover_image_url: 'https://via.placeholder.com/1200x400?text=Sweet+Treats+Cover', category_id: 8, rating: 4.9, total_reviews: 134, delivery_time: '15-25 min', delivery_fee: 1.99, min_order: 5.00, address: '741 Ash St, Sweet Street', phone: '(555) 012-3456' }
      ],
      
      menu_items: [
        { restaurant_id: 1, name: 'Classic Cheeseburger', description: 'Beef patty with cheese, lettuce, tomato, and special sauce', price: 8.99, image_url: 'https://via.placeholder.com/300x200?text=Cheeseburger', category: 'Main Course', is_vegetarian: false },
        { restaurant_id: 1, name: 'Double Bacon Burger', description: 'Two beef patties with bacon, cheese, and our signature sauce', price: 11.99, image_url: 'https://via.placeholder.com/300x200?text=Double+Bacon', category: 'Main Course', is_vegetarian: false },
        { restaurant_id: 1, name: 'Veggie Burger', description: 'Plant-based patty with fresh vegetables', price: 9.49, image_url: 'https://via.placeholder.com/300x200?text=Veggie+Burger', category: 'Main Course', is_vegetarian: true },
        { restaurant_id: 1, name: 'French Fries', description: 'Crispy golden fries with salt', price: 3.99, image_url: 'https://via.placeholder.com/300x200?text=Fries', category: 'Side Dish', is_vegetarian: true },
        { restaurant_id: 1, name: 'Onion Rings', description: 'Crispy battered onion rings', price: 4.49, image_url: 'https://via.placeholder.com/300x200?text=Onion+Rings', category: 'Side Dish', is_vegetarian: true },
        { restaurant_id: 2, name: 'Margherita Pizza', description: 'Classic pizza with tomato sauce, mozzarella, and basil', price: 12.99, image_url: 'https://via.placeholder.com/300x200?text=Margherita', category: 'Main Course', is_vegetarian: true },
        { restaurant_id: 2, name: 'Pepperoni Pizza', description: 'Pizza with tomato sauce, mozzarella, and pepperoni', price: 14.99, image_url: 'https://via.placeholder.com/300x200?text=Pepperoni', category: 'Main Course', is_vegetarian: false },
        { restaurant_id: 2, name: 'Vegetarian Pizza', description: 'Pizza with various vegetables and cheese', price: 13.99, image_url: 'https://via.placeholder.com/300x200?text=Veggie+Pizza', category: 'Main Course', is_vegetarian: true },
        { restaurant_id: 2, name: 'Garlic Bread', description: 'Freshly baked bread with garlic butter', price: 5.99, image_url: 'https://via.placeholder.com/300x200?text=Garlic+Bread', category: 'Side Dish', is_vegetarian: true },
        { restaurant_id: 2, name: 'Caesar Salad', description: 'Fresh romaine lettuce with Caesar dressing and croutons', price: 7.99, image_url: 'https://via.placeholder.com/300x200?text=Caesar+Salad', category: 'Salad', is_vegetarian: true }
      ],
      
      user_addresses: [
        { user_id: 2, label: 'Home', address_line1: '123 Main Street', city: 'New York', state: 'NY', postal_code: '10001', latitude: 40.7128, longitude: -74.0060 },
        { user_id: 2, label: 'Work', address_line1: '456 Office Blvd', city: 'New York', state: 'NY', postal_code: '10002', latitude: 40.7589, longitude: -73.9851 },
        { user_id: 3, label: 'Apartment', address_line1: '789 Park Avenue', city: 'Brooklyn', state: 'NY', postal_code: '11201', latitude: 40.6782, longitude: -73.9442 },
        { user_id: 4, label: 'House', address_line1: '321 Oak Street', city: 'Queens', state: 'NY', postal_code: '11375', latitude: 40.7282, longitude: -73.7949 },
        { user_id: 5, label: 'Condo', address_line1: '654 Elm Avenue', city: 'Manhattan', state: 'NY', postal_code: '10025', latitude: 40.7831, longitude: -73.9712 },
        { user_id: 6, label: 'Home', address_line1: '987 Pine Road', city: 'Bronx', state: 'NY', postal_code: '10451', latitude: 40.8448, longitude: -73.8648 },
        { user_id: 7, label: 'Dorm', address_line1: '147 College Street', city: 'Staten Island', state: 'NY', postal_code: '10301', latitude: 40.5795, longitude: -74.1502 },
        { user_id: 8, label: 'Townhouse', address_line1: '258 Maple Lane', city: 'Jersey City', state: 'NJ', postal_code: '07306', latitude: 40.7178, longitude: -74.0431 },
        { user_id: 9, label: 'Apartment', address_line1: '369 Cedar Avenue', city: 'Hoboken', state: 'NJ', postal_code: '07030', latitude: 40.7439, longitude: -74.0324 },
        { user_id: 10, label: 'House', address_line1: '741 Birch Street', city: 'Newark', state: 'NJ', postal_code: '07102', latitude: 40.7357, longitude: -74.1724 }
      ],
      
      reviews: [
        { user_id: 2, restaurant_id: 1, rating: 5, comment: 'The best burgers in the city! Highly recommend the double bacon.' },
        { user_id: 3, restaurant_id: 1, rating: 4, comment: 'Great food and fast delivery. Will order again.' },
        { user_id: 4, restaurant_id: 2, rating: 5, comment: 'Authentic Italian pizza. The Margherita was perfect!' },
        { user_id: 5, restaurant_id: 2, rating: 4, comment: 'Good pizza but could be a bit more cheesy.' },
        { user_id: 6, restaurant_id: 3, rating: 5, comment: 'Amazing tacos! The spicy chicken was delicious.' },
        { user_id: 7, restaurant_id: 3, rating: 4, comment: 'Great flavors and quick service.' },
        { user_id: 8, restaurant_id: 4, rating: 5, comment: 'Fresh sushi and excellent service. Will come back.' },
        { user_id: 9, restaurant_id: 4, rating: 4, comment: 'Good quality but a bit expensive.' },
        { user_id: 10, restaurant_id: 5, rating: 5, comment: 'Healthy options that actually taste good. Love it!' },
        { user_id: 2, restaurant_id: 5, rating: 4, comment: 'Good for a quick healthy meal. Delivery was fast.' }
      ],
      
      coupons: [
        { code: 'WELCOME10', description: 'Welcome discount for new customers', discount_type: 'percentage', discount_value: 10.00, min_order_value: 20.00, max_discount: 5.00, valid_from: new Date(Date.now() - 86400000), valid_until: new Date(Date.now() + 7776000000), usage_limit: 1000, used_count: 0 },
        { code: 'FREESHIP', description: 'Free delivery on orders over $25', discount_type: 'fixed', discount_value: 3.99, min_order_value: 25.00, max_discount: 3.99, valid_from: new Date(Date.now() - 86400000), valid_until: new Date(Date.now() + 2592000000), usage_limit: 500, used_count: 0 },
        { code: 'SUMMER20', description: 'Summer special discount', discount_type: 'percentage', discount_value: 20.00, min_order_value: 30.00, max_discount: 15.00, valid_from: new Date(Date.now() - 86400000), valid_until: new Date(Date.now() + 5184000000), usage_limit: 800, used_count: 0 },
        { code: 'TACOTUESDAY', description: 'Taco Tuesday special', discount_type: 'percentage', discount_value: 15.00, min_order_value: 15.00, max_discount: 10.00, valid_from: new Date(Date.now() - 86400000), valid_until: new Date(Date.now() + 2592000000), usage_limit: 300, used_count: 0 },
        { code: 'PIZZAPAL', description: 'Pizza lover discount', discount_type: 'fixed', discount_value: 5.00, min_order_value: 20.00, max_discount: 5.00, valid_from: new Date(Date.now() - 86400000), valid_until: new Date(Date.now() + 5184000000), usage_limit: 400, used_count: 0 },
        { code: 'HEALTHY15', description: 'Healthy eating discount', discount_type: 'percentage', discount_value: 15.00, min_order_value: 18.00, max_discount: 8.00, valid_from: new Date(Date.now() - 86400000), valid_until: new Date(Date.now() + 2592000000), usage_limit: 600, used_count: 0 },
        { code: 'SUSHILOVE', description: 'Sushi enthusiast discount', discount_type: 'percentage', discount_value: 12.00, min_order_value: 35.00, max_discount: 12.00, valid_from: new Date(Date.now() - 86400000), valid_until: new Date(Date.now() + 7776000000), usage_limit: 200, used_count: 0 },
        { code: 'DESSERT25', description: 'Sweet treats discount', discount_type: 'fixed', discount_value: 2.50, min_order_value: 10.00, max_discount: 2.50, valid_from: new Date(Date.now() - 86400000), valid_until: new Date(Date.now() + 2592000000), usage_limit: 700, used_count: 0 },
        { code: 'ITALIAN22', description: 'Authentic Italian discount', discount_type: 'percentage', discount_value: 22.00, min_order_value: 22.00, max_discount: 11.00, valid_from: new Date(Date.now() - 86400000), valid_until: new Date(Date.now() + 5184000000), usage_limit: 550, used_count: 0 },
        { code: 'MEXICAN18', description: 'Mexican cuisine discount', discount_type: 'percentage', discount_value: 18.00, min_order_value: 15.00, max_discount: 9.00, valid_from: new Date(Date.now() - 86400000), valid_until: new Date(Date.now() + 2592000000), usage_limit: 450, used_count: 0 }
      ]
    };

    // Insert categories
    console.log('Inserting categories...');
    for (const category of realData.categories) {
      const [result] = await connection.execute(
        'INSERT INTO categories (name, slug, image_url) VALUES (?, ?, ?)',
        [category.name, category.slug, category.image_url]
      );
      console.log(`Inserted category: ${category.name} with ID: ${result.insertId}`);
    }

    // Insert users (with password hashing)
    console.log('Inserting users...');
    for (const user of realData.users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const [result] = await connection.execute(
        'INSERT INTO users (email, password, username, role) VALUES (?, ?, ?, ?)',
        [user.email, hashedPassword, user.username, user.role]
      );
      console.log(`Inserted user: ${user.email} with ID: ${result.insertId}`);
    }

    // Insert restaurants
    console.log('Inserting restaurants...');
    for (const restaurant of realData.restaurants) {
      const [result] = await connection.execute(
        'INSERT INTO restaurants (name, slug, description, image_url, cover_image_url, category_id, rating, total_reviews, delivery_time, delivery_fee, min_order, address, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [restaurant.name, restaurant.slug, restaurant.description, restaurant.image_url, restaurant.cover_image_url, restaurant.category_id, restaurant.rating, restaurant.total_reviews, restaurant.delivery_time, restaurant.delivery_fee, restaurant.min_order, restaurant.address, restaurant.phone]
      );
      console.log(`Inserted restaurant: ${restaurant.name} with ID: ${result.insertId}`);
    }

    // Insert menu items
    console.log('Inserting menu items...');
    for (const menuItem of realData.menu_items) {
      const [result] = await connection.execute(
        'INSERT INTO menu_items (restaurant_id, name, description, price, image_url, category, is_vegetarian) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [menuItem.restaurant_id, menuItem.name, menuItem.description, menuItem.price, menuItem.image_url, menuItem.category, menuItem.is_vegetarian]
      );
      console.log(`Inserted menu item: ${menuItem.name} with ID: ${result.insertId}`);
    }

    // Insert user addresses
    console.log('Inserting user addresses...');
    for (const address of realData.user_addresses) {
      const [result] = await connection.execute(
        'INSERT INTO user_addresses (user_id, label, address_line1, city, state, postal_code, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [address.user_id, address.label, address.address_line1, address.city, address.state, address.postal_code, address.latitude, address.longitude]
      );
      console.log(`Inserted address for user ID: ${address.user_id} with ID: ${result.insertId}`);
    }

    // Insert reviews
    console.log('Inserting reviews...');
    for (const review of realData.reviews) {
      const [result] = await connection.execute(
        'INSERT INTO reviews (user_id, restaurant_id, rating, comment) VALUES (?, ?, ?, ?)',
        [review.user_id, review.restaurant_id, review.rating, review.comment]
      );
      console.log(`Inserted review for user ${review.user_id} and restaurant ${review.restaurant_id} with ID: ${result.insertId}`);
    }

    // Insert coupons
    console.log('Inserting coupons...');
    for (const coupon of realData.coupons) {
      const [result] = await connection.execute(
        'INSERT INTO coupons (code, description, discount_type, discount_value, min_order_value, max_discount, valid_from, valid_until, usage_limit, used_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [coupon.code, coupon.description, coupon.discount_type, coupon.discount_value, coupon.min_order_value, coupon.max_discount, coupon.valid_from, coupon.valid_until, coupon.usage_limit, coupon.used_count]
      );
      console.log(`Inserted coupon: ${coupon.code} with ID: ${result.insertId}`);
    }

    console.log('Database seeding completed successfully!');
    
  } catch (error) {
    console.error('Error during database seeding:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

// Run the seeding function
seedDatabase()
  .then(() => console.log('Seeding completed'))
  .catch(err => console.error('Seeding failed:', err));