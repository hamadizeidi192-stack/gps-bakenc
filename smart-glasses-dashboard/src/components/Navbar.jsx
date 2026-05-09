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
      className="fixed top-0 left-0 right-0 h-16 bg-dark-900 border-b border-dark-700 glass-effect-lighter z-40"
    >
      <div className="h-full px-4 md:px-6 flex items-center justify-between">
        {/* Left side - Menu toggle and title */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="p-2 hover:bg-dark-800 rounded-lg transition-smooth lg:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu size={24} className="text-blue-400" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">📡</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white hidden sm:block">
                Smart Glasses Tracker
              </h1>
              <p className="text-xs text-gray-400 hidden sm:block">
                GPS Tracking Dashboard
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Additional nav items */}
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-dark-800 rounded-lg transition-smooth text-gray-400 hover:text-blue-400">
            <HelpCircle size={20} />
          </button>
          <button className="p-2 hover:bg-dark-800 rounded-lg transition-smooth text-gray-400 hover:text-blue-400">
            <Settings size={20} />
          </button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
