import os
import logging
from dotenv import load_dotenv
from services.notification_service import send_sms_alert

# Load environment
load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_sms_with_url():
    print("🚀 Triggering SMS Diagnostic Test WITH URL...")
    
    # Example URL similar to what's sent during uploads
    snapshot_url = "https://wyctxufdndzrhyzsjkvv.supabase.co/storage/v1/object/public/accidents/test-uuid/before/before_accident.jpg"
    
    test_body = (
        f"🚨 ALERT360 DIAGNOSTIC 🚨\n"
        f"Incident Type: TEST_WITH_URL\n"
        f"Confidence: 99%\n"
        f"Incident ID: test-diag-001\n"
        f"View Snapshot: {snapshot_url}"
    )
    
    try:
        success = send_sms_alert(test_body)
        if success:
            print("✅ SMS Dispatch reported SUCCESS by Twilio SDK.")
            print("Please confirm if you received the SMS on your phone.")
        else:
            print("❌ SMS Dispatch reported FAILURE in notification_service.py.")
    except Exception as e:
        print(f"💥 Fatal Exception during SMS test: {e}")

if __name__ == "__main__":
    test_sms_with_url()
