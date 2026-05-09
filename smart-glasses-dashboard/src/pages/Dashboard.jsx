import React, { useRef } from 'react';
import { formatLocationData } from '../services/api';
import MapComponent from '../components/MapComponent';
import { StatusCardsGrid } from '../components/StatusCard';
import { motion } from 'framer-motion';
import { RefreshCw, Activity, Wifi, Clock, Battery, TrendingUp } from 'lucide-react';

// ─── Countdown Ring ───────────────────────────────────────────────────────────
const CountdownRing = ({ countdown, total }) => {
  const size = 64;
  const stroke = 3;
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (countdown / total) * circ;
  const pct = Math.round((countdown / total) * 100);
  const color = countdown > total * 0.5 ? '#a78bfa' : countdown > total * 0.25 ? '#fb923c' : '#f87171';

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="absolute" width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          stroke={color} strokeWidth={stroke} fill="none"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.4s ease' }}
        />
      </svg>
      <div className="text-center z-10">
        <p className="text-lg font-bold text-white leading-none">{countdown}</p>
        <p className="text-[9px] text-white/30 font-medium">SEC</p>
      </div>
    </div>
  );
};

// ─── Battery bar ──────────────────────────────────────────────────────────────
const BatteryIndicator = ({ level }) => {
  const color = level > 50 ? '#34d399' : level > 20 ? '#fb923c' : '#f87171';
  const bg = level > 50 ? 'rgba(52,211,153,0.12)' : level > 20 ? 'rgba(251,146,60,0.12)' : 'rgba(248,113,113,0.12)';
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-white/40 font-medium">Battery</span>
        <span className="text-xs font-bold" style={{ color }}>{level}%</span>
      </div>
      <div className="progress-track">
        <motion.div
          className="progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${level}%` }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            background: `linear-gradient(to right, ${color}99, ${color})`,
            boxShadow: `0 0 8px ${color}40`,
          }}
        />
      </div>
    </div>
  );
};

// ─── Dashboard ────────────────────────────────────────────────────────────────
export const Dashboard = ({ locationData, loading, onRefresh, isOnline, countdown = 30, pollInterval = 30 }) => {
  const mapRef = useRef(null);
  const formattedData = formatLocationData(locationData);

  const handleCenterMap = () => {
    if (mapRef?.current && locationData.latitude && locationData.longitude) {
      mapRef.current.setView([locationData.latitude, locationData.longitude], 16);
    }
  };

  return (
    <div className="pt-20 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-7"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className={`status-dot ${isOnline ? 'online' : 'offline'}`} />
                <span className="text-xs font-semibold" style={{ color: isOnline ? '#34d399' : '#f87171' }}>
                  {isOnline ? 'Live Tracking Active' : 'Device Offline'}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                GPS Dashboard
              </h1>
              <p className="text-sm text-white/40 mt-1">
                Real-time location &amp; telemetry for your smart glasses
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Countdown */}
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <CountdownRing countdown={countdown} total={pollInterval} />
                <div>
                  <p className="text-[10px] text-white/30 font-medium mb-0.5">NEXT SYNC</p>
                  <p className="text-xs text-white/60 font-semibold">Every {pollInterval}s</p>
                </div>
              </div>

              {/* Refresh */}
              <button onClick={onRefresh} disabled={loading} className="btn-primary">
                <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
                {loading ? 'Syncing…' : 'Sync Now'}
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="mt-5 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
        </motion.div>

        {/* ── Stat Cards ───────────────────────────────────────────────────── */}
        <StatusCardsGrid data={formattedData} loading={loading} />

        {/* ── Map + Side Panel ─────────────────────────────────────────────── */}
        <div className="flex flex-col xl:flex-row gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <MapComponent
              latitude={locationData.latitude}
              longitude={locationData.longitude}
              isOnline={isOnline}
              loading={loading}
              onCenterMap={handleCenterMap}
              mapRef={mapRef}
            />
          </div>

          {/* Side panel */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="xl:w-60 flex flex-col gap-3"
          >
            {/* Connection */}
            <div
              className="card p-4"
              style={{ borderColor: isOnline ? 'rgba(52,211,153,0.15)' : 'rgba(248,113,113,0.15)' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Activity size={14} style={{ color: isOnline ? '#34d399' : '#f87171' }} />
                <p className="text-xs font-semibold text-white/50">Connection</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`status-dot ${isOnline ? 'online' : 'offline'}`} />
                <span className="font-bold text-sm text-white">{isOnline ? 'Online' : 'Offline'}</span>
              </div>
              <p className="text-xs text-white/30 mt-1.5">
                {isOnline ? 'Streaming telemetry data' : 'Awaiting reconnect…'}
              </p>
            </div>

            {/* Battery */}
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-3">
                <Battery size={14} className="text-white/40" />
                <p className="text-xs font-semibold text-white/50">Power Level</p>
              </div>
              <BatteryIndicator level={formattedData.battery} />
            </div>

            {/* Network */}
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Wifi size={14} className="text-white/40" />
                <p className="text-xs font-semibold text-white/50">Network</p>
              </div>
              <p className="text-sm font-bold text-white">{formattedData.wifi || '—'}</p>
              <span className={`pill mt-2 ${formattedData.wifi === 'Disconnected' ? 'pill-red' : 'pill-green'}`}>
                {formattedData.wifi === 'Disconnected' ? 'Disconnected' : 'Connected'}
              </span>
            </div>

            {/* Last sync */}
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={14} className="text-white/40" />
                <p className="text-xs font-semibold text-white/50">Last Sync</p>
              </div>
              <p className="text-xs font-mono text-white/70">{formattedData.lastUpdate || 'Never'}</p>
            </div>
          </motion.div>
        </div>

        {/* ── Info cards row ───────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-3"
        >
          {/* System info */}
          <div className="card p-5 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={15} className="text-white/30" />
              <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">System Info</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Sync Interval',  value: `${pollInterval}s` },
                { label: 'Backend',        value: 'Render Cloud' },
                { label: 'Encryption',     value: 'AES-256' },
                { label: 'Protocol',       value: 'HTTPS/REST' },
              ].map(item => (
                <div key={item.label}>
                  <p className="text-[10px] text-white/30 font-medium mb-0.5 uppercase tracking-wider">{item.label}</p>
                  <p className="text-sm font-semibold text-white/70">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div
            className="card-accent p-5"
          >
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">💡 Tips</p>
            <ul className="space-y-2.5">
              {[
                'GPS is more accurate outdoors',
                'Keep battery above 20%',
                'Stable WiFi improves sync',
              ].map(tip => (
                <li key={tip} className="flex items-start gap-2 text-xs text-white/50">
                  <span style={{ color: '#a78bfa', marginTop: 2 }}>•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Dashboard;
