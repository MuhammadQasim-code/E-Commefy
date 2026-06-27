import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeaturedProducts } from '../features/products/productSlice';
import { fetchCategories } from '../features/categories/categorySlice';
import ProductGrid from '../components/product/ProductGrid';
import Loader from '../components/common/Loader';
import { HiArrowRight, HiShoppingBag, HiTruck, HiShieldCheck, HiArrowPath } from 'react-icons/hi2';

const Home = () => {
  const dispatch = useDispatch();
  const { featuredProducts, loading } = useSelector((state) => state.products);
  const { categories, loading: categoriesLoading } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchFeaturedProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  const features = [
    { name: 'Free Shipping', desc: 'On orders over $100', icon: HiTruck },
    { name: 'Secure Payments', desc: 'SSL encryption security', icon: HiShieldCheck },
    { name: 'Easy Returns', desc: '30-day money-back guarantee', icon: HiArrowPath },
  ];

  return (
    <div className="space-y-16 animate-fade-in">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden gradient-primary py-20 px-8 md:px-16 text-white flex flex-col md:flex-row items-center justify-between shadow-xl shadow-primary-500/20">
        {/* Background glow effects */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-xl space-y-6 text-center md:text-left z-10">
          <span className="bg-white/20 text-white font-bold text-xs uppercase px-4 py-1.5 rounded-full tracking-wider">
            Summer Season Sale
          </span>
          <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight">
            Discover Your <br />
            <span className="text-cyan-200">Ultimate Style</span>
          </h1>
          <p className="text-slate-100 text-base md:text-lg font-medium opacity-90 max-w-lg leading-relaxed">
            Shop the latest trends in tech, fashion, kitchenware, and more. Upgrade your collection with premium quality products today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
            <Link
              to="/products"
              className="w-full sm:w-auto px-8 py-4 bg-white text-primary-600 font-bold rounded-2xl shadow-lg hover:shadow-xl hover:scale-102 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <HiShoppingBag className="w-5 h-5" />
              <span>Shop Now</span>
            </Link>
            <Link
              to="/about"
              className="w-full sm:w-auto px-8 py-4 bg-white/15 text-white font-bold rounded-2xl hover:bg-white/25 border border-white/25 transition-all duration-300 flex items-center justify-center"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Decorative Grid Image */}
        <div className="hidden md:flex relative z-10 w-1/2 justify-center max-w-md">
          <img
            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80"
            alt="Hero Shoe"
            className="w-full max-h-[350px] object-contain drop-shadow-[0_35px_35px_rgba(255,255,255,0.4)] animate-bounce-gentle"
          />
        </div>
      </section>

      {/* Trust Badges */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((f, idx) => {
          const Icon = f.icon;
          return (
            <div key={idx} className="flex items-center space-x-4 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 bg-primary-500/10 text-primary-500 rounded-xl">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200">{f.name}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{f.desc}</p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Categories Grid */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-100">
              Browse by Category
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Find exactly what you're looking for
            </p>
          </div>
        </div>

        {categoriesLoading ? (
          <div className="flex justify-center py-10">
            <Loader.Inline />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.slice(0, 4).map((cat) => (
              <Link
                key={cat._id}
                to={`/products?category=${cat.slug}`}
                className="group relative rounded-2xl overflow-hidden h-40 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10 z-10" />
                <img
                  src={
                    cat.image
                      ? cat.image.startsWith('http')
                        ? cat.image
                        : `http://localhost:5000${cat.image.startsWith('/') ? cat.image : `/${cat.image}`}`
                      : 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&auto=format&fit=crop&q=80'
                  }
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&auto=format&fit=crop&q=80';
                  }}
                />
                <div className="absolute bottom-4 left-4 z-20">
                  <h4 className="text-lg font-bold text-white uppercase tracking-wide">
                    {cat.name}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Featured Products */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-100">
              Featured Products
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Top picks handpicked for you
            </p>
          </div>
          <Link
            to="/products"
            className="flex items-center space-x-2 text-primary-500 dark:text-primary-400 font-bold hover:text-primary-600 transition-colors"
          >
            <span>View All</span>
            <HiArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <ProductGrid products={featuredProducts} loading={loading} />
      </section>

      {/* Newsletter Signup */}
      <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/30 p-8 md:p-12 shadow-sm text-center max-w-3xl mx-auto space-y-6">
        <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-100">
          Subscribe to our Newsletter
        </h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          Be the first to know about new arrivals, sales, exclusive discounts, and company updates.
        </p>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
        >
          <input
            type="email"
            placeholder="Enter your email address"
            className="flex-grow px-5 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-4 focus:ring-primary-500/20 transition-all duration-200"
          />
          <button
            type="submit"
            className="px-8 py-3.5 bg-primary-600 text-white font-bold rounded-xl gradient-primary hover:opacity-90 transition-opacity"
          >
            Subscribe
          </button>
        </form>
      </section>
    </div>
  );
};

export default Home;
