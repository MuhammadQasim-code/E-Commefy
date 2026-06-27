const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

// @desc    Get all users (admin)
// @route   GET /api/v1/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [users, total] = await Promise.all([
      User.find()
        .select('-password -refreshToken')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      User.countDocuments(),
    ]);

    const response = new ApiResponse(200, {
      users,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      total,
    }, 'Users fetched successfully');

    res.status(200).json(response.toJSON());
  } catch (error) {
    next(error);
  }
};

// @desc    Get user by ID (admin)
// @route   GET /api/v1/users/:id
// @access  Private/Admin
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -refreshToken')
      .lean();

    if (!user) {
      return next(ApiError.notFound('User not found'));
    }

    const response = new ApiResponse(200, { user }, 'User fetched successfully');
    res.status(200).json(response.toJSON());
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role (admin)
// @route   PUT /api/v1/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!role || !['customer', 'admin'].includes(role)) {
      return next(ApiError.badRequest('Role must be either "customer" or "admin"'));
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password -refreshToken');

    if (!user) {
      return next(ApiError.notFound('User not found'));
    }

    const response = new ApiResponse(200, { user }, `User role updated to ${role}`);
    res.status(200).json(response.toJSON());
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user (admin)
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    // Cannot delete self
    if (req.params.id === req.user._id.toString()) {
      return next(ApiError.badRequest('You cannot delete your own account'));
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return next(ApiError.notFound('User not found'));
    }

    await user.deleteOne();

    const response = new ApiResponse(200, null, 'User deleted successfully');
    res.status(200).json(response.toJSON());
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
};
