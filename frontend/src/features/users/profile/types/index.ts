export interface ProfileDocument {
    type: string;
    idNumber: string;
    issueDate: string;
    expiryDate?: string;
    status: 'Verified' | 'Pending' | 'Expired';
    documentUrl?: string;
}

export interface ProfileVerificationData {
    emailVerified: boolean;
    passwordConfigured: boolean;
    twoFactorStatus: 'Secured' | 'Unsecured';
    ndaAccepted: boolean;
    monitoringPolicySigned: boolean;
    biometricSync: boolean;
    lastSecurityAudit: string;
}

export interface ProfilePersonalData {
    name: string;
    email: string;
    phone: string;
    avatarUrl?: string;
    bio?: string;
    joinedDate: string;
    employmentStatus: 'Active' | 'On Leave' | 'Suspended' | string;
    workLocation: string;
}

export interface ProfileProfessionalData {
    department: string;
    badgeId: string;
    title: string;
    assignedZones: string[];
    role: 'Admin' | 'Operator' | 'Analyst';
    clearanceLevel: number;
    documents: ProfileDocument[];
    manager: {
        name: string;
        id: string;
    };
    shiftTiming: string;
}

export interface ProfileSecurityData {
    twoFactorEnabled: boolean;
    lastPasswordChange: string;
    activeSessions: number;
    encryptionLevel: string;
    verification: ProfileVerificationData;
    securityEvents: {
        event: string;
        date: string;
        status: 'Safe' | 'Warning' | 'Critical';
    }[];
}

export interface ProfileEmergencyData {
    contactName: string;
    relationship: string;
    contactPhone: string;
    medicalNotes?: string;
    bloodGroup: string;
    allergies: string[];
    insuranceProvider: string;
    policyNumber: string;
}

export interface ProfilePreferenceData {
    language: 'English' | 'Spanish' | 'Hindi' | 'Marathi';
    theme: 'light' | 'dark' | 'system';
    highContrast: boolean;
    notificationChannels: {
        email: boolean;
        push: boolean;
        sms: boolean;
    };
    sessionPersistence: boolean;
}

export interface FullProfileData {
    personal: ProfilePersonalData;
    professional: ProfileProfessionalData;
    security: ProfileSecurityData;
    emergency: ProfileEmergencyData;
    preferences: ProfilePreferenceData;
}
