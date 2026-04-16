const express = require('express');
const requireAdmin = require('../middleware/auth');
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

const router = express.Router();

router.route('/').get(getProducts).post(requireAdmin, createProduct);
router
  .route('/:id')
  .get(getProductById)
  .put(requireAdmin, updateProduct)
  .delete(requireAdmin, deleteProduct);

module.exports = router;
