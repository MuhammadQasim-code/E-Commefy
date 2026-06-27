import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, clearCart } from '../features/cart/cartSlice';
import { createOrder } from '../features/orders/orderSlice';
import CheckoutForm from '../components/checkout/CheckoutForm';
import OrderSummary from '../components/checkout/OrderSummary';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items, loading: cartLoading } = useSelector((state) => state.cart);
  const { loading: orderLoading } = useSelector((state) => state.orders);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated]);

  // If cart is empty, redirect to products page
  useEffect(() => {
    if (!cartLoading && items.length === 0) {
      toast.error('Your cart is empty. Add products before checking out.');
      navigate('/products');
    }
  }, [items, cartLoading, navigate]);

  const handleCheckoutSubmit = async (shippingData) => {
    const { paymentMethod, ...shippingAddress } = shippingData;
    
    const orderItems = items.map((item) => {
      if (!item.product) return null;
      return {
        product: item.product._id,
        name: item.product.name,
        image: item.product.images?.[0] || '',
        price: item.product.discountPrice > 0 ? item.product.discountPrice : item.product.price,
        quantity: item.quantity,
      };
    }).filter(Boolean);

    try {
      const order = await dispatch(createOrder({
        orderItems,
        shippingAddress,
        paymentMethod,
      })).unwrap();

      toast.success('Order placed successfully!');
      
      // Save guest order ID locally
      if (!isAuthenticated && order) {
        try {
          const guestOrders = JSON.parse(localStorage.getItem('ecommefy_guest_orders') || '[]');
          const orderMongoId = order._id || order.id;
          if (orderMongoId && !guestOrders.includes(orderMongoId)) {
            guestOrders.push(orderMongoId);
            localStorage.setItem('ecommefy_guest_orders', JSON.stringify(guestOrders));
          }
        } catch (saveErr) {
          console.error('Failed to save guest order ID:', saveErr);
        }
      }

      // Clear cart locally
      dispatch(clearCart());
      // Navigate to success page
      navigate(`/order-success/${order.orderId || order._id}`);
    } catch (err) {
      toast.error(err.message || 'Failed to place order');
    }
  };

  if (cartLoading && items.length === 0) return <Loader />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100">
          Checkout
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Complete your billing details and place your order
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Billing Address Form */}
        <div className="lg:col-span-2">
          {/* We wrap the form fields inside CheckoutForm, and place a hidden submit button or trigger submit from OrderSummary */}
          {/* For best UX, we will pass a ref or simply let the form be submitted by a standard html button inside the CheckoutForm */}
          <div id="checkout-form-container">
            <CheckoutForm onSubmit={handleCheckoutSubmit} loading={orderLoading} />
          </div>
        </div>

        {/* Sidebar Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <OrderSummary
              items={items}
              loading={orderLoading}
              buttonText="Place My Order"
            />
            {/* Native form submit button */}
            <button
              type="submit"
              form="checkout-form"
              disabled={orderLoading || items.length === 0}
              className="mt-3 w-full py-3 text-center border border-slate-350 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl font-semibold text-sm transition-colors text-slate-700 dark:text-slate-300"
            >
              Confirm Details & Pay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
