import React, { useState, useEffect } from 'react';
import { fetchGPSLocation, startLocationPolling, stopLocationPolling } from './services/api';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import NotificationContainer from './components/NotificationSystem';
import Dashboard from './pages/Dashboard';
import './styles/index.css';

const POLL_INTERVAL = 30000;

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [locationData, setLocationData] = useState({
    latitude: null, longitude: null,
    battery: 0, wifi: 'Unknown',
    last_update: null, isOnline: false, error: null,
  });
  const [pathHistory, setPathHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [countdown, setCountdown] = useState(POLL_INTERVAL / 1000);

  const addNotification = (message, type = 'info') =>
    setNotifications(prev => [...prev, { id: Date.now(), message, type }]);
  const removeNotification = id =>
    setNotifications(prev => prev.filter(n => n.id !== id));

  const handleLocationUpdate = (data) => {
    setLocationData(data);
    if (data.latitude && data.longitude && data.isOnline) {
      setPathHistory(prev => {
        const last = prev[prev.length - 1];
        // Only add if coordinate changed significantly to avoid duplicates
        if (!last || last[0] !== data.latitude || last[1] !== data.longitude) {
          return [...prev.slice(-19), [data.latitude, data.longitude]];
        }
        return prev;
      });
    }
    setLoading(false);
    setCountdown(POLL_INTERVAL / 1000);
  };

  const handleRefresh = async () => {
    setLoading(true);
    setCountdown(POLL_INTERVAL / 1000);
    try {
      const data = await fetchGPSLocation();
      handleLocationUpdate(data);
      addNotification('Data synchronized', 'success');
    } catch {
      addNotification('Sync failed', 'error');
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchGPSLocation().then(handleLocationUpdate);
    const id = startLocationPolling(handleLocationUpdate, POLL_INTERVAL);
    return () => stopLocationPolling(id);
  }, []);

  useEffect(() => {
    const tick = setInterval(() =>
      setCountdown(p => p > 0 ? p - 1 : POLL_INTERVAL / 1000), 1000);
    return () => clearInterval(tick);
  }, []);

  const items = [
    `LAT ${locationData.latitude?.toFixed(5) ?? '—'}`,
    `LNG ${locationData.longitude?.toFixed(5) ?? '—'}`,
    `POWER ${locationData.battery}%`,
    `SIGNAL ${locationData.isOnline ? 'ONLINE' : 'OFFLINE'}`,
    `NEXT SYNC ${countdown}s`,
  ];
  const tickerStr = [...items, ...items, ...items].join('   ·   ');

  return (
    <div className="min-h-screen relative selection:bg-blue-100 selection:text-blue-700">
      {/* Premium Background */}
      <div className="bg-dots" />
      <div className="bg-blob blob-1" />
      <div className="bg-blob blob-2" />

      {/* Bottom Ticker */}
      <div className="fixed bottom-0 left-0 right-0 z-50 ticker-track">
        <div className="ticker-content">{tickerStr}</div>
      </div>

      <Navbar onMenuToggle={() => setSidebarOpen(o => !o)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} isOnline={locationData.isOnline} />

      <main className="lg:ml-64 pt-6">
        <Dashboard
          locationData={locationData}
          pathHistory={pathHistory}
          loading={loading}
          onRefresh={handleRefresh}
          isOnline={locationData.isOnline}
          countdown={countdown}
          pollInterval={POLL_INTERVAL / 1000}
        />
      </main>

      <NotificationContainer notifications={notifications} onClose={removeNotification} />
    </div>
  );
}

export default App;
