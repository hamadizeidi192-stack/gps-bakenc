import React from 'react';
import { Menu, Home, Settings, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Top Navigation Bar Component
 * Displays app title and menu toggle
 */
export const Navbar = ({ onMenuToggle, isSidebarOpen }) => {
  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 h-16 bg-white/70 border-b border-slate-200 backdrop-blur-xl z-40"
    >
      <div className="h-full px-4 md:px-6 flex items-center justify-between">
        {/* Left side - Menu toggle and title */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="p-2 hover:bg-slate-100 rounded-lg transition-smooth lg:hidden text-slate-600"
            aria-label="Toggle sidebar"
          >
            <Menu size={24} className="text-indigo-600" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-200">
              <span className="text-white font-bold text-lg">📡</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 hidden sm:block tracking-tight">
                Smart Tracker
              </h1>
              <p className="text-xs font-medium text-indigo-500 hidden sm:block">
                Live GPS Dashboard
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Additional nav items */}
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-slate-100 rounded-full transition-smooth text-slate-400 hover:text-indigo-600">
            <HelpCircle size={20} />
          </button>
          <button className="p-2 hover:bg-slate-100 rounded-full transition-smooth text-slate-400 hover:text-indigo-600">
            <Settings size={20} />
          </button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
