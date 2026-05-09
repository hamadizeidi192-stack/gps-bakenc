import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { motion } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation, Focus } from 'lucide-react';

const customMarker = L.divIcon({
  html: `
    <div style="position:relative;width:36px;height:36px;display:flex;align-items:center;justify-content:center">
      <div style="position:absolute;inset:0;background:rgba(59,130,246,0.15);border-radius:50%;animation:ping 2s cubic-bezier(0,0,0.2,1) infinite"></div>
      <div style="position:absolute;width:24px;height:24px;background:rgba(59,130,246,0.3);border-radius:50%;animation:ping 2s cubic-bezier(0,0,0.2,1) 0.5s infinite"></div>
      <div style="width:14px;height:14px;background:#3b82f6;border:3px solid white;border-radius:50%;box-shadow:0 4px 10px rgba(59,130,246,0.5)"></div>
    </div>
    <style>@keyframes ping{75%,100%{transform:scale(2);opacity:0}}</style>
  `,
  iconSize: [36, 36], iconAnchor: [18, 18], className: '',
});

export const MapComponent = ({ latitude, longitude, isOnline, loading, onCenterMap, mapRef }) => {
  const center = latitude && longitude ? [latitude, longitude] : [36.8065, 10.1815];

  useEffect(() => {
    if (mapRef?.current && latitude && longitude) mapRef.current.setView([latitude, longitude], 15);
  }, [latitude, longitude, mapRef]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl mb-6"
      style={{ height: 480 }}
    >
      {/* Floating Header */}
      <div className="absolute top-4 left-4 right-4 z-[400] flex items-center justify-between pointer-events-none">
        <div className="bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-3 pointer-events-auto">
          <div className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-rose-500'}`} />
          <span className="text-xs font-bold text-slate-700">{isOnline ? 'Live Stream' : 'Connection Lost'}</span>
          {latitude && <span className="text-[11px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">{latitude.toFixed(5)}, {longitude.toFixed(5)}</span>}
        </div>

        <button onClick={onCenterMap} disabled={loading || !latitude} className="bg-white hover:bg-slate-50 text-slate-600 p-2.5 rounded-2xl shadow-lg border border-slate-100 transition-all pointer-events-auto active:scale-95 disabled:opacity-50">
          <Focus size={18} />
        </button>
      </div>

      <MapContainer center={center} zoom={13} className="w-full h-full" ref={mapRef} zoomControl={false}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OSM' />
        {latitude && longitude && isOnline && (
          <Marker position={[latitude, longitude]} icon={customMarker}>
            <Popup className="custom-popup">
              <div className="p-1">
                <p className="font-bold text-slate-800 text-sm mb-1">🛰️ Glasses-01</p>
                <div className="space-y-0.5">
                  <p className="text-[11px] text-slate-500">Latitude: <span className="font-bold text-slate-700">{latitude.toFixed(6)}</span></p>
                  <p className="text-[11px] text-slate-500">Longitude: <span className="font-bold text-slate-700">{longitude.toFixed(6)}</span></p>
                </div>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* States */}
      {loading && (
        <div className="absolute inset-0 z-[500] bg-white/40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white px-6 py-4 rounded-3xl shadow-xl flex items-center gap-4 border border-slate-100">
            <div className="w-5 h-5 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-bold text-slate-700">Syncing Satellite Data…</span>
          </div>
        </div>
      )}

      {!isOnline && !loading && (
        <div className="absolute inset-0 z-[500] bg-rose-500/5 backdrop-blur-[2px] flex items-center justify-center">
          <div className="bg-white px-8 py-6 rounded-[2rem] shadow-2xl text-center border border-rose-100 border-b-4 border-b-rose-500">
            <p className="text-lg font-black text-rose-600 mb-1">SIGNAL LOST</p>
            <p className="text-xs font-semibold text-slate-400">Re-establishing connection to device…</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MapComponent;
