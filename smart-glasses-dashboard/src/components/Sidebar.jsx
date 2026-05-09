import React from 'react';
import { MapPin, Radio, BarChart3, Settings, Home, X } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Sidebar Navigation Component
 * Provides navigation links and device status
 */
export const Sidebar = ({ isOpen, onClose, isOnline }) => {
  const menuItems = [
    { icon: Home, label: 'Dashboard', href: '#' },
    { icon: MapPin, label: 'Live Map', href: '#' },
    { icon: Radio, label: 'Connections', href: '#' },
    { icon: BarChart3, label: 'Analytics', href: '#' },
    { icon: Settings, label: 'Settings', href: '#' },
  ];

  const sidebarVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.3 },
    },
    closed: {
      x: -280,
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm lg:hidden z-30"
        />
      )}

      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        initial="closed"
        animate={isOpen ? 'open' : 'closed'}
        className="fixed left-0 top-16 h-[calc(100vh-64px)] w-64 bg-white/80 border-r border-slate-200 backdrop-blur-xl lg:translate-x-0 z-40 overflow-y-auto"
      >
        <div className="p-6 flex flex-col h-full">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-lg lg:hidden text-slate-500"
          >
            <X size={20} />
          </button>

          {/* Navigation menu */}
          <nav className="flex-1 mt-4">
            <ul className="space-y-1.5">
              {menuItems.map((item, index) => (
                <motion.li
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <a
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-smooth group font-medium"
                  >
                    <item.icon
                      size={20}
                      className="text-slate-400 group-hover:text-indigo-500 transition-smooth"
                    />
                    <span>{item.label}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </nav>

          {/* Device status */}
          <div className="border-t border-slate-200 pt-6 mt-6">
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse-slow' : 'bg-rose-500'}`} />
                <span className="text-sm font-bold text-slate-800">
                  {isOnline ? 'Connected' : 'Offline'}
                </span>
              </div>
              <p className="text-xs font-medium text-slate-500">
                {isOnline ? 'Device is online and transmitting' : 'Lost connection to device'}
              </p>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
