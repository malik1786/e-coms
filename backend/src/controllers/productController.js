const Product = require('../models/Product');
const { getIsConnected } = require('../config/db');

// ─── In-memory storage for products ─────────────────────────────────────────
// This stores data in server RAM as a FALLBACK if MongoDB is not connected.
let products = [
  {
    _id: '1',
    name: 'Dehn Al Oud Amiri',
    price: 450,
    description: 'A majestic blend of aged agarwood from the forests of Cambodia. Deep, woody, and intensely long-lasting.',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800',
    stock: 8,
    createdAt: new Date()
  },
  {
    _id: '2',
    name: 'Royal Rose Musk',
    price: 185,
    description: 'A delicate fusion of fresh Taif rose petals and pure white musk. A clean, floral signature scent.',
    image: 'https://images.unsplash.com/photo-1583445013765-46c20c4a6772?auto=format&fit=crop&q=80&w=800',
    stock: 15,
    createdAt: new Date()
  },
  {
    _id: '3',
    name: 'Mukhallat Royale',
    price: 275,
    description: 'A sophisticated combination of saffron, amber, and warm spices. Captures the essence of Arabian nights.',
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800',
    stock: 12,
    createdAt: new Date()
  }
];

let counter = 4;

// ─── Controllers ─────────────────────────────────────────────────────────────

const createProduct = async (req, res) => {
  try {
    const { name, price, description, image, stock } = req.body;

    if (!name || price === undefined || !description || !image || stock === undefined) {
      return res.status(400).json({ message: 'All product fields are required' });
    }

    // Try MongoDB
    if (getIsConnected()) {
      try {
        const newDbProduct = await Product.create({ name, price, description, image, stock });
        return res.status(201).json(newDbProduct);
      } catch (e) {
        console.error('DB Create failed, falling back to Memory:', e.message);
      }
    }

    // Fallback to Memory
    const newProduct = {
      _id: String(counter++),
      name: name.trim(),
      price: Number(price),
      description: description.trim(),
      image: image.trim(),
      stock: Number(stock),
      createdAt: new Date()
    };

    products.push(newProduct);
    return res.status(201).json(newProduct);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create product' });
  }
};

const getProducts = async (req, res) => {
  try {
    // Try MongoDB
    if (getIsConnected()) {
      try {
        const dbProducts = await Product.find().sort({ createdAt: -1 });
        return res.json(dbProducts);
      } catch (e) {
        console.error('DB Fetch failed, falling back to Memory:', e.message);
      }
    }

    // Fallback to Memory (Return newest first)
    const sorted = [...products].sort((a, b) => b.createdAt - a.createdAt);
    return res.json(sorted);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load products' });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Try MongoDB
    if (getIsConnected() && id.length >= 24) {
      try {
        const dbProduct = await Product.findById(id);
        if (dbProduct) return res.json(dbProduct);
      } catch (e) {
        console.error('DB Fetch ID failed, falling back to Memory:', e.message);
      }
    }

    // Fallback to Memory
    const product = products.find((p) => p._id === id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    return res.json(product);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load product' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const update = { ...req.body };
    if (update.price !== undefined) update.price = Number(update.price);
    if (update.stock !== undefined) update.stock = Number(update.stock);

    // Try MongoDB
    if (getIsConnected() && id.length >= 24) {
      try {
        const dbProduct = await Product.findByIdAndUpdate(id, update, { new: true });
        if (dbProduct) return res.json(dbProduct);
      } catch (e) {
        console.error('DB Update failed, falling back to Memory:', e.message);
      }
    }

    // Fallback to Memory
    const idx = products.findIndex((p) => p._id === id);
    if (idx === -1) return res.status(404).json({ message: 'Product not found' });

    products[idx] = { ...products[idx], ...update };
    return res.json(products[idx]);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update product' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Try MongoDB
    if (getIsConnected() && id.length >= 24) {
      try {
        const deleted = await Product.findByIdAndDelete(id);
        if (deleted) return res.json({ message: 'Product deleted' });
      } catch (e) {
        console.error('DB Delete failed, falling back to Memory:', e.message);
      }
    }

    // Fallback to Memory
    const idx = products.findIndex((p) => p._id === id);
    if (idx === -1) return res.status(404).json({ message: 'Product not found' });

    products.splice(idx, 1);
    return res.json({ message: 'Product deleted' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete product' });
  }
};

const getStats = async (req, res) => {
  try {
    const totalProducts = getIsConnected() ? await Product.countDocuments() : products.length;
    
    // Calculate simple stats
    const totalStock = getIsConnected() 
      ? (await Product.aggregate([{ $group: { _id: null, total: { $sum: "$stock" } } }]))[0]?.total || 0
      : products.reduce((acc, p) => acc + p.stock, 0);

    return res.json({
      totalProducts,
      totalStock,
      totalSales: "1,250", // Mocked for now
      totalOrders: 14,     // Mocked for now
      recentOrders: []
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load stats' });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getStats
};
