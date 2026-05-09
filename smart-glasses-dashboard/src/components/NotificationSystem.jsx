import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const cfg = {
  error:   { icon: AlertCircle,  color: '#ef4444', border: 'rgba(239,68,68,0.2)',   left: '#ef4444' },
  success: { icon: CheckCircle,  color: '#22c55e', border: 'rgba(34,197,94,0.2)',   left: '#22c55e' },
  info:    { icon: Info,         color: '#f97316', border: 'rgba(249,115,22,0.2)',  left: '#f97316' },
};

const NotificationItem = ({ id, message, type = 'info', onClose }) => {
  useEffect(() => {
    const t = setTimeout(() => onClose(id), 4500);
    return () => clearTimeout(t);
  }, [id, onClose]);

  const c = cfg[type] || cfg.info;
  const Icon = c.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 40, scale: 0.96 }}
      animate={{ opacity: 1, x: 0,  scale: 1 }}
      exit={{    opacity: 0, x: 40, scale: 0.96 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className="notification"
      style={{ borderColor: c.border, borderLeft: `3px solid ${c.left}` }}
    >
      <Icon size={15} style={{ color: c.color, flexShrink: 0, marginTop: 1 }} />
      <p className="flex-1 text-sm text-white/75 font-medium">{message}</p>
      <button
        onClick={() => onClose(id)}
        className="p-1 rounded transition-smooth text-white/25 hover:text-white/60 flex-shrink-0"
      >
        <X size={13} />
      </button>
    </motion.div>
  );
};

export const NotificationContainer = ({ notifications, onClose }) => (
  <div className="fixed bottom-8 right-4 z-50 flex flex-col gap-2 pointer-events-none">
    <AnimatePresence mode="popLayout">
      {notifications.map(n => (
        <div key={n.id} className="pointer-events-auto">
          <NotificationItem {...n} onClose={onClose} />
        </div>
      ))}
    </AnimatePresence>
  </div>
);

export default NotificationContainer;
