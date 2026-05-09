import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Zap, Wifi, Clock, Signal, TrendingUp } from 'lucide-react';

const theme = {
  success: { iconBg: 'rgba(34,197,94,0.1)',   iconColor: '#22c55e', pill: 'pill-green',  pillTxt: 'Active'  },
  warning: { iconBg: 'rgba(249,115,22,0.12)',  iconColor: '#f97316', pill: 'pill-orange', pillTxt: 'Warning' },
  error:   { iconBg: 'rgba(239,68,68,0.1)',    iconColor: '#ef4444', pill: 'pill-red',    pillTxt: 'No Data' },
  normal:  { iconBg: 'rgba(255,255,255,0.06)', iconColor: 'rgba(255,255,255,0.5)', pill: 'pill-gray', pillTxt: '—' },
};

export const StatCard = ({ icon: Icon, label, value, unit = '', status = 'normal', loading = false, index = 0 }) => {
  const t = theme[status] || theme.normal;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="card p-5"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: t.iconBg }}>
          <Icon size={16} style={{ color: t.iconColor }} />
        </div>
        {!loading && <span className={`pill ${t.pill}`}>{t.pillTxt}</span>}
      </div>
      <p className="text-xs font-medium text-white/40 mb-1">{label}</p>
      {loading ? (
        <div className="flex items-center gap-2 h-8">
          <div className="spinner" />
          <span className="text-sm text-white/25">Loading…</span>
        </div>
      ) : (
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-bold text-white">{value ?? '—'}</span>
          {unit && <span className="text-sm text-white/35 font-medium">{unit}</span>}
        </div>
      )}
    </motion.div>
  );
};

export const StatusCardsGrid = ({ data, loading }) => {
  const getStatus = (field, value) => {
    if (loading || value === null || value === 'N/A' || value === undefined) return 'error';
    if (field === 'Battery' && value < 20) return 'warning';
    if (field === 'WiFi' && value === 'Disconnected') return 'error';
    return 'success';
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-5">
      {[
        { icon: MapPin,  label: 'Latitude',  value: data.latitude,  field: 'Latitude',  index: 0 },
        { icon: MapPin,  label: 'Longitude', value: data.longitude, field: 'Longitude', index: 1 },
        { icon: Zap,     label: 'Battery',   value: data.battery,   unit: '%', field: 'Battery', index: 2 },
        { icon: Wifi,    label: 'Network',   value: data.wifi,      field: 'WiFi',      index: 3 },
        { icon: Clock,   label: 'Last Sync', value: data.lastUpdate,field: 'Time',      index: 4 },
        { icon: Signal,  label: 'Status',    value: data.isOnline ? 'Online' : 'Offline', field: 'Status', index: 5 },
      ].map(c => (
        <StatCard key={c.label} {...c} loading={loading}
          status={c.field === 'Status' ? (data.isOnline ? 'success' : 'error') : getStatus(c.field, c.value)}
        />
      ))}
    </div>
  );
};

export default StatCard;
