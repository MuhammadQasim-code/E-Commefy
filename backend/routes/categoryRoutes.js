const express = require('express');
const router = express.Router();
const {
  getAllCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const protect = require('../middleware/auth');
const adminOnly = require('../middleware/admin');
const { uploadSingle } = require('../middleware/upload');

// Public routes
router.get('/', getAllCategories);
router.get('/slug/:slug', getCategoryBySlug);

// Admin routes
router.post('/', protect, adminOnly, uploadSingle, createCategory);
router.put('/:id', protect, adminOnly, uploadSingle, updateCategory);
router.delete('/:id', protect, adminOnly, deleteCategory);

module.exports = router;
