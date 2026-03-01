import { Card, CardContent } from '@/shared/components/ui/card';
import { Activity, CheckCircle, Server, Shield } from 'lucide-react';
import type { NotificationChannel } from '@/features/notifications/constants/notification.types';

interface ChannelHealthGridProps {
    channels: NotificationChannel[];
    isMobile: boolean;
    colors: any;
    typography: any;
}

export const ChannelHealthGrid = ({ channels, isMobile, colors, typography }: ChannelHealthGridProps) => {
    const stats = [
        { label: 'Avg Latency', value: `${(channels.reduce((sum, c) => sum + (c.responseTime || 0), 0) / channels.filter(c => c.responseTime).length).toFixed(1)}s`, icon: Activity, color: colors.accent.primary },
        { label: 'Uptime Score', value: `${(channels.reduce((sum, c) => sum + c.successRate, 0) / channels.length).toFixed(1)}%`, icon: CheckCircle, color: colors.status.safe.main },
        { label: 'Nodes Tracked', value: channels.length, icon: Server, color: colors.accent.primary, hideOnMobile: true },
        { label: 'Failures Blocked', value: '184', icon: Shield, color: colors.status.critical.main, hideOnMobile: true },
    ];

    return (
        <div className={`grid gap-4 ${isMobile ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-4'}`}>
            {stats.map((item, i) => (
                (!item.hideOnMobile || !isMobile) && (
                    <Card key={i} className="glass-primary border-white/5">
                        <CardContent className={isMobile ? 'p-3' : 'p-4'}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p style={typography.caption}>{item.label}</p>
                                    <p style={typography.h3}>{item.value}</p>
                                </div>
                                <item.icon size={isMobile ? 24 : 32} style={{ color: item.color }} />
                            </div>
                        </CardContent>
                    </Card>
                )
            ))}
        </div>
    );
};
