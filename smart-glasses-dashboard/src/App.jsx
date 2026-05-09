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

  const addNotification = (message, type = 'info') => {
    setNotifications(prev => [...prev, { id: Date.now(), message, type }]);
  };
  const removeNotification = id => setNotifications(prev => prev.filter(n => n.id !== id));

  const handleLocationUpdate = (data) => {
    setLocationData(prev => {
      if (data.isOnline && !prev.isOnline) addNotification('Device connected — streaming live', 'success');
      else if (!data.isOnline && prev.isOnline) addNotification('Device went offline', 'error');
      return data;
    });
    setLoading(false);
    setCountdown(POLL_INTERVAL / 1000);
  };

  const handleRefresh = async () => {
    setLoading(true);
    setCountdown(POLL_INTERVAL / 1000);
    try {
      const data = await fetchGPSLocation();
      handleLocationUpdate(data);
      if (data.isOnline) addNotification('Data synced successfully', 'success');
      else addNotification('Device not responding', 'error');
    } catch {
      addNotification('Sync failed — connection error', 'error');
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchGPSLocation().then(handleLocationUpdate);
    addNotification('Dashboard ready', 'info');
    const id = startLocationPolling(handleLocationUpdate, POLL_INTERVAL);
    return () => stopLocationPolling(id);
  }, []);

  // Countdown tick
  useEffect(() => {
    const tick = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : POLL_INTERVAL / 1000));
    }, 1000);
    return () => clearInterval(tick);
  }, []);

  // Ticker data
  const tickerItems = [
    `LAT ${locationData.latitude?.toFixed(5) ?? '—'}`,
    `LNG ${locationData.longitude?.toFixed(5) ?? '—'}`,
    `BATT ${locationData.battery}%`,
    `NET ${locationData.wifi}`,
    `STATUS ${locationData.isOnline ? 'ONLINE' : 'OFFLINE'}`,
    `SYNC IN ${countdown}s`,
  ];
  const tickerStr = [...tickerItems, ...tickerItems].join('   ·   ');

  return (
    <div style={{ background: '#080c14', minHeight: '100vh', position: 'relative' }}>
      {/* Gradient mesh background */}
      <div className="bg-mesh" />

      {/* Bottom ticker */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 ticker-track py-1.5"
        style={{ background: 'rgba(8,12,20,0.92)', borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="ticker-content">{tickerStr}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{tickerStr}</div>
      </div>

      <Navbar onMenuToggle={() => setSidebarOpen(o => !o)} isSidebarOpen={sidebarOpen} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} isOnline={locationData.isOnline} />

      <main className="lg:ml-56">
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
