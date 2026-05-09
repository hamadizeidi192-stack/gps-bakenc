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
    const timer = setTimeout(() => onClose(id), 5000);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  const icons = {
    error: AlertCircle,
    success: CheckCircle,
    info: Info,
  };

  const hudColors = {
    error: { borderColor: 'rgba(255, 0, 60, 0.5)', leftBorder: '#ff003c', color: '#ff003c', bg: 'rgba(255, 0, 60, 0.05)', label: 'ERROR' },
    success: { borderColor: 'rgba(0, 255, 65, 0.4)', leftBorder: '#00ff41', color: '#00ff41', bg: 'rgba(0, 255, 65, 0.05)', label: 'SUCCESS' },
    info: { borderColor: 'rgba(0, 240, 255, 0.4)', leftBorder: '#00f0ff', color: '#00f0ff', bg: 'rgba(0, 240, 255, 0.05)', label: 'INFO' },
  };

  const cfg = hudColors[type] || hudColors.info;
  const Icon = icons[type] || icons.info;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 60 }}
      transition={{ duration: 0.35 }}
      className="max-w-sm"
      style={{
        background: 'rgba(5, 10, 15, 0.95)',
        border: `1px solid ${cfg.borderColor}`,
        borderLeft: `3px solid ${cfg.leftBorder}`,
        backdropFilter: 'blur(12px)',
        fontFamily: '"Share Tech Mono", monospace',
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        boxShadow: `0 0 20px ${cfg.bg}`,
      }}
    >
      <Icon size={16} style={{ color: cfg.color, flexShrink: 0, filter: `drop-shadow(0 0 5px ${cfg.color})` }} />
      <div className="flex-1">
        <p className="text-xs tracking-widest mb-0.5" style={{ color: cfg.color, opacity: 0.6 }}>// {cfg.label}</p>
        <p className="text-xs tracking-wide" style={{ color: cfg.color }}>{message}</p>
      </div>
      <button
        onClick={() => onClose(id)}
        className="p-1 transition-smooth opacity-50 hover:opacity-100 flex-shrink-0"
        style={{ color: cfg.color }}
      >
        <X size={14} />
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
