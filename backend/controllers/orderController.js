const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

// @desc    Create a new order
// @route   POST /api/v1/orders
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return next(ApiError.badRequest('No order items provided'));
    }

    // Calculate subtotal
    let subtotal = 0;
    for (const item of orderItems) {
      subtotal += item.price * item.quantity;
    }

    // Calculate tax (5% of subtotal)
    const taxPrice = Math.round(subtotal * 0.05 * 100) / 100;

    // Calculate shipping (free over $100, else $10)
    const shippingPrice = subtotal > 100 ? 0 : 10;

    // Calculate total
    const totalPrice = Math.round((subtotal + taxPrice + shippingPrice) * 100) / 100;

    const order = await Order.create({
      user: req.user ? req.user._id : undefined,
      orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'COD',
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    // Clear user's cart if authenticated
    if (req.user) {
      await Cart.findOneAndUpdate(
        { user: req.user._id },
        { $set: { items: [] } }
      );
    }

    // Update product stock and sold count
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity, sold: item.quantity },
      });
    }

    if (order.user) {
      await order.populate('user', 'name email');
    }

    const response = new ApiResponse(201, { order }, 'Order placed successfully');
    res.status(201).json(response.toJSON());
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in user's orders
// @route   GET /api/v1/orders/my-orders
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [orders, total] = await Promise.all([
      Order.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Order.countDocuments({ user: req.user._id }),
    ]);

    const response = new ApiResponse(200, {
      orders,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      total,
    }, 'Orders fetched successfully');

    res.status(200).json(response.toJSON());
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/v1/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .lean();

    if (!order) {
      return next(ApiError.notFound('Order not found'));
    }

    // Users can only see their own orders, admins can see any
    // Guest orders (no associated user) can be fetched by anyone who knows the order's DB ID
    if (order.user) {
      if (
        !req.user ||
        (req.user.role !== 'admin' &&
          order.user._id.toString() !== req.user._id.toString())
      ) {
        return next(ApiError.forbidden('Not authorized to view this order'));
      }
    }

    const response = new ApiResponse(200, { order }, 'Order fetched successfully');
    res.status(200).json(response.toJSON());
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/v1/orders
// @access  Private/Admin
const getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [orders, total] = await Promise.all([
      Order.find()
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Order.countDocuments(),
    ]);

    const response = new ApiResponse(200, {
      orders,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      total,
    }, 'All orders fetched successfully');

    res.status(200).json(response.toJSON());
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (admin)
// @route   PUT /api/v1/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(ApiError.notFound('Order not found'));
    }

    // Set deliveredAt if delivered
    if (status === 'Delivered') {
      order.deliveredAt = new Date();
      order.paymentStatus = 'Paid';
    }

    // If cancelled, restore stock
    if (status === 'Cancelled' && order.orderStatus !== 'Cancelled') {
      for (const item of order.orderItems) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity, sold: -item.quantity },
        });
      }
    }

    order.orderStatus = status;
    await order.save();

    await order.populate('user', 'name email');

    const response = new ApiResponse(200, { order }, `Order status updated to ${status}`);
    res.status(200).json(response.toJSON());
  } catch (error) {
    next(error);
  }
};

// @desc    Delete order (admin)
// @route   DELETE /api/v1/orders/:id
// @access  Private/Admin
const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(ApiError.notFound('Order not found'));
    }

    await order.deleteOne();

    const response = new ApiResponse(200, null, 'Order deleted successfully');
    res.status(200).json(response.toJSON());
  } catch (error) {
    next(error);
  }
};

// @desc    Get order statistics (admin)
// @route   GET /api/v1/orders/stats
// @access  Private/Admin
const getOrderStats = async (req, res, next) => {
  try {
    // Total orders and revenue
    const totalStats = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$totalPrice' },
        },
      },
    ]);

    // Orders by status
    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 },
        },
      },
    ]);

    // Recent orders (last 5)
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Total products and users count
    const [totalProducts, totalUsers] = await Promise.all([
      Product.countDocuments(),
      User.countDocuments(),
    ]);

    // Monthly revenue aggregation (last 12 months)
    const monthlyRevenue = await Order.aggregate([
      {
        $match: { orderStatus: { $ne: 'Cancelled' } }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          revenue: { $sum: '$totalPrice' },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 12 },
      {
        $project: {
          _id: 0,
          month: '$_id',
          revenue: { $round: ['$revenue', 2] },
        },
      },
    ]);

    const response = new ApiResponse(200, {
      totalOrders: totalStats[0]?.totalOrders || 0,
      totalRevenue: Math.round((totalStats[0]?.totalRevenue || 0) * 100) / 100,
      ordersByStatus: ordersByStatus.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      recentOrders,
      totalProducts,
      totalUsers,
      monthlyRevenue,
    }, 'Order statistics fetched successfully');

    res.status(200).json(response.toJSON());
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  getOrderStats,
};
