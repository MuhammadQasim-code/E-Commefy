const Product = require('../models/Product');
const Category = require('../models/Category');
const Review = require('../models/Review');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const mongoose = require('mongoose');

// @desc    Get all products with filtering, sorting, pagination
// @route   GET /api/v1/products
// @access  Public
const getAllProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      rating,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const filter = {};

    // Text search
    if (search) {
      filter.$text = { $search: search };
    }

    // Category filter (by slug or id, support comma-separated list for multi-select)
    if (category) {
      const categoryItems = category.split(',').map((item) => item.trim());
      const categoryIds = [];

      for (const item of categoryItems) {
        if (mongoose.Types.ObjectId.isValid(item)) {
          categoryIds.push(new mongoose.Types.ObjectId(item));
        } else {
          const cat = await Category.findOne({ slug: item });
          if (cat) {
            categoryIds.push(cat._id);
          }
        }
      }

      if (categoryIds.length > 0) {
        filter.category = { $in: categoryIds };
      }
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Minimum rating filter
    if (rating) {
      filter.ratingsAverage = { $gte: Number(rating) };
    }

    // Sort options
    let sortOption = {}; // default: no sorting (database default)
    if (sort) {
      switch (sort) {
        case 'price_asc':
          sortOption = { price: 1 };
          break;
        case 'price_desc':
          sortOption = { price: -1 };
          break;
        case 'latest':
          sortOption = { createdAt: -1 };
          break;
        case 'bestselling':
          sortOption = { sold: -1 };
          break;
        case 'rating':
          sortOption = { ratingsAverage: -1 };
          break;
        default:
          sortOption = {};
      }
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('category', 'name slug')
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Product.countDocuments(filter),
    ]);

    const pages = Math.ceil(total / limitNum);

    const response = new ApiResponse(200, {
      products,
      page: pageNum,
      pages,
      total,
    }, 'Products fetched successfully');

    res.status(200).json(response.toJSON());
  } catch (error) {
    next(error);
  }
};

// @desc    Get product by slug
// @route   GET /api/v1/products/slug/:slug
// @access  Public
const getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate('category', 'name slug')
      .lean();

    if (!product) {
      return next(ApiError.notFound('Product not found'));
    }

    // Get reviews for the product
    const reviews = await Review.find({ product: product._id })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .lean();

    const response = new ApiResponse(200, {
      product: { ...product, reviews },
    }, 'Product fetched successfully');

    res.status(200).json(response.toJSON());
  } catch (error) {
    next(error);
  }
};

// @desc    Get product by ID
// @route   GET /api/v1/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug')
      .lean();

    if (!product) {
      return next(ApiError.notFound('Product not found'));
    }

    const response = new ApiResponse(200, { product }, 'Product fetched successfully');
    res.status(200).json(response.toJSON());
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new product
// @route   POST /api/v1/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const productData = { ...req.body };

    // Handle file uploads
    if (req.files && req.files.length > 0) {
      productData.images = req.files.map((file) => file.path.replace(/\\/g, '/'));
    }

    // Handle tags if string
    if (typeof productData.tags === 'string') {
      productData.tags = productData.tags.split(',').map((tag) => tag.trim());
    }

    const product = await Product.create(productData);
    await product.populate('category', 'name slug');

    const response = new ApiResponse(201, { product }, 'Product created successfully');
    res.status(201).json(response.toJSON());
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/v1/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const updateData = { ...req.body };

    // Handle file uploads
    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map((file) => file.path.replace(/\\/g, '/'));
    }

    // Handle tags if string
    if (typeof updateData.tags === 'string') {
      updateData.tags = updateData.tags.split(',').map((tag) => tag.trim());
    }

    // Regenerate slug if name changed
    if (updateData.name) {
      const slugify = require('slugify');
      updateData.slug =
        slugify(updateData.name, { lower: true, strict: true }) + '-' + Date.now();
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).populate('category', 'name slug');

    if (!product) {
      return next(ApiError.notFound('Product not found'));
    }

    const response = new ApiResponse(200, { product }, 'Product updated successfully');
    res.status(200).json(response.toJSON());
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/v1/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(ApiError.notFound('Product not found'));
    }

    // Delete associated reviews
    await Review.deleteMany({ product: product._id });

    await product.deleteOne();

    const response = new ApiResponse(200, null, 'Product deleted successfully');
    res.status(200).json(response.toJSON());
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured products
// @route   GET /api/v1/products/featured
// @access  Public
const getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isFeatured: true })
      .populate('category', 'name slug')
      .limit(8)
      .sort({ createdAt: -1 })
      .lean();

    const response = new ApiResponse(200, { products }, 'Featured products fetched successfully');
    res.status(200).json(response.toJSON());
  } catch (error) {
    next(error);
  }
};

// @desc    Get related products
// @route   GET /api/v1/products/:id/related
// @access  Public
const getRelatedProducts = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(ApiError.notFound('Product not found'));
    }

    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
    })
      .populate('category', 'name slug')
      .limit(4)
      .sort({ ratingsAverage: -1 })
      .lean();

    const response = new ApiResponse(200, { products: relatedProducts }, 'Related products fetched successfully');
    res.status(200).json(response.toJSON());
  } catch (error) {
    next(error);
  }
};

// @desc    Create a review for a product
// @route   POST /api/v1/products/:id/reviews
// @access  Private
const createReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.id;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return next(ApiError.notFound('Product not found'));
    }

    // Check if user already reviewed
    const existingReview = await Review.findOne({
      user: req.user._id,
      product: productId,
    });

    if (existingReview) {
      return next(ApiError.badRequest('You have already reviewed this product'));
    }

    const review = await Review.create({
      user: req.user._id,
      product: productId,
      rating: Number(rating),
      comment,
    });

    await review.populate('user', 'name avatar');

    const response = new ApiResponse(201, { review }, 'Review created successfully');
    res.status(201).json(response.toJSON());
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a product
// @route   GET /api/v1/products/:id/reviews
// @access  Public
const getProductReviews = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [reviews, total] = await Promise.all([
      Review.find({ product: id })
        .populate('user', 'name avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Review.countDocuments({ product: id }),
    ]);

    const response = new ApiResponse(200, {
      reviews,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      total,
    }, 'Reviews fetched successfully');

    res.status(200).json(response.toJSON());
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};
