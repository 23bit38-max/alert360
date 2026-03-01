export interface IncidentImage {
    id: string;
    url: string;
    timestamp: Date;
    type: 'before' | 'during' | 'after';
    description: string;
    cameraAngle: string;
}

export interface TimelineEvent {
    time: string;
    event: string;
    status: 'info' | 'success' | 'warning' | 'critical';
}

export interface Alert {
    id: string;
    type: 'critical' | 'high' | 'medium' | 'low';
    title: string;
    location: string;
    zone: string;
    timestamp: Date;
    vehicles: number;
    confidence: number;
    status: 'active' | 'responding' | 'resolved' | 'escalated';
    assignedTo?: string;
    cameraId: string;
    coordinates: { lat: number; lng: number };
    description: string;
    actions: string[];
    images: IncidentImage[];
    videoUrl?: string;
    injuries?: number;
    severity: 'minor' | 'moderate' | 'severe' | 'fatal';
    responsibleDepartment: 'police' | 'fire' | 'hospital' | 'multi-department';
    detectionSource: 'camera' | 'sensor' | 'AI' | 'manual';
    eta?: string;
    responseStage?: 'dispatched' | 'en_route' | 'on_site';
    casualtyLikelihood?: 'low' | 'moderate' | 'high';
    unitsResponding?: {
        police?: boolean;
        fire?: boolean;
        medical?: boolean;
    };
    timeline?: TimelineEvent[];

    // Expanded Intelligence Fields (Matched with Manual Upload)
    city?: string;
    district?: string;
    stateName?: string;
    roadHighwayId?: string;
    vehicleTypes?: string[];
    infrastructureInvolved?: string[];
    injuredCount?: number;
    criticalInjuries?: number;
    fatalities?: number;
    trappedPersons?: boolean;
    weatherCondition?: string;
    visibilityLevel?: string;
    roadCondition?: string;
    fireFlag?: boolean;
    fuelLeakFlag?: boolean;
    chemicalHazardFlag?: boolean;
    agenciesToNotify?: string[];
    trafficDiversionRequired?: boolean;
    confidentialFlag?: boolean;
    officerId?: string;
    officerDepartment?: string;
}
