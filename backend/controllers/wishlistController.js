const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

// @desc    Get user's wishlist
// @route   GET /api/v1/wishlist
// @access  Private
const getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate(
      'products',
      'name slug price discountPrice images ratingsAverage ratingsCount stock isFeatured'
    );

    if (!wishlist) {
      wishlist = { products: [] };
    }

    const response = new ApiResponse(200, { wishlist }, 'Wishlist fetched successfully');
    res.status(200).json(response.toJSON());
  } catch (error) {
    next(error);
  }
};

// @desc    Add product to wishlist
// @route   POST /api/v1/wishlist
// @access  Private
const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return next(ApiError.notFound('Product not found'));
    }

    // Find or create wishlist, use $addToSet to prevent duplicates
    let wishlist = await Wishlist.findOneAndUpdate(
      { user: req.user._id },
      { $addToSet: { products: productId } },
      { new: true, upsert: true }
    ).populate(
      'products',
      'name slug price discountPrice images ratingsAverage ratingsCount stock isFeatured'
    );

    const response = new ApiResponse(200, { wishlist }, 'Product added to wishlist');
    res.status(200).json(response.toJSON());
  } catch (error) {
    next(error);
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/v1/wishlist/:productId
// @access  Private
const removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOneAndUpdate(
      { user: req.user._id },
      { $pull: { products: productId } },
      { new: true }
    ).populate(
      'products',
      'name slug price discountPrice images ratingsAverage ratingsCount stock isFeatured'
    );

    if (!wishlist) {
      return next(ApiError.notFound('Wishlist not found'));
    }

    const response = new ApiResponse(200, { wishlist }, 'Product removed from wishlist');
    res.status(200).json(response.toJSON());
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};
