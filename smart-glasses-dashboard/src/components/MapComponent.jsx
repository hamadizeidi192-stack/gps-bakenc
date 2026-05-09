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
      className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xl shadow-slate-200/50 mb-6 h-96 md:h-[500px] relative"
    >
      <MapContainer
        center={center}
        zoom={13}
        className="w-full h-full"
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
        />

        {latitude && longitude && isOnline && (
          <Marker position={[latitude, longitude]} icon={glassesIcon}>
            <Popup>
              <div className="text-slate-800 font-semibold p-1">
                <p className="flex items-center gap-1.5 text-base mb-2"><span className="text-indigo-500">📡</span> Smart Glasses</p>
                <p className="text-xs text-slate-500 mb-1">Lat: <span className="text-slate-800 font-bold">{latitude.toFixed(6)}</span></p>
                <p className="text-xs text-slate-500">Lon: <span className="text-slate-800 font-bold">{longitude.toFixed(6)}</span></p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Map controls overlay */}
      <div className="absolute bottom-4 left-4 flex gap-2 z-[400]">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCenterMap}
          className="bg-white p-3 rounded-xl hover:bg-slate-50 transition-smooth flex items-center gap-2 border border-slate-200 shadow-lg text-slate-700 font-semibold"
          disabled={loading}
        >
          <Navigation size={18} className="text-indigo-600" />
          <span className="text-sm hidden sm:inline">Center Map</span>
        </motion.button>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-[500]">
          <div className="text-center bg-white p-6 rounded-2xl shadow-xl border border-slate-100">
            <div className="spinner mb-4 mx-auto" />
            <p className="text-slate-700 font-bold">Connecting to GPS...</p>
          </div>
        </div>
      )}

      {/* Offline state */}
      {!isOnline && (
        <div className="absolute inset-0 bg-rose-50/80 backdrop-blur-sm flex items-center justify-center z-[500] border-2 border-rose-200/50">
          <div className="text-center bg-white p-6 rounded-2xl shadow-xl shadow-rose-100 border border-rose-100">
            <p className="text-rose-600 font-extrabold text-lg mb-1">Device Offline</p>
            <p className="text-sm text-rose-500 font-medium">Waiting for connection...</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MapComponent;
