import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  HiChartBar,
  HiShoppingBag,
  HiFolder,
  HiClipboardDocumentList,
  HiUsers,
  HiArrowLeft,
} from 'react-icons/hi2';
import Logo from '../common/Logo';

const Sidebar = ({ isCollapsed, toggleCollapse }) => {
  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: HiChartBar },
    { name: 'Products', path: '/admin/products', icon: HiShoppingBag },
    { name: 'Categories', path: '/admin/categories', icon: HiFolder },
    { name: 'Orders', path: '/admin/orders', icon: HiClipboardDocumentList },
    { name: 'Users', path: '/admin/users', icon: HiUsers },
  ];


  return (
    <aside className={`fixed md:sticky top-0 left-0 h-screen z-40 bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800 transition-all duration-300 ${
      isCollapsed ? 'w-20' : 'w-64'
    }`}>
      {/* Sidebar Header */}
      <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800">
        {!isCollapsed && <Logo />}
        {isCollapsed && (
          <span className="text-xl font-black bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
            EC
          </span>
        )}
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-4 px-4 py-3.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                }`
              }
            >
              <Icon className="w-6 h-6 flex-shrink-0" />
              {!isCollapsed && <span className="font-medium">{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-slate-800">
        <NavLink
          to="/"
          className="flex items-center space-x-4 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800/50 hover:text-white transition-all duration-200"
        >
          <HiArrowLeft className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="font-medium">Exit Admin</span>}
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
