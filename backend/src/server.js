const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
const clientUrl = process.env.CLIENT_URL;

// CORS configuration - handles frontend connection
app.use(
  cors({
    origin: clientUrl || true
  })
);
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'E-coms API is running', version: '1.0.0' });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', mode: 'in-memory' });
});

app.use('/auth', authRoutes);
app.use('/products', productRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ message: error.message || 'Server error' });
});

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Backend running in IN-MEMORY mode on port ${PORT}`);
    console.log(`🔌 No database required.`);
  });
}

module.exports = app;
