const Product = require('../models/Product');
const { getIsConnected } = require('../config/db');
const { normalizeImages } = require('../utils/productImages');

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
    images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800'],
    featured: true,
    trending: true,
    createdAt: new Date('2026-04-01T10:00:00Z')
  },
  {
    _id: '2',
    name: 'Royal Rose Musk',
    price: 185,
    description: 'A delicate fusion of fresh Taif rose petals and pure white musk. A clean, floral signature scent.',
    image: 'https://images.unsplash.com/photo-1583445013765-46c20c4a6772?auto=format&fit=crop&q=80&w=800',
    stock: 15,
    images: ['https://images.unsplash.com/photo-1583445013765-46c20c4a6772?auto=format&fit=crop&q=80&w=800'],
    featured: true,
    trending: false,
    createdAt: new Date('2026-04-02T10:00:00Z')
  },
  {
    _id: '3',
    name: 'Mukhallat Royale',
    price: 275,
    description: 'A sophisticated combination of saffron, amber, and warm spices. Captures the essence of Arabian nights.',
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800',
    stock: 12,
    images: ['https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800'],
    featured: false,
    trending: true,
    createdAt: new Date('2026-04-03T10:00:00Z')
  },
  {
    _id: '4',
    name: 'Amber Saffron Reserve',
    price: 320,
    description: 'Velvety amber layered with saffron threads and soft woods for a luxurious evening profile.',
    image: 'https://images.unsplash.com/photo-1615634262417-167b47d4f5c8?auto=format&fit=crop&q=80&w=800',
    stock: 9,
    featured: true,
    trending: true,
    createdAt: new Date('2026-04-04T10:00:00Z')
  },
  {
    _id: '5',
    name: 'White Musk Silk',
    price: 160,
    description: 'A clean white musk fragrance with airy powdery notes and a smooth, elegant finish.',
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=800',
    stock: 18,
    featured: false,
    trending: false,
    createdAt: new Date('2026-04-05T10:00:00Z')
  },
  {
    _id: '6',
    name: 'Oud Al Majd',
    price: 525,
    description: 'Rich smoky oud with resinous depth, leather warmth, and a regal long-lasting trail.',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800',
    stock: 6,
    featured: true,
    trending: true,
    createdAt: new Date('2026-04-06T10:00:00Z')
  },
  {
    _id: '7',
    name: 'Velvet Jasmine Attar',
    price: 190,
    description: 'Soft jasmine petals blended with creamy musk for a refined floral oil that wears beautifully.',
    image: 'https://images.unsplash.com/photo-1619994403073-2cec99c8d3b1?auto=format&fit=crop&q=80&w=800',
    stock: 14,
    featured: false,
    trending: false,
    createdAt: new Date('2026-04-07T10:00:00Z')
  },
  {
    _id: '8',
    name: 'Desert Bakhoor Blend',
    price: 240,
    description: 'An aromatic bakhoor-inspired fragrance with incense, woods, and sweet oriental smoke.',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=800',
    stock: 10,
    featured: false,
    trending: true,
    createdAt: new Date('2026-04-08T10:00:00Z')
  },
  {
    _id: '9',
    name: 'Taif Bloom Essence',
    price: 210,
    description: 'Fresh Taif rose with sparkling citrus nuances and clean musk beneath the floral heart.',
    image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59dc7?auto=format&fit=crop&q=80&w=800',
    stock: 11,
    featured: false,
    trending: false,
    createdAt: new Date('2026-04-09T10:00:00Z')
  },
  {
    _id: '10',
    name: 'Sultan Spice Oud',
    price: 395,
    description: 'A bold mix of oud, black pepper, clove, and amber for customers who love a strong signature.',
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800',
    stock: 7,
    featured: true,
    trending: false,
    createdAt: new Date('2026-04-10T10:00:00Z')
  },
  {
    _id: '11',
    name: 'Golden Amber Mist',
    price: 175,
    description: 'Smooth amber sweetness with soft vanilla and warm spice, ideal for daily wear.',
    image: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&q=80&w=800',
    stock: 16,
    featured: false,
    trending: false,
    createdAt: new Date('2026-04-11T10:00:00Z')
  },
  {
    _id: '12',
    name: 'Black Oud Velvet',
    price: 560,
    description: 'Dense oud polished with soft balsamic notes for a smooth but deeply powerful fragrance profile.',
    image: 'https://images.unsplash.com/photo-1615634262417-167b47d4f5c8?auto=format&fit=crop&q=80&w=800',
    stock: 5,
    featured: true,
    trending: true,
    createdAt: new Date('2026-04-12T10:00:00Z')
  },
  {
    _id: '13',
    name: 'Madinah Musk Gold',
    price: 205,
    description: 'A radiant musk blend with sweet florals and a golden powdery softness.',
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=800',
    stock: 13,
    featured: false,
    trending: false,
    createdAt: new Date('2026-04-13T10:00:00Z')
  },
  {
    _id: '14',
    name: 'Noor Al Ward',
    price: 185,
    description: 'Bright floral rose and peony tones resting on a gentle musky base.',
    image: 'https://images.unsplash.com/photo-1583445013765-46c20c4a6772?auto=format&fit=crop&q=80&w=800',
    stock: 12,
    featured: false,
    trending: true,
    createdAt: new Date('2026-04-14T10:00:00Z')
  },
  {
    _id: '15',
    name: 'Imperial Leather Oud',
    price: 480,
    description: 'Dark leather wrapped in oud smoke and dry woods for a commanding premium finish.',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800',
    stock: 8,
    featured: true,
    trending: false,
    createdAt: new Date('2026-04-15T10:00:00Z')
  },
  {
    _id: '16',
    name: 'Rosewood Elixir',
    price: 265,
    description: 'Elegant rosewood and rose petals with a soft amber layer underneath.',
    image: 'https://images.unsplash.com/photo-1619994403073-2cec99c8d3b1?auto=format&fit=crop&q=80&w=800',
    stock: 10,
    featured: false,
    trending: false,
    createdAt: new Date('2026-04-16T10:00:00Z')
  },
  {
    _id: '17',
    name: 'Majestic Bakhoor Oud',
    price: 350,
    description: 'Incense smoke, oud chips, and warm resins come together in a bold oriental composition.',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=800',
    stock: 9,
    featured: false,
    trending: true,
    createdAt: new Date('2026-04-17T10:00:00Z')
  },
  {
    _id: '18',
    name: 'Royal Sandal Musk',
    price: 220,
    description: 'Creamy sandalwood and soft musk for a calm, polished scent profile.',
    image: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&q=80&w=800',
    stock: 17,
    featured: false,
    trending: false,
    createdAt: new Date('2026-04-18T10:00:00Z')
  },
  {
    _id: '19',
    name: 'Arabian Night Reserve',
    price: 430,
    description: 'A rich oriental blend of saffron, oud, incense, and amber inspired by classic Arabic perfumery.',
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800',
    stock: 7,
    featured: true,
    trending: true,
    createdAt: new Date('2026-04-19T10:00:00Z')
  },
  {
    _id: '20',
    name: 'Pearl White Attar',
    price: 150,
    description: 'Clean floral musk with a light powdery body and gentle sweetness.',
    image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59dc7?auto=format&fit=crop&q=80&w=800',
    stock: 20,
    featured: false,
    trending: false,
    createdAt: new Date('2026-04-20T10:00:00Z')
  },
  {
    _id: '21',
    name: 'Saffron Oud Noir',
    price: 510,
    description: 'Dark oud intensity sharpened with saffron and dry spice for a dramatic signature.',
    image: 'https://images.unsplash.com/photo-1615634262417-167b47d4f5c8?auto=format&fit=crop&q=80&w=800',
    stock: 6,
    featured: true,
    trending: true,
    createdAt: new Date('2026-04-21T10:00:00Z')
  },
  {
    _id: '22',
    name: 'Amber Honey Dusk',
    price: 230,
    description: 'Golden amber with honey warmth and smooth woods for a comforting evening scent.',
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=800',
    stock: 12,
    featured: false,
    trending: false,
    createdAt: new Date('2026-04-22T10:00:00Z')
  },
  {
    _id: '23',
    name: 'Musk Al Qamar',
    price: 195,
    description: 'A luminous white musk with clean floral edges and a soft lingering trail.',
    image: 'https://images.unsplash.com/photo-1619994403073-2cec99c8d3b1?auto=format&fit=crop&q=80&w=800',
    stock: 15,
    featured: false,
    trending: false,
    createdAt: new Date('2026-04-23T10:00:00Z')
  },
  {
    _id: '24',
    name: 'Oud Cedar Signature',
    price: 365,
    description: 'A balanced combination of oud depth, cedar dryness, and a touch of warm spice.',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800',
    stock: 11,
    featured: false,
    trending: true,
    createdAt: new Date('2026-04-24T10:00:00Z')
  },
  {
    _id: '25',
    name: 'Rose Amber Supreme',
    price: 285,
    description: 'Rose petals, glowing amber, and musky warmth in a rich elegant composition.',
    image: 'https://images.unsplash.com/photo-1583445013765-46c20c4a6772?auto=format&fit=crop&q=80&w=800',
    stock: 10,
    featured: true,
    trending: false,
    createdAt: new Date('2026-04-25T10:00:00Z')
  },
  {
    _id: '26',
    name: 'Velvet Oud Smoke',
    price: 470,
    description: 'Smoky oud with suede softness and an amber base that stays rich for hours.',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=800',
    stock: 8,
    featured: false,
    trending: true,
    createdAt: new Date('2026-04-26T10:00:00Z')
  },
  {
    _id: '27',
    name: 'Jasmine Oud Mist',
    price: 245,
    description: 'Fresh jasmine flowers wrapped in a light oud accord for a modern oriental feel.',
    image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59dc7?auto=format&fit=crop&q=80&w=800',
    stock: 13,
    featured: false,
    trending: false,
    createdAt: new Date('2026-04-27T10:00:00Z')
  },
  {
    _id: '28',
    name: 'Golden Oud Elan',
    price: 540,
    description: 'A luxurious oud composition with saffron, amber, and smooth woods for a grand finish.',
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800',
    stock: 5,
    featured: true,
    trending: true,
    createdAt: new Date('2026-04-28T10:00:00Z')
  },
  {
    _id: '29',
    name: 'Soft Cashmere Musk',
    price: 170,
    description: 'Clean musk and soft cashmere woods that create an easy elegant everyday fragrance.',
    image: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&q=80&w=800',
    stock: 19,
    featured: false,
    trending: false,
    createdAt: new Date('2026-04-29T10:00:00Z')
  },
  {
    _id: '30',
    name: 'Royal Incense Amber',
    price: 335,
    description: 'A warm incense and amber blend with subtle spice, perfect for evening wear and gifting.',
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=800',
    stock: 9,
    featured: true,
    trending: false,
    createdAt: new Date('2026-04-30T10:00:00Z')
  }
];

let counter = 31;

// ─── Controllers ─────────────────────────────────────────────────────────────

const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      image,
      images,
      stock,
      featured = false,
      trending = false
    } = req.body;

    const normalizedImages = normalizeImages({ image, images });

    if (
      !name ||
      price === undefined ||
      !description ||
      !normalizedImages.image ||
      stock === undefined
    ) {
      return res.status(400).json({ message: 'All product fields are required' });
    }

    // Try MongoDB
    if (getIsConnected()) {
      try {
        const newDbProduct = await Product.create({
          name,
          price,
          description,
          image: normalizedImages.image,
          images: normalizedImages.images,
          stock,
          featured: Boolean(featured),
          trending: Boolean(trending)
        });
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
      image: normalizedImages.image,
      images: normalizedImages.images,
      stock: Number(stock),
      featured: Boolean(featured),
      trending: Boolean(trending),
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
    if (update.image !== undefined || update.images !== undefined) {
      Object.assign(update, normalizeImages(update));
    }
    if (update.price !== undefined) update.price = Number(update.price);
    if (update.stock !== undefined) update.stock = Number(update.stock);
    if (update.featured !== undefined) update.featured = Boolean(update.featured);
    if (update.trending !== undefined) update.trending = Boolean(update.trending);

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
