import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Wifi, Clock, AlertCircle, MapPin } from 'lucide-react';

/**
 * Status Card Component
 * Displays individual status metrics with icons and animations
 */
export const StatusCard = ({ icon: Icon, label, value, unit = '', status = 'normal', loading = false }) => {
  const statusColors = {
    normal: 'border-slate-100',
    warning: 'border-amber-200 bg-amber-50/30',
    error: 'border-rose-200 bg-rose-50/30',
    success: 'border-emerald-200 bg-emerald-50/30',
  };

  const statusBgColors = {
    normal: 'bg-indigo-50',
    warning: 'bg-amber-100',
    error: 'bg-rose-100',
    success: 'bg-emerald-100',
  };

  const statusIconColors = {
    normal: 'text-indigo-600',
    warning: 'text-amber-600',
    error: 'text-rose-600',
    success: 'text-emerald-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`glass-effect p-6 border ${statusColors[status]} transition-smooth card-hover group`}
    >
      <div className={`${statusBgColors[status]} w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-smooth group-hover:scale-110 group-hover:rotate-3`}>
        <Icon size={24} className={statusIconColors[status]} />
      </div>

      <p className="text-sm font-semibold text-slate-500 mb-1 tracking-wide uppercase">{label}</p>

      {loading ? (
        <div className="flex items-center gap-2 mt-2">
          <div className="spinner" />
          <span className="text-lg font-bold text-slate-400">Loading...</span>
        </div>
      ) : (
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-slate-800 tracking-tight">{value}</span>
          {unit && <span className="text-sm font-bold text-slate-400">{unit}</span>}
        </div>
      )}

      {status !== 'normal' && (
        <div className={`mt-3 flex items-center gap-1.5 text-xs font-bold ${statusIconColors[status]}`}>
          <AlertCircle size={14} />
          <span>
            {status === 'error' && 'No Data Received'}
            {status === 'warning' && 'Low Battery'}
            {status === 'success' && 'Systems Nominal'}
          </span>
        </div>
      )}
    </motion.div>
  );
};

/**
 * Status Cards Grid Component
 * Displays multiple status cards in a responsive grid
 */
export const StatusCardsGrid = ({ data, loading }) => {
  const getStatus = (label, value) => {
    if (loading || value === null || value === 'N/A') return 'error';
    if (label === 'Battery' && value < 20) return 'warning';
    if (label === 'WiFi' && value === 'Disconnected') return 'error';
    return 'success';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <StatusCard
        icon={MapPin}
        label="Latitude"
        value={data.latitude}
        loading={loading}
        status={getStatus('Latitude', data.latitude)}
      />
      <StatusCard
        icon={MapPin}
        label="Longitude"
        value={data.longitude}
        loading={loading}
        status={getStatus('Longitude', data.longitude)}
      />
      <StatusCard
        icon={Zap}
        label="Battery Level"
        value={data.battery}
        unit="%"
        loading={loading}
        status={getStatus('Battery', data.battery)}
      />
      <StatusCard
        icon={Wifi}
        label="WiFi Status"
        value={data.wifi}
        loading={loading}
        status={getStatus('WiFi', data.wifi)}
      />
      <StatusCard
        icon={Clock}
        label="Last Update"
        value={data.lastUpdate}
        loading={loading}
        status={data.isOnline ? 'success' : 'error'}
      />
      <StatusCard
        icon={AlertCircle}
        label="Connection Status"
        value={data.isOnline ? 'Online' : 'Offline'}
        loading={loading}
        status={data.isOnline ? 'success' : 'error'}
      />
    </div>
  );
};

export default StatusCard;
