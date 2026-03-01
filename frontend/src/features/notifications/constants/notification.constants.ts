import {
    Bell,
    Mail,
    MessageSquare,
    Phone,
    Slack,
    Users,
    Link,
    Wifi,
    WifiOff,
    AlertTriangle,
    TestTube,
    Clock,
    CheckCircle,
    XCircle,
    Settings,
    User,
} from 'lucide-react';
import type { NotificationChannel, NotificationLog, RecentNotification } from '@/features/notifications/constants/notification.types';

export const INITIAL_CHANNELS = (emailFallback: string): NotificationChannel[] => [
    {
        id: 'email-1',
        type: 'email',
        name: 'Primary Email',
        enabled: true,
        address: emailFallback,
        status: 'connected',
        lastTested: new Date(Date.now() - 2 * 60 * 60 * 1000),
        responseTime: 1.2,
        successRate: 99.2,
        settings: {
            critical: true,
            high: true,
            medium: true,
            low: false,
            quietHours: { enabled: false, start: '22:00', end: '06:00' },
            rateLimiting: { enabled: true, maxPerHour: 50 },
            retryPolicy: { enabled: true, maxRetries: 3, backoffMultiplier: 2 },
            formatting: {
                template: 'default',
                includeLocation: true,
                includeTimestamp: true,
                includeSeverity: true
            }
        },
        permissions: ['read', 'write', 'admin']
    },
    {
        id: 'sms-1',
        type: 'sms',
        name: 'Emergency SMS',
        enabled: true,
        address: '+91 98765 43210',
        status: 'connected',
        lastTested: new Date(Date.now() - 30 * 60 * 1000),
        responseTime: 3.5,
        successRate: 97.8,
        settings: {
            critical: true,
            high: true,
            medium: false,
            low: false,
            quietHours: { enabled: true, start: '23:00', end: '07:00' },
            rateLimiting: { enabled: true, maxPerHour: 10 },
            retryPolicy: { enabled: true, maxRetries: 5, backoffMultiplier: 1.5 },
            formatting: {
                template: 'short',
                includeLocation: true,
                includeTimestamp: false,
                includeSeverity: true
            }
        },
        permissions: ['read', 'write']
    },
    {
        id: 'slack-1',
        type: 'slack',
        name: 'Emergency Operations Slack',
        enabled: true,
        address: '#emergency-alerts',
        status: 'connected',
        lastTested: new Date(Date.now() - 15 * 60 * 1000),
        responseTime: 0.8,
        successRate: 99.9,
        settings: {
            critical: true,
            high: true,
            medium: true,
            low: true,
            quietHours: { enabled: false, start: '00:00', end: '00:00' },
            rateLimiting: { enabled: false, maxPerHour: 100 },
            retryPolicy: { enabled: true, maxRetries: 2, backoffMultiplier: 2 },
            formatting: {
                template: 'slack',
                includeLocation: true,
                includeTimestamp: true,
                includeSeverity: true
            }
        },
        credentials: { webhookUrl: 'https://hooks.slack.com/services/...' },
        permissions: ['read', 'write']
    }
];

export const MOCK_NOTIFICATION_LOGS = (emailFallback: string): NotificationLog[] => [
    {
        id: 'log-1',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        channel: 'email',
        recipient: emailFallback,
        message: 'CRITICAL: Multi-vehicle collision detected at Anna Salai Junction, Mumbai',
        status: 'sent',
        severity: 'critical',
        retries: 0
    },
    {
        id: 'log-2',
        timestamp: new Date(Date.now() - 12 * 60 * 1000),
        channel: 'sms',
        recipient: '+91 98765 43210',
        message: 'CRITICAL: Multi-vehicle collision detected at Anna Salai Junction, Mumbai - Emergency services dispatched',
        status: 'sent',
        severity: 'critical',
        retries: 0
    },
    {
        id: 'log-3',
        timestamp: new Date(Date.now() - 25 * 60 * 1000),
        channel: 'email',
        recipient: emailFallback,
        message: 'HIGH: Vehicle rollover detected at ECR Road IT Park, Mumbai - Fire department and ambulance responding',
        status: 'sent',
        severity: 'high',
        retries: 0
    },
    {
        id: 'log-4',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        channel: 'slack',
        recipient: '#emergency-alerts',
        message: 'HIGH: Vehicle rollover detected at ECR Road IT Park, Mumbai - Emergency response team activated',
        status: 'failed',
        severity: 'high',
        retries: 2
    },
    {
        id: 'log-5',
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        channel: 'push',
        recipient: 'Browser',
        message: 'MEDIUM: Rear-end collision at T.Nagar Junction, Mumbai - Traffic police on scene',
        status: 'sent',
        severity: 'medium',
        retries: 0
    }
];

export const RECENT_NOTIFICATIONS = (userFallback: string): RecentNotification[] => [
    {
        id: 'recent-1',
        type: 'alert',
        timestamp: new Date(Date.now() - 3 * 60 * 1000),
        title: 'Critical Accident Detected',
        message: 'Multi-vehicle collision at Anna Salai Junction. Emergency services dispatched.',
        severity: 'critical',
        location: 'Anna Salai Junction, Mumbai',
        channels: ['email', 'sms', 'slack'],
        status: 'delivered'
    },
    {
        id: 'recent-2',
        type: 'channel_update',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        title: 'SMS Channel Updated',
        message: 'Emergency SMS channel settings updated - Critical alerts enabled',
        severity: 'medium',
        user: userFallback,
        status: 'completed'
    },
    {
        id: 'recent-3',
        type: 'test',
        timestamp: new Date(Date.now() - 28 * 60 * 1000),
        title: 'Test Notification Sent',
        message: 'Test notification sent to all active channels - Email: Success, SMS: Success, Slack: Success',
        severity: 'low',
        channels: ['email', 'sms', 'slack'],
        status: 'completed'
    },
    {
        id: 'recent-4',
        type: 'alert',
        timestamp: new Date(Date.now() - 42 * 60 * 1000),
        title: 'Vehicle Incident Resolved',
        message: 'Traffic incident at Velachery Main Road has been cleared.',
        severity: 'medium',
        location: 'Velachery Main Road, Mumbai',
        channels: ['email', 'push'],
        status: 'delivered'
    },
    {
        id: 'recent-5',
        type: 'channel_update',
        timestamp: new Date(Date.now() - 55 * 60 * 1000),
        title: 'Slack Integration Connected',
        message: 'Emergency Operations Slack channel successfully connected and tested',
        severity: 'low',
        user: userFallback,
        status: 'completed'
    },
    {
        id: 'recent-6',
        type: 'preference_update',
        timestamp: new Date(Date.now() - 75 * 60 * 1000),
        title: 'Notification Preferences Updated',
        message: 'Quiet hours enabled for SMS channel (23:00 - 07:00)',
        severity: 'low',
        user: userFallback,
        status: 'completed'
    }
];

export const getChannelIcon = (type: string) => {
    switch (type) {
        case 'email': return Mail;
        case 'sms': return Phone;
        case 'whatsapp': return MessageSquare;
        case 'push': return Bell;
        case 'slack': return Slack;
        case 'teams': return Users;
        case 'webhook': return Link;
        case 'voice': return Phone;
        default: return Bell;
    }
};

export const getStatusColor = (status: string, colors: any) => {
    switch (status) {
        case 'connected': return colors.status.safe.main;
        case 'disconnected': return colors.text.muted;
        case 'error': return colors.status.critical.main;
        case 'testing': return colors.status.warning.main;
        default: return colors.text.muted;
    }
};

export const getStatusIcon = (status: string) => {
    switch (status) {
        case 'connected': return Wifi;
        case 'disconnected': return WifiOff;
        case 'error': return AlertTriangle;
        case 'testing': return TestTube;
        default: return Clock;
    }
};

export const getChannelTypeColor = (type: string, colors: any) => {
    const channelColor = colors.notification?.[type as keyof typeof colors.notification] || colors.text.muted;
    return {
        backgroundColor: `${channelColor}20`,
        color: channelColor,
        borderColor: `${channelColor}40`,
        borderWidth: '1px'
    };
};

export const getDeliveryStatusColor = (status: string, colors: any) => {
    switch (status) {
        case 'sent': return colors.status.safe.main;
        case 'failed': return colors.status.critical.main;
        case 'pending': return colors.status.warning.main;
        default: return colors.text.muted;
    }
};

export const getDeliveryStatusIcon = (status: string) => {
    switch (status) {
        case 'sent': return CheckCircle;
        case 'failed': return XCircle;
        case 'pending': return Clock;
        default: return Clock;
    }
};

export const getSeverityColor = (severity: string, colors: any) => {
    switch (severity) {
        case 'critical': return colors.status.critical.main;
        case 'high': return colors.status.warning.main;
        case 'medium': return colors.accent.primary;
        case 'low': return colors.status.safe.main;
        default: return colors.text.muted;
    }
};

export const getNotificationTypeIcon = (type: string) => {
    switch (type) {
        case 'alert': return AlertTriangle;
        case 'channel_update': return Settings;
        case 'test': return TestTube;
        case 'preference_update': return User;
        default: return Bell;
    }
};

export const getNotificationTypeColor = (type: string, colors: any) => {
    switch (type) {
        case 'alert': return colors.status.critical.main;
        case 'channel_update': return colors.accent.primary;
        case 'test': return colors.notification.push;
        case 'preference_update': return colors.status.safe.main;
        default: return colors.text.muted;
    }
};

export const getDeliveryStatusBadge = (status: string) => {
    switch (status) {
        case 'delivered': return 'DELI';
        case 'completed': return 'COMP';
        case 'failed': return 'FAIL';
        default: return 'PEND';
    }
};

export const getDeliveryStatusBadgeColor = (status: string, colors: any) => {
    switch (status) {
        case 'delivered': return colors.status.safe.main;
        case 'completed': return colors.accent.primary;
        case 'failed': return colors.status.critical.main;
        default: return colors.status.warning.main;
    }
};

export const formatTimeAgo = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
};
