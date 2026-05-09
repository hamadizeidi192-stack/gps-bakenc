import axios from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const LOCATION_ENDPOINT = '/location';

/**
 * Create axios instance with default configuration
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Variables to track when the data actually changes
let previousUpdateStr = null;
let lastChangeTime = Date.now();

/**
 * Fetch GPS location data from the Raspberry Pi backend
 * @returns {Promise<Object>} Location data including GPS coordinates, battery, and status
 * @throws {Error} If the request fails
 */
export const fetchGPSLocation = async () => {
  try {
    const response = await apiClient.get(LOCATION_ENDPOINT);
    
    // Validate response structure
    if (!response.data) {
      throw new Error('Empty response from server');
    }

    // Check if the data is actually fresh
    if (response.data.last_update && response.data.last_update !== previousUpdateStr) {
      previousUpdateStr = response.data.last_update;
      lastChangeTime = Date.now();
    }

    // Consider online if the data has changed within the last 15 seconds
    // and it's not the default "Never" state
    const isActuallyOnline = 
      response.data.last_update !== "Never" && 
      (Date.now() - lastChangeTime) < 15000;

    return {
      ...response.data,
      isOnline: isActuallyOnline,
      error: null,
    };
  } catch (error) {
    console.error('Failed to fetch GPS location:', error);

    // Return offline state with previous data if available
    return {
      isOnline: false,
      error: error.message || 'Failed to connect to device',
      latitude: null,
      longitude: null,
      battery: null,
      wifi: 'Disconnected',
      last_update: null,
    };
  }
};

/**
 * Start polling for GPS location updates
 * @param {Function} callback - Callback function to handle location updates
 * @param {number} interval - Polling interval in milliseconds (default: 5000ms)
 * @returns {number} Interval ID for clearing the interval later
 */
export const startLocationPolling = (callback, interval = 30000) => {
  fetchGPSLocation().then(callback);
  return setInterval(() => {
    fetchGPSLocation().then(callback);
  }, interval);
};

/**
 * Stop polling for GPS location updates
 * @param {number} intervalId - The interval ID returned from startLocationPolling
 */
export const stopLocationPolling = (intervalId) => {
  if (intervalId) {
    clearInterval(intervalId);
  }
};

/**
 * Format location data for display
 * @param {Object} data - Raw location data from API
 * @returns {Object} Formatted location data
 */
export const formatLocationData = (data) => {
  return {
    latitude: data.latitude ? data.latitude.toFixed(6) : 'N/A',
    longitude: data.longitude ? data.longitude.toFixed(6) : 'N/A',
    battery: data.battery ?? 0,
    wifi: data.wifi || 'Unknown',
    lastUpdate: data.last_update || 'Never',
    isOnline: data.isOnline ?? false,
  };
};

export default apiClient;
