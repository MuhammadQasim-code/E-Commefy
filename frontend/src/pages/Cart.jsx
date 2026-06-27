import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, clearCart } from '../features/cart/cartSlice';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import toast from 'react-hot-toast';

const Cart = () => {
  const dispatch = useDispatch();
  const { cart, items, loading } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated]);

  const handleClearCart = async () => {
    try {
      await dispatch(clearCart()).unwrap();
      toast.success('Cart cleared successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to clear cart');
    }
  };

  if (loading && !cart) return <Loader />;

  if (items.length === 0) {
    return (
      <div className="py-16">
        <EmptyState
          title="Your Cart is Empty"
          description="Looks like you haven't added anything to your cart yet."
          actionText="Start Shopping"
          actionLink="/products"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-end border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100">
            Shopping Cart
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Review and adjust your selected items
          </p>
        </div>
        <button
          onClick={handleClearCart}
          className="text-sm font-bold text-red-500 hover:text-red-650 dark:hover:text-red-400 transition-colors"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart Items list */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <CartItem key={item.product?._id || item._id} item={item} />
          ))}
        </div>

        {/* Cart Summary sidebar */}
        <div className="lg:col-span-1">
          <CartSummary items={items} />
        </div>
      </div>
    </div>
  );
};

export default Cart;
