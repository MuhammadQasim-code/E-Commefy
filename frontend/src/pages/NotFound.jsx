import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="text-center py-20 px-4 space-y-6 max-w-md mx-auto animate-scale-in">
      <h1 className="text-9xl font-black bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent tracking-widest select-none">
        404
      </h1>
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">
          Page Not Found
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed">
          Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
      </div>
      <Link
        to="/"
        className="inline-block px-8 py-3.5 bg-primary-600 text-white font-bold rounded-xl gradient-primary hover:opacity-90 transition-opacity"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
