import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { motion } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation, Maximize2 } from 'lucide-react';

const markerIcon = L.divIcon({
  html: `
    <div style="position:relative;width:32px;height:32px;display:flex;align-items:center;justify-content:center">
      <div style="
        position:absolute;width:32px;height:32px;border-radius:50%;
        border:2px solid rgba(167,139,250,0.5);
        animation:markerPing 2s ease-out infinite;
      "></div>
      <div style="
        position:absolute;width:20px;height:20px;border-radius:50%;
        border:2px solid #a78bfa;
        animation:markerPing 2s ease-out 0.6s infinite;
      "></div>
      <div style="
        width:10px;height:10px;border-radius:50%;
        background:#a78bfa;
        box-shadow:0 0 12px rgba(167,139,250,0.8),0 0 24px rgba(167,139,250,0.4);
      "></div>
    </div>
    <style>
      @keyframes markerPing {
        0%   { transform:scale(0.5); opacity:0.8; }
        100% { transform:scale(2.5); opacity:0; }
      }
    </style>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  className: '',
});

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
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="relative rounded-2xl overflow-hidden mb-4"
      style={{
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
        height: '440px',
      }}
    >
      {/* Header bar */}
      <div
        className="absolute top-0 left-0 right-0 z-[400] flex items-center justify-between px-4 py-3"
        style={{
          background: 'linear-gradient(to bottom, rgba(8,12,20,0.95), transparent)',
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{
              background: isOnline ? '#34d399' : '#f87171',
              boxShadow: isOnline ? '0 0 8px #34d399' : '0 0 8px #f87171',
            }}
          />
          <span className="text-xs font-semibold text-white/60">
            {isOnline ? 'Live Tracking' : 'Device Offline'}
          </span>
          {latitude && longitude && (
            <span className="text-[10px] font-mono text-white/30 ml-2">
              {latitude.toFixed(5)}, {longitude.toFixed(5)}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={onCenterMap}
            disabled={loading || !latitude}
            className="btn-ghost text-xs py-1.5 px-3 disabled:opacity-30"
          >
            <Navigation size={12} />
            Center
          </button>
        </div>
      </div>

      {/* Map */}
      <MapContainer
        center={center}
        zoom={13}
        className="w-full h-full"
        ref={mapRef}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_matter_no_labels/{z}/{x}/{y}{r}.png"
          attribution='&copy; CartoDB'
        />
        {latitude && longitude && isOnline && (
          <Marker position={[latitude, longitude]} icon={markerIcon}>
            <Popup>
              <div className="space-y-1">
                <p className="font-semibold text-white/90">📡 Smart Glasses</p>
                <p className="text-white/50">Lat: <strong className="text-white/80">{latitude.toFixed(6)}</strong></p>
                <p className="text-white/50">Lng: <strong className="text-white/80">{longitude.toFixed(6)}</strong></p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Loading overlay */}
      {loading && (
        <div
          className="absolute inset-0 z-[500] flex flex-col items-center justify-center gap-3"
          style={{ background: 'rgba(8,12,20,0.8)', backdropFilter: 'blur(6px)' }}
        >
          <div className="spinner" style={{ width: 28, height: 28, borderTopColor: '#a78bfa' }} />
          <p className="text-sm text-white/50">Acquiring signal…</p>
        </div>
      )}

      {/* Offline overlay */}
      {!isOnline && !loading && (
        <div
          className="absolute inset-0 z-[500] flex flex-col items-center justify-center gap-3"
          style={{ background: 'rgba(8,12,20,0.55)', backdropFilter: 'blur(4px)' }}
        >
          <div
            className="px-6 py-5 rounded-2xl text-center"
            style={{
              background: 'rgba(248,113,113,0.08)',
              border: '1px solid rgba(248,113,113,0.2)',
            }}
          >
            <p className="text-base font-bold text-red-400 mb-1">Device Offline</p>
            <p className="text-xs text-white/40">Waiting for device to reconnect…</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MapComponent;
