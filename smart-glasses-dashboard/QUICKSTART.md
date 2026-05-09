# Quick Start

Get the Smart Glasses GPS Dashboard running in 5 minutes!

## ⚡ 5-Minute Setup

### 1. Install Dependencies (2 min)
```bash
cd smart-glasses-dashboard
npm install
```

### 2. Configure Backend URL (30 sec)
```bash
cp .env.example .env
# Edit .env and set your backend URL
```

### 3. Start Development Server (30 sec)
```bash
npm run dev
```

### 4. Open in Browser (30 sec)
Visit `http://localhost:3000` - dashboard opens automatically!

### 5. Verify Connection (1 min)
- Check if GPS coordinates appear
- Verify status cards are updating
- Open DevTools (F12) to see API calls

## 📋 Minimal Backend Setup

For testing, run this Python FastAPI backend:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import random

app = FastAPI()

# Enable CORS
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
        "latitude": 36.8065 + random.uniform(-0.001, 0.001),
        "longitude": 10.1815 + random.uniform(-0.001, 0.001),
        "battery": random.randint(20, 100),
        "wifi": "Connected",
        "last_update": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

# Run with: uvicorn app:app --reload
```

## 🎯 What You Get

✅ Real-time GPS tracking map  
✅ Status cards (battery, WiFi, coordinates)  
✅ Dark mode UI with animations  
✅ Mobile responsive design  
✅ Auto-updating every 5 seconds  
✅ Connection status indicator  
✅ Notification system  

## 📂 Key Files to Edit

| File | Purpose | Edit to |
|------|---------|---------|
| `.env` | API configuration | Change backend URL |
| `src/App.jsx` | Main logic | Add features, change polling interval |
| `src/components/` | UI components | Customize appearance |
| `tailwind.config.js` | Colors & theme | Change colors, fonts, animations |
| `src/services/api.js` | API client | Add endpoints |

## 🚀 Next Steps

1. **Customize Theme**: Edit `tailwind.config.js`
2. **Add Your Backend**: Update `.env` with API URL
3. **Deploy**: Run `npm run build`, then deploy `dist/` folder
4. **Monitor**: Add error tracking with Sentry
5. **Scale**: Optimize performance, add features

## 📚 Full Documentation

- [Setup Guide](./SETUP_GUIDE.md) - Detailed installation
- [Deployment Guide](./DEPLOYMENT_GUIDE.md) - Deploy to production
- [Architecture Guide](./ARCHITECTURE.md) - Technical deep dive
- [API Service Docs](./src/services/api.js) - API integration

## 🆘 Troubleshooting

**Q: Backend connection failed?**  
A: Ensure FastAPI is running on port 8000 and CORS is enabled

**Q: Map not showing?**  
A: Restart dev server, check internet connection, clear cache

**Q: API updates not appearing?**  
A: Check Network tab in DevTools (F12), verify backend returns valid JSON

**Q: Build errors?**  
A: Delete `node_modules` and `package-lock.json`, then `npm install`

## 🎓 Learn More

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Leaflet Maps](https://leafletjs.com)
- [Framer Motion](https://www.framer.com/motion)

## 🎉 Congratulations!

Your Smart Glasses GPS Dashboard is ready to use!

**Questions?** Check the docs or GitHub issues.

---

**Happy tracking! 📡**
