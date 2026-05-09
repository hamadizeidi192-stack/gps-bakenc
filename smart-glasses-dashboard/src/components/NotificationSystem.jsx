import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Notification Context for global notifications
 */
export const NotificationContext = React.createContext();

/**
 * Notification Item Component
 */
const NotificationItem = ({ id, message, type = 'info', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), 4000);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  const icons = {
    error: AlertCircle,
    success: CheckCircle,
    info: Info,
  };

  const colors = {
    error: 'bg-red-500/20 border-red-500/50 text-red-300',
    success: 'bg-green-500/20 border-green-500/50 text-green-300',
    info: 'bg-blue-500/20 border-blue-500/50 text-blue-300',
  };

  const Icon = icons[type] || icons.info;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, x: 100 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, y: -20, x: 100 }}
      transition={{ duration: 0.3 }}
      className={`notification border-2 ${colors[type]} max-w-sm`}
    >
      <div className="flex items-center gap-3 flex-1">
        <Icon size={20} className="flex-shrink-0" />
        <p className="text-sm font-medium">{message}</p>
      </div>
      <button
        onClick={() => onClose(id)}
        className="ml-2 p-1 hover:bg-white/10 rounded transition-smooth flex-shrink-0"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
};

/**
 * Notification Container Component
 * Displays notifications at the top of the screen
 */
export const NotificationContainer = ({ notifications, onClose }) => {
  return (
    <div className="fixed top-24 right-4 z-50 flex flex-col gap-2 max-w-md pointer-events-none">
      <AnimatePresence>
        {notifications.map((notification) => (
          <div key={notification.id} className="pointer-events-auto">
            <NotificationItem
              {...notification}
              onClose={onClose}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

/**
 * Hook to use notifications
 */
export const useNotification = (notifications, addNotification) => {
  return {
    error: (message) => addNotification(message, 'error'),
    success: (message) => addNotification(message, 'success'),
    info: (message) => addNotification(message, 'info'),
  };
};

export default NotificationContainer;
