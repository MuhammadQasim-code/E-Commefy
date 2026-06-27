import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders, updateOrderStatus } from '../../features/orders/orderSlice';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/common/Modal';
import formatCurrency from '../../utils/formatCurrency';
import formatDate from '../../utils/formatDate';
import toast from 'react-hot-toast';
import { HiEye, HiOutlineCheck } from 'react-icons/hi2';

const ManageOrders = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.orders);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    dispatch(fetchAllOrders({ limit: 100 }));
  }, [dispatch]);

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    try {
      await dispatch(updateOrderStatus({ id, status })).unwrap();
      toast.success('Order status updated successfully');
      dispatch(fetchAllOrders({ limit: 100 }));
    } catch (err) {
      toast.error(err.message || 'Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleOpenDetails = (order) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  const columns = [
    {
      header: 'Order ID',
      render: (row) => <span className="font-bold text-slate-800 dark:text-slate-200 select-all">{row.orderId || row._id}</span>,
    },
    {
      header: 'Customer',
      render: (row) => <span className="capitalize">{row.shippingAddress?.fullName || 'Guest Buyer'}</span>,
    },
    {
      header: 'Date',
      render: (row) => <span>{formatDate(row.createdAt)}</span>,
    },
    {
      header: 'Total',
      render: (row) => <span className="font-bold">{formatCurrency(row.totalPrice)}</span>,
    },
    {
      header: 'Status',
      render: (row) => {
        const isCurrentUpdating = updatingId === row._id;
        return (
          <select
            value={row.orderStatus}
            disabled={isCurrentUpdating}
            onChange={(e) => handleStatusChange(row._id, e.target.value)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold ${
              row.orderStatus === 'Delivered'
                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                : row.orderStatus === 'Cancelled'
                ? 'bg-red-500/10 text-red-650 border-red-500/20'
                : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
            } focus:outline-none cursor-pointer`}
          >
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">
          Order Management
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Review, update, and manage orders placed by customers
        </p>
      </div>

      <DataTable
        columns={columns}
        data={orders}
        loading={loading}
        renderRowActions={(row) => (
          <button
            onClick={() => handleOpenDetails(row)}
            className="p-2 rounded-xl text-primary-500 hover:bg-primary-500/10 transition-colors"
            title="View Details"
          >
            <HiEye className="w-5 h-5" />
          </button>
        )}
      />

      {selectedOrder && (
        <Modal
          isOpen={detailsOpen}
          onClose={() => setDetailsOpen(false)}
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
              <span className="inline-block px-3 py-1 bg-primary-500/10 text-primary-500 border border-primary-500/25 rounded-full text-xs font-bold">
                {selectedOrder.orderStatus}
              </span>
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

export default ManageOrders;
