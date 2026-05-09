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
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [countdown, setCountdown] = useState(POLL_INTERVAL / 1000);

  const addNotification = (message, type = 'info') =>
    setNotifications(prev => [...prev, { id: Date.now(), message, type }]);
  const removeNotification = id =>
    setNotifications(prev => prev.filter(n => n.id !== id));

  const handleLocationUpdate = (data) => {
    setLocationData(data);
    setLoading(false);
    setCountdown(POLL_INTERVAL / 1000);
  };

  const handleRefresh = async () => {
    setLoading(true);
    setCountdown(POLL_INTERVAL / 1000);
    try {
      const data = await fetchGPSLocation();
      handleLocationUpdate(data);
      addNotification('Data synced', 'success');
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

  // Ticker items
  const items = [
    `LAT ${locationData.latitude?.toFixed(5) ?? '—'}`,
    `LNG ${locationData.longitude?.toFixed(5) ?? '—'}`,
    `BATT ${locationData.battery}%`,
    `NET ${locationData.wifi}`,
    `${locationData.isOnline ? 'ONLINE' : 'OFFLINE'}`,
    `SYNC ${countdown}s`,
  ];
  const ticker = [...items, ...items, ...items].join('   ·   ');

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      <div className="bg-ambient" />

      {/* Ticker */}
      <div className="fixed bottom-0 left-0 right-0 z-50 ticker-track py-1.5"
        style={{ background: 'rgba(10,10,10,0.95)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="ticker-content">{ticker}</div>
      </div>

      <Navbar onMenuToggle={() => setSidebarOpen(o => !o)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} isOnline={locationData.isOnline} />

      <main className="lg:ml-52">
        <Dashboard
          locationData={locationData}
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
