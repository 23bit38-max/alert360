import type { UserRole } from '@/shared/utils/rbac';

export type ApprovalStatus = 'pending' | 'under_review' | 'approved' | 'rejected' | 'escalated';
export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';

export interface DocumentReview {
    type: string;
    name: string;
    verified: boolean;
    verificationDate?: string;
    comments?: string;
}

export interface ReviewAudit {
    reviewerId: string;
    reviewerName: string;
    comments: string;
    timestamp: Date;
    status: ApprovalStatus;
}

export interface UserApprovalRequest {
    id: string;
    fullName: string;
    email: string;
    department: string;
    position: string;
    phoneNumber: string;
    phone?: string;
    employeeId: string;
    justification: string;
    urgency: UrgencyLevel;
    submittedAt: string | Date;
    status: ApprovalStatus;
    requestedRole: UserRole;
    requestedZones: string[];
    documents: DocumentReview[];
    reviews: ReviewAudit[];
    clearanceLevel?: number;
}

export interface CameraTechnicalSpecs {
    resolution: string;
    nightVision: boolean;
    weatherProof: string;
    aiCapabilities: string[];
    frameRate: number;
    connectivity: 'Fiber' | '5G' | 'Satellite';
}

export interface CameraApprovalRequest {
    id: string;
    location: string;
    zone: string;
    requesterName: string;
    requesterId: string;
    priority: UrgencyLevel;
    installationType: string;
    estimatedCost: number;
    description: string;
    technicalSpecs: CameraTechnicalSpecs;
    submittedAt: Date;
    status: ApprovalStatus;
    reviews: ReviewAudit[];
}

export interface ApprovalStats {
    totalPending: number;
    criticalRequests: number;
    avgVettingTime: string;
    activeReviewers: number;
    departmentDistribution: Record<string, number>;
}
