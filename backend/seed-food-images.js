const mysql = require('mysql2/promise');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env') });

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'online_resturant',
  port: process.env.DB_PORT || 3306
};

const foodImages = [
  {
    name: 'Kabuli Pulao',
    image_url: '/assets/foodimages/foodImages (1).jpg',
    category: 'Afghan',
    description: 'Traditional Afghan rice dish with tender lamb, raisins, and carrots.',
    ingredients: 'Basmati rice, Lamb meat, Carrots, Raisins, Cardamom, Cumin, Onions',
    preparation_time: '45-60 min',
    calories: 850
  },
  {
    name: 'Pepperoni Pizza',
    image_url: '/assets/foodimages/foodImages (2).jpg',
    category: 'Pizza',
    description: 'Classic Italian-style pizza with beef pepperoni and mozzarella cheese.',
    ingredients: 'Pizza dough, Tomato sauce, Mozzarella cheese, Beef pepperoni, Oregano',
    preparation_time: '20-25 min',
    calories: 1200
  },
  {
    name: 'Double Cheese Burger',
    image_url: '/assets/foodimages/foodImages (3).jpg',
    category: 'Burger',
    description: 'Juicy double beef patty with melted cheddar cheese and fresh toppings.',
    ingredients: 'Beef patty, Cheddar cheese, Lettuce, Tomato, Onion, Pickles, Burger bun',
    preparation_time: '15-20 min',
    calories: 950
  },
  {
    name: 'Manto',
    image_url: '/assets/foodimages/foodImages (4).jpg',
    category: 'Afghan',
    description: 'Steamed Afghan dumplings filled with minced meat and onions, topped with yogurt and lentils.',
    ingredients: 'Dough wrapper, Minced beef, Onions, Garlic, Yogurt, Split chickpeas, Dried mint',
    preparation_time: '40-50 min',
    calories: 650
  },
  {
    name: 'California Sushi Roll',
    image_url: '/assets/foodimages/foodImages (5).jpg',
    category: 'Sushi',
    description: 'Refreshing sushi roll with crab meat, avocado, and cucumber.',
    ingredients: 'Sushi rice, Nori, Crab meat, Avocado, Cucumber, Sesame seeds',
    preparation_time: '25-30 min',
    calories: 450
  },
  {
    name: 'Butter Chicken',
    image_url: '/assets/foodimages/foodImages (6).jpg',
    category: 'Indian',
    description: 'Creamy and flavorful Indian curry with tender chicken pieces.',
    ingredients: 'Chicken, Butter, Heavy cream, Tomato puree, Garam masala, Ginger, Garlic',
    preparation_time: '35-45 min',
    calories: 750
  },
  {
    name: 'Strawberry Smoothie',
    image_url: '/assets/foodimages/foodImages (7).jpg',
    category: 'Drinks',
    description: 'Freshly blended strawberries with milk and a hint of honey.',
    ingredients: 'Strawberries, Milk, Yogurt, Honey, Ice cubes',
    preparation_time: '5-10 min',
    calories: 250
  },
  {
    name: 'Zinger Burger',
    image_url: '/assets/foodimages/foodImages (8).jpg',
    category: 'Fast Food',
    description: 'Extra crispy spicy chicken burger with zesty mayo.',
    ingredients: 'Crispy chicken fillet, Lettuce, Mayonnaise, Spicy seasoning, Burger bun',
    preparation_time: '15-20 min',
    calories: 800
  },
  {
    name: 'Greek Salad',
    image_url: '/assets/foodimages/foodImages (9).jpg',
    category: 'Salad',
    description: 'Fresh Mediterranean salad with feta cheese, olives, and vegetables.',
    ingredients: 'Cucumber, Tomatoes, Red onion, Feta cheese, Kalamata olives, Olive oil',
    preparation_time: '10-15 min',
    calories: 350
  },
  {
    name: 'Grilled Chicken Meal',
    image_url: '/assets/foodimages/foodImages (10).jpg',
    category: 'Chicken',
    description: 'Perfectly seasoned grilled chicken breast served with steamed rice and side salad.',
    ingredients: 'Chicken breast, Basmati rice, Seasonal vegetables, Lemon, Herbs',
    preparation_time: '30-40 min',
    calories: 600
  }
];

const restaurantImages = [
  { slug: 'kabul-darbar', image_url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800', cover_image_url: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200' },
  { slug: 'pizza-world', image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800', cover_image_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200' },
  { slug: 'burger-haven', image_url: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800', cover_image_url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=1200' },
  { slug: 'herat-saffron', image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800', cover_image_url: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=1200' },
  { slug: 'tokyo-sushi', image_url: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=800', cover_image_url: 'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=1200' },
  { slug: 'indian-spice', image_url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800', cover_image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200' },
  { slug: 'fresh-smoothies', image_url: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=800', cover_image_url: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=1200' },
  { slug: 'fast-bite', image_url: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800', cover_image_url: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=1200' },
  { slug: 'healthy-salads', image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800', cover_image_url: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=1200' },
  { slug: 'chicken-express', image_url: 'https://images.unsplash.com/photo-1626700051175-656868ed2bb1?w=800', cover_image_url: 'https://images.unsplash.com/photo-1460306855393-0410f61241c7?w=1200' }
];

const categoryImages = [
  { slug: 'pizza', image_url: '/assets/foodimages/foodImages (1).jpg' },
  { slug: 'burgers', image_url: '/assets/foodimages/foodImages (2).jpg' },
  { slug: 'drinks', image_url: '/assets/foodimages/foodImages (3).jpg' },
  { slug: 'desserts', image_url: '/assets/foodimages/foodImages (4).jpg' },
  { slug: 'sandwiches', image_url: '/assets/foodimages/foodImages (5).jpg' },
  { slug: 'afghan-food', image_url: '/assets/foodimages/foodImages (6).jpg' },
  { slug: 'indian-food', image_url: '/assets/foodimages/foodImages (7).jpg' },
  { slug: 'fast-food', image_url: '/assets/foodimages/foodImages (8).jpg' },
  { slug: 'salads', image_url: '/assets/foodimages/foodImages (9).jpg' },
  { slug: 'chicken-meals', image_url: '/assets/foodimages/foodImages (10).jpg' }
];

async function updateImages() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to database for image updates.');

    // 1. Update Category Images
    console.log('Updating category images...');
    for (const cat of categoryImages) {
      await connection.execute(
        'UPDATE categories SET image_url = ? WHERE slug = ?',
        [cat.image_url, cat.slug]
      );
    }

    // 2. Update Restaurant Images
    console.log('Updating restaurant images...');
    for (const res of restaurantImages) {
      await connection.execute(
        'UPDATE restaurants SET image_url = ?, cover_image_url = ? WHERE slug = ?',
        [res.image_url, res.cover_image_url, res.slug]
      );
    }

    // 3. Update Menu Item Images and metadata
    console.log('Updating menu item images and metadata...');
    for (const food of foodImages) {
      await connection.execute(
        'UPDATE menu_items SET image_url = ?, description = ? WHERE name = ?',
        [food.image_url, food.description, food.name]
      );
    }

    // 4. Populate food_images table for the UI sections (Popular, Special, etc.)
    console.log('Populating food_images table for special sections...');
    // Clear existing if any (optional, but good for fresh seed)
    await connection.execute('DELETE FROM food_images');
    
    for (let i = 0; i < foodImages.length; i++) {
      const food = foodImages[i];
      // Distribute foods into different sections for variety in UI
      const is_favorite = i % 3 === 0;
      const is_special = i % 4 === 0;
      const is_fast_food = food.category === 'Fast Food' || food.category === 'Burger' || food.category === 'Pizza';
      const is_discounted = i % 5 === 0;
      const discount_percentage = is_discounted ? 15 : 0;
      const price = 5 + (i * 2); // Random-ish price

      await connection.execute(
        `INSERT INTO food_images 
        (name, image_url, category, is_favorite, is_special, is_fast_food, is_discounted, discount_percentage, price, description, ingredients, preparation_time, calories) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          food.name, 
          food.image_url, 
          food.category, 
          is_favorite, 
          is_special, 
          is_fast_food, 
          is_discounted, 
          discount_percentage, 
          price, 
          food.description, 
          food.ingredients, 
          food.preparation_time, 
          food.calories
        ]
      );
    }

    console.log('All images and metadata updated successfully.');

  } catch (error) {
    console.error('Error updating images:', error);
  } finally {
    if (connection) await connection.end();
  }
}

updateImages();
