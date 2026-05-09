# Installation & Troubleshooting Guide

Complete step-by-step installation guide with troubleshooting for the Smart Glasses GPS Dashboard.

## 🚀 System Requirements

### Prerequisites
- **Node.js**: v16 or higher ([Download](https://nodejs.org/en/download/))
- **npm**: v7 or higher (comes with Node.js)
- **OS**: Windows, macOS, or Linux
- **Browser**: Chrome, Firefox, Safari, or Edge (recent versions)

### Verify Installation
```bash
node --version    # Should show v16 or higher
npm --version     # Should show v7 or higher
```

---

## 📦 Installation Steps

### Step 1: Navigate to Project Directory

**Windows Command Prompt:**
```cmd
cd "C:\Users\DELL\OneDrive\Desktop\gps_location\smart-glasses-dashboard"
```

**Windows PowerShell:**
```powershell
cd "C:\Users\DELL\OneDrive\Desktop\gps_location\smart-glasses-dashboard"
```

**macOS/Linux Terminal:**
```bash
cd ~/Desktop/gps_location/smart-glasses-dashboard
```

### Step 2: Install Dependencies

```bash
npm install
```

**What happens:**
- Downloads ~300MB of packages
- Installs to `node_modules/` folder
- Creates `package-lock.json`
- Takes 2-5 minutes depending on internet

**Expected output:**
```
added 500+ packages in 3m
```

### Step 3: Create Environment File

**Option A: Copy example file**
```bash
cp .env.example .env
```

**Option B: Create manually**
- Create new file named `.env` in project root
- Add content:
```env
VITE_API_URL=http://localhost:8000
```

### Step 4: Start Development Server

```bash
npm run dev
```

**Expected output:**
```
  VITE v4.4.0  ready in 135 ms

  ➜  Local:   http://localhost:3000/
  ➜  press h to show help
```

Browser should automatically open. If not, visit: **http://localhost:3000**

---

## ✅ Verify Installation

After starting the dev server, verify:

1. **Browser loads**: Page visible at http://localhost:3000
2. **Dashboard displays**: Navigation bar visible
3. **Status cards show**: "Loading..." state initially
4. **Map appears**: Map section visible
5. **Sidebar works**: Menu items visible (desktop) or hamburger icon (mobile)

### Check API Connection

1. Open browser DevTools: Press **F12**
2. Go to **Network** tab
3. Look for request to `/location`
4. If showing status 200: ✅ Connected to backend
5. If showing error: ❌ Backend not running

---

## 🔧 Troubleshooting

### Issue: "Command not found: node"

**Cause**: Node.js not installed or not in PATH

**Solution**:
1. Download Node.js from https://nodejs.org/
2. Install with default settings
3. Restart terminal
4. Try again: `npm install`

---

### Issue: "npm ERR! code ERESOLVE"

**Cause**: Dependency conflict

**Solution**:
```bash
# Option 1: Use legacy peer deps
npm install --legacy-peer-deps

# Option 2: Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

### Issue: "Port 3000 already in use"

**Cause**: Another application using port 3000

**Solution - Windows:**
```cmd
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F

# Or use different port
npm run dev -- --port 3001
```

**Solution - macOS/Linux:**
```bash
# Find process
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use different port
npm run dev -- --port 3001
```

---

### Issue: "Cannot GET /location"

**Cause**: Backend API not running

**Solution**:
1. Ensure FastAPI backend is running on port 8000
2. Test with curl:
   ```bash
   curl http://localhost:8000/location
   ```
3. Check `.env` file has correct API URL
4. Verify backend CORS is enabled

**Backend Example:**
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/location")
async def get_location():
    return {
        "latitude": 36.8065,
        "longitude": 10.1815,
        "battery": 82,
        "wifi": "Connected",
        "last_update": "2026-05-09 14:30:00"
    }
```

---

### Issue: "VITE API error" or "Cannot find module"

**Cause**: Dependencies not fully installed

**Solution**:
```bash
# Complete clean install
rm -rf node_modules
rm package-lock.json
npm install
```

---

### Issue: Map not showing / blank area

**Cause**: Leaflet CSS not loading

**Solution**:
1. Check browser console (F12) for errors
2. Look for CSS import errors
3. Clear browser cache: Ctrl+Shift+Delete
4. Restart dev server: Stop and `npm run dev`

---

### Issue: Hot reload not working

**Cause**: Vite HMR issue

**Solution**:
```bash
# Stop server (Ctrl+C)
# Clear cache
npm run dev -- --force

# Or clear vite cache
rm -rf node_modules/.vite
npm run dev
```

---

### Issue: High CPU usage / Slow performance

**Cause**: Too many re-renders or polling

**Solution**:
1. Check polling interval (default 5s)
2. Open DevTools → Performance tab
3. Reduce animation effects if needed
4. Check backend response time

---

### Issue: "Error: connect ECONNREFUSED"

**Cause**: Cannot connect to backend

**Checklist**:
- [ ] Backend is running (`python app.py`)
- [ ] Backend on correct port (8000)
- [ ] `.env` has correct URL
- [ ] No firewall blocking
- [ ] Try: `curl http://localhost:8000/health`

---

### Issue: Build fails with "Cannot find file"

**Cause**: Missing files after cloning/extraction

**Solution**:
```bash
# Verify project structure
ls -la src/
ls -la src/components/
ls -la src/pages/
ls -la src/services/

# If files missing, check extraction was complete
```

---

### Issue: "TypeError: Cannot read property 'latitude'"

**Cause**: API response format incorrect

**Solution**:
1. Check backend returns valid JSON:
   ```bash
   curl http://localhost:8000/location
   ```
2. Response should be:
   ```json
   {
     "latitude": 36.8065,
     "longitude": 10.1815,
     "battery": 82,
     "wifi": "Connected",
     "last_update": "2026-05-09 14:30:00"
   }
   ```

---

## 🎯 Common Setup Issues

### Issue: npm install takes very long

**Cause**: Slow internet or npm registry issue

**Solution**:
```bash
# Try alternative registry
npm install --registry https://registry.npmjs.org/

# Or use yarn
npm install -g yarn
yarn install
```

---

### Issue: "node_modules" folder is huge (500MB+)

**This is normal!** Contains all dependencies.

**To reduce size:**
```bash
# Remove optional dependencies
npm install --no-optional

# Or use npm ci for cleaner install
npm ci
```

---

### Issue: File permissions denied (macOS/Linux)

**Solution**:
```bash
# Give execute permission
chmod +x node_modules/.bin/vite

# Or fix all node_modules
npm install
```

---

## 📝 Verification Checklist

After installation, verify everything works:

### Development Setup
- [ ] Node.js installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Project directory navigated to
- [ ] `node_modules/` folder exists
- [ ] `.env` file created with API URL

### Dev Server
- [ ] `npm run dev` starts without errors
- [ ] Browser opens at http://localhost:3000
- [ ] Page loads without blank screen
- [ ] No red errors in browser console

### Frontend
- [ ] Navbar visible at top
- [ ] Sidebar menu visible (desktop) or hamburger (mobile)
- [ ] Status cards visible
- [ ] Map section visible
- [ ] Responsive on mobile (F12 → device toolbar)

### Backend Connection
- [ ] API request in Network tab (F12)
- [ ] Request status 200 (success) or similar
- [ ] JSON response visible in DevTools
- [ ] Status cards populate with data
- [ ] Map shows location marker

---

## 🚀 Next Steps After Installation

### 1. Test the Application
```bash
npm run dev
# Open http://localhost:3000
# Verify all features working
```

### 2. Make Your First Change
- Edit `src/components/Navbar.jsx`
- Change title from "Smart Glasses Tracker" to your title
- Save file
- See changes instantly (hot reload)

### 3. Customize Colors
- Edit `tailwind.config.js`
- Change `colors.dark` values
- Save and see theme update

### 4. Deploy to Production
```bash
npm run build
# Outputs optimized files to dist/
# See DEPLOYMENT_GUIDE.md for hosting options
```

---

## 💡 Pro Tips

### Development
```bash
# Fast reload without losing state
npm run dev

# Access from other devices on network
# Replace localhost with your IP:
# http://192.168.1.100:3000
```

### Debugging
```bash
# Install React DevTools browser extension
# F12 → Components tab to inspect components

# Console logs from app
console.log('Debug message');
```

### Performance
```bash
# Analyze bundle size
npm run build

# Check what's in the bundle
du -sh dist/
du -sh dist/assets/*
```

---

## 🎓 Learning Resources

### React
- Official Docs: https://react.dev
- Quick Start: https://react.dev/learn

### Tailwind CSS
- Official Docs: https://tailwindcss.com
- Theme Config: https://tailwindcss.com/docs/configuration

### Vite
- Official Docs: https://vitejs.dev
- Guide: https://vitejs.dev/guide/

### Leaflet Maps
- Official Docs: https://leafletjs.com
- React Binding: https://react-leaflet.js.org

---

## 📞 Getting Help

### If Something Doesn't Work

1. **Check this guide** - Search for your error
2. **Check browser console** - F12 → Console tab
3. **Check network requests** - F12 → Network tab
4. **Check server logs** - Terminal running `npm run dev`
5. **Try clean install** - Follow "Hard Reset" below

### Hard Reset (Nuclear Option)

```bash
# Stop development server (Ctrl+C)

# Windows
del /S node_modules
del package-lock.json
npm install

# macOS/Linux
rm -rf node_modules
rm package-lock.json
npm install

# Then start again
npm run dev
```

---

## 🔐 Security Notes

### Before Production

1. **Never commit .env file** - Add to .gitignore
2. **Use HTTPS** - Not just HTTP
3. **Enable CORS** - Only allow your frontend domain
4. **Validate inputs** - Both frontend and backend
5. **Hide API keys** - Use environment variables

---

## 📊 System Performance

### Expected Metrics

- **Bundle Size**: ~150KB gzipped
- **Page Load**: 2-3 seconds
- **Map Load**: 1-2 seconds
- **API Response**: <500ms
- **Animations**: 60fps smooth

### If Performance is Poor

1. Check internet speed
2. Check backend response time
3. Check browser has sufficient RAM
4. Close other applications
5. Check for browser extensions slowing things down

---

## ✨ Installation Complete!

You're all set! Your Smart Glasses GPS Dashboard is ready to use.

**Next Steps**:
1. Review QUICKSTART.md for feature overview
2. Check DEPLOYMENT_GUIDE.md for production
3. Customize via tailwind.config.js
4. Enjoy building! 🎉

---

**Happy coding! 🚀**
