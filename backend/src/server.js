const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// ======================
// CONFIG & DB
// ======================
dotenv.config();
connectDB();

const app = express();

app.use(express.json());

// ======================
// ENV
// ======================
const EXPLICIT_CLIENT_URL = (process.env.CLIENT_URL || '').trim();
const PORT = process.env.PORT || 5000;

// ======================
// CORS (FIXED + SAFE)
// ======================
const corsOptions = {
  origin: function (origin, callback) {
    // If CLIENT_URL isn't set (common on first deploy), allow requests so the app works.
    // Set CLIENT_URL in production to lock this down.
    const allowAnyOrigin = !EXPLICIT_CLIENT_URL;

    const allowedOrigins = [
      EXPLICIT_CLIENT_URL,
      'http://localhost:5173',
      'http://127.0.0.1:5173'
    ].filter(Boolean);

    // allow requests with no origin (like mobile apps or curl)
    if (!origin || allowAnyOrigin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));

// ======================
// HANDLE PREFLIGHT REQUESTS (IMPORTANT)
// ======================
app.options('*', cors(corsOptions));

// ======================
// ROOT
// ======================
app.get('/', (req, res) => {
  res.json({ message: 'API Running' });
});

// ======================
// ROUTES
// ======================
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');

// Support both "/api/*" and bare routes. This makes local dev and Vercel
// (when using routePrefix="/api") work without double-prefix issues.
app.use(['/api/products', '/products'], productRoutes);
app.use(['/api/auth', '/auth'], authRoutes);

// ======================
// 404
// ======================
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ======================
// ERROR HANDLER
// ======================
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);

  res.status(500).json({
    message: err.message || 'Server error'
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`API listening on port ${PORT}`);
  });
}

module.exports = app;
