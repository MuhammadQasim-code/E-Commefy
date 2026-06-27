import React from 'react';
import formatCurrency from '../../utils/formatCurrency';

const OrderSummary = ({ items, loading, buttonText = "Place Order" }) => {
  const subtotal = items.reduce((acc, item) => {
    if (!item.product) return acc;
    const price = item.product.discountPrice > 0 ? item.product.discountPrice : item.product.price;
    return acc + price * item.quantity;
  }, 0);

  const tax = subtotal * 0.05;
  const shipping = subtotal > 100 || subtotal === 0 ? 0 : 10;
  const total = subtotal + tax + shipping;

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 p-6 shadow-sm">
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-6">
        Order Summary
      </h3>
      
      {/* Product List */}
      <div className="space-y-4 max-h-80 overflow-y-auto mb-6 pr-2 scrollbar-thin">
        {items.map((item) => {
          const { product, quantity } = item;
          if (!product) return null;
          
          const imageUrl = product.images && product.images.length > 0
            ? `http://localhost:5000${product.images[0]}`
            : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60';
          const price = product.discountPrice > 0 ? product.discountPrice : product.price;

          return (
            <div key={item._id} className="flex items-center space-x-3">
              <img
                src={imageUrl}
                alt={product.name}
                className="w-14 h-14 rounded-lg object-cover border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60';
                }}
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200 truncate">
                  {product.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Qty: {quantity} × {formatCurrency(price)}
                </p>
              </div>
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {formatCurrency(price * quantity)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pricing Details */}
      <div className="space-y-3 border-t border-slate-200 dark:border-slate-800 pt-6 mb-6">
        <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
          <span>Subtotal</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {formatCurrency(subtotal)}
          </span>
        </div>
        <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
          <span>Estimated Tax (5%)</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {formatCurrency(tax)}
          </span>
        </div>
        <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
          <span>Shipping</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {shipping === 0 ? 'Free' : formatCurrency(shipping)}
          </span>
        </div>
      </div>

      <div className="flex justify-between text-lg font-bold text-slate-800 dark:text-slate-200 mb-6 border-t border-slate-200 dark:border-slate-800 pt-4">
        <span>Total</span>
        <span className="text-primary-500 dark:text-primary-400">
          {formatCurrency(total)}
        </span>
      </div>

      <button
        type="submit"
        form="checkout-form"
        disabled={loading || items.length === 0}
        className="w-full py-3.5 px-4 font-semibold text-white rounded-xl gradient-primary hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <span>{buttonText}</span>
        )}
      </button>
    </div>
  );
};

export default OrderSummary;
