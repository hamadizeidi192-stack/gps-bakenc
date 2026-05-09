import React from 'react';
import { Menu, Settings, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

export const Navbar = ({ onMenuToggle }) => {
  return (
    <motion.nav
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-0 right-0 h-16 z-40"
      style={{
        background: 'rgba(8,12,20,0.8)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <div className="h-full max-w-screen-2xl mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-lg transition-smooth hover:bg-white/5 text-white/50 hover:text-white lg:hidden"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-2.5">
            {/* Logo */}
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
            >
              📡
            </div>
            <div>
              <p className="text-sm font-700 text-white leading-tight tracking-tight">Smart Tracker</p>
              <p className="text-[10px] font-medium" style={{ color: 'rgba(167,139,250,0.7)' }}>GPS Dashboard</p>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-1">
          <button className="p-2 rounded-lg transition-smooth hover:bg-white/5 text-white/40 hover:text-white/70">
            <Bell size={18} />
          </button>
          <button className="p-2 rounded-lg transition-smooth hover:bg-white/5 text-white/40 hover:text-white/70">
            <Settings size={18} />
          </button>
          {/* Avatar placeholder */}
          <div
            className="w-8 h-8 rounded-full ml-2 flex items-center justify-center text-xs font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
          >
            U
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
