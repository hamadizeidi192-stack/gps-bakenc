import React, { useRef } from 'react';
import { formatLocationData } from '../services/api';
import MapComponent from '../components/MapComponent';
import { StatusCardsGrid } from '../components/StatusCard';
import { motion } from 'framer-motion';
import { RefreshCw, Battery, Wifi, Activity, Info, ArrowUpRight, BarChart3, Clock, ShieldCheck } from 'lucide-react';

// ── Countdown ─────────────────────────────────────────────────────────────────
const Countdown = ({ countdown, total }) => {
  const pct = total > 0 ? (countdown / total) * 100 : 0;
  const color = countdown > 10 ? '#3b82f6' : countdown > 5 ? '#f59e0b' : '#ef4444';
  return (
    <div className="flex items-center gap-4 bg-white px-5 py-3 rounded-[1.5rem] shadow-sm border border-slate-100">
      <div className="relative w-10 h-10 flex items-center justify-center">
        <svg className="absolute inset-0" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="16" fill="none" stroke="#f1f5f9" strokeWidth="3" />
          <motion.circle 
            cx="18" cy="18" r="16" fill="none" stroke={color} strokeWidth="3"
            strokeDasharray="100" 
            animate={{ strokeDashoffset: 100 - pct }}
            transition={{ type: 'tween', ease: 'linear' }}
            strokeLinecap="round"
          />
        </svg>
        <span className="text-[11px] font-black text-slate-800">{Math.max(0, Math.floor(countdown))}</span>
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Next Sync</p>
        <p className="text-xs font-bold text-slate-900">Live polling</p>
      </div>
    </div>
  );
};

// ── Mock Mini Chart ───────────────────────────────────────────────────────────
const MiniChart = ({ color = '#3b82f6', id = 'grad-1' }) => (
  <div className="h-16 w-full mt-4">
    <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.2 }} />
          <stop offset="100%" style={{ stopColor: color, stopOpacity: 0 }} />
        </linearGradient>
      </defs>
      <path
        d="M0,40 L0,25 Q15,10 30,28 T60,15 T100,20 L100,40 Z"
        fill={`url(#${id})`}
      />
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
        d="M0,25 Q15,10 30,28 T60,15 T100,20"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  </div>
);

// ── Dashboard ──────────────────────────────────────────────────────────────────
export const Dashboard = ({ locationData, pathHistory = [], loading, onRefresh, isOnline, countdown = 30, pollInterval = 30 }) => {
  const mapRef = useRef(null);
  // Default to empty object to prevent crash if locationData is null
  const safeData = locationData || { battery: 0, wifi: 'Unknown', isOnline: false };
  const fd = formatLocationData(safeData);

  const handleCenter = () => {
    if (mapRef?.current && safeData.latitude && safeData.longitude)
      mapRef.current.setView([safeData.latitude, safeData.longitude], 16);
  };

  return (
    <div className="pb-24 px-4 md:px-8 max-w-7xl mx-auto">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8 pt-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className={`pill ${isOnline ? 'pill-green' : 'pill-red'}`}>
              <span className={`status-dot ${isOnline ? 'online' : 'offline'}`} />
              {isOnline ? 'SYSTEM ACTIVE' : 'SYSTEM OFFLINE'}
            </span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Telemetry Console</h1>
          <p className="text-slate-500 font-medium opacity-80">Real-time data stream from SmartGlasses-v1</p>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <Countdown countdown={countdown} total={pollInterval} />
          <button onClick={onRefresh} disabled={loading} className="btn-primary ml-auto lg:ml-0 group">
            <RefreshCw size={18} className={`${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-all duration-500'}`} />
            {loading ? 'SYNCING' : 'REFRESH'}
          </button>
        </div>
      </motion.div>

      {/* ── Grid ────────────────────────────────────────────────────────── */}
      <StatusCardsGrid data={fd} loading={loading} />

      {/* ── Main Section ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-6">
        <div className="xl:col-span-3">
          <MapComponent
            latitude={safeData.latitude}
            longitude={safeData.longitude}
            pathHistory={pathHistory}
            isOnline={isOnline}
            loading={loading}
            onCenterMap={handleCenter}
            mapRef={mapRef}
          />
        </div>

        {/* Info Column */}
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="card p-6 border-b-4 border-b-blue-500">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Battery Health</p>
              <BarChart3 size={16} className="text-blue-500" />
            </div>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-black text-slate-900">{fd.battery}%</span>
              <span className="text-xs font-bold text-emerald-500 mb-2 flex items-center bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                <ArrowUpRight size={14} className="mr-0.5" /> Stable
              </span>
            </div>
            <MiniChart color="#3b82f6" id="batt-chart" />
            <div className="mt-4 progress-track">
              <motion.div 
                className="progress-fill bg-blue-500 shadow-sm" 
                initial={{ width: 0 }}
                animate={{ width: `${fd.battery}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Link Status</p>
              <Wifi size={16} className="text-emerald-500" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-500">SSID</span>
                <span className="text-sm font-black text-slate-800">{fd.wifi || 'Unknown'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-500">Quality</span>
                <span className="text-sm font-black text-emerald-600 font-mono text-xs">EXCELLENT</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-500">Ping</span>
                <span className="text-sm font-black text-slate-800">18ms</span>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="rounded-[2.5rem] bg-slate-900 p-6 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-4 -right-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Activity size={120} />
            </div>
            <div className="flex items-center gap-2 mb-4 relative z-10">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-300">Diagnostic Log</p>
            </div>
            <div className="space-y-4 relative z-10">
              <div className="flex gap-3">
                <Clock size={14} className="text-slate-500 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] font-medium text-slate-300 leading-snug">
                  GPS signal lock confirmed via 8 satellites. Accuracy ±3m.
                </p>
              </div>
              <div className="flex gap-3">
                <ShieldCheck size={14} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] font-medium text-slate-300 leading-snug">
                  Packet encryption verified. SSL/TLS handshake successful.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
