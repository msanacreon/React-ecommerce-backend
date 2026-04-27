const { pool } = require('./config/database');

const fakeProducts = [
  {
    name: 'Premium Wireless Headphones',
    description: 'Experience pure sound with these high-end noise-cancelling wireless headphones.',
    price: 299.99,
    stock: 25,
    category: 'Electronics',
    image_url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=600&auto=format&fit=crop'
  },
  {
    name: 'Smart Fitness Watch',
    description: 'Track your health and stay connected with this sleek modern smartwatch.',
    price: 199.50,
    stock: 50,
    category: 'Electronics',
    image_url: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=600&auto=format&fit=crop'
  },
  {
    name: 'Ergonomic Office Chair',
    description: 'Designed for comfort and posture. Perfect for your home office setup.',
    price: 149.99,
    stock: 12,
    category: 'Furniture',
    image_url: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=600&auto=format&fit=crop'
  },
  {
    name: 'Mechanical Keyboard',
    description: 'Clicky, responsive, and beautifully illuminated mechanical keyboard.',
    price: 89.99,
    stock: 45,
    category: 'Electronics',
    image_url: 'https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=600&auto=format&fit=crop'
  },
  {
    name: 'Premium Coffee Maker',
    description: 'Brew cafe-quality coffee from the comfort of your kitchen.',
    price: 125.00,
    stock: 8,
    category: 'Home & Kitchen',
    image_url: 'https://images.unsplash.com/photo-1495474472200-cfaebba7d5ff?q=80&w=600&auto=format&fit=crop'
  },
  {
    name: 'Minimalist Desk Lamp',
    description: 'Modern desk lamp with adjustable brightness and color temperature.',
    price: 45.00,
    stock: 30,
    category: 'Furniture',
    image_url: 'https://images.unsplash.com/photo-1534281324707-1601a096c4b2?q=80&w=600&auto=format&fit=crop'
  }
];

const generalImages = [
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop', // Headphones
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop', // Watch
  'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=600&auto=format&fit=crop', // Camera
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop', // Shoes
];

async function seed() {
  try {
    // 1. Check if we have any products
    const [rows] = await pool.execute('SELECT product_id FROM Products');
    
    if (rows.length === 0) {
      console.log('No products found. Inserting default products with beautiful images...');
      for (const prod of fakeProducts) {
        await pool.execute(
          'INSERT INTO Products (name, description, price, stock, category, image_url) VALUES (?, ?, ?, ?, ?, ?)',
          [prod.name, prod.description, prod.price, prod.stock, prod.category, prod.image_url]
        );
      }
      console.log('Successfully seeded 6 new products.');
    } else {
      console.log('Products found. Updating their images to highly aesthetic placeholders...');
      for (let i = 0; i < rows.length; i++) {
        const imageToUse = generalImages[i % generalImages.length];
        await pool.execute('UPDATE Products SET image_url = ? WHERE product_id = ?', [imageToUse, rows[i].product_id]);
      }
      console.log(`Updated images for ${rows.length} existing products.`);
    }

  } catch (error) {
    console.error('Error seeding images:', error);
  } finally {
    process.exit(0);
  }
}

seed();
