import React from 'react';
import { Menu, Settings, Bell, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export const Navbar = ({ onMenuToggle }) => (
  <motion.nav
    initial={{ y: -72, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5, ease: 'easeOut' }}
    className="fixed top-0 left-0 right-0 h-16 z-40"
    style={{ background: 'rgba(255, 255, 255, 0.7)', borderBottom: '1px solid #e2e8f0', backdropFilter: 'blur(20px)' }}
  >
    <div className="h-full max-w-screen-2xl mx-auto px-4 md:px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button onClick={onMenuToggle} className="p-2 rounded-xl transition-smooth hover:bg-slate-100 text-slate-500 lg:hidden">
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
            <motion.div animate={{ rotate: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 4 }}>📡</motion.div>
          </div>
          <div>
            <span className="text-base font-bold text-slate-900 tracking-tight block leading-none">SmartGlasses</span>
            <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider">Live Monitor</span>
          </div>
        </div>
      </div>

      <div className="hidden md:flex items-center bg-slate-100/80 px-3 py-1.5 rounded-xl border border-slate-200/50 w-64">
        <Search size={14} className="text-slate-400" />
        <input type="text" placeholder="Search devices..." className="bg-transparent border-none focus:ring-0 text-xs text-slate-600 w-full ml-2" />
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2 rounded-xl transition-smooth hover:bg-slate-100 text-slate-400 hover:text-slate-600">
          <Bell size={18} />
        </button>
        <button className="p-2 rounded-xl transition-smooth hover:bg-slate-100 text-slate-400 hover:text-slate-600">
          <Settings size={18} />
        </button>
        <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center ml-2 border-2 border-white shadow-sm overflow-hidden">
          <img src="https://ui-avatars.com/api/?name=User&background=3b82f6&color=fff" alt="Avatar" />
        </div>
      </div>
    </div>
  </motion.nav>
);

export default Navbar;
