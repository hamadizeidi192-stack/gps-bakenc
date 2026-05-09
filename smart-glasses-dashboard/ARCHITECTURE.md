# Architecture Guide

Comprehensive documentation of the Smart Glasses GPS Dashboard architecture.

## Overview

The Smart Glasses GPS Dashboard is a modern React frontend that connects to a FastAPI backend to display real-time GPS tracking data from a Raspberry Pi-connected smart glasses device.

### Core Technologies

- **Frontend Framework**: React 18 with functional components and hooks
- **Styling**: Tailwind CSS with custom dark mode theme
- **Maps**: Leaflet + React-Leaflet + OpenStreetMap
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **Development Server**: Vite dev server

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Navbar.jsx       # Top navigation bar
│   ├── Sidebar.jsx      # Side navigation menu
│   ├── StatusCard.jsx   # Status metric displays
│   ├── MapComponent.jsx # GPS map with Leaflet
│   ├── NotificationSystem.jsx # Toast notifications
│   └── index.js         # Component exports
├── pages/               # Page-level components
│   └── Dashboard.jsx    # Main dashboard layout
├── services/            # Business logic & API
│   └── api.js          # API client with polling
├── styles/              # Global styling
│   └── index.css       # Tailwind + custom CSS
├── App.jsx             # Root component
└── main.jsx            # Entry point

public/                 # Static assets
index.html              # HTML template
```

## Component Hierarchy

```
App (State Management)
├── Navbar (UI)
│   └── Settings & Help buttons
├── Sidebar (Navigation)
│   ├── Menu items
│   └── Device status
└── Dashboard (Main Content)
    ├── Header
    ├── StatusCardsGrid
    │   ├── StatusCard (Latitude)
    │   ├── StatusCard (Longitude)
    │   ├── StatusCard (Battery)
    │   ├── StatusCard (WiFi)
    │   ├── StatusCard (Last Update)
    │   └── StatusCard (Connection Status)
    ├── MapComponent (Leaflet Map)
    │   ├── TileLayer (OpenStreetMap)
    │   ├── Marker (GPS Position)
    │   └── Controls
    └── Info Section

NotificationContainer (Overlay)
├── Notification (Error)
├── Notification (Success)
└── Notification (Info)
```

## Data Flow

```
┌─────────────────────────────────────────┐
│        FastAPI Backend                   │
│   /location endpoint                     │
└──────────────────┬──────────────────────┘
                   │
                   ▼ GET /location
┌─────────────────────────────────────────┐
│      API Service (api.js)                │
│  • fetchGPSLocation()                    │
│  • startLocationPolling()                │
│  • formatLocationData()                  │
└──────────────────┬──────────────────────┘
                   │
                   ▼ Polling every 5s
┌─────────────────────────────────────────┐
│     App Component (State)                │
│  • locationData state                    │
│  • notifications state                   │
│  • sidebarOpen state                     │
└──────────────────┬──────────────────────┘
                   │
        ┌──────────┼──────────┐
        ▼          ▼          ▼
   ┌────────┐ ┌────────┐ ┌──────────┐
   │ Navbar │ │Sidebar │ │ Dashboard│
   └────────┘ └────────┘ └──┬───────┘
                             │
                    ┌────────┼────────┐
                    ▼        ▼        ▼
              ┌─────────┐ ┌──────┐ ┌────┐
              │ Navbar  │ │Cards │ │Map │
              └─────────┘ └──────┘ └────┘
```

## State Management

### App State

```javascript
{
  sidebarOpen: boolean,        // Mobile sidebar visibility
  locationData: {
    latitude: number,          // GPS latitude
    longitude: number,         // GPS longitude
    battery: number,           // Battery percentage
    wifi: string,              // WiFi status
    last_update: string,       // Last update timestamp
    isOnline: boolean,         // Connection status
    error: string | null       // Error message
  },
  loading: boolean,            // Loading state
  notifications: [             // Toast notifications
    { id, message, type }
  ],
  pollingId: number            // Interval ID for cleanup
}
```

### State Flow

1. **App Mount**: Initialize polling
2. **Polling**: Every 5 seconds, fetch location
3. **API Response**: Update `locationData` state
4. **Status Change**: Show notification
5. **Component Render**: Pass state to children

## API Integration

### API Client (api.js)

**Axios Instance**
```javascript
const apiClient = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});
```

**Endpoints**
```javascript
GET /location
// Response
{
  latitude: number,
  longitude: number,
  battery: number,
  wifi: string,
  last_update: string
}
```

**Key Functions**
- `fetchGPSLocation()` - Single API call
- `startLocationPolling(callback, interval)` - Start polling
- `stopLocationPolling(intervalId)` - Stop polling
- `formatLocationData(data)` - Format for display

## Component Details

### Navbar
- **Props**: `onMenuToggle`, `isSidebarOpen`
- **Features**: Logo, title, settings button
- **Animations**: Slide in from top
- **Responsive**: Hamburger menu on mobile

### Sidebar
- **Props**: `isOpen`, `onClose`, `isOnline`
- **Features**: Navigation, device status
- **Animations**: Slide from left
- **Mobile**: Full-screen overlay

### StatusCard
- **Props**: `icon`, `label`, `value`, `unit`, `status`, `loading`
- **Status Colors**: normal, warning, error, success
- **Features**: Hover effects, loading spinner
- **Animations**: Slide up on mount

### MapComponent
- **Props**: `latitude`, `longitude`, `isOnline`, `loading`, `onCenterMap`, `mapRef`
- **Libraries**: Leaflet, React-Leaflet, OpenStreetMap
- **Features**: Custom markers, zoom, panning
- **States**: Loading, offline, normal

### NotificationSystem
- **Type**: Toast notifications
- **Duration**: 4 seconds auto-dismiss
- **Types**: error, success, info
- **Animations**: Slide in/out

### Dashboard
- **Props**: `locationData`, `loading`, `onRefresh`, `onNotification`, `isOnline`
- **Sections**: Header, status cards, map, info
- **Features**: Refresh button, tips section
- **Responsive**: Grid layout adapts to screen

## Styling System

### Tailwind Configuration

**Dark Theme**
```javascript
colors: {
  dark: {
    50: '#f9fafb',
    ...
    950: '#030712'
  },
  glass: {
    light: 'rgba(255, 255, 255, 0.1)',
    lighter: 'rgba(255, 255, 255, 0.15)'
  }
}
```

**Custom Utilities**
```css
.glass-effect       /* Semi-transparent card */
.glass-effect-lighter /* More transparent card */
.transition-smooth  /* Smooth transitions */
.status-indicator   /* Status display */
.card-hover         /* Hover effects */
.btn-primary        /* Primary button */
.btn-secondary      /* Secondary button */
```

**Animations**
```css
@keyframes float      /* Up/down floating */
@keyframes glow       /* Glow effect */
animate-pulse-slow    /* Slower pulse */
```

## Performance Optimization

### Code Splitting
```javascript
// Lazy load components
const Dashboard = lazy(() => import('./pages/Dashboard'));
const MapComponent = lazy(() => import('./components/MapComponent'));
```

### Memoization
```javascript
const StatusCard = memo(({ icon, label, value }) => (
  // Component render
), (prevProps, nextProps) => {
  // Custom comparison
  return prevProps.value === nextProps.value;
});
```

### Polling Optimization
- Cleanup interval on unmount
- Avoid state updates if unmounted
- Batch notifications

### Bundle Size
- Tree shaking enabled
- CSS purging in production
- Code minification

## Error Handling

### API Errors
```javascript
try {
  const data = await fetchGPSLocation();
} catch (error) {
  return {
    isOnline: false,
    error: error.message,
    latitude: null
  };
}
```

### Network Timeout
- Automatic retry (configurable)
- Fallback to offline state
- Show error notification

### Component Errors
```javascript
// Error boundary pattern
if (!locationData) return <Loading />;
if (locationData.error) return <Error message={...} />;
return <Content />;
```

## Responsive Design

### Breakpoints (Tailwind)
```
sm: 640px   - Small phones
md: 768px   - Tablets
lg: 1024px  - Desktops
xl: 1280px  - Large screens
```

### Layout Adaptation
```
Mobile (<640px)
├── Single column
├── Hamburger menu
└── Full-width cards

Tablet (640px-1024px)
├── 2-column grid
├── Collapsible sidebar
└── Medium cards

Desktop (>1024px)
├── 3-column grid
├── Fixed sidebar
└── Optimized spacing
```

## Security Considerations

### Input Validation
- Validate API responses
- Sanitize displayed data
- Check coordinates range

### CORS
```javascript
// Backend should allow frontend origin
CORS origins: ['http://localhost:3000']
```

### Data Privacy
- No sensitive data in localStorage
- HTTPS required in production
- Implement authentication

### XSS Prevention
- React auto-escapes content
- Sanitize user inputs
- Avoid `dangerouslySetInnerHTML`

## Deployment Architecture

```
┌─────────────────────────┐
│   Development           │
│  localhost:3000         │
│  localhost:8000 (API)   │
└─────────────────────────┘
            │
            ▼
┌─────────────────────────┐
│   Build (npm run build) │
│   Generates dist/       │
└─────────────────────────┘
            │
            ▼
┌─────────────────────────┐
│   Production Hosting    │
│   • Vercel              │
│   • Netlify             │
│   • Self-hosted         │
└─────────────────────────┘
            │
            ▼ HTTPS
┌─────────────────────────┐
│   FastAPI Backend       │
│   Raspberry Pi 4        │
│   Production API        │
└─────────────────────────┘
```

## Future Enhancements

### Planned Features
- [ ] WebSocket real-time updates
- [ ] Historical tracking with timeline
- [ ] Geofencing alerts
- [ ] Multi-device support
- [ ] User authentication
- [ ] Analytics dashboard
- [ ] Export location data
- [ ] Offline mode with sync

### Performance Improvements
- [ ] Service Worker caching
- [ ] IndexedDB for offline data
- [ ] Image optimization
- [ ] Code splitting by route

### UI/UX Enhancements
- [ ] Dark/Light theme toggle
- [ ] Customizable dashboard
- [ ] More map providers
- [ ] Advanced filtering

## Testing Strategy

### Unit Tests
```javascript
// Test API client
test('fetchGPSLocation returns valid data', async () => {
  const data = await fetchGPSLocation();
  expect(data).toHaveProperty('latitude');
});
```

### Component Tests
```javascript
// Test StatusCard rendering
test('StatusCard displays value', () => {
  render(<StatusCard value="42" label="Test" />);
  expect(screen.getByText('42')).toBeInTheDocument();
});
```

### Integration Tests
```javascript
// Test full app flow
test('App fetches and displays location', async () => {
  render(<App />);
  await waitFor(() => {
    expect(screen.getByText(/latitude/i)).toBeInTheDocument();
  });
});
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT - Open source and free to use

---

**Architecture designed for scalability and maintainability**
