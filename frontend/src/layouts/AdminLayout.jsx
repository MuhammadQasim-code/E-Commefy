import React, { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getProfile } from '../features/auth/authSlice';
import Sidebar from '../components/admin/Sidebar';
import Loader from '../components/common/Loader';
import Toast from '../components/common/Toast';
import { HiMenuAlt1 } from 'react-icons/hi';

const AdminLayout = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);


  // Loading state
  if (loading && !user) {
    return <Loader />;
  }

  // Auth protection: user must be authenticated AND role must be admin
  if (!isAuthenticated || (user && user.role !== 'admin')) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex">
      {/* Toast Notification Container */}
      <Toast />

      {/* Sidebar for Desktop */}
      <div className="hidden md:block">
        <Sidebar isCollapsed={isCollapsed} />
      </div>

      {/* Sidebar Drawer for Mobile */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer content */}
          <div className="relative animate-slide-in-left">
            <Sidebar isCollapsed={false} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top bar */}
        <header className="h-20 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 flex items-center justify-between px-6 sticky top-0 z-30 backdrop-blur-md">
          <div className="flex items-center space-x-4">
            {/* Collapse toggle (desktop) */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden md:block p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <HiMenuAlt1 className="w-6 h-6" />
            </button>
            {/* Drawer toggle (mobile) */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <HiMenuAlt1 className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Admin Panel
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 capitalize">
              Welcome, {user?.name || 'Admin'}
            </span>
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center font-bold text-white uppercase shadow-md shadow-primary-500/20">
              {user?.name?.substring(0, 2) || 'AD'}
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
