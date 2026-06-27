import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProductBySlug,
  fetchRelatedProducts,
  createReview,
} from '../features/products/productSlice';
import { addToWishlist } from '../features/wishlist/wishlistSlice';
import useCart from '../hooks/useCart';
import ProductImageGallery from '../components/product/ProductImageGallery';
import RelatedProducts from '../components/product/RelatedProducts';
import StarRating from '../components/common/StarRating';
import Loader from '../components/common/Loader';
import formatCurrency from '../utils/formatCurrency';
import toast from 'react-hot-toast';
import { HiShoppingBag, HiHeart, HiArrowRight, HiMinus, HiPlus } from 'react-icons/hi2';

const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addItem } = useCart();

  const { product, relatedProducts, loading, error } = useSelector((state) => state.products);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    dispatch(fetchProductBySlug(slug));
  }, [dispatch, slug]);

  useEffect(() => {
    if (product) {
      dispatch(fetchRelatedProducts(product._id));
    }
  }, [dispatch, product]);

  if (loading) return <Loader />;
  if (error || !product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-red-500">Product not found</h2>
        <button
          onClick={() => navigate('/products')}
          className="mt-4 px-6 py-2.5 bg-primary-600 text-white rounded-xl gradient-primary"
        >
          Back to Catalog
        </button>
      </div>
    );
  }

  const handleQuantityChange = (type) => {
    if (type === 'dec' && quantity > 1) setQuantity(quantity - 1);
    if (type === 'inc' && quantity < product.stock) setQuantity(quantity + 1);
  };

  const handleAddToCart = async (checkoutImmediately = false) => {
    try {
      await addItem(product._id, quantity, product);
      toast.success(`${product.name} added to cart!`);
      if (checkoutImmediately) {
        navigate('/checkout');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to add to cart');
    }
  };

  const handleAddToWishlist = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to use wishlist');
      navigate('/login');
      return;
    }
    try {
      await dispatch(addToWishlist(product._id)).unwrap();
      toast.success(`${product.name} added to wishlist!`);
    } catch (err) {
      toast.error(err.message || 'Failed to add to wishlist');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error('Please enter a comment');
      return;
    }
    setSubmittingReview(true);
    try {
      await dispatch(createReview({ productId: product._id, rating, comment })).unwrap();
      toast.success('Review submitted successfully!');
      setComment('');
      // Reload product to show new reviews and rating average
      dispatch(fetchProductBySlug(slug));
    } catch (err) {
      toast.error(err.message || 'Failed to submit review. You can only write one review per product.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const price = product.discountPrice > 0 ? product.discountPrice : product.price;

  return (
    <div className="space-y-16 animate-fade-in">
      {/* Product top row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Images */}
        <div>
          <ProductImageGallery images={product.images} />
        </div>

        {/* Product Details Info */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-primary-500 dark:text-primary-400 uppercase tracking-widest bg-primary-500/10 px-3 py-1 rounded-full">
              {product.category?.name || 'Category'}
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-slate-100">
              {product.name}
            </h1>
            <div className="flex items-center space-x-3 pt-2">
              <StarRating rating={product.ratingsAverage} />
              <span className="text-sm text-slate-500 dark:text-slate-400">
                ({product.ratingsCount} customer reviews)
              </span>
            </div>
          </div>

          <div className="border-y border-slate-200 dark:border-slate-800 py-4 flex items-baseline space-x-3">
            <span className="text-3xl font-extrabold text-primary-500 dark:text-primary-400">
              {formatCurrency(price)}
            </span>
            {product.discountPrice > 0 && (
              <>
                <span className="text-slate-400 line-through text-lg">
                  {formatCurrency(product.price)}
                </span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded-md">
                  {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                </span>
              </>
            )}
          </div>

          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm md:text-base">
            {product.description.substring(0, 200)}...
          </p>

          {/* Stock status */}
          <div className="flex items-center space-x-3">
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Availability:</span>
            <span className={`text-sm font-bold ${
              product.stock > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-650'
            }`}>
              {product.stock > 0 ? `In Stock (${product.stock} left)` : 'Out of Stock'}
            </span>
          </div>

          {/* Quantity selector */}
          {product.stock > 0 && (
            <div className="space-y-3">
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Quantity:</span>
              <div className="flex items-center space-x-3">
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 w-fit">
                  <button
                    onClick={() => handleQuantityChange('dec')}
                    className="p-2 rounded-lg hover:bg-slate-250 dark:hover:bg-slate-700 text-slate-500"
                    disabled={quantity <= 1}
                  >
                    <HiMinus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-bold text-slate-850 dark:text-slate-200">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange('inc')}
                    className="p-2 rounded-lg hover:bg-slate-250 dark:hover:bg-slate-700 text-slate-500"
                    disabled={quantity >= product.stock}
                  >
                    <HiPlus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={() => handleAddToCart(false)}
              disabled={product.stock <= 0}
              className="flex-grow py-4 px-6 bg-primary-600 text-white font-bold rounded-2xl gradient-primary hover:opacity-90 transition-opacity flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <HiShoppingBag className="w-5 h-5" />
              <span>Add to Cart</span>
            </button>
            
            <button
              onClick={() => handleAddToCart(true)}
              disabled={product.stock <= 0}
              className="flex-grow py-4 px-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-2xl hover:opacity-95 transition-opacity flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Buy Now</span>
              <HiArrowRight className="w-5 h-5" />
            </button>
            
            <button
              onClick={handleAddToWishlist}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition-colors flex items-center justify-center"
              title="Add to Wishlist"
            >
              <HiHeart className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs description and reviews */}
      <section className="border-t border-slate-200 dark:border-slate-800 pt-10">
        <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6">
          <button
            onClick={() => setActiveTab('description')}
            className={`pb-4 px-6 font-bold text-sm tracking-wider uppercase border-b-2 transition-all ${
              activeTab === 'description'
                ? 'border-primary-500 text-primary-500'
                : 'border-transparent text-slate-400 hover:text-slate-650'
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-4 px-6 font-bold text-sm tracking-wider uppercase border-b-2 transition-all ${
              activeTab === 'reviews'
                ? 'border-primary-500 text-primary-500'
                : 'border-transparent text-slate-400 hover:text-slate-650'
            }`}
          >
            Reviews ({product.reviews?.length || 0})
          </button>
        </div>

        {activeTab === 'description' ? (
          <div className="text-slate-600 dark:text-slate-400 leading-relaxed space-y-4 max-w-4xl">
            <p>{product.description}</p>
          </div>
        ) : (
          <div className="space-y-8 max-w-4xl">
            {/* Reviews list */}
            <div className="space-y-6">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((rev) => (
                  <div key={rev._id} className="p-5 rounded-2xl bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-slate-200">
                          {rev.user?.name || 'Verified Buyer'}
                        </h4>
                        <span className="text-xs text-slate-400">
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <StarRating rating={rev.rating} />
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                      {rev.comment}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 dark:text-slate-400">No reviews yet. Be the first to review this product!</p>
              )}
            </div>

            {/* Review form */}
            {isAuthenticated ? (
              <form onSubmit={handleReviewSubmit} className="space-y-4 border-t border-slate-200 dark:border-slate-800 pt-8">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                  Write a Customer Review
                </h3>
                <div className="space-y-2">
                  <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Rating
                  </span>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`text-2xl transition-colors ${
                          star <= rating ? 'text-amber-400' : 'text-slate-300'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Review Details
                  </label>
                  <textarea
                    rows="4"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us what you liked or disliked about this product..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-4 focus:ring-primary-500/20 transition-all resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-6 py-3 bg-primary-600 text-white font-bold rounded-xl gradient-primary hover:opacity-90 transition-opacity"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-500 text-sm border border-slate-200 dark:border-slate-800 text-center">
                Please <Link to="/login" className="text-primary-500 font-bold hover:underline">login</Link> to submit your product review.
              </div>
            )}
          </div>
        )}
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 border-t border-slate-200 dark:border-slate-800 pt-10">
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">
            You Might Also Like
          </h2>
          <RelatedProducts products={relatedProducts} />
        </section>
      )}
    </div>
  );
};

export default ProductDetails;
