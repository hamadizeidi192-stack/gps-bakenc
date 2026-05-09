import React, { useRef } from 'react';
import { formatLocationData } from '../services/api';
import MapComponent from '../components/MapComponent';
import { StatusCardsGrid } from '../components/StatusCard';
import { motion } from 'framer-motion';
import { RefreshCw, Activity, Zap, Wifi, Clock, Shield } from 'lucide-react';

// ─── Countdown Ring SVG ───────────────────────────────────────────────────────
const CountdownRing = ({ countdown, total }) => {
  const size = 72;
  const stroke = 3;
  const radius = (size - stroke * 2) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = countdown / total;
  const offset = circumference - progress * circumference;
  const color = countdown > 15 ? '#00f0ff' : countdown > 8 ? '#ff9a00' : '#ff003c';

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="countdown-ring absolute" width={size} height={size}>
        {/* Track */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke="rgba(0,240,255,0.08)" strokeWidth={stroke} fill="none"
        />
        {/* Progress */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke={color} strokeWidth={stroke} fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ filter: `drop-shadow(0 0 6px ${color})`, transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }}
        />
      </svg>
      {/* Center text */}
      <div className="text-center z-10">
        <p
          className="text-lg font-black leading-none"
          style={{ fontFamily: '"Orbitron", monospace', color, textShadow: `0 0 10px ${color}` }}
        >
          {countdown}
        </p>
        <p className="text-[8px] tracking-widest opacity-60" style={{ color }}>SEC</p>
      </div>
    </div>
  );
};

// ─── Battery Bar ──────────────────────────────────────────────────────────────
const BatteryBar = ({ level }) => {
  const color = level > 50 ? '#00ff41' : level > 20 ? '#ff9a00' : '#ff003c';
  const segments = 10;
  const filled = Math.round((level / 100) * segments);
  return (
    <div>
      <div className="flex items-center gap-2 mb-1.5">
        <div className="flex gap-1">
          {Array.from({ length: segments }).map((_, i) => (
            <div
              key={i}
              className="transition-all duration-300"
              style={{
                width: '12px', height: '18px',
                background: i < filled ? color : 'rgba(255,255,255,0.06)',
                border: `1px solid ${i < filled ? color : 'rgba(255,255,255,0.1)'}`,
                boxShadow: i < filled ? `0 0 6px ${color}` : 'none',
              }}
            />
          ))}
        </div>
        {/* Battery cap */}
        <div style={{ width: 4, height: 10, background: 'rgba(255,255,255,0.2)', borderRadius: '0 2px 2px 0' }} />
      </div>
      <p className="text-xs tracking-widest" style={{ color, textShadow: `0 0 8px ${color}` }}>
        {level}% POWER
      </p>
    </div>
  );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export const Dashboard = ({ locationData, loading, onRefresh, onNotification, isOnline, countdown = 30, pollInterval = 30 }) => {
  const mapRef = useRef(null);
  const formattedData = formatLocationData(locationData);

  const handleCenterMap = () => {
    if (mapRef?.current && locationData.latitude && locationData.longitude) {
      mapRef.current.setView([locationData.latitude, locationData.longitude], 16);
    }
  };

  return (
    <div className="pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* ── HERO HEADER ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 pt-4"
        >
          {/* Breadcrumb */}
          <p className="text-xs tracking-[0.3em] opacity-40 mb-3" style={{ color: '#00f0ff' }}>
            SYS:// &gt; GPS_CONSOLE &gt; LIVE_TRACKING
          </p>

          <div className="flex flex-col lg:flex-row lg:items-center gap-6 justify-between">
            {/* Title block */}
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="relative">
                  {isOnline && (
                    <>
                      <div className="radar-ring" style={{ width: 12, height: 12, top: '50%', left: '50%', marginTop: -6, marginLeft: -6, animationDelay: '0s' }} />
                      <div className="radar-ring" style={{ width: 12, height: 12, top: '50%', left: '50%', marginTop: -6, marginLeft: -6, animationDelay: '0.8s' }} />
                    </>
                  )}
                  <div
                    className="w-3 h-3 rounded-full relative z-10"
                    style={{
                      background: isOnline ? '#00ff41' : '#ff003c',
                      boxShadow: `0 0 12px ${isOnline ? '#00ff41' : '#ff003c'}`,
                    }}
                  />
                </div>
                <span className="text-xs tracking-[0.25em]" style={{ color: isOnline ? '#00ff41' : '#ff003c' }}>
                  {isOnline ? 'SIGNAL ACQUIRED' : 'NO SIGNAL'}
                </span>
              </div>

              <h1
                className="text-3xl md:text-5xl font-black tracking-[0.12em] uppercase leading-none"
                style={{
                  fontFamily: '"Orbitron", monospace',
                  color: '#00f0ff',
                  textShadow: '0 0 30px rgba(0,240,255,0.5), 0 0 60px rgba(0,240,255,0.15)',
                }}
              >
                GPS CONSOLE
              </h1>
              <p className="text-xs tracking-[0.3em] opacity-40 mt-2" style={{ color: '#00f0ff' }}>
                // REAL-TIME LOCATION &amp; TELEMETRY MONITORING
              </p>
            </div>

            {/* Right side controls */}
            <div className="flex items-center gap-4 flex-wrap">
              {/* Countdown ring */}
              <div
                className="flex flex-col items-center gap-1 p-3"
                style={{ border: '1px solid rgba(0,240,255,0.15)', background: 'rgba(0,10,20,0.5)' }}
              >
                <p className="text-[9px] tracking-widest opacity-40 mb-1" style={{ color: '#00f0ff' }}>NEXT SYNC</p>
                <CountdownRing countdown={countdown} total={pollInterval} />
              </div>

              {/* Sync button */}
              <button
                onClick={onRefresh}
                disabled={loading}
                className="btn-primary flex items-center gap-2"
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                {loading ? 'SYNCING...' : 'FORCE SYNC'}
              </button>
            </div>
          </div>

          {/* Divider with glow */}
          <div className="mt-5 flex items-center gap-3">
            <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, rgba(0,240,255,0.5), rgba(0,240,255,0.05))' }} />
            <span className="text-xs opacity-30" style={{ color: '#00f0ff' }}>◈</span>
            <div className="h-px w-16" style={{ background: 'rgba(0,240,255,0.08)' }} />
          </div>
        </motion.div>

        {/* ── STATUS CARDS GRID ────────────────────────────────────────────── */}
        <StatusCardsGrid data={formattedData} loading={loading} />

        {/* ── MAP + SIDE PANEL ─────────────────────────────────────────────── */}
        <div className="flex flex-col xl:flex-row gap-4 mb-4">
          {/* Map takes most of the space */}
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

          {/* Side telemetry panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="xl:w-64 flex flex-col gap-4"
          >
            {/* Connection status block */}
            <div
              className="hud-card p-5"
              style={isOnline ? { borderColor: 'rgba(0,255,65,0.3)' } : { borderColor: 'rgba(255,0,60,0.3)' }}
            >
              <p className="text-[10px] tracking-[0.3em] opacity-50 mb-3" style={{ color: '#00f0ff' }}>LINK STATUS</p>
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-3 h-3 rounded-full animate-pulse-slow"
                  style={{
                    background: isOnline ? '#00ff41' : '#ff003c',
                    color: isOnline ? '#00ff41' : '#ff003c',
                    boxShadow: `0 0 10px ${isOnline ? '#00ff41' : '#ff003c'}`,
                  }}
                />
                <span
                  className="text-sm font-bold tracking-widest"
                  style={{
                    fontFamily: '"Orbitron", monospace',
                    color: isOnline ? '#00ff41' : '#ff003c',
                    textShadow: `0 0 8px ${isOnline ? '#00ff41' : '#ff003c'}`,
                  }}
                >
                  {isOnline ? 'ONLINE' : 'OFFLINE'}
                </span>
              </div>
              <p className="text-xs opacity-40 tracking-widest" style={{ color: '#00f0ff' }}>
                {isOnline ? '// Telemetry active' : '// Signal lost'}
              </p>
            </div>

            {/* Battery segmented bar */}
            <div className="hud-card p-5">
              <p className="text-[10px] tracking-[0.3em] opacity-50 mb-3" style={{ color: '#00f0ff' }}>POWER</p>
              <BatteryBar level={formattedData.battery} />
            </div>

            {/* Network */}
            <div className="hud-card p-5">
              <p className="text-[10px] tracking-[0.3em] opacity-50 mb-2" style={{ color: '#00f0ff' }}>NETWORK</p>
              <div className="flex items-center gap-2">
                <Wifi size={14} style={{ color: '#ff9a00' }} />
                <span
                  className="text-sm font-bold tracking-widest"
                  style={{ fontFamily: '"Orbitron", monospace', color: '#ff9a00', textShadow: '0 0 8px #ff9a00' }}
                >
                  {formattedData.wifi}
                </span>
              </div>
            </div>

            {/* Last sync */}
            <div className="hud-card p-5">
              <p className="text-[10px] tracking-[0.3em] opacity-50 mb-2" style={{ color: '#00f0ff' }}>LAST SYNC</p>
              <div className="flex items-center gap-2">
                <Clock size={14} style={{ color: '#00f0ff' }} />
                <span className="text-xs tracking-wide opacity-80" style={{ color: '#00f0ff' }}>
                  {formattedData.lastUpdate || 'NEVER'}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── SYSTEM LOG ───────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="hud-card p-5"
        >
          <div className="flex items-center gap-3 mb-4">
            <Shield size={14} style={{ color: '#00f0ff', opacity: 0.6 }} />
            <p className="text-xs tracking-[0.3em] opacity-50" style={{ color: '#00f0ff' }}>SYSTEM_LOG</p>
            <div className="h-px flex-1 opacity-10" style={{ background: '#00f0ff' }} />
            <span className="text-[9px] tracking-widest opacity-30" style={{ color: '#00ff41' }}>● ACTIVE</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              { level: 'INFO', msg: `Data sync interval: ${pollInterval}s` },
              { level: 'INFO', msg: 'GPS accuracy improves in open environments' },
              { level: 'WARN', msg: 'Monitor POWER_LVL — ensure device charging' },
              { level: 'INFO', msg: 'Ensure stable WiFi for continuous tracking' },
              { level: 'INFO', msg: 'AES-256 encryption active on all streams' },
              { level: 'SYS',  msg: 'Backend: gps-bakenc.onrender.com — OK' },
            ].map((log, i) => (
              <p
                key={i}
                className="text-xs font-mono opacity-50 hover:opacity-80 transition-smooth tracking-wide"
                style={{
                  color: log.level === 'WARN' ? '#ff9a00' : log.level === 'SYS' ? '#00ff41' : '#00f0ff',
                }}
              >
                [{log.level}] {log.msg}
              </p>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Dashboard;
