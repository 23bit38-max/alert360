export interface YoloSettings {
    confidence: number;
    detectionInterval: number;
    batchSize: number;
    gpuAcceleration: boolean;
    modelVersion: 'v8n' | 'v8s' | 'v8m' | 'v8l' | 'v8x';
}

export interface AccountSettings {
    fullName: string;
    email: string;
    role: 'Admin' | 'Operator' | 'Analyst';
    avatarUrl?: string;
}

export interface SecuritySettings {
    twoFactorEnabled: boolean;
    sessionTimeout: number;
    ipWhitelist: string[];
    lastPasswordChange: string;
}

export interface NotificationSettings {
    emailAlerts: boolean;
    pushNotifications: boolean;
    smsAlerts: boolean;
    alertSeverityThreshold: 'low' | 'medium' | 'high' | 'critical';
}

export interface SystemConfig {
    siteName: string;
    timezone: string;
    language: string;
    maintenanceMode: boolean;
}

export interface IntegrationSettings {
    webhookUrl?: string;
    apiKey?: string;
    cloudStorageEnabled: boolean;
    externalLogServer?: string;
}

export interface DataManagementSettings {
    autoArchiveDays: number;
    dataRetentionPeriod: number;
    compactDatabaseOnExit: boolean;
}

export interface AppearanceSettings {
    theme: 'light' | 'dark' | 'system';
    primaryColor: string;
    sidebarCollapsed: boolean;
    highContrastMode: boolean;
}

export interface AllSettings {
    yolo: YoloSettings;
    account: AccountSettings;
    security: SecuritySettings;
    notifications: NotificationSettings;
    system: SystemConfig;
    integrations: IntegrationSettings;
    data: DataManagementSettings;
    appearance: AppearanceSettings;
}
