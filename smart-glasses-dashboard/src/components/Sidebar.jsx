import React from 'react';
import { MapPin, Radio, BarChart3, Settings, Home, X } from 'lucide-react';
import { motion } from 'framer-motion';

export const Sidebar = ({ isOpen, onClose, isOnline }) => {
  const menuItems = [
    { icon: Home, label: 'DASHBOARD', code: '01' },
    { icon: MapPin, label: 'LIVE MAP', code: '02' },
    { icon: Radio, label: 'CONNECTIONS', code: '03' },
    { icon: BarChart3, label: 'ANALYTICS', code: '04' },
    { icon: Settings, label: 'SETTINGS', code: '05' },
  ];

  const sidebarVariants = {
    open: { x: 0, opacity: 1, transition: { duration: 0.3 } },
    closed: { x: -280, opacity: 0, transition: { duration: 0.3 } },
  };

  return (
    <>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 lg:hidden z-30"
          style={{ background: 'rgba(5, 10, 15, 0.7)', backdropFilter: 'blur(4px)' }}
        />
      )}

      <motion.aside
        variants={sidebarVariants}
        initial="closed"
        animate={isOpen ? 'open' : 'closed'}
        className="fixed left-0 top-16 h-[calc(100vh-64px)] w-64 lg:translate-x-0 z-40 overflow-y-auto"
        style={{
          background: 'rgba(5, 10, 15, 0.95)',
          borderRight: '1px solid rgba(0, 240, 255, 0.2)',
          backdropFilter: 'blur(16px)',
        }}
      >
        {/* Right border glow line */}
        <div className="absolute top-0 right-0 bottom-0 w-px opacity-40"
          style={{ background: 'linear-gradient(to bottom, transparent, #00f0ff, transparent)' }}
        />

        <div className="p-6 flex flex-col h-full">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 lg:hidden transition-smooth opacity-60 hover:opacity-100"
            style={{ color: '#00f0ff' }}
          >
            <X size={18} />
          </button>

          {/* System Header */}
          <div className="mb-8 mt-2">
            <p className="text-xs tracking-widest opacity-40 mb-1" style={{ color: '#00f0ff' }}>
              &gt; NAVIGATION_MATRIX
            </p>
            <div className="h-px w-full opacity-30" style={{ background: '#00f0ff' }} />
          </div>

          {/* Navigation */}
          <nav className="flex-1">
            <ul className="space-y-1">
              {menuItems.map((item, index) => (
                <motion.li
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.06 }}
                >
                  <a
                    href="#"
                    className="flex items-center gap-3 px-3 py-3 group transition-smooth relative"
                    style={{ color: 'rgba(0, 240, 255, 0.6)' }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = '#00f0ff';
                      e.currentTarget.style.background = 'rgba(0, 240, 255, 0.05)';
                      e.currentTarget.style.borderLeft = '2px solid #00f0ff';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = 'rgba(0, 240, 255, 0.6)';
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.borderLeft = '2px solid transparent';
                    }}
                  >
                    <span className="text-xs opacity-50 font-mono w-5">[{item.code}]</span>
                    <item.icon size={14} />
                    <span className="text-xs tracking-widest font-bold">{item.label}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </nav>

          {/* Device Status Panel */}
          <div className="mt-8">
            <p className="text-xs tracking-widest opacity-40 mb-3" style={{ color: '#00f0ff' }}>
              &gt; DEVICE_STATUS
            </p>
            <div
              className="p-4 relative"
              style={{
                background: isOnline ? 'rgba(0, 255, 65, 0.04)' : 'rgba(255, 0, 60, 0.04)',
                border: `1px solid ${isOnline ? 'rgba(0, 255, 65, 0.3)' : 'rgba(255, 0, 60, 0.3)'}`,
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-2.5 h-2.5 rounded-full hud-pulse"
                  style={{
                    backgroundColor: isOnline ? '#00ff41' : '#ff003c',
                    color: isOnline ? '#00ff41' : '#ff003c',
                    boxShadow: `0 0 8px ${isOnline ? '#00ff41' : '#ff003c'}`,
                  }}
                />
                <span
                  className="text-xs tracking-widest font-bold"
                  style={{ color: isOnline ? '#00ff41' : '#ff003c', textShadow: `0 0 8px ${isOnline ? '#00ff41' : '#ff003c'}` }}
                >
                  {isOnline ? 'ONLINE' : 'OFFLINE'}
                </span>
              </div>
              <p className="text-xs opacity-50 tracking-wide" style={{ color: '#00f0ff' }}>
                {isOnline ? '// Transmitting data stream' : '// Signal lost. Reconnecting...'}
              </p>
            </div>

            {/* System Info */}
            <div className="mt-4 space-y-1">
              {['KERNEL: v3.14.1', 'UPTIME: 99.9%', 'ENC: AES-256'].map(line => (
                <p key={line} className="text-xs opacity-25 tracking-widest font-mono" style={{ color: '#00f0ff' }}>
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
