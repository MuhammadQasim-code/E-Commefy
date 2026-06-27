const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductBySlug,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getRelatedProducts,
  createReview,
  getProductReviews,
} = require('../controllers/productController');
const protect = require('../middleware/auth');
const adminOnly = require('../middleware/admin');
const { uploadMultiple } = require('../middleware/upload');

// Public routes
router.get('/', getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id', getProductById);
router.get('/:id/related', getRelatedProducts);
router.get('/:id/reviews', getProductReviews);

// Protected routes
router.post('/:id/reviews', protect, createReview);

// Admin routes
router.post('/', protect, adminOnly, uploadMultiple, createProduct);
router.put('/:id', protect, adminOnly, uploadMultiple, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
