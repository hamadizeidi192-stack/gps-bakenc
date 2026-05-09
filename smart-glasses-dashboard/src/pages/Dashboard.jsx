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
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Live GPS Tracking
          </h1>
          <p className="text-gray-400">
            Real-time location and status monitoring for your smart glasses device
          </p>

          {/* Refresh button */}
          <button
            onClick={onRefresh}
            disabled={loading}
            className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-smooth font-medium"
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
          className="glass-effect p-6 rounded-xl border-2 border-dark-700"
        >
          <h2 className="text-xl font-bold text-white mb-4">Device Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400 mb-1">Connection Status</p>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500 animate-pulse-slow' : 'bg-red-500'}`} />
                <span className="font-medium text-gray-200">
                  {isOnline ? 'Connected' : 'Offline'}
                </span>
              </div>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Last Sync</p>
              <p className="font-medium text-gray-200">
                {formattedData.lastUpdate || 'Never'}
              </p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Battery Health</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-dark-700 rounded-full h-2">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      formattedData.battery > 50
                        ? 'bg-green-500'
                        : formattedData.battery > 20
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${formattedData.battery}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-300 w-8">
                  {formattedData.battery}%
                </span>
              </div>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Network</p>
              <p className="font-medium text-gray-200">
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
          className="mt-6 glass-effect p-6 rounded-xl border-2 border-blue-500/30 bg-blue-500/5"
        >
          <h3 className="text-lg font-bold text-blue-400 mb-2">💡 Tips</h3>
          <ul className="text-sm text-gray-300 space-y-2">
            <li>• Updates refresh every 5 seconds automatically</li>
            <li>• Ensure your device has stable WiFi connection</li>
            <li>• GPS accuracy improves in open environments</li>
            <li>• Monitor battery level to avoid unexpected shutdowns</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
