import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Wifi, Clock, AlertCircle, MapPin, Signal } from 'lucide-react';

const statusConfig = {
  normal: { borderColor: 'rgba(0, 240, 255, 0.3)', glowColor: '#00f0ff', textColor: '#00f0ff', cardClass: '' },
  warning: { borderColor: 'rgba(255, 154, 0, 0.4)', glowColor: '#ff9a00', textColor: '#ff9a00', cardClass: 'warning' },
  error: { borderColor: 'rgba(255, 0, 60, 0.4)', glowColor: '#ff003c', textColor: '#ff003c', cardClass: 'error' },
  success: { borderColor: 'rgba(0, 255, 65, 0.35)', glowColor: '#00ff41', textColor: '#00ff41', cardClass: 'success' },
};

export const StatusCard = ({ icon: Icon, label, value, unit = '', status = 'normal', loading = false, code = '00' }) => {
  const cfg = statusConfig[status] || statusConfig.normal;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`hud-card ${cfg.cardClass} p-5`}
    >
      {/* Top row: icon + code */}
      <div className="flex items-center justify-between mb-4">
        <div
          className="w-10 h-10 flex items-center justify-center relative"
          style={{ border: `1px solid ${cfg.borderColor}`, background: `${cfg.glowColor}08` }}
        >
          <Icon size={18} style={{ color: cfg.glowColor, filter: `drop-shadow(0 0 5px ${cfg.glowColor})` }} />
          {/* Corner brackets */}
          <span className="absolute top-0 left-0 w-2 h-2 border-t border-l" style={{ borderColor: cfg.glowColor, opacity: 0.7 }} />
          <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r" style={{ borderColor: cfg.glowColor, opacity: 0.7 }} />
        </div>
        <span className="text-xs font-mono opacity-30" style={{ color: cfg.glowColor }}>
          [{code}]
        </span>
      </div>

      {/* Label */}
      <p className="text-xs tracking-widest uppercase mb-2 opacity-60" style={{ color: cfg.glowColor }}>
        {label}
      </p>

      {/* Value */}
      {loading ? (
        <div className="flex items-center gap-2 h-9">
          <div className="spinner" />
          <span className="text-sm opacity-50" style={{ color: cfg.glowColor }}>LOADING...</span>
        </div>
      ) : (
        <div className="flex items-baseline gap-1.5">
          <span
            className="text-2xl font-bold tracking-wider"
            style={{
              color: cfg.glowColor,
              textShadow: `0 0 12px ${cfg.glowColor}`,
              fontFamily: '"Orbitron", monospace',
            }}
          >
            {value}
          </span>
          {unit && (
            <span className="text-sm opacity-60" style={{ color: cfg.glowColor }}>
              {unit}
            </span>
          )}
        </div>
      )}

      {/* Status Footer */}
      {status !== 'normal' && !loading && (
        <div className="flex items-center gap-1.5 mt-3 pt-3"
          style={{ borderTop: `1px solid ${cfg.borderColor}` }}
        >
          <AlertCircle size={11} style={{ color: cfg.glowColor }} />
          <span className="text-xs tracking-widest opacity-70" style={{ color: cfg.glowColor }}>
            {status === 'error' && '// NO_SIGNAL'}
            {status === 'warning' && '// LOW_POWER'}
            {status === 'success' && '// NOMINAL'}
          </span>
        </div>
      )}
    </motion.div>
  );
};

export const StatusCardsGrid = ({ data, loading }) => {
  const getStatus = (label, value) => {
    if (loading || value === null || value === 'N/A') return 'error';
    if (label === 'Battery' && value < 20) return 'warning';
    if (label === 'WiFi' && value === 'Disconnected') return 'error';
    return 'success';
  };

  const cards = [
    { icon: MapPin, label: 'Latitude', value: data.latitude, code: 'LAT', field: 'Latitude' },
    { icon: MapPin, label: 'Longitude', value: data.longitude, code: 'LNG', field: 'Longitude' },
    { icon: Zap, label: 'Battery', value: data.battery, unit: '%', code: 'PWR', field: 'Battery' },
    { icon: Wifi, label: 'Network', value: data.wifi, code: 'NET', field: 'WiFi' },
    { icon: Clock, label: 'Last Sync', value: data.lastUpdate, code: 'TMP', field: 'Time' },
    { icon: Signal, label: 'Status', value: data.isOnline ? 'ONLINE' : 'OFFLINE', code: 'CON', field: 'Status' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
      {cards.map((card, i) => (
        <StatusCard
          key={card.code}
          icon={card.icon}
          label={card.label}
          value={card.value}
          unit={card.unit}
          code={card.code}
          loading={loading}
          status={card.field === 'Status'
            ? (data.isOnline ? 'success' : 'error')
            : getStatus(card.field, card.value)
          }
        />
      ))}
    </div>
  );
};

export default StatusCard;
