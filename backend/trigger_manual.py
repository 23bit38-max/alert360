import requests

url = "http://localhost:8000/api/diagnostic/trigger_alert"
data = {
    "accident_id": "MAN-TRIG-001",
    "enable_sms": "true"
}

try:
    response = requests.post(url, data=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"Error: {e}")
