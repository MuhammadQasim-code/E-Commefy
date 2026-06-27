import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import formatCurrency from '../../utils/formatCurrency';

export const RevenueChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-72 flex items-center justify-center text-slate-400">
        No sales data available
      </div>
    );
  }

  // Format month names nicely if needed (data format: [{ month: '2026-06', revenue: 1000 }])
  const formattedData = data.map((d) => {
    const [year, month] = d.month.split('-');
    const date = new Date(year, parseInt(month) - 1);
    const label = date.toLocaleString('default', { month: 'short', year: '2-digit' });
    return { ...d, label };
  });

  return (
    <div className="h-72 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="label"
            stroke="#94A3B8"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#94A3B8"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip
            contentStyle={{
              background: '#1E293B',
              border: 'none',
              borderRadius: '12px',
              color: '#F8FAFC',
            }}
            formatter={(value) => [formatCurrency(value), 'Revenue']}
            labelFormatter={(label) => `Month: ${label}`}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#6366F1"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorRevenue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const OrderStatusChart = ({ data }) => {
  const COLORS = {
    Pending: '#F59E0B',
    Confirmed: '#3B82F6',
    Shipped: '#6366F1',
    Delivered: '#10B981',
    Cancelled: '#EF4444',
  };

  const chartData = Array.isArray(data)
    ? data.map((d) => ({
        name: d.status,
        value: d.count,
        color: COLORS[d.status] || '#94A3B8',
      }))
    : Object.entries(data || {}).map(([status, count]) => ({
        name: status,
        value: count,
        color: COLORS[status] || '#94A3B8',
      }));

  if (chartData.length === 0) {
    return (
      <div className="h-72 flex items-center justify-center text-slate-400">
        No order status data available
      </div>
    );
  }

  return (
    <div className="h-72 w-full mt-4 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: '#1E293B',
              border: 'none',
              borderRadius: '12px',
              color: '#F8FAFC',
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
