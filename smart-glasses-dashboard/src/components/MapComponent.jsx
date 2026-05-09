import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { motion } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Zap, Navigation } from 'lucide-react';

/**
 * Create custom marker icon for glasses
 */
const glassesIcon = L.divIcon({
  html: `
    <div class="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-full border-4 border-blue-300 shadow-lg animate-pulse">
      <span class="text-lg">📡</span>
    </div>
  `,
  iconSize: [40, 40],
  className: 'glasses-marker',
});

/**
 * Map Component
 * Displays live GPS location with Leaflet/OpenStreetMap
 */
export const MapComponent = ({ 
  latitude, 
  longitude, 
  isOnline, 
  loading,
  onCenterMap,
  mapRef 
}) => {
  const defaultCenter = [36.8065, 10.1815]; // Default location (Tunis)
  const center = latitude && longitude ? [latitude, longitude] : defaultCenter;

  useEffect(() => {
    if (mapRef?.current && latitude && longitude) {
      mapRef.current.setView([latitude, longitude], 15);
    }
  }, [latitude, longitude, mapRef]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="glass-effect-lighter rounded-xl overflow-hidden border-2 border-dark-700 mb-6 h-96 md:h-[500px] relative"
    >
      <MapContainer
        center={center}
        zoom={13}
        className="w-full h-full"
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
          className="grayscale"
        />

        {latitude && longitude && isOnline && (
          <Marker position={[latitude, longitude]} icon={glassesIcon}>
            <Popup>
              <div className="text-dark-900 font-semibold">
                <p>📡 Smart Glasses Location</p>
                <p className="text-sm">Lat: {latitude.toFixed(6)}</p>
                <p className="text-sm">Lon: {longitude.toFixed(6)}</p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Map controls overlay */}
      <div className="absolute bottom-4 left-4 flex gap-2 z-10">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onCenterMap}
          className="glass-effect p-3 rounded-lg hover:bg-glass-lighter transition-smooth flex items-center gap-2"
          disabled={loading}
        >
          <Navigation size={18} className="text-blue-400" />
          <span className="text-sm hidden sm:inline">Center</span>
        </motion.button>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="absolute inset-0 bg-dark-900/50 flex items-center justify-center rounded-lg">
          <div className="text-center">
            <div className="spinner mb-3 mx-auto" />
            <p className="text-gray-300 text-sm">Updating location...</p>
          </div>
        </div>
      )}

      {/* Offline state */}
      {!isOnline && (
        <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center rounded-lg border-2 border-red-500/50">
          <div className="text-center">
            <p className="text-red-300 font-semibold">Device Offline</p>
            <p className="text-xs text-red-300/80">Waiting for connection...</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MapComponent;
