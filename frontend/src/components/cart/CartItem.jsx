import React from 'react';
import { HiMinus, HiPlus, HiTrash } from 'react-icons/hi2';
import useCart from '../../hooks/useCart';
import formatCurrency from '../../utils/formatCurrency';
import toast from 'react-hot-toast';

const CartItem = ({ item }) => {
  const { updateItem, removeItem } = useCart();
  const { product, quantity, _id: itemId } = item;

  // Handle case where product might have been deleted but cart item remains
  if (!product) return null;

  const handleQuantityChange = async (newQty) => {
    if (newQty < 1) return;
    if (newQty > product.stock) {
      toast.error(`Only ${product.stock} items left in stock`);
      return;
    }
    
    try {
      await updateItem(itemId || product._id, newQty);
    } catch (err) {
      toast.error(err.message || 'Failed to update quantity');
    }
  };

  const handleRemove = async () => {
    try {
      await removeItem(itemId || product._id);
      toast.success('Item removed from cart');
    } catch (err) {
      toast.error(err.message || 'Failed to remove item');
    }
  };

  const imageUrl = product.images && product.images.length > 0
    ? `http://localhost:5000${product.images[0]}`
    : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60';

  const price = product.discountPrice > 0 ? product.discountPrice : product.price;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 mb-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 shadow-sm transition-all duration-300 hover:shadow-md">
      {/* Product Info */}
      <div className="flex items-center space-x-4 w-full sm:w-auto mb-4 sm:mb-0">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-20 h-20 rounded-xl object-cover border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60';
          }}
        />
        <div className="flex-1">
          <h3 className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">
            {product.brand || 'ECo Exclusive'}
          </p>
          <div className="mt-1 flex items-baseline space-x-2">
            <span className="font-bold text-primary-500 dark:text-primary-400">
              {formatCurrency(price)}
            </span>
            {product.discountPrice > 0 && (
              <span className="text-xs text-slate-400 line-through">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Actions (Quantity and Delete) */}
      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-6">
        {/* Quantity Controls */}
        <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
          <button
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
            className="p-1 rounded-md text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <HiMinus className="w-4 h-4" />
          </button>
          <span className="w-8 text-center font-medium text-slate-800 dark:text-slate-200">
            {quantity}
          </span>
          <button
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={quantity >= product.stock}
            className="p-1 rounded-md text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <HiPlus className="w-4 h-4" />
          </button>
        </div>

        {/* Subtotal */}
        <div className="text-right min-w-[80px]">
          <span className="font-bold text-slate-800 dark:text-slate-200">
            {formatCurrency(price * quantity)}
          </span>
        </div>

        {/* Remove Button */}
        <button
          onClick={handleRemove}
          className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          title="Remove Item"
        >
          <HiTrash className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
