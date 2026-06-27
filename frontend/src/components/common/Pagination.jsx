import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';

const Pagination = ({ page, pages, currentPage, totalPages, onPageChange, className = '' }) => {
  const activePage = page !== undefined ? page : currentPage;
  const totalPageCount = pages !== undefined ? pages : totalPages;

  if (!totalPageCount || totalPageCount <= 1) return null;

  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, activePage - delta);
      i <= Math.min(totalPageCount - 1, activePage + delta);
      i++
    ) {
      range.push(i);
    }

    if (activePage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (activePage + delta < totalPageCount - 1) {
      rangeWithDots.push('...', totalPageCount);
    } else if (totalPageCount > 1) {
      rangeWithDots.push(totalPageCount);
    }

    return [...new Set(rangeWithDots)];
  };

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <button
        onClick={() => onPageChange(activePage - 1)}
        disabled={activePage <= 1}
        className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:border-primary-300 dark:hover:border-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300"
      >
        <HiChevronLeft className="w-5 h-5" />
      </button>

      {getPageNumbers().map((num, idx) =>
        num === '...' ? (
          <span
            key={`dots-${idx}`}
            className="px-2 text-slate-400 dark:text-slate-500 select-none"
          >
            ...
          </span>
        ) : (
          <button
            key={num}
            onClick={() => onPageChange(num)}
            className={`w-10 h-10 rounded-xl font-medium text-sm transition-all duration-300 ${
              activePage === num
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25'
                : 'border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:border-primary-300 dark:hover:border-primary-700'
            }`}
          >
            {num}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(activePage + 1)}
        disabled={activePage >= totalPageCount}
        className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:border-primary-300 dark:hover:border-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300"
      >
        <HiChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Pagination;
