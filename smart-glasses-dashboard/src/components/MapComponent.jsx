import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { motion } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation, Focus } from 'lucide-react';

const customMarker = L.divIcon({
  html: `
    <div style="position:relative;width:36px;height:36px;display:flex;align-items:center;justify-content:center">
      <div style="position:absolute;inset:0;background:rgba(59,130,246,0.2);border-radius:50%;animation:ping 2s cubic-bezier(0,0,0.2,1) infinite"></div>
      <div style="width:14px;height:14px;background:#3b82f6;border:3px solid white;border-radius:50%;box-shadow:0 4px 10px rgba(59,130,246,0.5)"></div>
    </div>
    <style>@keyframes ping{75%,100%{transform:scale(2.5);opacity:0}}</style>
  `,
  iconSize: [36, 36], iconAnchor: [18, 18], className: '',
});

export const MapComponent = ({ latitude, longitude, pathHistory = [], isOnline, loading, onCenterMap, mapRef }) => {
  const center = latitude && longitude ? [latitude, longitude] : [36.8065, 10.1815];

  useEffect(() => {
    if (mapRef?.current && latitude && longitude) mapRef.current.setView([latitude, longitude], 15);
  }, [latitude, longitude, mapRef]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="relative rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl mb-6 bg-slate-100"
      style={{ height: 520 }}
    >
      {/* Floating Header */}
      <div className="absolute top-4 left-4 right-4 z-[400] flex items-center justify-between pointer-events-none">
        <div className="bg-white/90 backdrop-blur-md px-5 py-3 rounded-2xl shadow-xl border border-white/50 flex items-center gap-4 pointer-events-auto">
          <div className="relative">
            <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-rose-500'}`} />
            {isOnline && <div className="absolute inset-0 w-3 h-3 rounded-full bg-emerald-500 animate-ping" />}
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 leading-none mb-1">Status</p>
            <p className="text-xs font-bold text-slate-800 leading-none">{isOnline ? 'Active Link' : 'Searching Signal...'}</p>
          </div>
          <div className="h-6 w-px bg-slate-200 mx-1" />
          {latitude && (
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 leading-none mb-1">Coordinates</p>
              <p className="text-xs font-bold text-slate-800 leading-none font-mono">{latitude.toFixed(4)}°, {longitude.toFixed(4)}°</p>
            </div>
          )}
        </div>

        <div className="flex gap-2 pointer-events-auto">
          <button onClick={onCenterMap} disabled={loading || !latitude} className="bg-white hover:bg-blue-50 hover:text-blue-600 text-slate-600 p-3 rounded-2xl shadow-xl border border-white transition-all active:scale-90 disabled:opacity-50 group">
            <Focus size={20} className="group-hover:rotate-90 transition-transform" />
          </button>
        </div>
      </div>

      <MapContainer center={center} zoom={13} className="w-full h-full" ref={mapRef} zoomControl={false}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OSM' />
        
        {/* Path trail */}
        {pathHistory.length > 1 && isOnline && (
          <Polyline
            positions={pathHistory}
            pathOptions={{
              color: '#3b82f6',
              weight: 4,
              opacity: 0.6,
              dashArray: '1, 10',
              lineCap: 'round',
            }}
          />
        )}

        {latitude && longitude && isOnline && (
          <Marker position={[latitude, longitude]} icon={customMarker}>
            <Popup className="custom-popup">
              <div className="p-1">
                <p className="font-bold text-slate-800 text-sm mb-1">🛰️ Active Device</p>
                <div className="space-y-0.5">
                  <p className="text-[11px] text-slate-500">Last seen: <span className="font-bold text-slate-700">Just now</span></p>
                  <p className="text-[11px] text-slate-500">History: <span className="font-bold text-slate-700">{pathHistory.length} pts</span></p>
                </div>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Overlay: Animated Scanning effect */}
      {loading && (
        <div className="absolute inset-0 z-[500] bg-blue-500/5 backdrop-blur-[2px] pointer-events-none">
          <motion.div
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            className="absolute left-0 right-0 h-1 bg-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.5)]"
          />
        </div>
      )}

      {/* States */}
      {!isOnline && !loading && (
        <div className="absolute inset-0 z-[500] bg-slate-900/40 backdrop-blur-md flex items-center justify-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white px-10 py-8 rounded-[3rem] shadow-2xl text-center border-b-8 border-rose-500">
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity size={32} className="text-rose-500" />
            </div>
            <p className="text-2xl font-black text-slate-900 mb-1 tracking-tight">SIGNAL DROPPED</p>
            <p className="text-sm font-semibold text-slate-400">Searching for encrypted beacon...</p>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default MapComponent;
