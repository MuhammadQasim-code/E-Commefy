import React from 'react';

const StatsCard = ({ label, value, icon: Icon, trend, trendType = 'up' }) => {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 p-6 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <h3 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-2">
            {value}
          </h3>
        </div>
        <div className="p-3 bg-primary-500/10 text-primary-500 dark:text-primary-400 rounded-xl">
          <Icon className="w-6 h-6" />
        </div>
      </div>
      
      {trend && (
        <div className="mt-4 flex items-center space-x-2">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            trendType === 'up'
              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
              : 'bg-red-500/15 text-red-600 dark:text-red-400'
          }`}>
            {trend}
          </span>
          <span className="text-xs text-slate-400">
            vs last month
          </span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;
