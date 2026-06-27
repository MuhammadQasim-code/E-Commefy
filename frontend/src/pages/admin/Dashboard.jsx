import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderStats } from '../../features/orders/orderSlice';
import StatsCard from '../../components/admin/StatsCard';
import { RevenueChart, OrderStatusChart } from '../../components/admin/Charts';
import Loader from '../../components/common/Loader';
import formatCurrency from '../../utils/formatCurrency';
import formatDate from '../../utils/formatDate';
import {
  HiOutlineCurrencyDollar,
  HiOutlineShoppingBag,
  HiOutlineUsers,
  HiOutlineTag,
} from 'react-icons/hi';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrderStats());
  }, [dispatch]);

  if (loading && !stats) return <Loader />;

  const totalRevenue = stats?.totalRevenue || 0;
  const totalOrders = stats?.totalOrders || 0;
  const totalProducts = stats?.totalProducts || 0;
  const totalUsers = stats?.totalUsers || 0;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">
          Dashboard Overview
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Store analytics and performance summary
        </p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          label="Total Sales"
          value={formatCurrency(totalRevenue)}
          icon={HiOutlineCurrencyDollar}
          trend="+12.5%"
          trendType="up"
        />
        <StatsCard
          label="Total Orders"
          value={totalOrders}
          icon={HiOutlineShoppingBag}
          trend="+5.2%"
          trendType="up"
        />
        <StatsCard
          label="Total Users"
          value={totalUsers}
          icon={HiOutlineUsers}
          trend="+8.1%"
          trendType="up"
        />
        <StatsCard
          label="Products Catalog"
          value={totalProducts}
          icon={HiOutlineTag}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Trend Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
            Monthly Sales Trend
          </h3>
          <RevenueChart data={stats?.monthlyRevenue || []} />
        </div>

        {/* Order Status Distribution */}
        <div className="lg:col-span-1 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
            Order Statuses
          </h3>
          <OrderStatusChart data={stats?.ordersByStatus || []} />
        </div>
      </div>

      {/* Recent Orders List */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-6">
          Recent Orders
        </h3>
        
        <div className="overflow-x-auto">
          {stats?.recentOrders && stats.recentOrders.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="pb-3 pr-4">Order ID</th>
                  <th className="pb-3 px-4">Customer</th>
                  <th className="pb-3 px-4">Date</th>
                  <th className="pb-3 px-4">Total</th>
                  <th className="pb-3 pl-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
                {stats.recentOrders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 pr-4 font-semibold text-slate-800 dark:text-slate-200 select-all">
                      {ord.orderId || ord._id}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 capitalize">
                      {ord.shippingAddress?.fullName || 'Guest User'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {formatDate(ord.createdAt)}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-850 dark:text-slate-250">
                      {formatCurrency(ord.totalPrice)}
                    </td>
                    <td className="py-3.5 pl-4 text-right">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        ord.orderStatus === 'Delivered'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : ord.orderStatus === 'Cancelled'
                          ? 'bg-red-500/10 text-red-650'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      }`}>
                        {ord.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-slate-500 text-center py-6">No orders recorded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
