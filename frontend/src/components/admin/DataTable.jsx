import React from 'react';
import Loader from '../common/Loader';
import EmptyState from '../common/EmptyState';

const DataTable = ({
  columns,
  data,
  loading,
  searchPlaceholder = "Search...",
  searchValue = "",
  onSearchChange,
  actionsHeader = "Actions",
  renderRowActions,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 overflow-hidden shadow-sm">
      {/* Top Filter Bar */}
      {onSearchChange && (
        <div className="p-5 border-b border-slate-200 dark:border-slate-800">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full md:max-w-xs px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-4 focus:ring-primary-500/20 transition-all duration-200"
          />
        </div>
      )}

      {/* Table Container */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader.Inline />
          </div>
        ) : data.length === 0 ? (
          <div className="py-16">
            <EmptyState
              title="No data found"
              description="We couldn't find any records matching your search."
            />
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
                {columns.map((col) => (
                  <th
                    key={col.header}
                    className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                  >
                    {col.header}
                  </th>
                ))}
                {renderRowActions && (
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">
                    {actionsHeader}
                  </th>
                )}
              </tr>

            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {data.map((row, idx) => (
                <tr
                  key={row._id || idx}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  {columns.map((col) => (
                    <td key={col.header} className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                  {renderRowActions && (
                    <td className="px-6 py-4 text-sm text-right">
                      <div className="flex justify-end space-x-2">
                        {renderRowActions(row)}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DataTable;
