const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

// ======================
// CONFIG & DB
// ======================
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
connectDB();

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ======================
// ENV
// ======================
const CLIENT_URLS = (process.env.CLIENT_URL || '')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);
const PORT = process.env.PORT || 8080;

const getAllowedOrigins = () => {
  const origins = new Set([
    ...CLIENT_URLS,
    'http://localhost:5173',
    'http://127.0.0.1:5173'
  ]);

  if (process.env.VERCEL_URL) {
    origins.add(`https://${process.env.VERCEL_URL}`);
  }

  return [...origins];
};

// ======================
// CORS (FIXED + SAFE)
// ======================
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = getAllowedOrigins();
    const allowAnyOrigin = allowedOrigins.length === 2; // localhost only fallback

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
// SERVE FRONTEND (Production)
// ======================
const FRONTEND_DIST = path.resolve(__dirname, '../../frontend/dist');
const fs = require('fs');
if (fs.existsSync(FRONTEND_DIST)) {
  app.use(express.static(FRONTEND_DIST));
}

app.get(['/health', '/api/health'], (req, res) => {
  res.json({
    ok: true,
    message: 'API healthy'
  });
});

// ======================
// ROUTES
// ======================
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');

// Ensure API routes strictly use /api prefix to avoid colliding with React frontend routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

// ======================
// CATCH-ALL: Serve React frontend for non-API routes
// ======================
app.get('*', (req, res) => {
  const indexFile = path.join(FRONTEND_DIST, 'index.html');
  if (fs.existsSync(indexFile)) {
    res.sendFile(indexFile);
  } else {
    res.status(404).json({ message: 'Route not found' });
  }
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

app.listen(PORT, '0.0.0.0', () => {
  console.log(`API listening on port ${PORT}`);
});

module.exports = app;
