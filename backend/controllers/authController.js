const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const generateTokens = require('../utils/generateToken');
const jwt = require('jsonwebtoken');

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return next(ApiError.badRequest('An account with this email already exists'));
    }

    // Create user
    const user = await User.create({ name, email, password, phone });

    // Generate tokens
    const tokens = generateTokens(user, res);

    // Save refresh token to user
    user.refreshToken = tokens.refreshToken;
    await user.save({ validateBeforeSave: false });

    const response = new ApiResponse(201, {
      user: user.toJSON(),
      accessToken: tokens.accessToken,
    }, 'Registration successful');

    res.status(201).json(response.toJSON());
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user with password
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return next(ApiError.unauthorized('Invalid email or password'));
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(ApiError.unauthorized('Invalid email or password'));
    }

    // Generate tokens
    const tokens = generateTokens(user, res);

    // Save refresh token
    user.refreshToken = tokens.refreshToken;
    await user.save({ validateBeforeSave: false });

    const response = new ApiResponse(200, {
      user: user.toJSON(),
      accessToken: tokens.accessToken,
    }, 'Login successful');

    res.status(200).json(response.toJSON());
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/v1/auth/logout
// @access  Private
const logout = async (req, res, next) => {
  try {
    // Clear cookies
    res.cookie('accessToken', '', {
      httpOnly: true,
      expires: new Date(0),
    });
    res.cookie('refreshToken', '', {
      httpOnly: true,
      expires: new Date(0),
    });

    // Clear refresh token in database
    await User.findByIdAndUpdate(req.user._id, { refreshToken: '' });

    const response = new ApiResponse(200, null, 'Logged out successfully');
    res.status(200).json(response.toJSON());
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh access token
// @route   POST /api/v1/auth/refresh-token
// @access  Public
const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return next(ApiError.unauthorized('No refresh token provided'));
    }

    // Verify refresh token
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    // Find user
    const user = await User.findById(decoded.id).select('+refreshToken');
    if (!user) {
      return next(ApiError.unauthorized('User not found'));
    }

    // Verify stored refresh token matches
    if (user.refreshToken !== token) {
      return next(ApiError.unauthorized('Invalid refresh token'));
    }

    // Generate new tokens
    const tokens = generateTokens(user, res);

    // Update refresh token in DB
    user.refreshToken = tokens.refreshToken;
    await user.save({ validateBeforeSave: false });

    const response = new ApiResponse(200, {
      accessToken: tokens.accessToken,
    }, 'Token refreshed successfully');

    res.status(200).json(response.toJSON());
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/v1/auth/profile
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    const response = new ApiResponse(200, { user: req.user }, 'Profile fetched successfully');
    res.status(200).json(response.toJSON());
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/v1/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const allowedFields = { name: req.body.name, phone: req.body.phone };

    // Only add avatar if provided
    if (req.body.avatar !== undefined) {
      allowedFields.avatar = req.body.avatar;
    }

    // Remove undefined fields
    Object.keys(allowedFields).forEach(
      (key) => allowedFields[key] === undefined && delete allowedFields[key]
    );

    const user = await User.findByIdAndUpdate(req.user._id, allowedFields, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return next(ApiError.notFound('User not found'));
    }

    const response = new ApiResponse(200, { user }, 'Profile updated successfully');
    res.status(200).json(response.toJSON());
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  refreshToken,
  getProfile,
  updateProfile,
};
