import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishlist, removeFromWishlist } from '../features/wishlist/wishlistSlice';
import { addToCart } from '../features/cart/cartSlice';
import ProductCard from '../components/product/ProductCard';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const dispatch = useDispatch();
  const { wishlist, items, loading } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleMoveToCart = async (product) => {
    try {
      // Add to cart
      await dispatch(addToCart({ productId: product._id, quantity: 1 })).unwrap();
      // Remove from wishlist
      await dispatch(removeFromWishlist(product._id)).unwrap();
      toast.success(`${product.name} moved to cart!`);
    } catch (err) {
      toast.error(err.message || 'Failed to move item to cart');
    }
  };

  if (loading && !wishlist) return <Loader />;

  if (items.length === 0) {
    return (
      <div className="py-16">
        <EmptyState
          title="Your Wishlist is Empty"
          description="Save items you like to buy them later."
          actionText="Explore Products"
          actionLink="/products"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100">
          My Wishlist
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Items you've saved for later
        </p>
      </div>

      {/* Grid containing wishlist products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map((prod) => (
          <div key={prod._id} className="relative group">
            <ProductCard product={prod} />
            <div className="absolute top-16 left-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={() => handleMoveToCart(prod)}
                disabled={prod.stock === 0}
                className="w-full py-2 bg-slate-900/90 dark:bg-white/90 text-white dark:text-slate-900 font-bold rounded-xl text-xs backdrop-blur-sm shadow-lg hover:scale-102 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {prod.stock === 0 ? 'Out of Stock' : 'Move to Cart'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
