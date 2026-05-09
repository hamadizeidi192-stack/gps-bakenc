import React from 'react';
import { MapPin, Radio, BarChart3, Settings, Home, X, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Sidebar = ({ isOpen, onClose, isOnline }) => {
  const menuItems = [
    { icon: Home,     label: 'Dashboard',   active: true },
    { icon: MapPin,   label: 'Live Map',    active: false },
    { icon: Radio,    label: 'Connections', active: false },
    { icon: BarChart3,label: 'Analytics',   active: false },
    { icon: Zap,      label: 'Alerts',      active: false },
    { icon: Settings, label: 'Settings',    active: false },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full py-6 px-4">
      {/* Close (mobile) */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/5 text-white/40 hover:text-white lg:hidden transition-smooth"
      >
        <X size={18} />
      </button>

      {/* Section label */}
      <p className="text-[10px] font-600 uppercase tracking-widest text-white/30 px-3 mb-3">
        Navigation
      </p>

      {/* Nav items */}
      <nav className="space-y-1">
        {menuItems.map(item => (
          <a
            key={item.label}
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-smooth group"
            style={{
              background: item.active ? 'rgba(167,139,250,0.1)' : 'transparent',
              color: item.active ? '#a78bfa' : 'rgba(255,255,255,0.5)',
              border: item.active ? '1px solid rgba(167,139,250,0.2)' : '1px solid transparent',
            }}
            onMouseEnter={e => {
              if (!item.active) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
              }
            }}
            onMouseLeave={e => {
              if (!item.active) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
              }
            }}
          >
            <item.icon size={16} style={{ opacity: item.active ? 1 : 0.6 }} />
            {item.label}
          </a>
        ))}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Device status card */}
      <div
        className="rounded-xl p-4"
        style={{
          background: isOnline ? 'rgba(52,211,153,0.06)' : 'rgba(248,113,113,0.06)',
          border: `1px solid ${isOnline ? 'rgba(52,211,153,0.15)' : 'rgba(248,113,113,0.15)'}`,
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className={`status-dot ${isOnline ? 'online' : 'offline'}`} />
          <span className="text-sm font-semibold" style={{ color: isOnline ? '#34d399' : '#f87171' }}>
            {isOnline ? 'Device Online' : 'Device Offline'}
          </span>
        </div>
        <p className="text-xs text-white/40">
          {isOnline ? 'Streaming location data' : 'Waiting for connection…'}
        </p>
      </div>

      {/* Version */}
      <p className="text-center text-[10px] text-white/20 mt-4">v2.1.0</p>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-30 lg:hidden"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          />
        )}
      </AnimatePresence>

      {/* Desktop sidebar — always visible */}
      <aside
        className="fixed left-0 top-16 hidden lg:flex flex-col w-56 h-[calc(100vh-64px)] z-40"
        style={{
          background: 'rgba(8,12,20,0.8)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {sidebarContent}
      </aside>

      {/* Mobile sidebar — drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            key="drawer"
            initial={{ x: -240 }}
            animate={{ x: 0 }}
            exit={{ x: -240 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed left-0 top-16 w-56 h-[calc(100vh-64px)] z-40 lg:hidden"
            style={{
              background: 'rgba(8,12,20,0.97)',
              borderRight: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
