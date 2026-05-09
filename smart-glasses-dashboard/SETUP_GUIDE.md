# Complete Setup Guide

Complete step-by-step guide to get the Smart Glasses GPS Dashboard running.

## Prerequisites

- **Node.js**: Version 16 or higher ([Download](https://nodejs.org/))
- **npm**: Comes with Node.js, or use `yarn`
- **Git**: For version control (optional)
- **FastAPI Backend**: Running on `http://localhost:8000`

## Installation Steps

### Step 1: Navigate to Project Directory

```bash
cd smart-glasses-dashboard
```

### Step 2: Install Dependencies

```bash
npm install
```

Or with yarn:
```bash
yarn install
```

This installs all required packages:
- React 18
- React Leaflet and Leaflet
- Tailwind CSS
- Framer Motion
- Lucide React
- Axios
- Vite

### Step 3: Configure Environment

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` to match your backend:

```env
VITE_API_URL=http://localhost:8000
```

### Step 4: Start Development Server

```bash
npm run dev
```

Expected output:
```
  VITE v4.4.0  ready in 123 ms

  ➜  Local:   http://localhost:3000/
  ➜  press h to show help
```

The application will:
- Automatically open at `http://localhost:3000`
- Hot reload when you save files
- Show errors in the browser console

### Step 5: Verify Connection

1. Open browser DevTools (F12)
2. Go to Network tab
3. Check if `GET /location` requests are successful
4. You should see real-time GPS data updating

## Troubleshooting Installation

### Issue: "Cannot find module" errors

**Solution**: Clear node_modules and reinstall

```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Port 3000 already in use

**Solution**: Use a different port

```bash
npm run dev -- --port 3001
```

### Issue: Backend connection fails

**Checklist**:
- [ ] FastAPI server is running
- [ ] Server runs on `http://localhost:8000`
- [ ] Check backend CORS settings
- [ ] Verify firewall settings
- [ ] Check browser console for errors

**Test backend**:
```bash
curl http://localhost:8000/location
```

Should return:
```json
{
  "latitude": 36.8065,
  "longitude": 10.1815,
  "battery": 82,
  "wifi": "Connected",
  "last_update": "2026-05-09 14:30:00"
}
```

## Development Tips

### Hot Module Replacement (HMR)

Changes to React components automatically reload without losing state:

```bash
npm run dev
```

Edit `src/components/StatusCard.jsx` and save - changes appear instantly!

### Debug Mode

Open browser DevTools (F12) to see:
- Console logs from API requests
- Network requests to backend
- React component hierarchy
- CSS styles

### Using React DevTools Extension

Install [React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools/) browser extension for better component debugging.

## Available Scripts

### Development

```bash
npm run dev
```
- Starts Vite dev server
- Hot reload enabled
- Opens browser automatically

### Production Build

```bash
npm run build
```
- Creates optimized build
- Outputs to `dist/` folder
- Ready for deployment

### Preview Build

```bash
npm run preview
```
- Serves production build locally
- Test production build before deploying

### Linting

```bash
npm run lint
```
- Checks code for errors
- Runs ESLint validation

## Project Structure

```
smart-glasses-dashboard/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx              # Top navigation
│   │   ├── Sidebar.jsx             # Side menu
│   │   ├── StatusCard.jsx          # Status metrics
│   │   ├── MapComponent.jsx        # GPS map
│   │   └── NotificationSystem.jsx  # Notifications
│   ├── pages/
│   │   └── Dashboard.jsx           # Main page
│   ├── services/
│   │   └── api.js                  # API client
│   ├── styles/
│   │   └── index.css               # Global styles
│   ├── App.jsx                     # Root component
│   └── main.jsx                    # Entry point
├── public/                          # Static files
├── index.html                       # HTML template
├── package.json                     # Dependencies
├── vite.config.js                   # Vite config
├── tailwind.config.js               # Tailwind config
└── postcss.config.js                # PostCSS config
```

## Customization

### Change Default Location

Edit `src/components/MapComponent.jsx`:

```javascript
const defaultCenter = [40.7128, -74.0060]; // New York
```

### Change Polling Interval

Edit `src/App.jsx`:

```javascript
const id = startLocationPolling(handleLocationUpdate, 10000); // 10 seconds
```

### Change Theme Colors

Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#3B82F6',
      // Add more colors
    }
  }
}
```

### Change API Endpoint

Edit `.env`:

```env
VITE_API_URL=https://your-api.com
```

Or programmatically in `src/services/api.js`:

```javascript
const API_BASE_URL = 'https://your-production-api.com';
```

## Next Steps

1. **Deploy to Production** - See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
2. **Add Authentication** - Implement user login
3. **Add Features** - Historical tracking, alerts, etc.
4. **Optimize Performance** - Code splitting, lazy loading
5. **Set up CI/CD** - Automated testing and deployment

## Getting Help

- **React Issues**: [React Docs](https://react.dev)
- **Tailwind Questions**: [Tailwind Docs](https://tailwindcss.com)
- **Leaflet Maps**: [Leaflet Docs](https://leafletjs.com)
- **API Issues**: Check backend logs
- **Build Issues**: Check browser console (F12)

## Common Commands Cheat Sheet

```bash
# Start development
npm run dev

# Build for production
npm run build

# Test production build
npm run preview

# Install new package
npm install package-name

# Update all packages
npm update

# Remove node_modules and reinstall
rm -rf node_modules && npm install
```

## System Requirements

- **RAM**: Minimum 2GB, Recommended 4GB+
- **Disk**: 500MB for node_modules
- **Internet**: Required for OpenStreetMap tiles and backend API
- **Browser**: Modern browser (Chrome, Firefox, Safari, Edge)

## Next Session Setup

When returning to development:

```bash
# Navigate to project
cd smart-glasses-dashboard

# Ensure dependencies are installed
npm install

# Start development server
npm run dev
```

---

**Happy coding! 🚀**
