import React from 'react';
import { Menu, Settings, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const Navbar = ({ onMenuToggle, isSidebarOpen }) => {
  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 h-16 z-40"
      style={{
        background: 'rgba(5, 10, 15, 0.92)',
        borderBottom: '1px solid rgba(0, 240, 255, 0.25)',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 0 30px rgba(0, 240, 255, 0.06)',
      }}
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60" />

      <div className="h-full px-4 md:px-6 flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="p-2 transition-smooth lg:hidden"
            style={{ color: '#00f0ff' }}
            aria-label="Toggle sidebar"
          >
            <Menu size={22} />
          </button>

          <div className="flex items-center gap-3">
            {/* Logo */}
            <div
              className="w-10 h-10 flex items-center justify-center relative"
              style={{
                border: '1px solid rgba(0, 240, 255, 0.5)',
                background: 'rgba(0, 240, 255, 0.05)',
                boxShadow: '0 0 15px rgba(0, 240, 255, 0.2)',
              }}
            >
              <span className="text-lg">📡</span>
              {/* Corner brackets */}
              <span className="absolute top-0 left-0 w-2 h-2 border-t border-l" style={{ borderColor: '#00f0ff' }} />
              <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r" style={{ borderColor: '#00f0ff' }} />
            </div>

            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="text-xs opacity-50" style={{ color: '#00f0ff' }}>SYS://</span>
                <h1
                  className="text-lg font-bold tracking-widest uppercase"
                  style={{
                    fontFamily: '"Orbitron", monospace',
                    color: '#00f0ff',
                    textShadow: '0 0 10px rgba(0, 240, 255, 0.6)',
                  }}
                >
                  SMART TRACKER
                </h1>
              </div>
              <p className="text-xs tracking-widest opacity-60" style={{ color: '#00f0ff' }}>
                GPS TRACKING SYSTEM v2.1.0
              </p>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Live indicator */}
          <div className="hidden sm:flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full hud-pulse"
              style={{ backgroundColor: '#00ff41', color: '#00ff41', boxShadow: '0 0 6px #00ff41' }}
            />
            <span className="text-xs tracking-widest" style={{ color: '#00ff41' }}>LIVE</span>
          </div>

          <button
            className="p-2 transition-smooth opacity-60 hover:opacity-100"
            style={{ color: '#00f0ff' }}
          >
            <HelpCircle size={18} />
          </button>
          <button
            className="p-2 transition-smooth opacity-60 hover:opacity-100"
            style={{ color: '#00f0ff' }}
          >
            <Settings size={18} />
          </button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
