import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyOrders } from '../features/orders/orderSlice';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import Modal from '../components/common/Modal';
import formatCurrency from '../utils/formatCurrency';
import formatDate from '../utils/formatDate';
import { HiEye, HiOutlineClock, HiOutlineCheckCircle, HiOutlineTruck, HiOutlineCheckBadge, HiOutlineXCircle } from 'react-icons/hi2';

const MyOrders = () => {
  const dispatch = useDispatch();
  const { myOrders, loading } = useSelector((state) => state.orders);
  
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  const handleOpenDetails = (order) => {
    setSelectedOrder(order);
    setDetailsModalOpen(true);
  };

  const getStatusBadge = (status) => {
    const badges = {
      Pending: { bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20', icon: HiOutlineClock },
      Confirmed: { bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20', icon: HiOutlineCheckCircle },
      Shipped: { bg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20', icon: HiOutlineTruck },
      Delivered: { bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20', icon: HiOutlineCheckBadge },
      Cancelled: { bg: 'bg-red-500/10 text-red-650 dark:text-red-400 border-red-500/20', icon: HiOutlineXCircle },
    };

    const style = badges[status] || { bg: 'bg-slate-500/10 text-slate-600 border-slate-550/20', icon: HiOutlineClock };
    const Icon = style.icon;

    return (
      <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full border text-xs font-bold ${style.bg}`}>
        <Icon className="w-3.5 h-3.5" />
        <span>{status}</span>
      </span>
    );
  };

  if (loading && myOrders.length === 0) return <Loader />;

  if (myOrders.length === 0) {
    return (
      <div className="py-16">
        <EmptyState
          title="No Orders Found"
          description="You haven't placed any orders yet. Fill your cart with items!"
          actionText="Start Shopping"
          actionLink="/products"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100">
          My Orders
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Track the status and history of your orders
        </p>
      </div>

      {/* Orders Table/List */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {myOrders.map((order) => (
                <tr key={order._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-slate-800 dark:text-slate-200 select-all">
                    {order.orderId || order._id}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-450">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-800 dark:text-slate-200">
                    {formatCurrency(order.totalPrice)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {getStatusBadge(order.orderStatus)}
                  </td>
                  <td className="px-6 py-4 text-sm text-right">
                    <button
                      onClick={() => handleOpenDetails(order)}
                      className="p-2 rounded-xl text-primary-500 hover:bg-primary-500/10 transition-colors"
                      title="View Details"
                    >
                      <HiEye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedOrder && (
        <Modal
          isOpen={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          title={`Order Details: ${selectedOrder.orderId || selectedOrder._id}`}
        >
          <div className="space-y-6 py-2">
            {/* Status Summary */}
            <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <div>
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Payment Status
                </span>
                <span className="block text-sm font-bold text-slate-800 dark:text-slate-200 capitalize mt-0.5">
                  {selectedOrder.paymentMethod} — {selectedOrder.paymentStatus}
                </span>
              </div>
              <div>{getStatusBadge(selectedOrder.orderStatus)}</div>
            </div>

            {/* Delivery address details */}
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">
                Shipping Address
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800/50">
                <strong>{selectedOrder.shippingAddress.fullName}</strong>
                <br />
                {selectedOrder.shippingAddress.phone}
                <br />
                {selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city},{' '}
                {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode},{' '}
                {selectedOrder.shippingAddress.country}
              </p>
            </div>

            {/* Items table */}
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">
                Order Items
              </h4>
              <div className="space-y-3 max-h-40 overflow-y-auto pr-2 scrollbar-thin">
                {selectedOrder.orderItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <span className="text-slate-700 dark:text-slate-350 truncate max-w-[200px]">
                      {item.name} <span className="text-slate-400">× {item.quantity}</span>
                    </span>
                    <span className="font-bold text-slate-850 dark:text-slate-200">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 border-t border-slate-200 dark:border-slate-800 pt-4 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Shipping</span>
                <span>{selectedOrder.shippingPrice === 0 ? 'Free' : formatCurrency(selectedOrder.shippingPrice)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Tax (5%)</span>
                <span>{formatCurrency(selectedOrder.taxPrice)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-800 dark:text-slate-200 border-t border-slate-200 dark:border-slate-800 pt-2">
                <span>Total Paid</span>
                <span className="text-primary-500">{formatCurrency(selectedOrder.totalPrice)}</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MyOrders;
