const express = require('express');
const router = express.Router();

// LOGIN ROUTE (IMPORTANT: POST ONLY)
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // dummy login logic (replace with DB later)
  if (email === 'admin@gmail.com' && password === '123456') {
    return res.json({
      token: 'demo-jwt-token'
    });
  }

  return res.status(401).json({
    message: 'Invalid credentials'
  });
});

module.exports = router;
