const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/analyticsController');
const protect = require('../middleware/auth');
const adminOnly = require('../middleware/admin');

// All routes require authentication and admin role
router.use(protect, adminOnly);

router.get('/dashboard', getDashboardStats);

module.exports = router;
