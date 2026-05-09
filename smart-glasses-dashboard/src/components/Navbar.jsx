import React from 'react';
import { Menu, Settings, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

export const Navbar = ({ onMenuToggle }) => (
  <motion.nav
    initial={{ y: -64, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.4 }}
    className="fixed top-0 left-0 right-0 h-14 z-40"
    style={{ background: 'rgba(10,10,10,0.9)', borderBottom: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(16px)' }}
  >
    <div className="h-full max-w-screen-2xl mx-auto px-4 md:px-6 flex items-center justify-between">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button onClick={onMenuToggle} className="p-1.5 rounded-lg transition-smooth hover:bg-white/5 text-white/40 hover:text-white lg:hidden">
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold text-white" style={{ background: '#f97316' }}>
            G
          </div>
          <span className="text-sm font-bold text-white tracking-tight">GPS Tracker</span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1">
        <button className="p-2 rounded-lg transition-smooth hover:bg-white/5 text-white/30 hover:text-white/60">
          <Bell size={16} />
        </button>
        <button className="p-2 rounded-lg transition-smooth hover:bg-white/5 text-white/30 hover:text-white/60">
          <Settings size={16} />
        </button>
      </div>
    </div>
  </motion.nav>
);

export default Navbar;
