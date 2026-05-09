import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { motion } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation } from 'lucide-react';

const markerIcon = L.divIcon({
  html: `
    <div style="position:relative;width:28px;height:28px;display:flex;align-items:center;justify-content:center">
      <div style="position:absolute;inset:0;border-radius:50%;border:2px solid rgba(249,115,22,0.4);animation:ping1 2s ease-out infinite;"></div>
      <div style="position:absolute;width:18px;height:18px;border-radius:50%;border:2px solid rgba(249,115,22,0.6);animation:ping1 2s ease-out 0.5s infinite;"></div>
      <div style="width:8px;height:8px;border-radius:50%;background:#f97316;box-shadow:0 0 10px rgba(249,115,22,0.8),0 0 20px rgba(249,115,22,0.4);"></div>
    </div>
    <style>@keyframes ping1{0%{transform:scale(0.6);opacity:0.8}100%{transform:scale(2.4);opacity:0}}</style>
  `,
  iconSize: [28, 28], iconAnchor: [14, 14], className: '',
});

export const MapComponent = ({ latitude, longitude, isOnline, loading, onCenterMap, mapRef }) => {
  const center = latitude && longitude ? [latitude, longitude] : [36.8065, 10.1815];

  useEffect(() => {
    if (mapRef?.current && latitude && longitude) mapRef.current.setView([latitude, longitude], 15);
  }, [latitude, longitude, mapRef]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
      className="relative rounded-xl overflow-hidden mb-4"
      style={{ border: '1px solid rgba(255,255,255,0.07)', height: 420 }}
    >
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-[400] flex items-center justify-between px-4 py-2.5"
        style={{ background: 'linear-gradient(to bottom, rgba(10,10,10,0.95) 60%, transparent)' }}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: isOnline ? '#22c55e' : '#ef4444', boxShadow: isOnline ? '0 0 6px #22c55e' : 'none' }} />
          <span className="text-xs font-semibold text-white/50">{isOnline ? 'Live' : 'Offline'}</span>
          {latitude && longitude && (
            <span className="text-[10px] font-mono text-white/25 ml-1">{latitude.toFixed(5)}, {longitude.toFixed(5)}</span>
          )}
        </div>
        <button onClick={onCenterMap} disabled={loading || !latitude} className="btn-ghost py-1 px-2.5 text-xs disabled:opacity-30">
          <Navigation size={11} /> Center
        </button>
      </div>

      <MapContainer center={center} zoom={13} className="w-full h-full" ref={mapRef} zoomControl={false}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_matter_no_labels/{z}/{x}/{y}{r}.png" attribution='© CartoDB' />
        {latitude && longitude && isOnline && (
          <Marker position={[latitude, longitude]} icon={markerIcon}>
            <Popup>
              <div className="space-y-1.5">
                <p className="font-semibold text-white/90">📡 Smart Glasses</p>
                <p className="text-white/45 text-xs">Lat: <strong className="text-white/75">{latitude.toFixed(6)}</strong></p>
                <p className="text-white/45 text-xs">Lng: <strong className="text-white/75">{longitude.toFixed(6)}</strong></p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {loading && (
        <div className="absolute inset-0 z-[500] flex flex-col items-center justify-center gap-2.5"
          style={{ background: 'rgba(10,10,10,0.75)', backdropFilter: 'blur(6px)' }}>
          <div className="spinner" style={{ width: 26, height: 26, borderTopColor: '#f97316' }} />
          <p className="text-sm text-white/40">Acquiring signal…</p>
        </div>
      )}

      {!isOnline && !loading && (
        <div className="absolute inset-0 z-[500] flex items-center justify-center"
          style={{ background: 'rgba(10,10,10,0.5)', backdropFilter: 'blur(4px)' }}>
          <div className="px-6 py-4 rounded-xl text-center"
            style={{ background: '#161616', border: '1px solid rgba(239,68,68,0.2)' }}>
            <p className="text-sm font-bold text-red-400 mb-1">Device Offline</p>
            <p className="text-xs text-white/35">Waiting for reconnect…</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MapComponent;
