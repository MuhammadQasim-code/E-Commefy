const mongoose = require('mongoose');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const dotenv = require('dotenv');

const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Review = require('../models/Review');
const Cart = require('../models/Cart');
const Wishlist = require('../models/Wishlist');
const Order = require('../models/Order');

const seedDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB for seeding');

    // Clear all collections
    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      Review.deleteMany({}),
      Cart.deleteMany({}),
      Wishlist.deleteMany({}),
      Order.deleteMany({}),
    ]);
    console.log('✅ All collections cleared');

    // ─── Create Users ───────────────────────────────────
    console.log('👤 Creating users...');
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@ecommefy.com',
      password: 'Admin@123',
      role: 'admin',
      phone: '1234567890',
    });

    const customer1 = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'Customer@123',
      role: 'customer',
      phone: '9876543210',
      addresses: [
        {
          fullName: 'John Doe',
          phone: '9876543210',
          country: 'United States',
          state: 'California',
          city: 'Los Angeles',
          postalCode: '90001',
          address: '123 Main Street, Apt 4B',
          isDefault: true,
        },
      ],
    });

    const customer2 = await User.create({
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'Customer@123',
      role: 'customer',
      phone: '5551234567',
      addresses: [
        {
          fullName: 'Jane Smith',
          phone: '5551234567',
          country: 'United States',
          state: 'New York',
          city: 'New York City',
          postalCode: '10001',
          address: '456 Broadway, Suite 12',
          isDefault: true,
        },
      ],
    });

    console.log('✅ Users created: Admin, John Doe, Jane Smith');

    // ─── Create Categories ──────────────────────────────
    console.log('📁 Creating categories...');
    const categories = await Category.insertMany([
      {
        name: 'Electronics',
        description: 'Latest gadgets, smartphones, laptops, and electronic accessories.',
        image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&auto=format&fit=crop&q=80',
        isActive: true,
      },
      {
        name: 'Fashion',
        description: 'Trendy clothing, shoes, and accessories for men and women.',
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&auto=format&fit=crop&q=80',
        isActive: true,
      },
      {
        name: 'Home & Kitchen',
        description: 'Home appliances, kitchen essentials, and home decor items.',
        image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500&auto=format&fit=crop&q=80',
        isActive: true,
      },
      {
        name: 'Sports & Outdoors',
        description: 'Sports equipment, outdoor gear, and fitness accessories.',
        image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&auto=format&fit=crop&q=80',
        isActive: true,
      },
      {
        name: 'Books',
        description: 'Best-selling books, textbooks, and e-books across all genres.',
        image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500&auto=format&fit=crop&q=80',
        isActive: true,
      },
      {
        name: 'Beauty & Personal Care',
        description: 'Skincare, makeup, haircare, and personal grooming products.',
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&auto=format&fit=crop&q=80',
        isActive: true,
      },
      {
        name: 'Toys & Games',
        description: 'Fun toys, board games, and educational toys for all ages.',
        image: 'https://images.unsplash.com/photo-1532330393533-443990a51d10?w=500&auto=format&fit=crop&q=80',
        isActive: true,
      },
      {
        name: 'Automotive',
        description: 'Car accessories, tools, and automotive parts for your vehicle.',
        image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=500&auto=format&fit=crop&q=80',
        isActive: true,
      },
    ]);

    console.log(`✅ ${categories.length} categories created`);

    // Map categories by name for easy reference
    const catMap = {};
    categories.forEach((cat) => {
      catMap[cat.name] = cat._id;
    });

    // ─── Create Products ────────────────────────────────
    console.log('📦 Creating products...');

    const productsData = [
      // Electronics (5 products)
      {
        name: 'Wireless Bluetooth Headphones',
        description:
          'Premium noise-cancelling wireless headphones with 40-hour battery life. Features deep bass, comfortable over-ear design, and built-in microphone for calls.',
        price: 79.99,
        discountPrice: 59.99,
        category: catMap['Electronics'],
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80'],
        stock: 150,
        brand: 'SoundMax',
        tags: ['headphones', 'wireless', 'bluetooth', 'noise-cancelling'],
        ratingsAverage: 4.5,
        ratingsCount: 128,
        sold: 342,
        isFeatured: true,
      },
      {
        name: 'Ultra-Slim 15.6" Laptop',
        description:
          'Powerful ultra-slim laptop with Intel i7 processor, 16GB RAM, and 512GB SSD. Perfect for productivity and entertainment with a stunning Full HD display.',
        price: 899.99,
        discountPrice: 749.99,
        category: catMap['Electronics'],
        images: ['https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&auto=format&fit=crop&q=80'],
        stock: 45,
        brand: 'TechPro',
        tags: ['laptop', 'computer', 'intel', 'ultrabook'],
        ratingsAverage: 4.7,
        ratingsCount: 89,
        sold: 156,
        isFeatured: true,
      },
      {
        name: 'Smart Watch Pro Series',
        description:
          'Advanced smartwatch with heart rate monitor, GPS tracking, and SpO2 sensor. Water-resistant up to 50m with a 7-day battery life and always-on AMOLED display.',
        price: 249.99,
        discountPrice: 199.99,
        category: catMap['Electronics'],
        images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80'],
        stock: 200,
        brand: 'WristTech',
        tags: ['smartwatch', 'fitness', 'gps', 'health'],
        ratingsAverage: 4.3,
        ratingsCount: 215,
        sold: 578,
        isFeatured: true,
      },
      {
        name: '4K Ultra HD Action Camera',
        description:
          'Capture stunning 4K video and 20MP photos with this rugged action camera. Waterproof up to 30m with electronic image stabilization and Wi-Fi connectivity.',
        price: 199.99,
        discountPrice: 0,
        category: catMap['Electronics'],
        images: ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&auto=format&fit=crop&q=80'],
        stock: 80,
        brand: 'AdventureCam',
        tags: ['camera', '4k', 'action-camera', 'waterproof'],
        ratingsAverage: 4.1,
        ratingsCount: 67,
        sold: 123,
        isFeatured: false,
      },
      {
        name: 'Portable Bluetooth Speaker',
        description:
          'Compact and powerful portable speaker with 360-degree sound. IPX7 waterproof rating, 12-hour playtime, and built-in power bank functionality.',
        price: 49.99,
        discountPrice: 39.99,
        category: catMap['Electronics'],
        images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&auto=format&fit=crop&q=80'],
        stock: 300,
        brand: 'BoomBox',
        tags: ['speaker', 'bluetooth', 'portable', 'waterproof'],
        ratingsAverage: 4.4,
        ratingsCount: 312,
        sold: 890,
        isFeatured: false,
      },

      // Fashion (5 products)
      {
        name: "Men's Classic Fit Oxford Shirt",
        description:
          'Timeless oxford shirt crafted from premium cotton. Features a comfortable classic fit, button-down collar, and available in multiple colors for every occasion.',
        price: 45.99,
        discountPrice: 34.99,
        category: catMap['Fashion'],
        images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&auto=format&fit=crop&q=80'],
        stock: 250,
        brand: 'UrbanStyle',
        tags: ['shirt', 'oxford', 'mens', 'classic'],
        ratingsAverage: 4.2,
        ratingsCount: 156,
        sold: 420,
        isFeatured: true,
      },
      {
        name: "Women's Running Sneakers",
        description:
          'Lightweight and breathable running shoes with responsive cushioning. Engineered mesh upper provides superior ventilation and a secure, comfortable fit.',
        price: 89.99,
        discountPrice: 69.99,
        category: catMap['Fashion'],
        images: ['https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=500&auto=format&fit=crop&q=80'],
        stock: 180,
        brand: 'StrideX',
        tags: ['shoes', 'running', 'sneakers', 'womens'],
        ratingsAverage: 4.6,
        ratingsCount: 203,
        sold: 567,
        isFeatured: true,
      },
      {
        name: 'Leather Crossbody Bag',
        description:
          'Elegant genuine leather crossbody bag with adjustable strap. Features multiple compartments, RFID-blocking pocket, and a sleek minimalist design.',
        price: 65.99,
        discountPrice: 0,
        category: catMap['Fashion'],
        images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&auto=format&fit=crop&q=80'],
        stock: 120,
        brand: 'LuxeCraft',
        tags: ['bag', 'leather', 'crossbody', 'accessories'],
        ratingsAverage: 4.4,
        ratingsCount: 98,
        sold: 234,
        isFeatured: false,
      },
      {
        name: "Men's Slim Fit Denim Jeans",
        description:
          'Premium stretch denim jeans with a modern slim fit. Made with durable cotton blend fabric featuring a comfortable mid-rise waist and tapered leg.',
        price: 59.99,
        discountPrice: 44.99,
        category: catMap['Fashion'],
        images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&auto=format&fit=crop&q=80'],
        stock: 200,
        brand: 'DenimCo',
        tags: ['jeans', 'denim', 'slim-fit', 'mens'],
        ratingsAverage: 4.3,
        ratingsCount: 178,
        sold: 445,
        isFeatured: false,
      },
      {
        name: 'Polarized Aviator Sunglasses',
        description:
          'Classic aviator sunglasses with UV400 polarized lenses. Lightweight metal frame with adjustable nose pads for a custom fit. Comes with a premium hard case.',
        price: 34.99,
        discountPrice: 24.99,
        category: catMap['Fashion'],
        images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&auto=format&fit=crop&q=80'],
        stock: 350,
        brand: 'SunShield',
        tags: ['sunglasses', 'aviator', 'polarized', 'accessories'],
        ratingsAverage: 4.5,
        ratingsCount: 267,
        sold: 789,
        isFeatured: false,
      },

      // Home & Kitchen (4 products)
      {
        name: 'Stainless Steel French Press Coffee Maker',
        description:
          'Premium double-wall insulated French press that keeps coffee hot for hours. Made from 18/10 stainless steel with a 4-level filtration system for a clean, rich brew.',
        price: 39.99,
        discountPrice: 29.99,
        category: catMap['Home & Kitchen'],
        images: ['https://images.unsplash.com/photo-1518057111178-44a106bad636?w=500&auto=format&fit=crop&q=80'],
        stock: 175,
        brand: 'BrewMaster',
        tags: ['coffee', 'french-press', 'kitchen', 'stainless-steel'],
        ratingsAverage: 4.6,
        ratingsCount: 342,
        sold: 812,
        isFeatured: true,
      },
      {
        name: 'Robot Vacuum Cleaner',
        description:
          'Smart robot vacuum with laser navigation and 2700Pa suction power. Features app control, automatic charging, and multi-floor mapping for effortless cleaning.',
        price: 299.99,
        discountPrice: 249.99,
        category: catMap['Home & Kitchen'],
        images: ['https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=500&auto=format&fit=crop&q=80'],
        stock: 60,
        brand: 'CleanBot',
        tags: ['vacuum', 'robot', 'smart-home', 'cleaning'],
        ratingsAverage: 4.4,
        ratingsCount: 189,
        sold: 345,
        isFeatured: true,
      },
      {
        name: 'Non-Stick Cookware Set (10-Piece)',
        description:
          'Complete 10-piece cookware set with durable non-stick ceramic coating. Includes fry pans, saucepans, and a Dutch oven. Oven-safe up to 450°F and dishwasher-safe.',
        price: 129.99,
        discountPrice: 99.99,
        category: catMap['Home & Kitchen'],
        images: ['https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=500&auto=format&fit=crop&q=80'],
        stock: 90,
        brand: 'ChefElite',
        tags: ['cookware', 'non-stick', 'kitchen', 'ceramic'],
        ratingsAverage: 4.5,
        ratingsCount: 156,
        sold: 378,
        isFeatured: false,
      },
      {
        name: 'Memory Foam Pillow Set (2-Pack)',
        description:
          'Ergonomic memory foam pillows designed for optimal neck and spine support. Hypoallergenic, breathable bamboo cover that stays cool throughout the night.',
        price: 49.99,
        discountPrice: 37.99,
        category: catMap['Home & Kitchen'],
        images: ['https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500&auto=format&fit=crop&q=80'],
        stock: 220,
        brand: 'DreamRest',
        tags: ['pillow', 'memory-foam', 'bedroom', 'sleep'],
        ratingsAverage: 4.3,
        ratingsCount: 234,
        sold: 567,
        isFeatured: false,
      },

      // Sports & Outdoors (4 products)
      {
        name: 'Adjustable Dumbbell Set (5-52.5 lbs)',
        description:
          'Space-saving adjustable dumbbells that replace 15 sets of weights. Quick dial system allows you to adjust from 5 to 52.5 lbs in seconds. Perfect for home gyms.',
        price: 349.99,
        discountPrice: 299.99,
        category: catMap['Sports & Outdoors'],
        images: ['https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=500&auto=format&fit=crop&q=80'],
        stock: 40,
        brand: 'IronFlex',
        tags: ['dumbbells', 'weights', 'fitness', 'home-gym'],
        ratingsAverage: 4.8,
        ratingsCount: 145,
        sold: 234,
        isFeatured: true,
      },
      {
        name: 'Yoga Mat with Alignment Lines',
        description:
          'Extra-thick 6mm yoga mat with laser-etched alignment lines. Non-slip surface on both sides, eco-friendly TPE material, and comes with a carrying strap.',
        price: 29.99,
        discountPrice: 0,
        category: catMap['Sports & Outdoors'],
        images: ['https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=500&auto=format&fit=crop&q=80'],
        stock: 400,
        brand: 'ZenFit',
        tags: ['yoga', 'mat', 'fitness', 'exercise'],
        ratingsAverage: 4.5,
        ratingsCount: 478,
        sold: 1234,
        isFeatured: false,
      },
      {
        name: 'Ultralight Camping Tent (2-Person)',
        description:
          'Compact and lightweight 2-person tent weighing only 3.5 lbs. Features a waterproof rainfly, mesh ventilation panels, and sets up in under 5 minutes.',
        price: 159.99,
        discountPrice: 129.99,
        category: catMap['Sports & Outdoors'],
        images: ['https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=500&auto=format&fit=crop&q=80'],
        stock: 75,
        brand: 'TrailPeak',
        tags: ['tent', 'camping', 'outdoor', 'ultralight'],
        ratingsAverage: 4.6,
        ratingsCount: 112,
        sold: 189,
        isFeatured: false,
      },
      {
        name: 'Insulated Water Bottle (32 oz)',
        description:
          'Triple-insulated stainless steel water bottle that keeps drinks cold for 24 hours or hot for 12 hours. BPA-free with a leak-proof lid and wide mouth opening.',
        price: 24.99,
        discountPrice: 19.99,
        category: catMap['Sports & Outdoors'],
        images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=80'],
        stock: 500,
        brand: 'HydroCore',
        tags: ['water-bottle', 'insulated', 'sports', 'hydration'],
        ratingsAverage: 4.7,
        ratingsCount: 567,
        sold: 2345,
        isFeatured: false,
      },

      // Books (3 products)
      {
        name: 'The Art of Clean Code',
        description:
          'A comprehensive guide to writing elegant, maintainable code. Covers best practices, design patterns, and refactoring techniques with real-world examples.',
        price: 34.99,
        discountPrice: 27.99,
        category: catMap['Books'],
        images: ['https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&auto=format&fit=crop&q=80'],
        stock: 150,
        brand: 'TechPress',
        tags: ['programming', 'coding', 'software', 'education'],
        ratingsAverage: 4.8,
        ratingsCount: 234,
        sold: 567,
        isFeatured: false,
      },
      {
        name: 'Mindset: The Psychology of Success',
        description:
          'Discover how your mindset shapes your life and learn to develop a growth mindset. This bestseller offers practical strategies for achieving success in all areas.',
        price: 16.99,
        discountPrice: 12.99,
        category: catMap['Books'],
        images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=80'],
        stock: 300,
        brand: 'RandomHouse',
        tags: ['psychology', 'self-help', 'motivation', 'bestseller'],
        ratingsAverage: 4.6,
        ratingsCount: 1456,
        sold: 4567,
        isFeatured: true,
      },
      {
        name: 'Mastering Modern JavaScript',
        description:
          'The definitive guide to modern JavaScript from ES6 to ES2024. Covers async/await, modules, TypeScript integration, and full-stack development patterns.',
        price: 44.99,
        discountPrice: 0,
        category: catMap['Books'],
        images: ['https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=500&auto=format&fit=crop&q=80'],
        stock: 100,
        brand: 'CodePublish',
        tags: ['javascript', 'programming', 'web-development', 'education'],
        ratingsAverage: 4.5,
        ratingsCount: 189,
        sold: 345,
        isFeatured: false,
      },

      // Beauty & Personal Care (3 products)
      {
        name: 'Vitamin C Brightening Serum',
        description:
          'Advanced brightening serum with 20% Vitamin C, hyaluronic acid, and vitamin E. Reduces dark spots, evens skin tone, and boosts collagen production for a radiant glow.',
        price: 28.99,
        discountPrice: 22.99,
        category: catMap['Beauty & Personal Care'],
        images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop&q=80'],
        stock: 250,
        brand: 'GlowLab',
        tags: ['skincare', 'serum', 'vitamin-c', 'brightening'],
        ratingsAverage: 4.4,
        ratingsCount: 567,
        sold: 1234,
        isFeatured: false,
      },
      {
        name: 'Professional Hair Dryer',
        description:
          'Salon-grade hair dryer with ionic technology that reduces frizz and drying time by 50%. Features 3 heat settings, 2 speed settings, and a cool shot button.',
        price: 59.99,
        discountPrice: 44.99,
        category: catMap['Beauty & Personal Care'],
        images: ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop&q=80'],
        stock: 130,
        brand: 'StylePro',
        tags: ['hair-dryer', 'haircare', 'styling', 'ionic'],
        ratingsAverage: 4.3,
        ratingsCount: 345,
        sold: 678,
        isFeatured: false,
      },
      {
        name: 'Electric Toothbrush with Smart Timer',
        description:
          'Rechargeable sonic electric toothbrush with 5 brushing modes and a 2-minute smart timer. Removes up to 10x more plaque than a manual toothbrush.',
        price: 39.99,
        discountPrice: 29.99,
        category: catMap['Beauty & Personal Care'],
        images: ['https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=500&auto=format&fit=crop&q=80'],
        stock: 200,
        brand: 'DentaCare',
        tags: ['toothbrush', 'electric', 'oral-care', 'dental'],
        ratingsAverage: 4.5,
        ratingsCount: 423,
        sold: 890,
        isFeatured: false,
      },

      // Toys & Games (3 products)
      {
        name: 'Building Blocks Mega Set (1000 Pieces)',
        description:
          'Spark creativity with this massive 1000-piece building block set. Compatible with all major brands, includes a variety of colors and shapes, plus an instruction booklet.',
        price: 39.99,
        discountPrice: 29.99,
        category: catMap['Toys & Games'],
        images: ['https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=500&auto=format&fit=crop&q=80'],
        stock: 180,
        brand: 'BuildFun',
        tags: ['building-blocks', 'lego', 'creative', 'kids'],
        ratingsAverage: 4.7,
        ratingsCount: 389,
        sold: 1234,
        isFeatured: false,
      },
      {
        name: 'Strategy Board Game Collection',
        description:
          'Premium board game featuring 4 classic strategy games in one box. Includes chess, checkers, backgammon, and a modern deck-building card game for family fun.',
        price: 34.99,
        discountPrice: 0,
        category: catMap['Toys & Games'],
        images: ['https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=500&auto=format&fit=crop&q=80'],
        stock: 120,
        brand: 'GameNight',
        tags: ['board-game', 'strategy', 'family', 'card-game'],
        ratingsAverage: 4.4,
        ratingsCount: 178,
        sold: 345,
        isFeatured: false,
      },
      {
        name: 'RC Racing Drone with HD Camera',
        description:
          'High-speed racing drone with 1080p HD camera and FPV real-time transmission. Features 3D flips, headless mode, altitude hold, and up to 20 minutes of flight time.',
        price: 89.99,
        discountPrice: 69.99,
        category: catMap['Toys & Games'],
        images: ['https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=500&auto=format&fit=crop&q=80'],
        stock: 65,
        brand: 'SkyRacer',
        tags: ['drone', 'rc', 'camera', 'racing'],
        ratingsAverage: 4.2,
        ratingsCount: 156,
        sold: 234,
        isFeatured: false,
      },

      // Automotive (3 products)
      {
        name: 'Dash Cam with Night Vision',
        description:
          'Full HD 1080p dash camera with superior night vision and 170° wide-angle lens. Features loop recording, G-sensor for collision detection, and parking mode.',
        price: 69.99,
        discountPrice: 54.99,
        category: catMap['Automotive'],
        images: ['https://images.unsplash.com/photo-1506015391300-4802dc74de2e?w=500&auto=format&fit=crop&q=80'],
        stock: 110,
        brand: 'RoadEye',
        tags: ['dashcam', 'car', 'camera', 'night-vision'],
        ratingsAverage: 4.3,
        ratingsCount: 234,
        sold: 456,
        isFeatured: false,
      },
      {
        name: 'Portable Jump Starter Power Bank',
        description:
          'Compact 2000A peak jump starter that can start 12V vehicles up to 8.0L gas and 6.5L diesel engines. Doubles as a portable power bank with USB-C and QC3.0 ports.',
        price: 79.99,
        discountPrice: 64.99,
        category: catMap['Automotive'],
        images: ['https://images.unsplash.com/photo-1563720223185-11003d516935?w=500&auto=format&fit=crop&q=80'],
        stock: 95,
        brand: 'PowerDrive',
        tags: ['jump-starter', 'car', 'power-bank', 'emergency'],
        ratingsAverage: 4.6,
        ratingsCount: 312,
        sold: 567,
        isFeatured: false,
      },
      {
        name: 'Car Seat Organizer with Tablet Holder',
        description:
          'Multi-pocket backseat organizer with a built-in tablet holder for passengers. Made from durable, waterproof material with touch-screen compatible window.',
        price: 19.99,
        discountPrice: 14.99,
        category: catMap['Automotive'],
        images: ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&auto=format&fit=crop&q=80'],
        stock: 350,
        brand: 'AutoTidy',
        tags: ['organizer', 'car', 'accessories', 'tablet-holder'],
        ratingsAverage: 4.1,
        ratingsCount: 189,
        sold: 678,
        isFeatured: false,
      },
    ];

    const products = await Product.insertMany(productsData);
    console.log(`✅ ${products.length} products created`);

    // ─── Create Sample Reviews ──────────────────────────
    console.log('⭐ Creating sample reviews...');

    const reviewsData = [
      // Reviews for Wireless Bluetooth Headphones
      {
        user: customer1._id,
        product: products[0]._id,
        rating: 5,
        comment: 'Absolutely incredible sound quality! The noise cancellation is top-notch and the battery easily lasts 2 full days of commuting.',
      },
      {
        user: customer2._id,
        product: products[0]._id,
        rating: 4,
        comment: 'Great headphones for the price. Very comfortable for long listening sessions. Only wish they came with a hard case.',
      },
      // Reviews for Ultra-Slim Laptop
      {
        user: customer1._id,
        product: products[1]._id,
        rating: 5,
        comment: 'This laptop is a beast! Super fast, lightweight, and the display is gorgeous. Perfect for both work and entertainment.',
      },
      {
        user: customer2._id,
        product: products[1]._id,
        rating: 4,
        comment: 'Excellent performance and build quality. The keyboard is really comfortable to type on. Highly recommend for professionals.',
      },
      // Reviews for Smart Watch
      {
        user: customer1._id,
        product: products[2]._id,
        rating: 4,
        comment: 'Love the fitness tracking features and the display is beautiful. Battery lasts about 5 days with heavy use.',
      },
      // Reviews for Men's Oxford Shirt
      {
        user: customer2._id,
        product: products[5]._id,
        rating: 5,
        comment: 'Perfect fit and the fabric quality is outstanding. Looks great for both office and casual settings. Ordered 3 more!',
      },
      // Reviews for French Press
      {
        user: customer1._id,
        product: products[10]._id,
        rating: 5,
        comment: 'Makes the best coffee I have ever had at home. The double-wall insulation keeps it hot for a long time. Well worth the investment.',
      },
      {
        user: customer2._id,
        product: products[10]._id,
        rating: 4,
        comment: 'Excellent build quality and the coffee it makes is smooth and rich. Easy to clean too. Highly recommended!',
      },
      // Reviews for Dumbbell Set
      {
        user: customer1._id,
        product: products[14]._id,
        rating: 5,
        comment: 'Game changer for my home gym! The weight adjustment is so quick and easy. Replaced an entire rack of dumbbells.',
      },
      // Reviews for Mindset Book
      {
        user: customer2._id,
        product: products[19]._id,
        rating: 5,
        comment: 'Life-changing book! It completely shifted my perspective on learning and personal growth. A must-read for everyone.',
      },
    ];

    const reviews = await Review.insertMany(reviewsData);
    console.log(`✅ ${reviews.length} reviews created`);

    // ─── Summary ────────────────────────────────────────
    console.log('\n' + '═'.repeat(50));
    console.log('🌱 SEED COMPLETE!');
    console.log('═'.repeat(50));
    console.log(`👤 Users:      ${3} (1 admin + 2 customers)`);
    console.log(`📁 Categories: ${categories.length}`);
    console.log(`📦 Products:   ${products.length}`);
    console.log(`⭐ Reviews:    ${reviews.length}`);
    console.log('═'.repeat(50));
    console.log('\n📋 Test Accounts:');
    console.log('   Admin:    admin@ecommefy.com / Admin@123');
    console.log('   Customer: john@example.com  / Customer@123');
    console.log('   Customer: jane@example.com  / Customer@123');
    console.log('═'.repeat(50));

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    console.error(error);
    process.exit(1);
  }
};

seedDB();
