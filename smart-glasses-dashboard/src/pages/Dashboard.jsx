import React, { useRef } from 'react';
import { formatLocationData, startLocationPolling, stopLocationPolling } from '../services/api';
import MapComponent from '../components/MapComponent';
import { StatusCardsGrid } from '../components/StatusCard';
import { motion } from 'framer-motion';
import { RefreshCw, Activity } from 'lucide-react';

export const Dashboard = ({ locationData, loading, onRefresh, onNotification, isOnline }) => {
  const mapRef = useRef(null);
  const formattedData = formatLocationData(locationData);

  const handleCenterMap = () => {
    if (mapRef?.current && locationData.latitude && locationData.longitude) {
      mapRef.current.setView([locationData.latitude, locationData.longitude], 16);
    }
  };

  return (
    <div className="pt-24 pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* === HUD HEADER === */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          {/* Breadcrumb */}
          <p className="text-xs tracking-widest opacity-50 mb-2" style={{ color: '#00f0ff' }}>
            SYS:// &gt; TRACKING &gt; GPS_CONSOLE
          </p>

          <div className="flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
            <div>
              <h1
                className="text-2xl md:text-4xl font-black tracking-widest uppercase mb-1"
                style={{
                  fontFamily: '"Orbitron", monospace',
                  color: '#00f0ff',
                  textShadow: '0 0 20px rgba(0, 240, 255, 0.5), 0 0 40px rgba(0, 240, 255, 0.2)',
                }}
              >
                GPS CONSOLE
              </h1>
              <p className="text-xs tracking-widest opacity-50" style={{ color: '#00f0ff' }}>
                // REAL-TIME LOCATION TRACKING &amp; STATUS MONITORING
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Online indicator badge */}
              <div
                className="flex items-center gap-2 px-4 py-2"
                style={{
                  border: `1px solid ${isOnline ? 'rgba(0, 255, 65, 0.4)' : 'rgba(255, 0, 60, 0.4)'}`,
                  background: isOnline ? 'rgba(0, 255, 65, 0.05)' : 'rgba(255, 0, 60, 0.05)',
                }}
              >
                <Activity size={14} style={{ color: isOnline ? '#00ff41' : '#ff003c' }} />
                <span
                  className="text-xs tracking-widest font-bold"
                  style={{
                    color: isOnline ? '#00ff41' : '#ff003c',
                    textShadow: `0 0 8px ${isOnline ? '#00ff41' : '#ff003c'}`,
                  }}
                >
                  {isOnline ? 'DEVICE_ONLINE' : 'DEVICE_OFFLINE'}
                </span>
              </div>

              {/* Refresh button */}
              <button
                onClick={onRefresh}
                disabled={loading}
                className="btn-primary flex items-center gap-2 disabled:opacity-30"
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                {loading ? 'SYNCING...' : 'SYNC NOW'}
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="mt-4 h-px w-full opacity-20" style={{ background: 'linear-gradient(to right, #00f0ff, transparent)' }} />
        </motion.div>

        {/* === STATUS CARDS === */}
        <StatusCardsGrid data={formattedData} loading={loading} />

        {/* === MAP === */}
        <MapComponent
          latitude={locationData.latitude}
          longitude={locationData.longitude}
          isOnline={isOnline}
          loading={loading}
          onCenterMap={handleCenterMap}
          mapRef={mapRef}
        />

        {/* === DEVICE INFO PANEL === */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hud-card p-6 mt-2"
        >
          {/* Panel header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px flex-1 opacity-20" style={{ background: '#00f0ff' }} />
            <p className="text-xs tracking-widest opacity-60" style={{ color: '#00f0ff' }}>
              DEVICE_TELEMETRY
            </p>
            <div className="h-px flex-1 opacity-20" style={{ background: '#00f0ff' }} />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-xs">
            {[
              { label: 'CONNECTION', value: isOnline ? 'ACTIVE' : 'LOST', color: isOnline ? '#00ff41' : '#ff003c' },
              { label: 'LAST_SYNC', value: formattedData.lastUpdate || 'NEVER', color: '#00f0ff' },
              { label: 'NETWORK_ID', value: formattedData.wifi, color: '#ff9a00' },
              { label: 'POWER_LVL', value: `${formattedData.battery}%`, color: formattedData.battery > 20 ? '#00ff41' : '#ff003c' },
            ].map(item => (
              <div key={item.label}>
                <p className="tracking-widest opacity-40 mb-1" style={{ color: '#00f0ff' }}>&gt; {item.label}</p>
                <p
                  className="text-sm font-bold tracking-widest"
                  style={{ color: item.color, textShadow: `0 0 8px ${item.color}`, fontFamily: '"Orbitron", monospace' }}
                >
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* Battery bar */}
          <div className="mt-6">
            <div className="flex justify-between text-xs mb-2 opacity-50" style={{ color: '#00f0ff' }}>
              <span>&gt; POWER_GAUGE</span>
              <span>{formattedData.battery}%</span>
            </div>
            <div
              className="h-2 w-full relative overflow-hidden"
              style={{ background: 'rgba(0, 240, 255, 0.1)', border: '1px solid rgba(0, 240, 255, 0.2)' }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${formattedData.battery}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="h-full"
                style={{
                  background: formattedData.battery > 50
                    ? 'linear-gradient(to right, #00ff41, #00f0ff)'
                    : formattedData.battery > 20
                    ? 'linear-gradient(to right, #ff9a00, #ffcc00)'
                    : '#ff003c',
                  boxShadow: `0 0 10px ${formattedData.battery > 50 ? '#00ff41' : formattedData.battery > 20 ? '#ff9a00' : '#ff003c'}`,
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* === SYSTEM LOG / TIPS === */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="hud-card mt-4 p-5"
        >
          <p className="text-xs tracking-widest mb-3 opacity-60" style={{ color: '#00f0ff' }}>
            &gt; SYSTEM_LOG
          </p>
          <div className="space-y-1.5">
            {[
              '[INFO] Data stream refreshes every 5000ms',
              '[INFO] GPS signal improves in open environments',
              '[WARN] Ensure stable WiFi for continuous tracking',
              '[INFO] Monitor POWER_LVL to prevent shutdown',
            ].map((log, i) => (
              <p
                key={i}
                className="text-xs font-mono opacity-50 hover:opacity-80 transition-smooth"
                style={{ color: log.startsWith('[WARN]') ? '#ff9a00' : '#00f0ff' }}
              >
                {log}
              </p>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Dashboard;
