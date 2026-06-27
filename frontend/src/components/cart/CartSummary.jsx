import React from 'react';
import { Link } from 'react-router-dom';
import formatCurrency from '../../utils/formatCurrency';

const CartSummary = ({ items }) => {
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
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">
        Order Summary
      </h3>
      <div className="space-y-3 border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
        <div className="flex justify-between text-slate-600 dark:text-slate-400">
          <span>Subtotal</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {formatCurrency(subtotal)}
          </span>
        </div>
        <div className="flex justify-between text-slate-600 dark:text-slate-400">
          <span>Estimated Tax (5%)</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {formatCurrency(tax)}
          </span>
        </div>
        <div className="flex justify-between text-slate-600 dark:text-slate-400">
          <span>Shipping</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {shipping === 0 ? 'Free' : formatCurrency(shipping)}
          </span>
        </div>
        {shipping > 0 && (
          <p className="text-xs text-primary-500 dark:text-primary-400">
            Add {formatCurrency(100 - subtotal)} more for free shipping!
          </p>
        )}
      </div>
      <div className="flex justify-between text-lg font-bold text-slate-800 dark:text-slate-200 mb-6">
        <span>Total</span>
        <span className="text-primary-500 dark:text-primary-400">
          {formatCurrency(total)}
        </span>
      </div>

      <Link
        to="/checkout"
        className="block w-full py-3 text-center font-semibold text-white rounded-xl gradient-primary hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary-500/50"
      >
        Proceed to Checkout
      </Link>
      <Link
        to="/products"
        className="block text-center text-sm font-semibold text-primary-500 dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-300 mt-4 transition-colors"
      >
        Continue Shopping
      </Link>
    </div>
  );
};

export default CartSummary;
