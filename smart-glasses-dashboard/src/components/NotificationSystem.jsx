import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const styles = {
  error:   { icon: AlertCircle, color: 'text-rose-500',  bg: 'bg-rose-50',  border: 'border-rose-100' },
  success: { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  info:    { icon: Info,        color: 'text-blue-500',    bg: 'bg-blue-50',    border: 'border-blue-100' },
};

const NotificationItem = ({ id, message, type = 'info', onClose }) => {
  useEffect(() => {
    const t = setTimeout(() => onClose(id), 5000);
    return () => clearTimeout(t);
  }, [id, onClose]);

  const s = styles[type] || styles.info;
  const Icon = s.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={`flex items-center gap-4 px-5 py-4 rounded-2xl shadow-xl border ${s.bg} ${s.border}`}
      style={{ minWidth: 320 }}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-white shadow-sm`}>
        <Icon size={20} className={s.color} />
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold text-slate-800">{message}</p>
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{type}</p>
      </div>
      <button onClick={() => onClose(id)} className="p-1 rounded-lg hover:bg-black/5 text-slate-400">
        <X size={16} />
      </button>
    </motion.div>
  );
};

export const NotificationContainer = ({ notifications, onClose }) => (
  <div className="fixed bottom-20 right-6 z-50 flex flex-col gap-3 pointer-events-none">
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
