import os
from datetime import datetime
from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
# Enable CORS for the frontend URLs
CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173"]}})

# MongoDB Configuration
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    # Check if the server is available
    client.server_info()
    db = client.get_database("smart_glasses")
    locations_collection = db.get_collection("locations")
    print("Successfully connected to MongoDB!")
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")
    locations_collection = None

@app.route("/health", methods=["GET"])
def health_check():
    """Health check endpoint"""
    status = "ok" if locations_collection is not None else "db_error"
    return jsonify({"status": status}), 200

@app.route("/location", methods=["GET"])
def get_location():
    """Get the most recent GPS location and device status"""
    if locations_collection is None:
        return jsonify({"error": "Database connection error"}), 500

    try:
        # Fetch the most recently added location
        # Sorting by _id implicitly sorts by insertion time
        latest_location = locations_collection.find_one({}, sort=[("_id", -1)])
        
        if latest_location:
            # Remove the ObjectId before sending to the frontend
            latest_location.pop("_id", None)
            return jsonify(latest_location), 200
        else:
            # Return some default values if the database is empty
            return jsonify({
                "latitude": 36.8065,
                "longitude": 10.1815,
                "battery": 0,
                "wifi": "Disconnected",
                "last_update": "Never"
            }), 200
            
    except Exception as e:
        print(f"Error fetching location: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/location", methods=["POST"])
def post_location():
    """Endpoint for the smart glasses to send new location data"""
    if locations_collection is None:
        return jsonify({"error": "Database connection error"}), 500

    try:
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        # Required fields
        required_fields = ["latitude", "longitude", "battery", "wifi"]
        if not all(field in data for field in required_fields):
            return jsonify({"error": f"Missing required fields. Expected: {required_fields}"}), 400
            
        # Add timestamp if not provided
        if "last_update" not in data:
            data["last_update"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            
        # Insert into MongoDB
        result = locations_collection.insert_one(data)
        
        return jsonify({
            "message": "Location updated successfully",
            "id": str(result.inserted_id)
        }), 201
        
    except Exception as e:
        print(f"Error saving location: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.getenv("FLASK_PORT", 8000))
    app.run(host="0.0.0.0", port=port, debug=True)
