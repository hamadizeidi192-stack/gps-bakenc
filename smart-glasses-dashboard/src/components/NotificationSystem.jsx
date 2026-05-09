import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const NotificationContext = React.createContext();

const icons = { error: AlertCircle, success: CheckCircle, info: Info };
const styles = {
  error:   { iconColor: '#f87171', border: 'rgba(248,113,113,0.2)', left: '#f87171' },
  success: { iconColor: '#34d399', border: 'rgba(52,211,153,0.2)',  left: '#34d399' },
  info:    { iconColor: '#a78bfa', border: 'rgba(167,139,250,0.2)', left: '#a78bfa' },
};

const NotificationItem = ({ id, message, type = 'info', onClose }) => {
  useEffect(() => {
    const t = setTimeout(() => onClose(id), 5000);
    return () => clearTimeout(t);
  }, [id, onClose]);

  const cfg = styles[type] || styles.info;
  const Icon = icons[type] || icons.info;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, scale: 0.95 }}
      animate={{ opacity: 1, x: 0,  scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.95 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="notification"
      style={{
        borderColor: cfg.border,
        borderLeft: `3px solid ${cfg.left}`,
        minWidth: 280,
      }}
    >
      <Icon size={16} style={{ color: cfg.iconColor, flexShrink: 0 }} />
      <p className="flex-1 text-sm text-white/80 font-medium">{message}</p>
      <button
        onClick={() => onClose(id)}
        className="p-1 rounded-lg hover:bg-white/5 text-white/30 hover:text-white/60 transition-smooth flex-shrink-0"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
};

export const NotificationContainer = ({ notifications, onClose }) => (
  <div className="fixed bottom-10 right-4 z-50 flex flex-col gap-2 pointer-events-none">
    <AnimatePresence mode="popLayout">
      {notifications.map(n => (
        <div key={n.id} className="pointer-events-auto">
          <NotificationItem {...n} onClose={onClose} />
        </div>
      ))}
    </AnimatePresence>
  </div>
);

export const useNotification = (notifications, addNotification) => ({
  error:   msg => addNotification(msg, 'error'),
  success: msg => addNotification(msg, 'success'),
  info:    msg => addNotification(msg, 'info'),
});

export default NotificationContainer;
