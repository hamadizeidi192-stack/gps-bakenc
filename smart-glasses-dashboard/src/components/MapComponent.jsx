import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { motion } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation } from 'lucide-react';

/**
 * Custom HUD-style marker icon
 */
const hudIcon = L.divIcon({
  html: `
    <div style="
      width: 36px; height: 36px;
      position: relative;
      display: flex; align-items: center; justify-content: center;
    ">
      <!-- Rotating ring -->
      <div style="
        position: absolute; inset: 0;
        border: 2px solid #00f0ff;
        border-radius: 50%;
        border-top-color: transparent;
        animation: spin 1.2s linear infinite;
        box-shadow: 0 0 12px #00f0ff;
      "></div>
      <!-- Inner dot -->
      <div style="
        width: 10px; height: 10px;
        background: #00f0ff;
        border-radius: 50%;
        box-shadow: 0 0 12px #00f0ff, 0 0 25px rgba(0, 240, 255, 0.5);
      "></div>
      <!-- Corner brackets -->
      <div style="position: absolute; top: -2px; left: -2px; width: 8px; height: 8px; border-top: 2px solid #ff9a00; border-left: 2px solid #ff9a00;"></div>
      <div style="position: absolute; bottom: -2px; right: -2px; width: 8px; height: 8px; border-bottom: 2px solid #ff9a00; border-right: 2px solid #ff9a00;"></div>
    </div>
    <style>@keyframes spin { to { transform: rotate(360deg); } }</style>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  className: 'hud-marker',
});

/**
 * Map Component - Dark radar style HUD
 */
export const MapComponent = ({ latitude, longitude, isOnline, loading, onCenterMap, mapRef }) => {
  const defaultCenter = [36.8065, 10.1815];
  const center = latitude && longitude ? [latitude, longitude] : defaultCenter;

  useEffect(() => {
    if (mapRef?.current && latitude && longitude) {
      mapRef.current.setView([latitude, longitude], 15);
    }
  }, [latitude, longitude, mapRef]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="mb-4 relative"
      style={{
        border: '1px solid rgba(0, 240, 255, 0.3)',
        boxShadow: '0 0 30px rgba(0, 240, 255, 0.08), inset 0 0 30px rgba(0, 240, 255, 0.03)',
      }}
    >
      {/* Map header bar */}
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{
          background: 'rgba(5, 10, 15, 0.9)',
          borderBottom: '1px solid rgba(0, 240, 255, 0.2)',
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full" style={{ background: '#00ff41', boxShadow: '0 0 6px #00ff41' }} />
          <span className="text-xs tracking-widest opacity-60" style={{ color: '#00f0ff' }}>
            &gt; MAP_STREAM // LIVE
          </span>
        </div>
        {latitude && longitude && (
          <span className="text-xs font-mono opacity-40" style={{ color: '#00f0ff' }}>
            {latitude?.toFixed(4)}°N {longitude?.toFixed(4)}°E
          </span>
        )}
      </div>

      {/* Map */}
      <div className="h-96 md:h-[440px] relative overflow-hidden">
        <MapContainer
          center={center}
          zoom={13}
          className="w-full h-full"
          ref={mapRef}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
          />

          {latitude && longitude && isOnline && (
            <Marker position={[latitude, longitude]} icon={hudIcon}>
              <Popup>
                <div style={{ fontFamily: '"Share Tech Mono", monospace', color: '#00f0ff', background: 'transparent', minWidth: '160px' }}>
                  <p style={{ color: '#ff9a00', marginBottom: '6px', fontWeight: 'bold' }}>📡 TARGET ACQUIRED</p>
                  <p style={{ opacity: 0.7, fontSize: '11px', marginBottom: '2px' }}>LAT: <strong>{latitude.toFixed(6)}</strong></p>
                  <p style={{ opacity: 0.7, fontSize: '11px' }}>LNG: <strong>{longitude.toFixed(6)}</strong></p>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>

        {/* HUD overlay corners */}
        <div className="absolute top-2 left-2 w-6 h-6 pointer-events-none z-[400]"
          style={{ borderTop: '2px solid rgba(0, 240, 255, 0.5)', borderLeft: '2px solid rgba(0, 240, 255, 0.5)' }} />
        <div className="absolute top-2 right-2 w-6 h-6 pointer-events-none z-[400]"
          style={{ borderTop: '2px solid rgba(0, 240, 255, 0.5)', borderRight: '2px solid rgba(0, 240, 255, 0.5)' }} />
        <div className="absolute bottom-2 left-2 w-6 h-6 pointer-events-none z-[400]"
          style={{ borderBottom: '2px solid rgba(0, 240, 255, 0.5)', borderLeft: '2px solid rgba(0, 240, 255, 0.5)' }} />
        <div className="absolute bottom-2 right-2 w-6 h-6 pointer-events-none z-[400]"
          style={{ borderBottom: '2px solid rgba(0, 240, 255, 0.5)', borderRight: '2px solid rgba(0, 240, 255, 0.5)' }} />

        {/* Center map button */}
        <div className="absolute bottom-4 left-4 z-[400]">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCenterMap}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 text-xs tracking-widest disabled:opacity-30"
            style={{
              background: 'rgba(5, 10, 15, 0.9)',
              border: '1px solid rgba(0, 240, 255, 0.4)',
              color: '#00f0ff',
              fontFamily: '"Share Tech Mono", monospace',
            }}
          >
            <Navigation size={12} />
            CENTER
          </motion.button>
        </div>

        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center z-[500]"
            style={{ background: 'rgba(5, 10, 15, 0.75)', backdropFilter: 'blur(4px)' }}
          >
            <div className="text-center">
              <div className="spinner mx-auto mb-3" />
              <p className="text-xs tracking-widest" style={{ color: '#00f0ff' }}>
                ACQUIRING SIGNAL...
              </p>
            </div>
          </div>
        )}

        {/* Offline overlay */}
        {!isOnline && (
          <div className="absolute inset-0 flex items-center justify-center z-[500]"
            style={{ background: 'rgba(5, 10, 15, 0.6)', backdropFilter: 'blur(2px)' }}
          >
            <div
              className="text-center p-6"
              style={{
                border: '1px solid rgba(255, 0, 60, 0.5)',
                background: 'rgba(255, 0, 60, 0.05)',
                boxShadow: '0 0 30px rgba(255, 0, 60, 0.1)',
              }}
            >
              <p className="text-sm font-bold tracking-widest mb-1" style={{ color: '#ff003c', textShadow: '0 0 10px #ff003c', fontFamily: '"Orbitron", monospace' }}>
                SIGNAL LOST
              </p>
              <p className="text-xs tracking-widest opacity-60" style={{ color: '#ff003c' }}>
                // AWAITING DEVICE RECONNECT
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MapComponent;
