from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# --- Collection: users ---
class UserPermissionToggles(BaseModel):
    view_all: bool = False
    # Add other permissions as needed based on frontend RBAC

class UserModel(BaseModel):
    uid: str
    email: str
    name: str
    role: str
    avatarUrl: Optional[str] = None
    department: str
    assignedZones: List[str] = []
    status: str = "pending"
    profileCompleted: bool = False
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    lastModified: datetime = Field(default_factory=datetime.utcnow)
    permissionToggles: Dict[str, bool] = {}

# --- Collection: accidents ---
class VehicleInvolvement(BaseModel):
    count: int = 0
    types: List[str] = []
    infrastructure: List[str] = []

class CasualtyReport(BaseModel):
    injuredCount: int = 0
    criticalInjuries: int = 0
    fatalities: int = 0
    trappedPersons: bool = False

class EnvironmentalConditions(BaseModel):
    weather: str = "clear"
    visibility: str = "good"
    road: str = "dry"
    fire: bool = False
    fuelLeak: bool = False
    chemicalHazard: bool = False

class AgencyDispatch(BaseModel):
    agencies: List[str] = []
    status: str = "pending"

class OfficerNote(BaseModel):
    text: str
    officerId: str
    department: str
    isConfidential: bool = False

class AccidentModel(BaseModel):
    id: str
    observedAt: datetime
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    location: str
    address: str
    latitude: float
    longitude: float
    zone: str
    city: str
    district: str
    state: str
    category: str
    severity: str
    priority: str
    status: str = "pending"
    responseTime: Optional[float] = None
    beforeImageUrl: Optional[str] = None
    afterImageUrl: Optional[str] = None
    vehicleInvolvement: VehicleInvolvement = Field(default_factory=VehicleInvolvement)
    casualtyReport: CasualtyReport = Field(default_factory=CasualtyReport)
    environmentalConditions: EnvironmentalConditions = Field(default_factory=EnvironmentalConditions)
    agencyDispatch: AgencyDispatch = Field(default_factory=AgencyDispatch)
    officerNotes: List[OfficerNote] = []

# --- Collection: cameras ---
class CameraModel(BaseModel):
    id: str
    name: str
    location: str
    latitude: float
    longitude: float
    zone: str
    status: str = "online"
    resolution: str = "1080p"
    fps: int = 30
    thumbnailUrl: Optional[str] = None
    streamUrl: str
    department: str

# --- Collection: ai_insights ---
class InsightModel(BaseModel):
    type: str
    title: str
    message: str
    confidence: float
    department: str
    createdAt: datetime = Field(default_factory=datetime.utcnow)

# --- Collection: user_approvals ---
class Document(BaseModel):
    name: str
    type: str
    verified: bool = False

class Review(BaseModel):
    reviewerId: str
    reviewerName: str
    comments: str
    timestamp: datetime
    status: str

class ApprovalModel(BaseModel):
    id: str
    full_name: str
    email: str
    department: str
    position: str
    phone_number: str
    emergency_id: str
    reason: str
    urgency: str
    status: str = "pending"
    requested_role: str
    requested_zones: List[str] = []
    documents: List[Document] = []
    submitted_at: datetime = Field(default_factory=datetime.utcnow)
    reviews: List[Review] = []

# --- Collection: ai_analysis ---
class AIAnalysisModel(BaseModel):
    id: str
    accident_id: str
    raw_detections: Any
    confidence_score: float
    processed_at: datetime = Field(default_factory=datetime.utcnow)
