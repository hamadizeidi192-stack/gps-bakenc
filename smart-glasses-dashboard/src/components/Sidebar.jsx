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
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
        />
      )}

      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        initial="closed"
        animate={isOpen ? 'open' : 'closed'}
        className="fixed left-0 top-16 h-[calc(100vh-64px)] w-64 bg-dark-900 border-r border-dark-700 glass-effect-lighter lg:translate-x-0 z-40 overflow-y-auto"
      >
        <div className="p-6 flex flex-col h-full">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-dark-800 rounded-lg lg:hidden text-gray-400"
          >
            <X size={20} />
          </button>

          {/* Navigation menu */}
          <nav className="flex-1 mt-8">
            <ul className="space-y-2">
              {menuItems.map((item, index) => (
                <motion.li
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <a
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-dark-800 hover:text-blue-400 transition-smooth group"
                  >
                    <item.icon
                      size={20}
                      className="text-gray-400 group-hover:text-blue-400 transition-smooth"
                    />
                    <span className="font-medium">{item.label}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </nav>

          {/* Device status */}
          <div className="border-t border-dark-700 pt-4 mt-4">
            <div className="glass-effect p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500 animate-pulse-slow' : 'bg-red-500'}`} />
                <span className="text-sm font-medium text-gray-300">
                  {isOnline ? 'Connected' : 'Offline'}
                </span>
              </div>
              <p className="text-xs text-gray-400">
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
