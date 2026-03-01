import { useState, useEffect } from 'react';
import { useAuth } from '@/core/auth/AuthContext';
import { useTheme } from '@/core/theme';
import type { NotificationChannel } from '@/features/notifications/constants/notification.types';
import { INITIAL_CHANNELS, MOCK_NOTIFICATION_LOGS, RECENT_NOTIFICATIONS } from '@/features/notifications/constants/notification.constants';
import { exportChannelConfig } from '@/features/notifications/services/notification.service';

export const useNotification = () => {
    const { user } = useAuth();
    const { colors, typography } = useTheme();

    const [muteAll, setMuteAll] = useState(false);
    const [muteUntil, setMuteUntil] = useState<Date | null>(null);
    const [testMessage, setTestMessage] = useState('');
    const [isMobile, setIsMobile] = useState(false);
    const [loading, setLoading] = useState(true);

    // Initialize data with user fallbacks
    const emailFallback = user?.email || 'admin@Mumbaiemergency.gov.in';
    const nameFallback = user?.name || 'System Administrator';

    const [channels, setChannels] = useState<NotificationChannel[]>(
        INITIAL_CHANNELS(emailFallback)
    );

    const mockNotificationLogs = MOCK_NOTIFICATION_LOGS(emailFallback);
    const recentNotifications = RECENT_NOTIFICATIONS(nameFallback);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 850);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleChannelToggle = (channelId: string) => {
        setChannels(prev => prev.map(channel =>
            channel.id === channelId
                ? { ...channel, enabled: !channel.enabled }
                : channel
        ));
    };

    const handleSeverityToggle = (channelId: string, severity: keyof NotificationChannel['settings']) => {
        setChannels(prev => prev.map(channel =>
            channel.id === channelId
                ? {
                    ...channel,
                    settings: {
                        ...channel.settings,
                        [severity]: !channel.settings[severity]
                    }
                }
                : channel
        ));
    };

    const handleMuteAll = (duration: number) => {
        setMuteAll(true);
        setMuteUntil(new Date(Date.now() + duration * 60 * 1000));
    };

    const handleUnmute = () => {
        setMuteAll(false);
        setMuteUntil(null);
    };

    const sendTestNotification = () => {
        if (!testMessage.trim()) return;
        alert(`Test notification sent: "${testMessage}"`);
        setTestMessage('');
    };

    const testChannel = async (channelId: string) => {
        setChannels(prev => prev.map(channel =>
            channel.id === channelId
                ? { ...channel, status: 'testing' }
                : channel
        ));

        setTimeout(() => {
            setChannels(prev => prev.map(channel =>
                channel.id === channelId
                    ? {
                        ...channel,
                        status: Math.random() > 0.1 ? 'connected' : 'error',
                        lastTested: new Date(),
                        responseTime: Math.random() * 5 + 0.5
                    }
                    : channel
            ));
        }, 2000);
    };

    const addNewChannel = () => {
        alert('Add new channel functionality would be implemented here');
    };

    const editChannel = (channelId: string) => {
        alert(`Edit channel ${channelId} functionality would be implemented here`);
    };

    const deleteChannel = (channelId: string) => {
        if (confirm('Are you sure you want to delete this channel?')) {
            setChannels(prev => prev.filter(channel => channel.id !== channelId));
        }
    };

    const handleExportChannelConfig = () => {
        exportChannelConfig(channels);
    };

    return {
        state: {
            user,
            colors,
            typography,
            muteAll,
            muteUntil,
            testMessage,
            isMobile,
            loading,
            channels,
            mockNotificationLogs,
            recentNotifications
        },
        handlers: {
            setTestMessage,
            handleChannelToggle,
            handleSeverityToggle,
            handleMuteAll,
            handleUnmute,
            sendTestNotification,
            testChannel,
            addNewChannel,
            editChannel,
            deleteChannel,
            handleExportChannelConfig
        }
    };
};
