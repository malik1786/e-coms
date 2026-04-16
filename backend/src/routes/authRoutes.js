const express = require('express');
const { loginAdmin } = require('../controllers/authController');
const { getStats } = require('../controllers/productController');
const requireAdmin = require('../middleware/auth');

const router = express.Router();

router.post('/login', loginAdmin);
router.get('/stats', requireAdmin, getStats);

module.exports = router;
