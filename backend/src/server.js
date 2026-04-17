const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// IMPORTANT: frontend URL
const CLIENT_URL = process.env.CLIENT_URL;

// ======================
// CORS CONFIG (FIXED)
// ======================
app.use(cors({
  origin: [
    CLIENT_URL,
    'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json());

// ======================
// ROOT
// ======================
app.get('/', (req, res) => {
  res.json({
    message: 'E-coms API is running',
    version: '1.0.0'
  });
});

// ======================
// HEALTH CHECK
// ======================
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// ======================
// API ROUTES (ONLY ONE STYLE)
// ======================
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// ======================
// 404 HANDLER
// ======================
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ======================
// ERROR HANDLER
// ======================
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({
    message: error.message || 'Server error'
  });
});

module.exports = app;