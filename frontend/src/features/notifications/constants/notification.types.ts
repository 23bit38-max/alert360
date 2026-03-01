export interface NotificationChannel {
    id: string;
    type: 'email' | 'sms' | 'whatsapp' | 'push' | 'slack' | 'teams' | 'webhook' | 'voice';
    name: string;
    enabled: boolean;
    address: string;
    status: 'connected' | 'disconnected' | 'error' | 'testing';
    lastTested?: Date;
    responseTime?: number;
    successRate: number;
    settings: {
        critical: boolean;
        high: boolean;
        medium: boolean;
        low: boolean;
        quietHours: {
            enabled: boolean;
            start: string;
            end: string;
        };
        rateLimiting: {
            enabled: boolean;
            maxPerHour: number;
        };
        retryPolicy: {
            enabled: boolean;
            maxRetries: number;
            backoffMultiplier: number;
        };
        formatting: {
            template: string;
            includeLocation: boolean;
            includeTimestamp: boolean;
            includeSeverity: boolean;
        };
    };
    credentials?: {
        apiKey?: string;
        webhookUrl?: string;
        accessToken?: string;
    };
    permissions: string[];
}

export interface NotificationLog {
    id: string;
    timestamp: Date;
    channel: string;
    recipient: string;
    message: string;
    status: 'sent' | 'failed' | 'pending';
    severity: 'critical' | 'high' | 'medium' | 'low';
    retries: number;
}

export interface RecentNotification {
    id: string;
    type: 'alert' | 'channel_update' | 'test' | 'preference_update';
    timestamp: Date;
    title: string;
    message: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    location?: string;
    channels?: string[];
    status: 'delivered' | 'completed' | 'failed';
    user?: string;
}
