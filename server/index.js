require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { 
  connectAndSeedDB,
  getProducts, 
  getProductById, 
  addProduct, 
  updateProduct, 
  deleteProduct, 
  getOrders, 
  addOrder, 
  getStats 
} = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// --- API ROUTES ---

// GET /api/products - get list with search, category, min/max price, ratings, inStock, sort
app.get('/api/products', async (req, res) => {
  try {
    const search = req.query.search || '';
    const category = req.query.category || '';
    const minPrice = parseFloat(req.query.minPrice) || 0;
    const maxPrice = parseFloat(req.query.maxPrice) || Infinity;
    const minRating = parseFloat(req.query.minRating) || 0;
    const inStock = req.query.inStock === 'true';
    const sort = req.query.sort || '';

    let products = await getProducts();

    // 1. Text Search
    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter(
        p => p.name.toLowerCase().includes(searchLower) || 
             (p.description && p.description.toLowerCase().includes(searchLower))
      );
    }

    // 2. Category Filter
    if (category && category !== 'All') {
      products = products.filter(p => p.category === category);
    }

    // 3. Price Filter
    products = products.filter(p => p.price >= minPrice && p.price <= maxPrice);

    // 4. Rating Filter
    products = products.filter(p => p.rating >= minRating);

    // 5. Stock Filter
    if (inStock) {
      products = products.filter(p => p.stock > 0);
    }

    // 6. Sorting
    if (sort === 'price-asc') {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      products.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating-desc') {
      products.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'popular') {
      products.sort((a, b) => b.reviewsCount - a.reviewsCount);
    }

    res.json(products);
  } catch (error) {
    console.error('Error GET /api/products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/products - add product (admin CRUD)
app.post('/api/products', async (req, res) => {
  try {
    const { name, price } = req.body;
    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required.' });
    }
    const newProduct = await addProduct(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error POST /api/products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/products/:id - single product
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error GET /api/products/:id:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT /api/products/:id - edit product
app.put('/api/products/:id', async (req, res) => {
  try {
    const updated = await updateProduct(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    res.json(updated);
  } catch (error) {
    console.error('Error PUT /api/products/:id:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE /api/products/:id - delete product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const success = await deleteProduct(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    res.json({ message: 'Product deleted successfully.' });
  } catch (error) {
    console.error('Error DELETE /api/products/:id:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/orders - get list of completed orders
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await getOrders();
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(orders);
  } catch (error) {
    console.error('Error GET /api/orders:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/orders - submit new order (decreases stock)
app.post('/api/orders', async (req, res) => {
  try {
    const { customer, items, total } = req.body;
    if (!customer || !items || items.length === 0 || !total) {
      return res.status(400).json({ error: 'Invalid order data. Customer, items and total are required.' });
    }
    const newOrder = await addOrder(req.body);
    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Error POST /api/orders:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/stats - get dashboard metrics
app.get('/api/stats', async (req, res) => {
  try {
    const stats = await getStats();
    res.json(stats);
  } catch (error) {
    console.error('Error GET /api/stats:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// --- PRODUCTION FRONTEND ROUTING ---

const fs = require('fs');
const distPath = path.join(__dirname, '../dist');
const hasDist = fs.existsSync(distPath);

if (hasDist) {
  // Serve static compiled Vite files in production
  app.use(express.static(distPath));

  // Send React App for any non-API routes (enables React SPA router)
  app.get('*any', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  // Fallback for API-only deployments (like on Render when frontend is on Vercel)
  app.get('/', (req, res) => {
    res.json({ message: 'Cartify Backend API is running successfully.' });
  });

  app.get('*any', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.status(404).json({ error: 'Endpoint not found. Frontend is deployed on Vercel.' });
  });
}

// Connect to Database and then start Server
connectAndSeedDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Backend Express server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to start server because database connection failed:', err);
    process.exit(1);
  });
