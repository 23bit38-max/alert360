import os
import logging
from dotenv import load_dotenv
from services.notification_service import send_sms_alert

# Load environment
load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_sms():
    print("🚀 Triggering Standalone SMS Diagnostic Test...")
    
    test_body = "🚨 Alert360 Diagnostic: This is a manual test of the SMS dispatch system. please confirm receipt."
    
    try:
        success = send_sms_alert(test_body)
        if success:
            print("✅ SMS Dispatch reported SUCCESS by Twilio SDK.")
        else:
            print("❌ SMS Dispatch reported FAILURE in notification_service.py.")
    except Exception as e:
        print(f"💥 Fatal Exception during SMS test: {e}")

if __name__ == "__main__":
    test_sms()
