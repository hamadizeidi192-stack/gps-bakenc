import React, { useRef } from 'react';
import { formatLocationData } from '../services/api';
import MapComponent from '../components/MapComponent';
import { StatusCardsGrid } from '../components/StatusCard';
import { motion } from 'framer-motion';
import { RefreshCw, Battery, Wifi, Activity, Info, ArrowUpRight } from 'lucide-react';

// ── Countdown ─────────────────────────────────────────────────────────────────
const Countdown = ({ countdown, total }) => {
  const pct = (countdown / total) * 100;
  const color = countdown > 10 ? '#3b82f6' : countdown > 5 ? '#f59e0b' : '#ef4444';
  return (
    <div className="flex items-center gap-4 bg-white px-5 py-3 rounded-[1.5rem] shadow-sm border border-slate-100">
      <div className="relative w-10 h-10 flex items-center justify-center">
        <svg className="absolute inset-0" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="16" fill="none" stroke="#f1f5f9" strokeWidth="3" />
          <circle cx="18" cy="18" r="16" fill="none" stroke={color} strokeWidth="3"
            strokeDasharray="100" strokeDashoffset={100 - pct} strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.4s' }} />
        </svg>
        <span className="text-[11px] font-black text-slate-800">{countdown}</span>
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Next Sync</p>
        <p className="text-xs font-bold text-slate-900">Auto-refresh active</p>
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
    <div className="pb-24 px-4 md:px-8 max-w-7xl mx-auto">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8 pt-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className={`pill ${isOnline ? 'pill-green' : 'pill-red'}`}>
              <span className={`status-dot ${isOnline ? 'online' : 'offline'}`} />
              {isOnline ? 'SYSTEM OPERATIONAL' : 'CONNECTION OFFLINE'}
            </span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Device Overview</h1>
          <p className="text-slate-500 font-medium">Monitoring your smart glasses telemetry in real-time.</p>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <Countdown countdown={countdown} total={pollInterval} />
          <button onClick={onRefresh} disabled={loading} className="btn-primary ml-auto lg:ml-0">
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            {loading ? 'SYNCING' : 'REFRESH'}
          </button>
        </div>
      </motion.div>

      {/* ── Grid ────────────────────────────────────────────────────────── */}
      <StatusCardsGrid data={fd} loading={loading} />

      {/* ── Main Section ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-6">
        <div className="xl:col-span-3">
          <MapComponent latitude={locationData.latitude} longitude={locationData.longitude}
            isOnline={isOnline} loading={loading} onCenterMap={handleCenter} mapRef={mapRef} />
        </div>

        {/* Info Column */}
        <div className="space-y-6">
          <div className="card p-6 border-b-4 border-b-blue-500">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Battery Status</p>
              <Battery size={16} className="text-slate-300" />
            </div>
            <div className="flex items-end gap-2 mb-3">
              <span className="text-4xl font-black text-slate-900">{fd.battery}%</span>
              <span className="text-xs font-bold text-emerald-500 mb-2 flex items-center"><ArrowUpRight size={14} /> Stable</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill bg-blue-500 shadow-[0_0_10px_#3b82f640]" style={{ width: `${fd.battery}%` }} />
            </div>
          </div>

          <div className="card p-6">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Network Info</p>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wifi size={16} className="text-blue-500" />
                  <span className="text-sm font-bold text-slate-700">SSID</span>
                </div>
                <span className="text-sm font-black text-slate-900">{fd.wifi || '—'}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity size={16} className="text-blue-500" />
                  <span className="text-sm font-bold text-slate-700">Latency</span>
                </div>
                <span className="text-sm font-black text-slate-900">24ms</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-blue-600 p-6 text-white shadow-xl shadow-blue-200">
            <div className="flex items-center gap-2 mb-4">
              <Info size={18} />
              <p className="text-xs font-bold uppercase tracking-wider">Device Health</p>
            </div>
            <p className="text-sm font-medium leading-relaxed opacity-90">
              Your device is sending high-precision GPS coordinates every 30 seconds. Battery health is optimal.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
