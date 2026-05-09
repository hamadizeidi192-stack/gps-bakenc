import React, { useState, useEffect } from 'react';
import { fetchGPSLocation, startLocationPolling, stopLocationPolling } from './services/api';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import NotificationContainer, { useNotification } from './components/NotificationSystem';
import Dashboard from './pages/Dashboard';
import './styles/index.css';

/**
 * Root App Component
 * Manages application state and API integration
 */
function App() {
  // State management
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [locationData, setLocationData] = useState({
    latitude: null,
    longitude: null,
    battery: 0,
    wifi: 'Unknown',
    last_update: null,
    isOnline: false,
    error: null,
  });
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [pollingId, setPollingId] = useState(null);

  /**
   * Add notification to the list
   */
  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    const notification = { id, message, type };
    setNotifications((prev) => [...prev, notification]);
  };

  /**
   * Remove notification from the list
   */
  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  /**
   * Handle location data update
   */
  const handleLocationUpdate = (data) => {
    setLocationData(data);
    setLoading(false);

    // Show notification on status change
    if (data.isOnline && locationData.isOnline === false) {
      addNotification('Device connected successfully!', 'success');
    } else if (!data.isOnline && locationData.isOnline === true) {
      addNotification('Lost connection to device', 'error');
    }
  };

  /**
   * Manual refresh handler
   */
  const handleRefresh = async () => {
    setLoading(true);
    try {
      const data = await fetchGPSLocation();
      handleLocationUpdate(data);
      if (data.isOnline) {
        addNotification('Location updated successfully', 'success');
      }
    } catch (error) {
      addNotification('Failed to refresh location data', 'error');
      console.error('Refresh error:', error);
    }
  };

  /**
   * Initialize polling on mount
   */
  useEffect(() => {
    // Fetch initial data
    setLoading(true);
    fetchGPSLocation().then(handleLocationUpdate);

    // Start polling
    const id = startLocationPolling(handleLocationUpdate, 5000);
    setPollingId(id);

    // Show initial message
    addNotification('Dashboard loaded - tracking active', 'info');

    // Cleanup on unmount
    return () => {
      if (id) {
        stopLocationPolling(id);
      }
    };
  }, []);

  /**
   * Handle sidebar toggle on mobile
   */
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div style={{ background: '#050a0f', minHeight: '100vh' }}>
      {/* Navigation */}
      <Navbar onMenuToggle={toggleSidebar} isSidebarOpen={sidebarOpen} />

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} isOnline={locationData.isOnline} />

      {/* Main content */}
      <main className="lg:ml-64">
        <Dashboard
          locationData={locationData}
          loading={loading}
          onRefresh={handleRefresh}
          onNotification={addNotification}
          isOnline={locationData.isOnline}
        />
      </main>

      {/* Notifications */}
      <NotificationContainer notifications={notifications} onClose={removeNotification} />
    </div>
  );
}

export default App;
