const Category = require('../models/Category');
const Product = require('../models/Product');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

// @desc    Get all categories
// @route   GET /api/v1/categories
// @access  Public
const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ name: 1 })
      .lean();

    const response = new ApiResponse(200, { categories }, 'Categories fetched successfully');
    res.status(200).json(response.toJSON());
  } catch (error) {
    next(error);
  }
};

// @desc    Get category by slug
// @route   GET /api/v1/categories/slug/:slug
// @access  Public
const getCategoryBySlug = async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug }).lean();

    if (!category) {
      return next(ApiError.notFound('Category not found'));
    }

    const response = new ApiResponse(200, { category }, 'Category fetched successfully');
    res.status(200).json(response.toJSON());
  } catch (error) {
    next(error);
  }
};

// @desc    Create category
// @route   POST /api/v1/categories
// @access  Private/Admin
const createCategory = async (req, res, next) => {
  try {
    const categoryData = { ...req.body };

    // Handle file upload
    if (req.file) {
      categoryData.image = req.file.path.replace(/\\/g, '/');
    }

    const category = await Category.create(categoryData);

    const response = new ApiResponse(201, { category }, 'Category created successfully');
    res.status(201).json(response.toJSON());
  } catch (error) {
    next(error);
  }
};

// @desc    Update category
// @route   PUT /api/v1/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res, next) => {
  try {
    const updateData = { ...req.body };

    // Handle file upload
    if (req.file) {
      updateData.image = req.file.path.replace(/\\/g, '/');
    }

    const category = await Category.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return next(ApiError.notFound('Category not found'));
    }

    const response = new ApiResponse(200, { category }, 'Category updated successfully');
    res.status(200).json(response.toJSON());
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category
// @route   DELETE /api/v1/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return next(ApiError.notFound('Category not found'));
    }

    // Check if products exist in this category
    const productCount = await Product.countDocuments({ category: category._id });
    if (productCount > 0) {
      return next(
        ApiError.badRequest(
          `Cannot delete category. ${productCount} product(s) are associated with it.`
        )
      );
    }

    await category.deleteOne();

    const response = new ApiResponse(200, null, 'Category deleted successfully');
    res.status(200).json(response.toJSON());
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
};
