const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

// Database connection configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'ahmad@wais12',
  database: 'online_resturant'
};

async function seedDatabase() {
  let connection;
  
  try {
    // Create database connection
    connection = await mysql.createConnection(dbConfig);
    
    console.log('Connected to database. Starting seeding process...');
    
    // Clear existing data (in reverse order of foreign key dependencies)
    console.log('Clearing existing data...');
    await connection.execute('DELETE FROM order_items');
    await connection.execute('DELETE FROM orders');
    await connection.execute('DELETE FROM reviews');
    await connection.execute('DELETE FROM user_favorites');
    await connection.execute('DELETE FROM menu_items');
    await connection.execute('DELETE FROM restaurants');
    await connection.execute('DELETE FROM categories');
    await connection.execute('DELETE FROM user_addresses');
    await connection.execute('DELETE FROM notifications');
    await connection.execute('DELETE FROM coupons');
    await connection.execute('DELETE FROM delivery_drivers');
    await connection.execute('DELETE FROM refresh_tokens');
    await connection.execute('DELETE FROM users WHERE email NOT IN ("ahmad.wais.sarwari786@gmail.com", "ahmadwaissarwari@gmail.com")');
    
    console.log('Existing data cleared.');
    
    // Seed categories
    console.log('Seeding categories...');
    const categories = [
      { name: 'Pizza', slug: 'pizza', display_order: 1 },
      { name: 'Burgers', slug: 'burgers', display_order: 2 },
      { name: 'Sushi', slug: 'sushi', display_order: 3 },
      { name: 'Pasta', slug: 'pasta', display_order: 4 },
      { name: 'Salads', slug: 'salads', display_order: 5 },
      { name: 'Desserts', slug: 'desserts', display_order: 6 },
      { name: 'Drinks', slug: 'drinks', display_order: 7 },
      { name: 'Asian', slug: 'asian', display_order: 8 }
    ];
    
    for (const category of categories) {
      await connection.execute(
        'INSERT INTO categories (name, slug, display_order) VALUES (?, ?, ?)',
        [category.name, category.slug, category.display_order]
      );
    }
    
    // Get category IDs
    const [categoryRows] = await connection.execute('SELECT id, slug FROM categories');
    const categoryMap = {};
    categoryRows.forEach(row => {
      categoryMap[row.slug] = row.id;
    });
    
    console.log('Categories seeded.');
    
    // Seed restaurants
    console.log('Seeding restaurants...');
    const restaurants = [
      {
        name: 'Tony\'s Pizza Palace',
        slug: 'tonys-pizza-palace',
        description: 'Authentic Italian pizza made with fresh ingredients and traditional recipes.',
        category_id: categoryMap['pizza'],
        rating: 4.8,
        total_reviews: 120,
        delivery_time: '25-35 min',
        delivery_fee: 2.99,
        min_order: 15.00,
        address: '123 Main St, Kabul, Afghanistan',
        phone: '+93 70 123 4567'
      },
      {
        name: 'Burger Junction',
        slug: 'burger-junction',
        description: 'Juicy burgers with premium beef and fresh toppings.',
        category_id: categoryMap['burgers'],
        rating: 4.6,
        total_reviews: 95,
        delivery_time: '20-30 min',
        delivery_fee: 1.99,
        min_order: 10.00,
        address: '456 Oak Ave, Kabul, Afghanistan',
        phone: '+93 70 234 5678'
      },
      {
        name: 'Sakura Sushi Bar',
        slug: 'sakura-sushi-bar',
        description: 'Fresh sushi and Japanese cuisine prepared by expert chefs.',
        category_id: categoryMap['sushi'],
        rating: 4.9,
        total_reviews: 150,
        delivery_time: '30-40 min',
        delivery_fee: 3.99,
        min_order: 20.00,
        address: '789 Pine Rd, Kabul, Afghanistan',
        phone: '+93 70 345 6789'
      },
      {
        name: 'Pasta Paradise',
        slug: 'pasta-paradise',
        description: 'Delicious Italian pasta dishes with homemade sauces.',
        category_id: categoryMap['pasta'],
        rating: 4.7,
        total_reviews: 85,
        delivery_time: '25-35 min',
        delivery_fee: 2.49,
        min_order: 12.00,
        address: '101 Elm St, Kabul, Afghanistan',
        phone: '+93 70 456 7890'
      }
    ];
    
    const restaurantIds = [];
    for (const restaurant of restaurants) {
      const [result] = await connection.execute(
        `INSERT INTO restaurants 
         (name, slug, description, category_id, rating, total_reviews, delivery_time, 
          delivery_fee, min_order, address, phone) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [restaurant.name, restaurant.slug, restaurant.description, restaurant.category_id,
         restaurant.rating, restaurant.total_reviews, restaurant.delivery_time,
         restaurant.delivery_fee, restaurant.min_order, restaurant.address, restaurant.phone]
      );
      restaurantIds.push(result.insertId);
    }
    
    console.log('Restaurants seeded.');
    
    // Seed menu items
    console.log('Seeding menu items...');
    const menuItems = [
      // Pizza items
      {
        restaurant_id: restaurantIds[0],
        name: 'Margherita Pizza',
        description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil',
        price: 12.99,
        category: 'Pizza',
        is_vegetarian: true
      },
      {
        restaurant_id: restaurantIds[0],
        name: 'Pepperoni Pizza',
        description: 'Pizza topped with spicy pepperoni slices and mozzarella cheese',
        price: 14.99,
        category: 'Pizza',
        is_vegetarian: false
      },
      {
        restaurant_id: restaurantIds[0],
        name: 'Vegetarian Supreme',
        description: 'Loaded with mushrooms, bell peppers, onions, olives, and tomatoes',
        price: 15.99,
        category: 'Pizza',
        is_vegetarian: true
      },
      
      // Burger items
      {
        restaurant_id: restaurantIds[1],
        name: 'Classic Cheeseburger',
        description: 'Beef patty with cheddar cheese, lettuce, tomato, and special sauce',
        price: 9.99,
        category: 'Burgers',
        is_vegetarian: false
      },
      {
        restaurant_id: restaurantIds[1],
        name: 'Veggie Burger',
        description: 'Plant-based patty with fresh vegetables and vegan mayo',
        price: 8.99,
        category: 'Burgers',
        is_vegetarian: true
      },
      {
        restaurant_id: restaurantIds[1],
        name: 'Double Bacon Burger',
        description: 'Two beef patties with crispy bacon, cheese, and special sauce',
        price: 12.99,
        category: 'Burgers',
        is_vegetarian: false
      },
      
      // Sushi items
      {
        restaurant_id: restaurantIds[2],
        name: 'California Roll',
        description: 'Crab, avocado, and cucumber rolled in seaweed and rice',
        price: 8.99,
        category: 'Sushi',
        is_vegetarian: false
      },
      {
        restaurant_id: restaurantIds[2],
        name: 'Vegetable Tempura Roll',
        description: 'Assorted vegetables tempura with soy sauce',
        price: 7.99,
        category: 'Sushi',
        is_vegetarian: true
      },
      {
        restaurant_id: restaurantIds[2],
        name: 'Salmon Nigiri',
        description: 'Fresh salmon slices over pressed vinegared rice',
        price: 6.99,
        category: 'Sushi',
        is_vegetarian: false
      },
      
      // Pasta items
      {
        restaurant_id: restaurantIds[3],
        name: 'Spaghetti Carbonara',
        description: 'Classic Roman pasta with eggs, cheese, pancetta, and black pepper',
        price: 11.99,
        category: 'Pasta',
        is_vegetarian: false
      },
      {
        restaurant_id: restaurantIds[3],
        name: 'Penne Arrabbiata',
        description: 'Penne pasta with spicy tomato sauce and garlic',
        price: 10.99,
        category: 'Pasta',
        is_vegetarian: true
      },
      {
        restaurant_id: restaurantIds[3],
        name: 'Fettuccine Alfredo',
        description: 'Flat ribbon pasta with rich butter and parmesan cheese sauce',
        price: 12.99,
        category: 'Pasta',
        is_vegetarian: true
      }
    ];
    
    const menuItemIds = [];
    for (const item of menuItems) {
      const [result] = await connection.execute(
        'INSERT INTO menu_items (restaurant_id, name, description, price, category, is_vegetarian) VALUES (?, ?, ?, ?, ?, ?)',
        [item.restaurant_id, item.name, item.description, item.price, item.category, item.is_vegetarian]
      );
      menuItemIds.push(result.insertId);
    }
    
    console.log('Menu items seeded.');
    
    // Seed some reviews
    console.log('Seeding reviews...');
    const reviews = [
      {
        user_id: 1, // Assuming admin user exists
        restaurant_id: restaurantIds[0],
        rating: 5,
        comment: 'Amazing pizza! Best I\'ve had in Kabul.'
      },
      {
        user_id: 1,
        restaurant_id: restaurantIds[1],
        rating: 4,
        comment: 'Great burgers, fast delivery!'
      },
      {
        user_id: 1,
        restaurant_id: restaurantIds[2],
        rating: 5,
        comment: 'Fresh sushi and excellent service.'
      }
    ];
    
    for (const review of reviews) {
      await connection.execute(
        'INSERT INTO reviews (user_id, restaurant_id, rating, comment) VALUES (?, ?, ?, ?)',
        [review.user_id, review.restaurant_id, review.rating, review.comment]
      );
    }
    
    console.log('Reviews seeded.');
    
    // Seed some orders to populate statistics
    console.log('Seeding orders...');
    const orders = [
      {
        order_number: 'ORD-001',
        user_id: 1,
        restaurant_id: restaurantIds[0],
        delivery_address: JSON.stringify({
          street: '123 Main St',
          city: 'Kabul',
          country: 'Afghanistan'
        }),
        subtotal: 27.97,
        delivery_fee: 2.99,
        tax: 2.50,
        total: 33.46,
        status: 'delivered',
        payment_status: 'paid',
        payment_method: 'credit_card'
      },
      {
        order_number: 'ORD-002',
        user_id: 1,
        restaurant_id: restaurantIds[1],
        delivery_address: JSON.stringify({
          street: '456 Oak Ave',
          city: 'Kabul',
          country: 'Afghanistan'
        }),
        subtotal: 18.98,
        delivery_fee: 1.99,
        tax: 1.75,
        total: 22.72,
        status: 'delivered',
        payment_status: 'paid',
        payment_method: 'cash'
      },
      {
        order_number: 'ORD-003',
        user_id: 1,
        restaurant_id: restaurantIds[2],
        delivery_address: JSON.stringify({
          street: '789 Pine Rd',
          city: 'Kabul',
          country: 'Afghanistan'
        }),
        subtotal: 23.97,
        delivery_fee: 3.99,
        tax: 2.25,
        total: 30.21,
        status: 'delivered',
        payment_status: 'paid',
        payment_method: 'paypal'
      }
    ];
    
    for (const order of orders) {
      await connection.execute(
        `INSERT INTO orders 
         (order_number, user_id, restaurant_id, delivery_address, subtotal, delivery_fee, tax, total, 
          status, payment_status, payment_method) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [order.order_number, order.user_id, order.restaurant_id, order.delivery_address, order.subtotal,
         order.delivery_fee, order.tax, order.total, order.status, 
         order.payment_status, order.payment_method]
      );
    }
    
    console.log('Orders seeded.');
    
    console.log('Database seeding completed successfully!');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the function
seedDatabase();