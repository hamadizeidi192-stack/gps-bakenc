# Smart Glasses GPS Tracking Dashboard

A modern, responsive React frontend for real-time GPS tracking of smart glasses connected to a Raspberry Pi 4.

## 🎯 Features

- **Live GPS Tracking**: Real-time map display using Leaflet and OpenStreetMap
- **Dark Mode Design**: Professional glassmorphism UI with smooth animations
- **Mobile Responsive**: Works seamlessly on all devices
- **Dashboard Layout**: Sidebar navigation, top navbar, and main tracking area
- **Status Cards**: Display GPS coordinates, battery, WiFi, connection status, and last update time
- **Real-time Updates**: Automatic polling every 5 seconds with loading states
- **Notification System**: Toast notifications for connection status and updates
- **Production Quality**: Clean architecture with reusable components

## 📋 Tech Stack

- **React 18** - UI framework with functional components
- **Tailwind CSS** - Utility-first styling with dark mode
- **Leaflet + React-Leaflet** - Interactive maps
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful icon library
- **Axios** - HTTP client for API calls
- **Vite** - Fast build tool and dev server

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm/yarn installed
- Backend FastAPI server running on `http://localhost:8000`

### Installation

1. **Clone and navigate to project**
   ```bash
   cd smart-glasses-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - The app will automatically open at `http://localhost:3000`

### Production Build

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
smart-glasses-dashboard/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx              # Top navigation bar
│   │   ├── Sidebar.jsx             # Side navigation menu
│   │   ├── StatusCard.jsx          # Status metric cards
│   │   ├── MapComponent.jsx        # GPS map with Leaflet
│   │   └── NotificationSystem.jsx  # Toast notifications
│   ├── pages/
│   │   └── Dashboard.jsx           # Main dashboard page
│   ├── services/
│   │   └── api.js                  # API service with polling
│   ├── styles/
│   │   └── index.css               # Global styles + Tailwind
│   ├── App.jsx                     # Root component
│   └── main.jsx                    # Entry point
├── public/                          # Static assets
├── index.html                       # HTML template
├── package.json                     # Dependencies
├── vite.config.js                   # Vite configuration
├── tailwind.config.js               # Tailwind configuration
└── postcss.config.js                # PostCSS configuration
```

## 🔌 API Integration

### Backend Endpoint

The app connects to:
```
GET http://localhost:8000/location
```

### Expected Response Format

```json
{
  "latitude": 36.8065,
  "longitude": 10.1815,
  "battery": 82,
  "wifi": "Connected",
  "last_update": "2026-05-09 14:30:00"
}
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:8000
```

If not specified, defaults to `http://localhost:8000`.

## 🎨 UI Components

### Navbar
- App title and branding
- Settings and help icons
- Mobile menu toggle

### Sidebar
- Navigation links (Dashboard, Live Map, Connections, Analytics, Settings)
- Device connection status indicator
- Mobile-responsive with overlay

### Status Cards
- **Latitude**: GPS latitude coordinate
- **Longitude**: GPS longitude coordinate
- **Battery Level**: Device battery percentage with status colors
- **WiFi Status**: Network connection status
- **Last Update**: Timestamp of last data refresh
- **Connection Status**: Online/Offline indicator

### Map Component
- OpenStreetMap background
- Custom marker for glasses location
- Center map button
- Animated marker with pulsing effect
- Offline state overlay
- Loading state indicator

### Notifications
- Auto-dismiss after 4 seconds
- Different types: success, error, info
- Smooth animations and transitions
- Stacked layout for multiple notifications

## ⚙️ Configuration

### Polling Interval

Edit the polling interval in `src/App.jsx`:

```javascript
const id = startLocationPolling(handleLocationUpdate, 5000); // 5 seconds
```

### Map Center Location

Default center in `src/components/MapComponent.jsx`:

```javascript
const defaultCenter = [36.8065, 10.1815]; // Tunis
```

### API Timeout

Set timeout in `src/services/api.js`:

```javascript
const apiClient = axios.create({
  timeout: 10000, // 10 seconds
});
```

## 🎓 Key Features Explained

### Real-time Polling
- Automatic data refresh every 5 seconds
- Immediate API call on app load
- Graceful error handling and offline state
- Auto-reconnection attempts

### Glassmorphism Design
- Semi-transparent glass effect cards
- Blur backdrop effects
- Gradient borders and shadows
- Smooth hover animations

### Responsive Layout
- Mobile-first design approach
- Hamburger menu on small screens
- Grid layout that adapts to screen size
- Touch-friendly buttons and controls

### Status Indicators
- Color-coded status badges (success/warning/error)
- Animated pulse for online status
- Battery level visualization
- Real-time connection indicator

## 🐛 Troubleshooting

### API Connection Issues

**Problem**: "Failed to connect to device"
- Ensure FastAPI backend is running on port 8000
- Check CORS settings in FastAPI backend
- Verify network connectivity

**Solution**:
```python
# Add to your FastAPI app
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Map Not Loading

**Problem**: Map doesn't appear or shows gray area
- Check Leaflet CSS is imported
- Verify internet connection (OpenStreetMap needs it)
- Check browser console for errors

**Solution**: Restart dev server

```bash
npm run dev
```

### Performance Issues

**Problem**: Dashboard feels slow or unresponsive
- Reduce polling frequency (increase interval)
- Check Network tab in DevTools for slow API responses
- Clear browser cache and reload

## 📱 Mobile Optimization

The dashboard is fully responsive:

- **Mobile (< 640px)**: Single column layout, hamburger menu
- **Tablet (640px - 1024px)**: 2-column grid, collapsible sidebar
- **Desktop (> 1024px)**: Full layout with permanent sidebar

## 🔐 Security Considerations

- Never commit `.env` files with sensitive data
- Use HTTPS in production
- Implement authentication for API endpoints
- Validate and sanitize all incoming data
- Keep dependencies updated

## 📚 Learning Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Leaflet Maps](https://leafletjs.com)
- [Framer Motion](https://www.framer.com/motion)

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the component documentation in source files
3. Check browser console for error messages
4. Verify backend API is responding correctly

## 📄 License

MIT License - Feel free to use this project for your own purposes.

## 🎉 Next Steps

1. Customize colors in `tailwind.config.js`
2. Add authentication to your backend
3. Implement WebSocket for real-time updates (optional)
4. Add historical tracking data visualization
5. Deploy to production (Vercel, Netlify, etc.)

---

**Built with ❤️ for IoT and Raspberry Pi projects**
