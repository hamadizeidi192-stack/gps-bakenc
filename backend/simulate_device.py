import os
import time
import requests
import random
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
API_URL = "https://gps-bakenc.onrender.com/location"
UPDATE_INTERVAL = 5 # seconds

# Initial coordinates (Tunis)
current_lat = 36.8065
current_lon = 10.1815
current_battery = 100

print(f"Starting device simulation. Sending data to {API_URL} every {UPDATE_INTERVAL} seconds...")

def simulate_data():
    global current_lat, current_lon, current_battery
    
    # Simulate slight movement
    current_lat += random.uniform(-0.0005, 0.0005)
    current_lon += random.uniform(-0.0005, 0.0005)
    
    # Simulate battery drain (slowly)
    if random.random() > 0.8 and current_battery > 0:
        current_battery -= 1
        
    # Simulate WiFi status
    wifi_status = "Connected" if random.random() > 0.05 else "Searching..."
    
    return {
        "latitude": round(current_lat, 6),
        "longitude": round(current_lon, 6),
        "battery": current_battery,
        "wifi": wifi_status,
        "last_update": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

try:
    while True:
        data = simulate_data()
        
        try:
            response = requests.post(API_URL, json=data)
            if response.status_code == 201:
                print(f"[{datetime.now().strftime('%H:%M:%S')}] Success: Moved to ({data['latitude']}, {data['longitude']}) - Battery: {data['battery']}%")
            else:
                print(f"[{datetime.now().strftime('%H:%M:%S')}] Failed: Server returned status {response.status_code}")
                print(response.text)
        except requests.exceptions.ConnectionError:
            print(f"[{datetime.now().strftime('%H:%M:%S')}] Connection Error: Make sure the Flask server is running on port {PORT}")
            
        time.sleep(UPDATE_INTERVAL)
except KeyboardInterrupt:
    print("\nSimulation stopped.")
