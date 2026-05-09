import React from 'react';
import { LayoutDashboard, Map, Radio, BarChart2, Settings, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const items = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: Map,             label: 'Live Map',   active: false },
  { icon: Radio,           label: 'Signals',    active: false },
  { icon: BarChart2,       label: 'Analytics',  active: false },
  { icon: Settings,        label: 'Settings',   active: false },
];

const SidebarContent = ({ onClose, isOnline }) => (
  <div className="flex flex-col h-full py-5 px-3">
    <button onClick={onClose} className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-white/5 text-white/30 lg:hidden transition-smooth">
      <X size={16} />
    </button>

    {/* Nav */}
    <nav className="space-y-0.5 mt-2">
      {items.map(item => (
        <a
          key={item.label}
          href="#"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-smooth"
          style={{
            background: item.active ? 'rgba(249,115,22,0.1)' : 'transparent',
            color: item.active ? '#f97316' : 'rgba(255,255,255,0.45)',
            borderLeft: item.active ? '2px solid #f97316' : '2px solid transparent',
          }}
          onMouseEnter={e => { if (!item.active) { e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}}
          onMouseLeave={e => { if (!item.active) { e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; e.currentTarget.style.background = 'transparent'; }}}
        >
          <item.icon size={16} />
          {item.label}
        </a>
      ))}
    </nav>

    <div className="flex-1" />

    {/* Device status */}
    <div
      className="rounded-xl p-4"
      style={{
        background: isOnline ? 'rgba(34,197,94,0.06)' : 'rgba(239,68,68,0.06)',
        border: `1px solid ${isOnline ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)'}`,
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className={`status-dot ${isOnline ? 'online' : 'offline'}`} />
        <span className="text-xs font-semibold" style={{ color: isOnline ? '#22c55e' : '#ef4444' }}>
          {isOnline ? 'Device Online' : 'Device Offline'}
        </span>
      </div>
      <p className="text-[11px] text-white/30">{isOnline ? 'Streaming GPS data' : 'Waiting for reconnect…'}</p>
    </div>
  </div>
);

export const Sidebar = ({ isOpen, onClose, isOnline }) => (
  <>
    <AnimatePresence>
      {isOpen && (
        <motion.div key="ov" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose} className="fixed inset-0 z-30 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
        />
      )}
    </AnimatePresence>

    {/* Desktop */}
    <aside className="fixed left-0 top-14 hidden lg:block w-52 h-[calc(100vh-56px)] z-40"
      style={{ background: '#0d0d0d', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
      <SidebarContent onClose={onClose} isOnline={isOnline} />
    </aside>

    {/* Mobile */}
    <AnimatePresence>
      {isOpen && (
        <motion.aside key="mob" initial={{ x: -220 }} animate={{ x: 0 }} exit={{ x: -220 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="fixed left-0 top-14 w-52 h-[calc(100vh-56px)] z-40 lg:hidden"
          style={{ background: '#0d0d0d', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
          <SidebarContent onClose={onClose} isOnline={isOnline} />
        </motion.aside>
      )}
    </AnimatePresence>
  </>
);

export default Sidebar;
