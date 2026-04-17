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
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// ======================
// CORS (FIXED + SAFE)
// ======================
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      CLIENT_URL,
      'http://localhost:5173'
    ];

    // allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// ======================
// HANDLE PREFLIGHT REQUESTS (IMPORTANT)
// ======================
app.options('*', cors());

// ======================
// ROOT
// ======================
app.get('/', (req, res) => {
  res.json({ message: 'API Running' });
});

// ======================
// ROUTES
// ======================
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));

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

module.exports = app;