import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Wifi, Clock, AlertCircle, MapPin } from 'lucide-react';

/**
 * Status Card Component
 * Displays individual status metrics with icons and animations
 */
export const StatusCard = ({ icon: Icon, label, value, unit = '', status = 'normal', loading = false }) => {
  const statusColors = {
    normal: 'border-dark-700',
    warning: 'border-yellow-500/50',
    error: 'border-red-500/50',
    success: 'border-green-500/50',
  };

  const statusBgColors = {
    normal: 'bg-dark-800/50',
    warning: 'bg-yellow-500/10',
    error: 'bg-red-500/10',
    success: 'bg-green-500/10',
  };

  const statusIconColors = {
    normal: 'text-blue-400',
    warning: 'text-yellow-400',
    error: 'text-red-400',
    success: 'text-green-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className={`glass-effect p-6 rounded-xl border-2 ${statusColors[status]} transition-smooth card-hover`}
    >
      <div className={`${statusBgColors[status]} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
        <Icon size={24} className={statusIconColors[status]} />
      </div>

      <p className="text-sm font-medium text-gray-400 mb-2">{label}</p>

      {loading ? (
        <div className="flex items-center gap-2">
          <div className="spinner" />
          <span className="text-lg font-bold text-gray-300">Loading...</span>
        </div>
      ) : (
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-white">{value}</span>
          {unit && <span className="text-sm text-gray-400">{unit}</span>}
        </div>
      )}

      {status !== 'normal' && (
        <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
          <AlertCircle size={14} />
          <span>
            {status === 'error' && 'No data'}
            {status === 'warning' && 'Low battery'}
            {status === 'success' && 'All good'}
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
