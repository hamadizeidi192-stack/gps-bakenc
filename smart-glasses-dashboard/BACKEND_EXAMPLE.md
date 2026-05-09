# FastAPI Backend Example

If you need a reference FastAPI backend to test this dashboard, here's a simple implementation:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from pydantic import BaseModel
import random

app = FastAPI(title="Smart Glasses GPS API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LocationData(BaseModel):
    latitude: float
    longitude: float
    battery: int
    wifi: str
    last_update: str

# Simulated GPS data
INITIAL_LAT = 36.8065
INITIAL_LON = 10.1815

@app.get("/location", response_model=LocationData)
async def get_location():
    """Get current GPS location and device status"""
    
    # Simulate slight position variations
    lat = INITIAL_LAT + random.uniform(-0.001, 0.001)
    lon = INITIAL_LON + random.uniform(-0.001, 0.001)
    
    # Simulate battery drain
    battery = random.randint(20, 100)
    
    # Simulate WiFi status
    wifi = "Connected" if random.random() > 0.1 else "Disconnected"
    
    return LocationData(
        latitude=lat,
        longitude=lon,
        battery=battery,
        wifi=wifi,
        last_update=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    )

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

**To run this backend:**

```bash
pip install fastapi uvicorn pydantic
python app.py
```

The API will be available at `http://localhost:8000`
