import React, { useState, useEffect } from 'react';
import { fetchGPSLocation, startLocationPolling, stopLocationPolling } from './services/api';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import NotificationContainer from './components/NotificationSystem';
import Dashboard from './pages/Dashboard';
import './styles/index.css';

const POLL_INTERVAL = 30000; // 30 seconds

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
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleLocationUpdate = (data, isManual = false) => {
    setLocationData(prev => {
      if (data.isOnline && !prev.isOnline) addNotification('Device connected — stream active', 'success');
      else if (!data.isOnline && prev.isOnline) addNotification('Signal lost — device offline', 'error');
      return data;
    });
    setLoading(false);
    if (!isManual) setCountdown(POLL_INTERVAL / 1000); // reset countdown after auto-fetch
  };

  const handleRefresh = async () => {
    setLoading(true);
    setCountdown(POLL_INTERVAL / 1000);
    try {
      const data = await fetchGPSLocation();
      handleLocationUpdate(data, true);
      if (data.isOnline) addNotification('Data stream synchronized', 'success');
      else addNotification('Device not responding', 'error');
    } catch (error) {
      addNotification('Sync failed — connection error', 'error');
      setLoading(false);
    }
  };

  // Main polling effect
  useEffect(() => {
    setLoading(true);
    fetchGPSLocation().then(data => handleLocationUpdate(data));
    addNotification('System initialized — tracking active', 'info');

    const id = startLocationPolling(data => handleLocationUpdate(data), POLL_INTERVAL);
    return () => stopLocationPolling(id);
  }, []);

  // Countdown timer effect
  useEffect(() => {
    const tick = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : POLL_INTERVAL / 1000));
    }, 1000);
    return () => clearInterval(tick);
  }, []);

  return (
    <div style={{ background: '#020810', minHeight: '100vh', position: 'relative' }}>
      {/* Background layers */}
      <div className="hud-grid-bg" />
      <div className="hud-scanlines" />
      <div className="hud-orbs">
        <div className="hud-orb hud-orb-1" />
        <div className="hud-orb hud-orb-2" />
        <div className="hud-orb hud-orb-3" />
      </div>

      {/* Data stream ticker at the very bottom */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 overflow-hidden py-1"
        style={{ borderTop: '1px solid rgba(0,240,255,0.15)', background: 'rgba(2,8,16,0.9)' }}
      >
        <div className="data-stream">
          ░░ GPS_STREAM_ACTIVE &nbsp;▸&nbsp; LAT:{locationData.latitude?.toFixed(6) ?? '---'} &nbsp;▸&nbsp;
          LNG:{locationData.longitude?.toFixed(6) ?? '---'} &nbsp;▸&nbsp;
          PWR:{locationData.battery}% &nbsp;▸&nbsp;
          NET:{locationData.wifi} &nbsp;▸&nbsp;
          STATUS:{locationData.isOnline ? 'ONLINE' : 'OFFLINE'} &nbsp;▸&nbsp;
          NEXT_SYNC:{countdown}s &nbsp;▸&nbsp;
          ENC:AES-256 &nbsp;▸&nbsp; SIG:STRONG &nbsp;▸&nbsp; VER:2.1.0 &nbsp;▸&nbsp;
          ░░ GPS_STREAM_ACTIVE &nbsp;▸&nbsp; LAT:{locationData.latitude?.toFixed(6) ?? '---'} &nbsp;▸&nbsp;
          LNG:{locationData.longitude?.toFixed(6) ?? '---'} &nbsp;▸&nbsp;
          PWR:{locationData.battery}% &nbsp;▸&nbsp;
          NET:{locationData.wifi} &nbsp;▸&nbsp;
          STATUS:{locationData.isOnline ? 'ONLINE' : 'OFFLINE'} &nbsp;▸&nbsp;
          NEXT_SYNC:{countdown}s &nbsp;▸&nbsp;
          ENC:AES-256 &nbsp;▸&nbsp; SIG:STRONG &nbsp;▸&nbsp; VER:2.1.0 &nbsp;░░
        </div>
      </div>

      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} isSidebarOpen={sidebarOpen} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} isOnline={locationData.isOnline} />

      <main className="lg:ml-64 pb-10">
        <Dashboard
          locationData={locationData}
          loading={loading}
          onRefresh={handleRefresh}
          onNotification={addNotification}
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
