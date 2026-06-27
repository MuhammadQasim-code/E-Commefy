import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { HiCheckCircle, HiHome, HiShoppingBag } from 'react-icons/hi2';

const OrderSuccess = () => {
  const { orderId } = useParams();

  return (
    <div className="max-w-2xl mx-auto text-center py-16 px-4 space-y-8 animate-scale-in">
      {/* Icon checkmark with circle pulse */}
      <div className="flex justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl scale-120 animate-pulse-slow" />
          <HiCheckCircle className="w-24 h-24 text-emerald-500 relative z-10" />
        </div>
      </div>

      <div className="space-y-3">
        <h1 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-slate-100">
          Order Placed Successfully!
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg max-w-md mx-auto leading-relaxed">
          Thank you for your purchase. Your order has been registered and is being processed.
        </p>
      </div>

      {orderId && (
        <div className="bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl max-w-sm mx-auto shadow-sm">
          <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest">
            Order Reference
          </span>
          <span className="block text-lg font-black text-primary-500 dark:text-primary-400 mt-1 select-all">
            {orderId}
          </span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto pt-4">
        <Link
          to="/my-orders"
          className="w-full sm:w-auto px-6 py-3.5 bg-primary-650 text-white font-bold rounded-xl gradient-primary hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
        >
          <HiShoppingBag className="w-5 h-5" />
          <span>View My Orders</span>
        </Link>
        
        <Link
          to="/"
          className="w-full sm:w-auto px-6 py-3.5 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-350 font-bold rounded-xl transition-colors flex items-center justify-center space-x-2"
        >
          <HiHome className="w-5 h-5" />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
