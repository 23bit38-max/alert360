from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import logging
import uuid
from ultralytics import YOLO
from detection.accident_detector import detect_accident_classes
from core.config import load_environment
from core.settings import Settings
from fastapi.responses import StreamingResponse
from app.main import process_image, generate_frames


# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load Environment
load_environment()

app = FastAPI()

# Mount static directory for results
# Mount static directory for results
os.makedirs(os.path.join("storage", "outputs"), exist_ok=True)
app.mount("/results", StaticFiles(directory=os.path.join("storage", "outputs")), name="results")

# CORS
origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://127.0.0.1:5175",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for model
model = None
accident_class_ids = []

@app.on_event("startup")
def startup_event():
    global model, accident_class_ids
    try:
        model_path = Settings.get_model_path()
        if not os.path.exists(model_path):
            logger.error(f"Model not found at {model_path}")
        
        logger.info(f"Loading model from {model_path}...")
        model = YOLO(model_path)
        accident_class_ids, _ = detect_accident_classes(model)
        logger.info("Model loaded successfully.")
    except Exception as e:
        logger.error(f"Failed to load model: {e}")


# Global state for analysis jobs
analysis_jobs = {}

@app.get("/api/video_feed")
async def video_feed(filename: str):
    """
    Stream video with annotation and track status.
    """
    file_path = os.path.join("storage", "uploads", filename)
    if not os.path.exists(file_path):
        return {"error": "File not found"}
    
    job_state = analysis_jobs.setdefault(filename, {
        "status": "processing",
        "accident_detected": False,
        "snapshots": None,
        "label": None,
        "confidence": 0.0,
        "enable_email": True,
        "enable_sms": True,
        "enable_call": True
    })
        
    return StreamingResponse(
        generate_frames(file_path, model, accident_class_ids, status_tracker=job_state, enable_email=job_state.get("enable_email", True), enable_sms=job_state.get("enable_sms", True), enable_call=job_state.get("enable_call", True)),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )

@app.get("/api/status/{filename}")
async def get_analysis_status(filename: str):
    job = analysis_jobs.get(filename)
    if not job:
        return {"status": "not_found"}
    return job

@app.get("/api/diagnostic/model")
async def model_diagnostic():
    """Returns model class info for debugging."""
    if not model:
        return {"error": "Model not loaded"}
    
    return {
        "all_classes": model.names,
        "detected_accident_ids": accident_class_ids,
        "detected_accident_names": [model.names[i] for i in accident_class_ids]
    }

@app.get("/api/diagnostic/env")
async def env_diagnostic():
    """Checks environment state."""
    import sys
    import subprocess
    try:
        pip_list = subprocess.check_output([sys.executable, "-m", "pip", "list"]).decode()
    except:
        pip_list = "Could not run pip"
    
    return {
        "python_version": sys.version,
        "executable": sys.executable,
        "cwd": os.getcwd(),
        "env_vars": {k: "SET" for k in os.environ},
        "twilio_installed": "twilio" in pip_list.lower()
    }

@app.post("/api/diagnostic/trigger_alert")
async def trigger_manual_alert(accident_id: str = Form(...), enable_sms: bool = Form(True)):
    """Manually triggers a dispatch for testing purposes from inside the server process."""
    from services.notification_service import dispatch_immediate_alerts
    import threading
    
    thread = threading.Thread(
        target=dispatch_immediate_alerts,
        args=(accident_id, "MANUAL_TEST", 0.99, "https://example.com/manual_test.jpg", enable_sms, False),
        daemon=True
    )
    thread.start()
    return {"status": "Dispatch thread started", "accident_id": accident_id}

@app.post("/api/analyze")
async def analyze_incident(
    file: UploadFile = File(...),
    camera_id: str = Form("Manual_Upload"),
    location: str = Form(None),
    accident_id: str = Form(None),
    enable_email: str = Form("true"),
    enable_sms: str = Form("true"),
    enable_call: str = Form("true")
):
    if not model:
        return {"error": "Model not loaded service unavailable"}

    # Generate or use provided accident_id
    uid = accident_id or str(uuid.uuid4())
    alerts_email = enable_email.lower() == "true"
    alerts_sms = enable_sms.lower() == "true"
    alerts_call = enable_call.lower() == "true"

    logger.info(f"📥 ANALYSIS REQUEST: ID={uid}, SMS_FLAG='{enable_sms}' -> {alerts_sms}, EMAIL_FLAG='{enable_email}' -> {alerts_email}")

    try:
        # Save file to uploads directory (persist for streaming)
        upload_dir = os.path.join("storage", "uploads")
        os.makedirs(upload_dir, exist_ok=True)
        filename = f"{uid}_{file.filename}"
        file_path = os.path.join(upload_dir, filename)
        
        # Save file (blocking write but async read to yield loop)
        with open(file_path, "wb") as buffer:
            while True:
                content = await file.read(1024 * 1024)  # 1MB chunks
                if not content:
                    break
                buffer.write(content)
            
        logger.info(f"Received file: {filename}, saved to {file_path}")

        # Determine type
        is_image = file.content_type.startswith("image/")
        
        result = {}
        if is_image:
            # Process image (visualize=False) - existing logic
            output_filename = f"processed_{filename}"
            output_path = os.path.join("storage", "outputs", output_filename)

            result = process_image(file_path, model, accident_class_ids, visualize=False, output_path=output_path, accident_id=uid, enable_email=alerts_email, enable_sms=alerts_sms, enable_call=alerts_call)
            result["accident_id"] = uid
            
            if not isinstance(result, dict):
                 result = {"accident_detected": False, "error": "Unknown processing error"}
                 
        else:
            # Video: Return stream URL immediately
            # Appending &live=true to force img tag in frontend
            stream_url = f"http://localhost:8000/api/video_feed?filename={filename}&live=true"
            
            # Initialize status tracker immediately so polling gets 200 OK right away
            analysis_jobs[filename] = {
                "status": "pending",
                "accident_detected": False,
                "label": "Waiting for stream...",
                "confidence": 0.0,
                "label": "Waiting for stream...",
                "confidence": 0.0,
                "snapshots": None,
                "accident_id": uid,
                "enable_email": alerts_email,
                "enable_sms": alerts_sms,
                "enable_call": alerts_call
            }
            
            result = {
                "accident_detected": False, 
                "label": "Live Analysis",
                "best_confidence": 0.0,
                "image_url": stream_url,
                "is_video": True,
                "filename": filename,
                "accident_id": uid,
                "enable_email": alerts_email,
                "enable_sms": alerts_sms,
                "enable_call": alerts_call
            }

        return result

    except Exception as e:
        logger.error(f"Error processing upload: {e}")
        return {"error": str(e)}
