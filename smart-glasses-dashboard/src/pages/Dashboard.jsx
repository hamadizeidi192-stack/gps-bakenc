import React, { useState, useEffect, useRef } from 'react';
import { formatLocationData, startLocationPolling, stopLocationPolling } from '../services/api';
import MapComponent from '../components/MapComponent';
import { StatusCardsGrid } from '../components/StatusCard';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

/**
 * Dashboard Page Component
 * Main page displaying GPS tracking and device status
 */
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            Live GPS Tracking
          </h1>
          <p className="text-slate-500 font-medium">
            Real-time location and status monitoring for your smart glasses device
          </p>

          {/* Refresh button */}
          <button
            onClick={onRefresh}
            disabled={loading}
            className="mt-6 flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 disabled:opacity-50 text-white rounded-xl shadow-lg shadow-indigo-500/30 transition-smooth font-semibold"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            Refresh Now
          </button>
        </motion.div>

        {/* Status Cards Grid */}
        <StatusCardsGrid data={formattedData} loading={loading} />

        {/* Map Section */}
        <MapComponent
          latitude={locationData.latitude}
          longitude={locationData.longitude}
          isOnline={isOnline}
          loading={loading}
          onCenterMap={handleCenterMap}
          mapRef={mapRef}
        />

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xl shadow-slate-200/50"
        >
          <h2 className="text-xl font-bold text-slate-800 mb-5">Device Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-slate-500 font-semibold uppercase tracking-wider mb-1.5 text-xs">Connection Status</p>
              <div className="flex items-center gap-2">
                <div className={`w-3.5 h-3.5 rounded-full ${isOnline ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse-slow' : 'bg-rose-500'}`} />
                <span className="font-bold text-slate-700 text-base">
                  {isOnline ? 'Connected' : 'Offline'}
                </span>
              </div>
            </div>
            <div>
              <p className="text-slate-500 font-semibold uppercase tracking-wider mb-1.5 text-xs">Last Sync</p>
              <p className="font-bold text-slate-700 text-base">
                {formattedData.lastUpdate || 'Never'}
              </p>
            </div>
            <div>
              <p className="text-slate-500 font-semibold uppercase tracking-wider mb-1.5 text-xs">Battery Health</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      formattedData.battery > 50
                        ? 'bg-emerald-500'
                        : formattedData.battery > 20
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${formattedData.battery}%` }}
                  />
                </div>
                <span className="text-sm font-extrabold text-slate-700 w-9">
                  {formattedData.battery}%
                </span>
              </div>
            </div>
            <div>
              <p className="text-slate-500 font-semibold uppercase tracking-wider mb-1.5 text-xs">Network</p>
              <p className="font-bold text-slate-700 text-base">
                {formattedData.wifi}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6 bg-indigo-50/80 border border-indigo-100 p-6 rounded-2xl shadow-md"
        >
          <h3 className="text-lg font-bold text-indigo-700 mb-3 flex items-center gap-2">
            <span>💡</span> Quick Tips
          </h3>
          <ul className="text-sm text-indigo-900/70 space-y-2.5 font-medium">
            <li className="flex gap-2"><span>•</span> Updates refresh every 5 seconds automatically</li>
            <li className="flex gap-2"><span>•</span> Ensure your device has stable WiFi connection</li>
            <li className="flex gap-2"><span>•</span> GPS accuracy improves in open environments</li>
            <li className="flex gap-2"><span>•</span> Monitor battery level to avoid unexpected shutdowns</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
