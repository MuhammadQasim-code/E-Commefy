const Cart = require('../models/Cart');
const Product = require('../models/Product');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

// @desc    Get user's cart
// @route   GET /api/v1/cart
// @access  Private
const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate(
      'items.product',
      'name price discountPrice images stock slug'
    );

    if (!cart) {
      cart = { items: [] };
    }

    // Calculate totals
    let subtotal = 0;
    const items = (cart.items || []).map((item) => {
      const itemObj = item.toObject ? item.toObject() : item;
      const effectivePrice =
        itemObj.product && itemObj.product.discountPrice > 0
          ? itemObj.product.discountPrice
          : itemObj.price;
      const itemTotal = effectivePrice * itemObj.quantity;
      subtotal += itemTotal;
      return { ...itemObj, itemTotal };
    });

    const response = new ApiResponse(
      200,
      {
        cart: {
          _id: cart._id,
          items,
          subtotal: Math.round(subtotal * 100) / 100,
          itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
        },
      },
      'Cart fetched successfully'
    );

    res.status(200).json(response.toJSON());
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/v1/cart
// @access  Private
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Check if product exists and has stock
    const product = await Product.findById(productId);
    if (!product) {
      return next(ApiError.notFound('Product not found'));
    }

    if (product.stock < 1) {
      return next(ApiError.badRequest('Product is out of stock'));
    }

    const effectivePrice =
      product.discountPrice > 0 ? product.discountPrice : product.price;

    // Find or create cart
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Check if item already in cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity
      const newQuantity = cart.items[existingItemIndex].quantity + Number(quantity);

      if (newQuantity > product.stock) {
        return next(
          ApiError.badRequest(`Only ${product.stock} items available in stock`)
        );
      }

      cart.items[existingItemIndex].quantity = newQuantity;
      cart.items[existingItemIndex].price = effectivePrice;
    } else {
      if (Number(quantity) > product.stock) {
        return next(
          ApiError.badRequest(`Only ${product.stock} items available in stock`)
        );
      }

      cart.items.push({
        product: productId,
        quantity: Number(quantity),
        price: effectivePrice,
      });
    }

    await cart.save();
    await cart.populate('items.product', 'name price discountPrice images stock slug');

    const response = new ApiResponse(200, { cart }, 'Item added to cart successfully');
    res.status(200).json(response.toJSON());
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/v1/cart/:itemId
// @access  Private
const updateCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return next(ApiError.badRequest('Quantity must be at least 1'));
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return next(ApiError.notFound('Cart not found'));
    }

    const itemIndex = cart.items.findIndex(
      (item) => item._id.toString() === itemId
    );

    if (itemIndex === -1) {
      return next(ApiError.notFound('Item not found in cart'));
    }

    // Validate against stock
    const product = await Product.findById(cart.items[itemIndex].product);
    if (!product) {
      return next(ApiError.notFound('Product no longer exists'));
    }

    if (Number(quantity) > product.stock) {
      return next(
        ApiError.badRequest(`Only ${product.stock} items available in stock`)
      );
    }

    cart.items[itemIndex].quantity = Number(quantity);
    await cart.save();
    await cart.populate('items.product', 'name price discountPrice images stock slug');

    const response = new ApiResponse(200, { cart }, 'Cart item updated successfully');
    res.status(200).json(response.toJSON());
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/v1/cart/:itemId
// @access  Private
const removeFromCart = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return next(ApiError.notFound('Cart not found'));
    }

    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);

    await cart.save();
    await cart.populate('items.product', 'name price discountPrice images stock slug');

    const response = new ApiResponse(200, { cart }, 'Item removed from cart successfully');
    res.status(200).json(response.toJSON());
  } catch (error) {
    next(error);
  }
};

// @desc    Clear cart
// @route   DELETE /api/v1/cart
// @access  Private
const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
      cart.items = [];
      await cart.save();
    }

    const response = new ApiResponse(200, null, 'Cart cleared successfully');
    res.status(200).json(response.toJSON());
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
