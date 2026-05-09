import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Zap, Wifi, Clock, Signal, AlertTriangle } from 'lucide-react';

const cardTheme = {
  success: {
    icon: 'rgba(52,211,153,0.15)',
    iconColor: '#34d399',
    value: '#e2e8f0',
    pill: 'pill-green',
    pillLabel: 'Good',
    border: 'rgba(52,211,153,0.12)',
  },
  warning: {
    icon: 'rgba(251,146,60,0.15)',
    iconColor: '#fb923c',
    value: '#e2e8f0',
    pill: 'pill-orange',
    pillLabel: 'Warning',
    border: 'rgba(251,146,60,0.15)',
  },
  error: {
    icon: 'rgba(248,113,113,0.15)',
    iconColor: '#f87171',
    value: 'rgba(255,255,255,0.4)',
    pill: 'pill-red',
    pillLabel: 'No Data',
    border: 'rgba(248,113,113,0.12)',
  },
  normal: {
    icon: 'rgba(167,139,250,0.12)',
    iconColor: '#a78bfa',
    value: '#e2e8f0',
    pill: 'pill-purple',
    pillLabel: 'Active',
    border: 'rgba(255,255,255,0.07)',
  },
};

export const StatCard = ({ icon: Icon, label, value, unit = '', status = 'normal', loading = false, index = 0 }) => {
  const t = cardTheme[status] || cardTheme.normal;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="card p-5 flex flex-col gap-4"
      style={{ borderColor: t.border }}
    >
      {/* Top row */}
      <div className="flex items-center justify-between">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: t.icon }}
        >
          <Icon size={18} style={{ color: t.iconColor }} />
        </div>
        {!loading && (
          <span className={`pill ${t.pill} text-[10px]`}>{t.pillLabel}</span>
        )}
      </div>

      {/* Value */}
      <div>
        <p className="text-xs font-medium text-white/40 mb-1 tracking-wide">{label}</p>
        {loading ? (
          <div className="flex items-center gap-2 h-8">
            <div className="spinner" />
            <span className="text-sm text-white/30">Loading…</span>
          </div>
        ) : (
          <div className="flex items-baseline gap-1">
            <span
              className="text-2xl font-bold tracking-tight"
              style={{ color: t.value }}
            >
              {value ?? '—'}
            </span>
            {unit && <span className="text-sm font-medium text-white/40">{unit}</span>}
          </div>
        )}
      </div>

      {/* Status bar */}
      {status === 'warning' && !loading && (
        <div className="flex items-center gap-1.5 text-xs" style={{ color: '#fb923c' }}>
          <AlertTriangle size={11} />
          <span>Low battery — charge soon</span>
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

  const cards = [
    { icon: MapPin,  label: 'Latitude',   value: data.latitude,   field: 'Latitude',  index: 0 },
    { icon: MapPin,  label: 'Longitude',  value: data.longitude,  field: 'Longitude', index: 1 },
    { icon: Zap,     label: 'Battery',    value: data.battery,    unit: '%', field: 'Battery', index: 2 },
    { icon: Wifi,    label: 'Network',    value: data.wifi,       field: 'WiFi',      index: 3 },
    { icon: Clock,   label: 'Last Sync',  value: data.lastUpdate, field: 'Time',      index: 4 },
    { icon: Signal,  label: 'Status',     value: data.isOnline ? 'Online' : 'Offline', field: 'Status', index: 5 },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-5">
      {cards.map(c => (
        <StatCard
          key={c.label}
          icon={c.icon}
          label={c.label}
          value={c.value}
          unit={c.unit}
          loading={loading}
          index={c.index}
          status={c.field === 'Status'
            ? (data.isOnline ? 'success' : 'error')
            : getStatus(c.field, c.value)
          }
        />
      ))}
    </div>
  );
};

export default StatCard;
