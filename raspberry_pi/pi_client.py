import time
import requests
import random
import serial
import pynmea2

# Replace this with the actual IP address of your backend server
# If running on the same network, it might be something like "http://192.168.1.100:8000/location"
BACKEND_URL = "https://gps-bakenc.onrender.com/location" 

def get_gps_data():
    """
    Function to read data from a real GPS module (e.g., NEO-6M).
    Adjust the serial port ('/dev/ttyS0' or '/dev/ttyAMA0' or '/dev/ttyUSB0')
    and baud rate (usually 9600) according to your Raspberry Pi setup.
    """
    try:
        # Connect to the serial port
        ser = serial.Serial('/dev/ttyS0', 9600, timeout=1.0)
        
        # Read lines until we get a valid GPS fix
        while True:
            line = ser.readline().decode('utf-8', errors='ignore')
            if line.startswith('$GPRMC') or line.startswith('$GPGGA'):
                try:
                    msg = pynmea2.parse(line)
                    # Check if the module has a fix (latitude and longitude are non-zero)
                    if msg.latitude and msg.longitude:
                        return msg.latitude, msg.longitude
                except pynmea2.ParseError:
                    pass
    except serial.SerialException as e:
        print(f"Error opening serial port: {e}")
        # Fallback to mock data if serial port fails
        return 36.8065, 10.1815

def get_battery_level():
    """Mock function to get battery percentage"""
    return random.randint(40, 100)

def get_wifi_status():
    """Mock function to get WiFi status"""
    return "Connected"

def send_data_to_server():
    """Gathers sensor data and sends an HTTP POST request to the backend."""
    latitude, longitude = get_gps_data()
    battery = get_battery_level()
    wifi = get_wifi_status()

    # Create the JSON payload that the backend expects
    payload = {
        "latitude": latitude,
        "longitude": longitude,
        "battery": battery,
        "wifi": wifi
    }

    try:
        # Send POST request to the Flask backend
        print(f"Sending data to {BACKEND_URL}...")
        response = requests.post(BACKEND_URL, json=payload, timeout=5)
        
        # HTTP 201 Created is returned by our backend on success
        if response.status_code == 201:
            print(f"Successfully sent data: {payload}")
        else:
            print(f"Failed to send data. Status code: {response.status_code}")
            print(f"Error: {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"Connection error: Could not reach the server. ({e})")

if __name__ == "__main__":
    print("Starting Raspberry Pi Data Sender...")
    print("Press Ctrl+C to stop.")
    try:
        while True:
            send_data_to_server()
            # Wait for 5 seconds before sending the next update
            time.sleep(5)
    except KeyboardInterrupt:
        print("\nStopping the script...")
