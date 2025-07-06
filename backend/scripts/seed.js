const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Product = require('../models/Product');
 

// Sample products data
const sampleProducts = [
  {
    name: "Premium Rice (25kg)",
    description: "High-quality basmati rice, perfect for retail stores. Premium grade with excellent cooking properties.",
    shortDescription: "High-quality basmati rice for retail",
    category: "Food & Grains",
    brand: "Premium Grains",
    price: 1250,
    originalPrice: 1400,
    wholesalePrice: 1200,
    stockQuantity: 500,
    minOrderQuantity: 10,
    maxOrderQuantity: 500,
    sku: "RICE-001",
    barcode: "8901234567890",
    weight: { value: 25, unit: "kg" },
    dimensions: { length: 60, width: 30, height: 15, unit: "cm" },
    images: [
      { url: "/uploads/rice-1.jpg", alt: "Premium Rice", isPrimary: true },
      { url: "/uploads/rice-2.jpg", alt: "Rice Package" }
    ],
    isActive: true,
    isFeatured: true,
    isBestSeller: true,
    rating: { average: 4.5, count: 128 },
    specifications: [
      { name: "Type", value: "Basmati" },
      { name: "Grade", value: "Premium" },
      { name: "Origin", value: "India" }
    ],
    tags: ["rice", "basmati", "premium", "wholesale"],
    shippingWeight: 26,
    isFreeShipping: false
  },
  {
    name: "Cooking Oil (15L)",
    description: "Pure sunflower cooking oil in bulk packaging. Ideal for restaurants and retail stores.",
    shortDescription: "Pure sunflower cooking oil",
    category: "Food & Grains",
    brand: "SunFresh",
    price: 2100,
    originalPrice: 2300,
    wholesalePrice: 2000,
    stockQuantity: 200,
    minOrderQuantity: 5,
    maxOrderQuantity: 100,
    sku: "OIL-001",
    barcode: "8901234567891",
    weight: { value: 15, unit: "l" },
    dimensions: { length: 40, width: 25, height: 30, unit: "cm" },
    images: [
      { url: "/uploads/oil-1.jpg", alt: "Cooking Oil", isPrimary: true }
    ],
    isActive: true,
    isFeatured: true,
    rating: { average: 4.3, count: 95 },
    specifications: [
      { name: "Type", value: "Sunflower Oil" },
      { name: "Volume", value: "15 Liters" },
      { name: "Purity", value: "100%" }
    ],
    tags: ["oil", "cooking", "sunflower", "bulk"],
    shippingWeight: 16,
    isFreeShipping: false
  },
  {
    name: "Detergent Powder (5kg)",
    description: "High-efficiency detergent powder for all fabrics. Removes tough stains and keeps clothes fresh.",
    shortDescription: "High-efficiency detergent powder",
    category: "Household",
    brand: "CleanPro",
    price: 450,
    originalPrice: 500,
    wholesalePrice: 400,
    stockQuantity: 300,
    minOrderQuantity: 20,
    maxOrderQuantity: 200,
    sku: "DET-001",
    barcode: "8901234567892",
    weight: { value: 5, unit: "kg" },
    dimensions: { length: 35, width: 25, height: 10, unit: "cm" },
    images: [
      { url: "/uploads/detergent-1.jpg", alt: "Detergent Powder", isPrimary: true }
    ],
    isActive: true,
    isBestSeller: true,
    rating: { average: 4.7, count: 203 },
    specifications: [
      { name: "Type", value: "Powder Detergent" },
      { name: "Weight", value: "5kg" },
      { name: "Fragrance", value: "Fresh" }
    ],
    tags: ["detergent", "laundry", "cleaning", "powder"],
    shippingWeight: 5.5,
    isFreeShipping: false
  },
  {
    name: "Tea Packets (250g x 20)",
    description: "Premium tea blend in retail-ready packaging. Perfect for grocery stores and convenience stores.",
    shortDescription: "Premium tea blend packets",
    category: "Beverages",
    brand: "TeaLeaf",
    price: 1800,
    originalPrice: 2000,
    wholesalePrice: 1700,
    stockQuantity: 0,
    minOrderQuantity: 15,
    maxOrderQuantity: 150,
    sku: "TEA-001",
    barcode: "8901234567893",
    weight: { value: 5, unit: "kg" },
    dimensions: { length: 30, width: 20, height: 15, unit: "cm" },
    images: [
      { url: "/uploads/tea-1.jpg", alt: "Tea Packets", isPrimary: true }
    ],
    isActive: true,
    rating: { average: 4.4, count: 156 },
    specifications: [
      { name: "Type", value: "Black Tea" },
      { name: "Packets", value: "20 x 250g" },
      { name: "Origin", value: "Assam" }
    ],
    tags: ["tea", "beverages", "black tea", "packets"],
    shippingWeight: 5.5,
    isFreeShipping: false
  },
  {
    name: "Biscuits Assorted (24 packs)",
    description: "Mixed variety biscuits pack for retail display. Includes chocolate, vanilla, and butter flavors.",
    shortDescription: "Mixed variety biscuits pack",
    category: "Snacks",
    brand: "Crunchy",
    price: 960,
    originalPrice: 1080,
    wholesalePrice: 900,
    stockQuantity: 400,
    minOrderQuantity: 12,
    maxOrderQuantity: 120,
    sku: "BISC-001",
    barcode: "8901234567894",
    weight: { value: 2.4, unit: "kg" },
    dimensions: { length: 40, width: 30, height: 20, unit: "cm" },
    images: [
      { url: "/uploads/biscuits-1.jpg", alt: "Assorted Biscuits", isPrimary: true }
    ],
    isActive: true,
    rating: { average: 4.2, count: 87 },
    specifications: [
      { name: "Type", value: "Assorted Biscuits" },
      { name: "Packs", value: "24" },
      { name: "Flavors", value: "Chocolate, Vanilla, Butter" }
    ],
    tags: ["biscuits", "snacks", "assorted", "retail"],
    shippingWeight: 2.5,
    isFreeShipping: false
  },
  {
    name: "Shampoo Bottles (500ml x 12)",
    description: "Premium hair care shampoo in retail bottles. Suitable for all hair types.",
    shortDescription: "Premium hair care shampoo",
    category: "Personal Care",
    brand: "HairCare",
    price: 1440,
    originalPrice: 1600,
    wholesalePrice: 1350,
    stockQuantity: 150,
    minOrderQuantity: 8,
    maxOrderQuantity: 80,
    sku: "SHAM-001",
    barcode: "8901234567895",
    weight: { value: 6, unit: "kg" },
    dimensions: { length: 50, width: 30, height: 25, unit: "cm" },
    images: [
      { url: "/uploads/shampoo-1.jpg", alt: "Shampoo Bottles", isPrimary: true }
    ],
    isActive: true,
    rating: { average: 4.6, count: 174 },
    specifications: [
      { name: "Type", value: "Shampoo" },
      { name: "Volume", value: "12 x 500ml" },
      { name: "Hair Type", value: "All Types" }
    ],
    tags: ["shampoo", "hair care", "personal care", "bottles"],
    shippingWeight: 6.5,
    isFreeShipping: false
  }
];

// Sample admin user
const adminUser = {
  businessName: "Nayak Enterprises Admin",
  businessType: "other",
  ownerName: "Admin User",
  email: "admin@nayakenterprises.com",
  phone: "9876543210",
  address: {
    street: "123 Admin Street",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001"
  },
  password: "admin123",
  isVerified: true,
  isActive: true,
  role: "admin"
};

// Sample customer user
const customerUser = {
  businessName: "Sample Retail Store",
  businessType: "retail-store",
  ownerName: "John Doe",
  email: "john@samplestore.com",
  phone: "9876543211",
  address: {
    street: "456 Retail Avenue",
    city: "Delhi",
    state: "Delhi",
    pincode: "110001"
  },
  password: "customer123",
  isVerified: true,
  isActive: true,
  role: "customer"
};

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nayak-enterprises');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const admin = await User.create(adminUser);
    console.log('Created admin user:', admin.email);

    // Create customer user
    const customer = await User.create(customerUser);
    console.log('Created customer user:', customer.email);

    // Create products
    const products = await Product.create(sampleProducts);
    console.log(`Created ${products.length} products`);

    console.log('\nDatabase seeded successfully!');
    console.log('\nSample Users:');
    console.log('Admin:', adminUser.email, '(password: admin123)');
    console.log('Customer:', customerUser.email, '(password: customer123)');
    console.log('\nSample Products:', products.length, 'products created');

  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase }; 