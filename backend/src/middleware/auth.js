const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());

// CORS (IMPORTANT for Vercel frontend)
app.use(cors({
  origin: [
    'https://your-frontend.vercel.app',
    'http://localhost:5173'
  ],
  credentials: true
}));

// Routes example
app.use('/api/products', require('./routes/products'));
app.use('/api/auth', require('./routes/auth'));

module.exports = app;
