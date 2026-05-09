import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Zap, Wifi, Clock, Signal, Info } from 'lucide-react';

const styles = {
  success: { bg: 'bg-emerald-50',  icon: 'text-emerald-500', pill: 'pill-green',  label: 'Steady' },
  warning: { bg: 'bg-amber-50',    icon: 'text-amber-500',   pill: 'pill-orange', label: 'Check' },
  error:   { bg: 'bg-rose-50',     icon: 'text-rose-500',    pill: 'pill-red',    label: 'Offline' },
  info:    { bg: 'bg-blue-50',     icon: 'text-blue-500',    pill: 'pill-blue',   label: 'Syncing' },
  normal:  { bg: 'bg-slate-50',    icon: 'text-slate-500',   pill: 'pill-gray',   label: '—' },
};

export const StatCard = ({ icon: Icon, label, value, unit = '', status = 'normal', loading = false, index = 0 }) => {
  const s = styles[status] || styles.normal;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="card p-6"
    >
      <div className="flex items-start justify-between mb-5">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${s.bg}`}>
          <Icon size={22} className={s.icon} />
        </div>
        {!loading && <span className={`pill ${s.pill}`}>{s.label}</span>}
      </div>

      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        {loading ? (
          <div className="flex items-center gap-2 h-9">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-semibold text-slate-300">Updating…</span>
          </div>
        ) : (
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">{value ?? '—'}</span>
            {unit && <span className="text-sm font-bold text-slate-400">{unit}</span>}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export const StatusCardsGrid = ({ data, loading }) => {
  const getStatus = (field, value) => {
    if (loading || value === null || value === 'N/A') return 'info';
    if (field === 'Battery' && value < 25) return 'warning';
    if (field === 'WiFi' && value === 'Disconnected') return 'error';
    return 'success';
  };

  const cards = [
    { icon: MapPin, label: 'Latitude',  value: data.latitude, field: 'Lat' },
    { icon: MapPin, label: 'Longitude', value: data.longitude, field: 'Lng' },
    { icon: Zap,    label: 'Power',     value: data.battery, unit: '%', field: 'Battery' },
    { icon: Wifi,   label: 'Network',   value: data.wifi, field: 'WiFi' },
    { icon: Clock,  label: 'Activity',  value: data.lastUpdate, field: 'Time' },
    { icon: Signal, label: 'Signal',    value: data.isOnline ? 'Active' : 'Lost', field: 'Status' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
      {cards.map((c, i) => (
        <StatCard key={c.label} {...c} loading={loading} index={i}
          status={c.field === 'Status' ? (data.isOnline ? 'success' : 'error') : getStatus(c.field, c.value)}
        />
      ))}
    </div>
  );
};

export default StatCard;
