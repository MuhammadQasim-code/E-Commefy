import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../features/products/productSlice';
import ProductGrid from '../components/product/ProductGrid';
import ProductFilters from '../components/product/ProductFilters';
import Pagination from '../components/common/Pagination';
import { HiFunnel } from 'react-icons/hi2';

const Products = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, loading, page, pages, total } = useSelector((state) => state.products);

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sync params state
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const rating = searchParams.get('rating') || '';
  const sort = searchParams.get('sort') || '';
  const currentPage = parseInt(searchParams.get('page')) || 1;

  useEffect(() => {
    dispatch(
      fetchProducts({
        search,
        category,
        minPrice,
        maxPrice,
        rating,
        sort,
        page: currentPage,
        limit: 9,
      })
    );
  }, [dispatch, search, category, minPrice, maxPrice, rating, sort, currentPage]);

  const handlePageChange = (newPage) => {
    searchParams.set('page', newPage);
    setSearchParams(searchParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (e) => {
    searchParams.set('sort', e.target.value);
    searchParams.set('page', 1); // Reset page on sort
    setSearchParams(searchParams);
  };

  const filters = {
    search,
    category,
    minPrice,
    maxPrice,
    rating,
    sort,
    page: currentPage,
  };

  const handleFilterChange = (newFilters) => {
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.set(key, value);
      } else {
        searchParams.delete(key);
      }
    });
    setSearchParams(searchParams);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100">
            Store Catalog
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Showing {products.length} of {total} products
          </p>
        </div>
        
        {/* Sort & Mobile Filter controls */}
        <div className="flex items-center space-x-3 self-end md:self-auto">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="md:hidden flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-350 font-semibold"
          >
            <HiFunnel className="w-5 h-5" />
            <span>Filters</span>
          </button>
          
          <select
            value={sort}
            onChange={handleSortChange}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-4 focus:ring-primary-500/20 font-semibold transition-all"
          >
            <option value="">Default Sorting</option>
            <option value="latest">Latest Arrivals</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="bestselling">Best Sellers</option>
          </select>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Filters (Desktop) */}
        <div className="hidden md:block md:col-span-1">
          <ProductFilters filters={filters} onFilterChange={handleFilterChange} />
        </div>

        {/* Mobile Filters Drawer */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <div className="relative w-80 max-w-sm bg-white dark:bg-slate-900 h-full p-6 overflow-y-auto animate-slide-in-left shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Filters</h3>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="text-sm font-semibold text-slate-500 hover:text-slate-700"
                >
                  Close
                </button>
              </div>
              <ProductFilters filters={filters} onFilterChange={handleFilterChange} />
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div className="md:col-span-3 space-y-8">
          <ProductGrid products={products} loading={loading} />

          {/* Pagination */}
          {!loading && pages > 1 && (
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-center">
              <Pagination
                page={page}
                pages={pages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
