import { useSelector, useDispatch } from 'react-redux';
import { useMemo, useCallback } from 'react';
import {
  fetchCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  addGuestItem,
  updateGuestItem,
  removeGuestItem,
  clearGuestCart,
} from '../features/cart/cartSlice';

const useCart = () => {
  const dispatch = useDispatch();
  const { cart, items, loading, error } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const itemCount = useMemo(() => {
    return items.reduce((total, item) => total + (item.quantity || 0), 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((total, item) => {
      const price = item.product?.discountPrice || item.product?.price || item.price || 0;
      return total + price * (item.quantity || 0);
    }, 0);
  }, [items]);

  const loadCart = useCallback(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated]);

  const addItem = useCallback(
    (productId, quantity = 1, product = null) => {
      if (isAuthenticated) {
        return dispatch(addToCart({ productId, quantity }));
      } else {
        return dispatch(addGuestItem({ product, quantity }));
      }
    },
    [dispatch, isAuthenticated]
  );

  const updateItem = useCallback(
    (itemId, quantity) => {
      if (isAuthenticated) {
        return dispatch(updateCartItem({ itemId, quantity }));
      } else {
        return dispatch(updateGuestItem({ productId: itemId, quantity }));
      }
    },
    [dispatch, isAuthenticated]
  );

  const removeItem = useCallback(
    (itemId) => {
      if (isAuthenticated) {
        return dispatch(removeFromCart(itemId));
      } else {
        return dispatch(removeGuestItem(itemId));
      }
    },
    [dispatch, isAuthenticated]
  );

  const clear = useCallback(() => {
    if (isAuthenticated) {
      return dispatch(clearCart());
    } else {
      return dispatch(clearGuestCart());
    }
  }, [dispatch, isAuthenticated]);

  return {
    cart,
    items,
    loading,
    error,
    itemCount,
    subtotal,
    loadCart,
    addItem,
    updateItem,
    removeItem,
    clear,
  };
};

export default useCart;
