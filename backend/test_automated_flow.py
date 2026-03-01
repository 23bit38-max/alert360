import os
import threading
import logging
from dotenv import load_dotenv
from services.notification_service import dispatch_immediate_alerts

# Load environment
load_dotenv()

# Set up logging to stdout
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_automated_flow_simulation():
    print("🚀 Simulating Automated Alert Flow (The way main.py does it)...")
    
    # Dummy data similar to what main.py provides
    accident_id = "SIM-TEST-" + os.urandom(4).hex()
    label = "car_accident"
    confidence = 0.8876
    snapshot_url = "https://example.com/snapshot.jpg"
    enable_sms = True
    enable_call = False # Test SMS specifically
    
    print(f"📡 Dispatching thread for {accident_id}...")
    
    # We use the same threading pattern as main.py
    thread = threading.Thread(
        target=dispatch_immediate_alerts,
        args=(accident_id, label, confidence, snapshot_url, enable_sms, enable_call),
        daemon=True
    )
    thread.start()
    
    # Wait for the thread to finish because this is a short script
    thread.join(timeout=10)
    print("🏁 Simulation thread joined. Check logs above.")

if __name__ == "__main__":
    test_automated_flow_simulation()
