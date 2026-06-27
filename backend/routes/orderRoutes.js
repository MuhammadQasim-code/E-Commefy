const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  getOrderStats,
} = require('../controllers/orderController');
const protect = require('../middleware/auth');
const adminOnly = require('../middleware/admin');
const validate = require('../middleware/validate');
const { updateOrderStatusSchema } = require('../utils/validators');

// Protected routes
router.post('/', protect.optional, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/stats', protect, adminOnly, getOrderStats);
router.get('/:id', protect.optional, getOrderById);

// Admin routes
router.get('/', protect, adminOnly, getAllOrders);
router.put('/:id/status', protect, adminOnly, validate(updateOrderStatusSchema), updateOrderStatus);
router.delete('/:id', protect, adminOnly, deleteOrder);

module.exports = router;
