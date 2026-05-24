const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dns = require('dns');

// Set DNS servers to resolve MongoDB Atlas SRV records in environments with restrictive DNS
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (err) {
  console.warn('Warning: Failed to set custom DNS servers, using system default.', err.message);
}


// Schemas
const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  category: { type: String, default: 'Uncategorized' },
  image: { type: String, default: '' },
  rating: { type: Number, default: 5.0 },
  reviewsCount: { type: Number, default: 0 },
  stock: { type: Number, default: 0 },
  colors: { type: [String], default: ['#1A1A1A'] },
  featured: { type: Boolean, default: false },
  specs: [
    {
      name: { type: String, required: true },
      value: { type: String, required: true }
    }
  ]
});

const orderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    zip: { type: String, required: true },
    phone: { type: String, required: true }
  },
  items: [
    {
      productId: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      color: String
    }
  ],
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  total: { type: Number, required: true },
  createdAt: { type: String, required: true },
  status: { type: String, default: 'Processing' }
});

const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);

// Connection & Seeding logic
async function connectAndSeedDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('Error: MONGODB_URI is not set in environment variables.');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('Successfully connected to MongoDB Atlas');

    // Seeding products
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('Products collection is empty. Seeding products...');
      const productsDataPath = path.join(__dirname, 'data', 'products.json');
      if (fs.existsSync(productsDataPath)) {
        const defaultProducts = JSON.parse(fs.readFileSync(productsDataPath, 'utf-8'));
        await Product.insertMany(defaultProducts);
        console.log(`Successfully seeded ${defaultProducts.length} default products.`);
      } else {
        console.warn('Seeding skipped: server/data/products.json not found.');
      }
    }

    // Seeding orders
    const orderCount = await Order.countDocuments();
    if (orderCount === 0) {
      console.log('Orders collection is empty. Seeding orders...');
      const ordersDataPath = path.join(__dirname, 'data', 'orders.json');
      if (fs.existsSync(ordersDataPath)) {
        const defaultOrders = JSON.parse(fs.readFileSync(ordersDataPath, 'utf-8'));
        await Order.insertMany(defaultOrders);
        console.log(`Successfully seeded ${defaultOrders.length} default orders.`);
      } else {
        console.warn('Seeding skipped: server/data/orders.json not found.');
      }
    }

  } catch (error) {
    console.error('Error connecting to MongoDB Atlas or seeding database:', error);
    process.exit(1);
  }
}

// --- DATABASE OPERATIONS ---

async function getProducts() {
  return await Product.find({}).lean();
}

async function getProductById(id) {
  return await Product.findOne({ id }).lean();
}

async function addProduct(productData) {
  const newProduct = new Product({
    id: `prod-${Date.now()}`,
    name: productData.name,
    description: productData.description || '',
    price: parseFloat(productData.price) || 0,
    category: productData.category || 'Uncategorized',
    image: productData.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    rating: parseFloat(productData.rating) || 5.0,
    reviewsCount: parseInt(productData.reviewsCount) || 0,
    stock: parseInt(productData.stock) || 0,
    colors: Array.isArray(productData.colors) && productData.colors.length > 0 ? productData.colors : ['#1A1A1A'],
    featured: !!productData.featured,
    specs: productData.specs || []
  });
  
  await newProduct.save();
  return newProduct.toObject();
}

async function updateProduct(id, productData) {
  const existingProduct = await Product.findOne({ id });
  if (!existingProduct) return null;

  const fields = ['name', 'description', 'price', 'category', 'image', 'rating', 'reviewsCount', 'stock', 'colors', 'featured', 'specs'];
  fields.forEach(field => {
    if (productData[field] !== undefined) {
      if (field === 'price' || field === 'rating') {
        existingProduct[field] = parseFloat(productData[field]);
      } else if (field === 'reviewsCount' || field === 'stock') {
        existingProduct[field] = parseInt(productData[field]);
      } else if (field === 'featured') {
        existingProduct[field] = !!productData[field];
      } else {
        existingProduct[field] = productData[field];
      }
    }
  });

  await existingProduct.save();
  return existingProduct.toObject();
}

async function deleteProduct(id) {
  const result = await Product.deleteOne({ id });
  return result.deletedCount > 0;
}

async function getOrders() {
  return await Order.find({}).lean();
}

async function addOrder(orderData) {
  const newOrder = new Order({
    id: `ord-${Date.now()}`,
    customer: {
      name: orderData.customer.name,
      email: orderData.customer.email,
      address: orderData.customer.address,
      city: orderData.customer.city,
      zip: orderData.customer.zip,
      phone: orderData.customer.phone
    },
    items: orderData.items.map(item => ({
      productId: item.productId,
      name: item.name,
      price: parseFloat(item.price),
      quantity: parseInt(item.quantity),
      color: item.color
    })),
    subtotal: parseFloat(orderData.subtotal),
    discount: parseFloat(orderData.discount || 0),
    tax: parseFloat(orderData.tax || 0),
    total: parseFloat(orderData.total),
    createdAt: new Date().toISOString(),
    status: 'Processing'
  });

  // Adjust stock
  for (const item of newOrder.items) {
    const product = await Product.findOne({ id: item.productId });
    if (product) {
      product.stock = Math.max(0, product.stock - item.quantity);
      await product.save();
    }
  }

  await newOrder.save();
  return newOrder.toObject();
}

async function getStats() {
  const orders = await Order.find({}).lean();
  const products = await Product.find({}).lean();

  const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
  
  const lowStockProducts = products.filter(p => p.stock < 10);

  const categorySales = {};
  const productSalesVolume = {};

  orders.forEach(order => {
    order.items.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      const cat = product ? product.category : 'Uncategorized';
      
      const itemTotal = item.price * item.quantity;
      categorySales[cat] = (categorySales[cat] || 0) + itemTotal;

      productSalesVolume[item.name] = (productSalesVolume[item.name] || 0) + item.quantity;
    });
  });

  const categorySalesArray = Object.entries(categorySales).map(([category, value]) => ({
    category,
    value: parseFloat(value.toFixed(2))
  }));

  const topProductsArray = Object.entries(productSalesVolume)
    .map(([name, quantity]) => ({ name, quantity }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  return {
    totalSales: parseFloat(totalSales.toFixed(2)),
    totalOrders,
    averageOrderValue: parseFloat(averageOrderValue.toFixed(2)),
    lowStockCount: lowStockProducts.length,
    categorySales: categorySalesArray,
    topProducts: topProductsArray,
    lowStockProducts: lowStockProducts.map(p => ({ id: p.id, name: p.name, stock: p.stock }))
  };
}

module.exports = {
  connectAndSeedDB,
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  getOrders,
  addOrder,
  getStats
};
