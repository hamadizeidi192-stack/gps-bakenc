import React, { useRef } from 'react';
import { formatLocationData } from '../services/api';
import MapComponent from '../components/MapComponent';
import { StatusCardsGrid } from '../components/StatusCard';
import { motion } from 'framer-motion';
import { RefreshCw, Battery, Wifi, Clock, Server } from 'lucide-react';

// ── Countdown Ring ─────────────────────────────────────────────────────────────
const CountdownRing = ({ countdown, total }) => {
  const size = 56, stroke = 3;
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (countdown / total) * circ;
  const color = countdown > total * 0.5 ? '#f97316' : countdown > total * 0.2 ? '#fb923c' : '#ef4444';
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="absolute" width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} fill="none" />
        <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth={stroke} fill="none"
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.4s ease' }} />
      </svg>
      <div className="text-center z-10">
        <p className="text-sm font-bold text-white leading-none">{countdown}</p>
        <p className="text-[8px] text-white/25 font-medium">SEC</p>
      </div>
    </div>
  );
};

// ── Battery bar ────────────────────────────────────────────────────────────────
const BatteryBar = ({ level }) => {
  const color = level > 50 ? '#22c55e' : level > 20 ? '#f97316' : '#ef4444';
  return (
    <div>
      <div className="flex justify-between mb-1.5">
        <span className="text-xs text-white/40">Battery</span>
        <span className="text-xs font-bold" style={{ color }}>{level}%</span>
      </div>
      <div className="progress-track">
        <motion.div className="progress-fill" initial={{ width: 0 }} animate={{ width: `${level}%` }}
          transition={{ duration: 0.9, ease: [0.16,1,0.3,1] }}
          style={{ background: color, boxShadow: `0 0 6px ${color}50` }} />
      </div>
    </div>
  );
};

// ── Dashboard ──────────────────────────────────────────────────────────────────
export const Dashboard = ({ locationData, loading, onRefresh, isOnline, countdown = 30, pollInterval = 30 }) => {
  const mapRef = useRef(null);
  const fd = formatLocationData(locationData);

  const handleCenter = () => {
    if (mapRef?.current && locationData.latitude && locationData.longitude)
      mapRef.current.setView([locationData.latitude, locationData.longitude], 16);
  };

  return (
    <div className="pt-14 pb-14 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4 }} className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`status-dot ${isOnline ? 'online' : 'offline'}`} />
                <span className="text-xs font-semibold" style={{ color: isOnline ? '#22c55e' : '#ef4444' }}>
                  {isOnline ? 'Live Tracking' : 'Device Offline'}
                </span>
              </div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">Tracking Dashboard</h1>
              <p className="text-sm text-white/35 mt-0.5">Smart glasses · Real-time GPS &amp; telemetry</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)' }}>
                <CountdownRing countdown={countdown} total={pollInterval} />
                <div>
                  <p className="text-[9px] text-white/25 font-medium mb-0.5">NEXT SYNC</p>
                  <p className="text-xs font-semibold text-white/55">Every {pollInterval}s</p>
                </div>
              </div>
              <button onClick={onRefresh} disabled={loading} className="btn-primary">
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                {loading ? 'Syncing…' : 'Sync'}
              </button>
            </div>
          </div>
          <div className="mt-4 divider" />
        </motion.div>

        {/* ── Stat cards ───────────────────────────────────────────────────── */}
        <StatusCardsGrid data={fd} loading={loading} />

        {/* ── Map + side panel ─────────────────────────────────────────────── */}
        <div className="flex flex-col xl:flex-row gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <MapComponent latitude={locationData.latitude} longitude={locationData.longitude}
              isOnline={isOnline} loading={loading} onCenterMap={handleCenter} mapRef={mapRef} />
          </div>

          {/* Side panel */}
          <motion.div initial={{ opacity:0, x:12 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.4, delay:0.15 }}
            className="xl:w-56 flex flex-col gap-3">

            {/* Status */}
            <div className="card p-4" style={{ borderColor: isOnline ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)' }}>
              <p className="text-[10px] font-semibold text-white/35 uppercase tracking-wider mb-2">Connection</p>
              <div className="flex items-center gap-2">
                <span className={`status-dot ${isOnline ? 'online' : 'offline'}`} />
                <span className="text-sm font-bold text-white">{isOnline ? 'Online' : 'Offline'}</span>
              </div>
            </div>

            {/* Battery */}
            <div className="card p-4">
              <p className="text-[10px] font-semibold text-white/35 uppercase tracking-wider mb-3">Power</p>
              <BatteryBar level={fd.battery} />
            </div>

            {/* Network */}
            <div className="card p-4">
              <p className="text-[10px] font-semibold text-white/35 uppercase tracking-wider mb-2">Network</p>
              <div className="flex items-center gap-2">
                <Wifi size={13} className="text-white/30" />
                <span className="text-sm font-semibold text-white/75">{fd.wifi || '—'}</span>
              </div>
            </div>

            {/* Last sync */}
            <div className="card p-4">
              <p className="text-[10px] font-semibold text-white/35 uppercase tracking-wider mb-2">Last Sync</p>
              <div className="flex items-center gap-2">
                <Clock size={13} className="text-white/30" />
                <span className="text-xs font-mono text-white/55">{fd.lastUpdate || 'Never'}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Bottom info row ──────────────────────────────────────────────── */}
        <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4, delay:0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-3">

          {/* System info */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Server size={13} className="text-white/25" />
              <p className="text-xs font-semibold text-white/35 uppercase tracking-wider">System</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { k: 'Sync interval', v: `${pollInterval}s` },
                { k: 'Backend',       v: 'Render Cloud' },
                { k: 'Encryption',    v: 'AES-256' },
                { k: 'Protocol',      v: 'HTTPS/REST' },
              ].map(({ k, v }) => (
                <div key={k}>
                  <p className="text-[10px] text-white/25 mb-0.5">{k}</p>
                  <p className="text-sm font-semibold text-white/65">{v}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="card-highlight p-5">
            <p className="text-xs font-semibold text-white/35 uppercase tracking-wider mb-3">Tips</p>
            <ul className="space-y-2">
              {[
                'GPS accuracy is better outdoors',
                'Keep battery charged above 20%',
                'Stable WiFi ensures consistent sync',
                'Device sends location every 30s',
              ].map(t => (
                <li key={t} className="flex items-start gap-2 text-xs text-white/45">
                  <span className="mt-0.5 text-accent">›</span> {t}
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
