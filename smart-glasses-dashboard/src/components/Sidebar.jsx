import React from 'react';
import { LayoutDashboard, Map, Radio, BarChart2, Settings, X, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const items = [
  { icon: LayoutDashboard, label: 'Overview',   active: true },
  { icon: Map,             label: 'Live Track',  active: false },
  { icon: Radio,           label: 'Signals',    active: false },
  { icon: BarChart2,       label: 'History',    active: false },
  { icon: Settings,        label: 'Settings',   active: false },
];

const SidebarContent = ({ onClose, isOnline }) => (
  <div className="flex flex-col h-full py-8 px-4">
    <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-xl hover:bg-slate-100 text-slate-400 lg:hidden transition-smooth">
      <X size={18} />
    </button>

    <div className="mb-8 px-2">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">Main Menu</p>
      <nav className="space-y-1.5">
        {items.map(item => (
          <a
            key={item.label}
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 group"
            style={{
              background: item.active ? '#eff6ff' : 'transparent',
              color: item.active ? '#2563eb' : '#64748b',
              boxShadow: item.active ? '0 4px 12px -2px rgba(59, 130, 246, 0.12)' : 'none',
            }}
          >
            <item.icon size={18} className={item.active ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'} />
            {item.label}
          </a>
        ))}
      </nav>
    </div>

    <div className="flex-1" />

    {/* Device card */}
    <div className="rounded-3xl p-5 bg-slate-50 border border-slate-100">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isOnline ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
          <ShieldCheck size={20} />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-900 leading-none mb-1">Device Status</p>
          <div className="flex items-center gap-1.5">
            <span className={`status-dot ${isOnline ? 'online' : 'offline'}`} />
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: isOnline ? '#10b981' : '#f43f5e' }}>
              {isOnline ? 'Encrypted' : 'Offline'}
            </span>
          </div>
        </div>
      </div>
      <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
        {isOnline ? 'Secure connection established. Data stream verified.' : 'Connection lost. Retrying synchronization…'}
      </p>
    </div>

    <p className="text-center text-[10px] text-slate-300 font-bold mt-6 tracking-widest">VERSION 3.0.4</p>
  </div>
);

export const Sidebar = ({ isOpen, onClose, isOnline }) => (
  <>
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose} className="fixed inset-0 z-30 lg:hidden bg-slate-900/20 backdrop-blur-sm"
        />
      )}
    </AnimatePresence>

    <aside className="fixed left-0 top-16 hidden lg:block w-64 h-[calc(100vh-64px)] z-40 bg-white border-r border-slate-200">
      <SidebarContent onClose={onClose} isOnline={isOnline} />
    </aside>

    <AnimatePresence>
      {isOpen && (
        <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed left-0 top-0 bottom-0 w-72 z-50 lg:hidden bg-white shadow-2xl">
          <SidebarContent onClose={onClose} isOnline={isOnline} />
        </motion.aside>
      )}
    </AnimatePresence>
  </>
);

export default Sidebar;
