import firebase_admin
from firebase_admin import credentials, firestore
import os
from dotenv import load_dotenv
from typing import List, Dict, Any, Optional
from datetime import datetime
from app.models.firestore_models import (
    UserModel, AccidentModel, CameraModel, 
    InsightModel, ApprovalModel, AIAnalysisModel
)

load_dotenv()

# Initialize Firebase Admin
def get_firestore_client():
    if not firebase_admin._apps:
        # Use service account values from environment variables
        cred_dict = {
            "type": "service_account",
            "project_id": os.getenv("FIREBASE_PROJECT_ID"),
            "private_key": os.getenv("FIREBASE_PRIVATE_KEY", "").replace("\\n", "\n"),
            "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
            "token_uri": "https://oauth2.googleapis.com/token",
        }
        cred = credentials.Certificate(cred_dict)
        firebase_admin.initialize_app(cred)
    return firestore.client()

db = get_firestore_client()

# --- User Operations ---
def create_user(user_data: UserModel):
    """Creates or updates a user in the 'users' collection."""
    doc_ref = db.collection("users").document(user_data.uid)
    doc_ref.set(user_data.dict())
    return user_data.uid

def get_user(uid: str):
    doc = db.collection("users").document(uid).get()
    return doc.to_dict() if doc.exists else None

# --- Accident Operations ---
def create_accident(accident_data: AccidentModel):
    """Creates a new accident record. Firestore auto-creates collection if it doesn't exist."""
    doc_ref = db.collection("accidents").document(accident_data.id)
    doc_ref.set(accident_data.dict())
    return accident_data.id

def update_accident(accident_id: str, update_data: Dict[str, Any]):
    """Updates specific fields of an accident record."""
    doc_ref = db.collection("accidents").document(accident_id)
    update_data["lastModified"] = datetime.utcnow()
    doc_ref.update(update_data)
    return accident_id

def get_accidents(limit: int = 50):
    docs = db.collection("accidents").order_by("createdAt", direction=firestore.Query.DESCENDING).limit(limit).stream()
    return [doc.to_dict() for doc in docs]

# --- Camera Operations ---
def upsert_camera(camera_data: CameraModel):
    doc_ref = db.collection("cameras").document(camera_data.id)
    doc_ref.set(camera_data.dict())
    return camera_data.id

def get_cameras():
    docs = db.collection("cameras").stream()
    return [doc.to_dict() for doc in docs]

# --- Insight Operations ---
def create_insight(insight_data: InsightModel):
    # Let Firestore generate a random ID for insights
    doc_ref = db.collection("ai_insights").document()
    doc_ref.set(insight_data.dict())
    return doc_ref.id

# --- Approval Operations ---
def create_approval_request(approval_data: ApprovalModel):
    doc_ref = db.collection("user_approvals").document(approval_data.id)
    doc_ref.set(approval_data.dict())
    return approval_data.id

# --- AI Analysis Operations ---
def log_ai_analysis(analysis_data: AIAnalysisModel):
    doc_ref = db.collection("ai_analysis").document(analysis_data.id)
    doc_ref.set(analysis_data.dict())
    return analysis_data.id
