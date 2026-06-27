import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HiMagnifyingGlass, HiXMark, HiStar } from 'react-icons/hi2';
import { fetchCategories } from '../../features/categories/categorySlice';
import useDebounce from '../../hooks/useDebounce';

const ProductFilters = ({ filters, onFilterChange, className = '' }) => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);
  const [search, setSearch] = useState(filters.search || '');
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      onFilterChange({ ...filters, search: debouncedSearch, page: 1 });
    }
  }, [debouncedSearch]);

  const handleCategoryChange = (cat) => {
    const current = filters.category || '';
    const items = current ? current.split(',') : [];
    const isSelected = items.some((val) => val === cat._id || val === cat.slug);
    
    let updated;
    if (isSelected) {
      updated = items.filter((val) => val !== cat._id && val !== cat.slug);
    } else {
      updated = [...items, cat.slug];
    }
    onFilterChange({ ...filters, category: updated.join(','), page: 1 });
  };

  const handlePriceChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value, page: 1 });
  };

  const handleRatingFilter = (rating) => {
    onFilterChange({
      ...filters,
      rating: filters.rating === rating ? '' : rating,
      page: 1,
    });
  };

  const clearFilters = () => {
    setSearch('');
    onFilterChange({ search: '', category: '', minPrice: '', maxPrice: '', rating: '', sort: '', page: 1 });
  };

  const hasActiveFilters = filters.search || filters.category || filters.minPrice || filters.maxPrice || filters.rating;

  const filterContent = (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
          Search
        </label>
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
          />
          <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        </div>
      </div>

      {/* Categories */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
          Categories
        </label>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {categories.map((cat) => {
            const selected = (filters.category || '')
              .split(',')
              .some((val) => val === cat._id || val === cat.slug);
            return (
              <div
                key={cat._id}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <div
                  className={`w-4.5 h-4.5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                    selected
                      ? 'bg-primary-500 border-primary-500'
                      : 'border-slate-300 dark:border-slate-600 group-hover:border-primary-400'
                  }`}
                  onClick={() => handleCategoryChange(cat)}
                >
                  {selected && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span
                  className="text-sm text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors"
                  onClick={() => handleCategoryChange(cat)}
                >
                  {cat.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
          Price Range
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            value={filters.minPrice || ''}
            onChange={(e) => handlePriceChange('minPrice', e.target.value)}
            placeholder="Min"
            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
          />
          <span className="text-slate-400">-</span>
          <input
            type="number"
            min="0"
            value={filters.maxPrice || ''}
            onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
            placeholder="Max"
            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
          />
        </div>
      </div>

      {/* Rating */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
          Rating
        </label>
        <div className="space-y-1.5">
          {[4, 3, 2, 1].map((r) => (
            <button
              key={r}
              onClick={() => handleRatingFilter(r)}
              className={`flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm transition-all duration-200 ${
                Number(filters.rating) === r
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <HiStar
                    key={i}
                    className={`w-4 h-4 ${i < r ? 'text-amber-400' : 'text-slate-200 dark:text-slate-600'}`}
                  />
                ))}
              </div>
              <span>& Up</span>
            </button>
          ))}
        </div>
      </div>

      {/* Clear */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200"
        >
          <HiXMark className="w-4 h-4" />
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className={className}>
      {filterContent}
    </div>
  );
};

export default ProductFilters;
