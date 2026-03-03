from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import logging
import uuid
from datetime import datetime
from ultralytics import YOLO
from detection.accident_detector import detect_accident_classes
from core.config import load_environment
from core.settings import Settings
from fastapi.responses import StreamingResponse
from app.main import process_image, generate_frames
from app.models.firestore_models import AccidentModel, UserModel, VehicleInvolvement, CasualtyReport
from services.firestore_service import create_accident, update_accident, get_accidents, create_user

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load Environment
load_environment()

app = FastAPI()

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
    "https://alert360.onrender.com",
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

@app.get("/health")
@app.get("/")
async def health_check():
    return {
        "status": "online",
        "service": "Alert360-Backend",
        "model_loaded": model is not None,
        "classes_count": len(accident_class_ids),
        "environment": os.getenv("NODE_ENV", "production") 
    }


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

@app.get("/api/accidents")
async def fetch_all_accidents():
    """Fetch all accidents from Firestore."""
    return get_accidents()

@app.post("/api/analyze")
async def analyze_incident(
    request: Request,
    file: UploadFile = File(...),
    camera_id: str = Form("Manual_Upload"),
    location: str = Form("Detection Zone I"),
    address: str = Form("Mumbai Highway, Mumbai"),
    latitude: float = Form(19.0760),
    longitude: float = Form(72.8777),
    accident_id: str = Form(None),
    enable_email: str = Form("true"),
    enable_sms: str = Form("true"),
    enable_call: str = Form("true")
):
    if not model:
        raise HTTPException(status_code=503, detail="Model service unavailable")

    uid = accident_id or f"ACC-{uuid.uuid4().hex[:8].upper()}"
    alerts_email = enable_email.lower() == "true"
    alerts_sms = enable_sms.lower() == "true"
    alerts_call = enable_call.lower() == "true"

    try:
        # Create Firestore Record First
        new_accident = AccidentModel(
            id=uid,
            observedAt=datetime.utcnow(),
            location=location or "Manual Analysis",
            address=address or "Unknown Location",
            latitude=latitude,
            longitude=longitude,
            zone="Central Mumbai",
            city="Mumbai",
            district="Mumbai City",
            state="Maharashtra",
            category="Pending Analysis",
            severity="medium",
            priority="Medium",
            status="pending"
        )
        create_accident(new_accident)

        # Save file to uploads directory
        upload_dir = os.path.join("storage", "uploads")
        os.makedirs(upload_dir, exist_ok=True)
        filename = f"{uid}_{file.filename}"
        file_path = os.path.join(upload_dir, filename)
        
        with open(file_path, "wb") as buffer:
            while True:
                content = await file.read(1024 * 1024)
                if not content:
                    break
                buffer.write(content)

        is_image = file.content_type.startswith("image/")
        
        if is_image:
            output_filename = f"processed_{filename}"
            output_path = os.path.join("storage", "outputs", output_filename)

            result = process_image(file_path, model, accident_class_ids, visualize=False, output_path=output_path, accident_id=uid, enable_email=alerts_email, enable_sms=alerts_sms, enable_call=alerts_call)
            
            # Update Document with Category discovered from image
            update_accident(uid, {"category": result.get("label", "Collision")})
            
            result["accident_id"] = uid
            return result
        else:
            base_url = str(request.base_url).rstrip('/')
            stream_url = f"{base_url}/api/video_feed?filename={filename}&live=true"
            analysis_jobs[filename] = {
                "status": "pending",
                "accident_detected": False,
                "label": "Initializing AI Engine...",
                "confidence": 0.0,
                "accident_id": uid,
                "before_snapshot_url": None,
                "after_snapshot_url": None,
                "enable_email": alerts_email,
                "enable_sms": alerts_sms,
                "enable_call": alerts_call
            }
            return {
                "accident_detected": False, 
                "label": "Live Analysis",
                "image_url": stream_url,
                "is_video": True,
                "filename": filename,
                "accident_id": uid
            }

    except Exception as e:
        logger.error(f"Error processing upload: {e}")
        return {"error": str(e)}

@app.post("/api/users/profile")
async def update_user_profile(user: UserModel):
    """Update or create user profile in Firestore."""
    create_user(user)
    return {"status": "success", "uid": user.uid}
