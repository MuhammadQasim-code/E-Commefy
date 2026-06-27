const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const ApiResponse = require('../utils/ApiResponse');

// @desc    Get dashboard statistics (admin)
// @route   GET /api/v1/analytics/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res, next) => {
  try {
    // Basic counts
    const [totalProducts, totalOrders, totalUsers] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments(),
    ]);

    // Total revenue
    const revenueResult = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' },
        },
      },
    ]);
    const totalRevenue = Math.round((revenueResult[0]?.totalRevenue || 0) * 100) / 100;

    // Orders by status distribution
    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 },
        },
      },
    ]);

    const statusDistribution = ordersByStatus.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    // Monthly revenue for last 12 months
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: twelveMonthsAgo },
          orderStatus: { $ne: 'Cancelled' },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          revenue: { $sum: '$totalPrice' },
          orders: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);

    // Format monthly revenue
    const formattedMonthlyRevenue = monthlyRevenue.map((item) => ({
      year: item._id.year,
      month: item._id.month,
      revenue: Math.round(item.revenue * 100) / 100,
      orders: item.orders,
    }));

    // Top 5 products by sold count
    const topProducts = await Product.find()
      .sort({ sold: -1 })
      .limit(5)
      .select('name slug price images sold ratingsAverage')
      .populate('category', 'name slug')
      .lean();

    // Recent 10 orders
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const response = new ApiResponse(200, {
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue,
      ordersByStatus: statusDistribution,
      monthlyRevenue: formattedMonthlyRevenue,
      topProducts,
      recentOrders,
    }, 'Dashboard statistics fetched successfully');

    res.status(200).json(response.toJSON());
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
};
