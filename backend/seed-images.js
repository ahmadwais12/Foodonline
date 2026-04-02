const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'online_resturant',
  port: process.env.DB_PORT || 3306
};

async function seedImages() {
  console.log('Starting image seeding...');
  
  const connection = await mysql.createConnection(dbConfig);
  
  try {
    // Define base URLs for images (these will be served from the frontend/dist/assets folder)
    const frontendAssetsPath = path.join(__dirname, '..', 'frontend', 'dist', 'assets');
    
    // Get list of food images
    const foodImagesDir = path.join(frontendAssetsPath, 'foodimages');
    const backgroundImagesDir = path.join(frontendAssetsPath, 'background images');
    
    let foodImageFiles = [];
    let bgImageFiles = [];
    
    try {
      foodImageFiles = fs.readdirSync(foodImagesDir);
    } catch (error) {
      console.log('Food images directory not found, will use placeholder URLs');
    }
    
    try {
      bgImageFiles = fs.readdirSync(backgroundImagesDir);
    } catch (error) {
      console.log('Background images directory not found, will use placeholder URLs');
    }
    
    console.log('Found food images:', foodImageFiles.length);
    console.log('Found background images:', bgImageFiles.length);
    
    // Clear existing data
    await connection.execute('DELETE FROM food_images');
    await connection.execute('DELETE FROM banner_images');
    await connection.execute('DELETE FROM popular_categories');
    
    // Seed food images
    console.log('Seeding food images...');
    
    const foodCategories = ['Pizza', 'Burger', 'Afghan Food', 'Drinks', 'Desserts', 'Pasta', 'Salad', 'Sandwich'];
    const isFavoriteFlags = [true, false, false, true, false, false, false, false];
    const isSpecialFlags = [false, true, false, false, true, false, false, false];
    const isFastFoodFlags = [true, true, false, false, false, true, false, true];
    const isDiscountedFlags = [false, false, false, false, true, false, true, false];
    
    for (let i = 0; i < Math.min(foodImageFiles.length, 20); i++) {
      const imageName = foodImageFiles[i];
      const imageUrl = `/assets/foodimages/${imageName}`;
      const category = foodCategories[i % foodCategories.length];
      
      await connection.execute(
        `INSERT INTO food_images (name, image_url, category, price, description, ingredients, 
         preparation_time, calories, is_favorite, is_special, is_fast_food, is_discounted, 
         discount_percentage, is_available) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          `Food Item ${i + 1}`,
          imageUrl,
          category,
          (Math.random() * 20 + 5).toFixed(2),
          `Delicious ${category} - A tasty dish that you'll love`,
          'Fresh ingredients, spices, vegetables, protein',
          `${Math.floor(Math.random() * 20 + 10)} minutes`,
          Math.floor(Math.random() * 500 + 200),
          isFavoriteFlags[i % isFavoriteFlags.length],
          isSpecialFlags[i % isSpecialFlags.length],
          isFastFoodFlags[i % isFastFoodFlags.length],
          isDiscountedFlags[i % isDiscountedFlags.length],
          isDiscountedFlags[i % isDiscountedFlags.length] ? Math.floor(Math.random() * 30 + 10) : 0,
          true
        ]
      );
    }
    
    // Seed banner/background images
    console.log('Seeding banner images...');
    
    const banners = [
      { title: 'Hero Banner 1', type: 'hero', order: 1 },
      { title: 'Hero Banner 2', type: 'hero', order: 2 },
      { title: 'Promotion Banner', type: 'promotion', order: 3 },
      { title: 'Category Background', type: 'category', order: 4 },
    ];
    
    for (let i = 0; i < banners.length; i++) {
      const banner = banners[i];
      const bgImage = bgImageFiles[i % bgImageFiles.length] || 'placeholder.svg';
      const imageUrl = `/assets/background images/${bgImage}`;
      
      await connection.execute(
        `INSERT INTO banner_images (title, image_url, type, display_order, is_active) VALUES (?, ?, ?, ?, ?)`,
        [banner.title, imageUrl, banner.type, banner.order, true]
      );
    }
    
    // Seed popular categories
    console.log('Seeding popular categories...');
    
    const categories = [
      { name: 'My Favourite Foods', slug: 'favourite-foods', description: 'Your most loved dishes' },
      { name: 'Special Offers', slug: 'special-offers', description: 'Exclusive deals and specials' },
      { name: 'Fast Foods', slug: 'fast-foods', description: 'Quick bites and fast food' },
      { name: 'Discounted Foods', slug: 'discounted-foods', description: 'Great food at discounted prices' },
      { name: 'Pizza', slug: 'pizza', description: 'Delicious pizzas' },
      { name: 'Burgers', slug: 'burgers', description: 'Juicy burgers' },
      { name: 'Afghan Food', slug: 'afghan-food', description: 'Traditional Afghan cuisine' },
      { name: 'Drinks', slug: 'drinks', description: 'Refreshing beverages' },
      { name: 'Desserts', slug: 'desserts', description: 'Sweet treats' },
    ];
    
    for (let i = 0; i < categories.length; i++) {
      const cat = categories[i];
      // Use category-specific images or fallback to first food image
      const imageUrl = foodImageFiles.length > 0 
        ? `/assets/foodimages/${foodImageFiles[i % foodImageFiles.length]}`
        : '/placeholder.svg';
      
      await connection.execute(
        `INSERT INTO popular_categories (name, slug, image_url, description, display_order, is_active) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [cat.name, cat.slug, imageUrl, cat.description, i, true]
      );
    }
    
    console.log('✅ Image seeding completed successfully!');
    console.log(`- Inserted ${Math.min(foodImageFiles.length, 20)} food images`);
    console.log(`- Inserted ${banners.length} banner images`);
    console.log(`- Inserted ${categories.length} popular categories`);
    
  } catch (error) {
    console.error('Error seeding images:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

// Run the seeding
seedImages()
  .then(() => console.log('Image seeding completed'))
  .catch(err => console.error('Image seeding failed:', err));
