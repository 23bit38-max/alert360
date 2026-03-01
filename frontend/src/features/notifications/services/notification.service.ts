import type { NotificationChannel } from '@/features/notifications/constants/notification.types';

export const exportChannelConfig = (channels: NotificationChannel[]) => {
    const config = JSON.stringify(channels, null, 2);
    const blob = new Blob([config], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'notification-channels-config.json';
    a.click();
    URL.revokeObjectURL(url);
};
