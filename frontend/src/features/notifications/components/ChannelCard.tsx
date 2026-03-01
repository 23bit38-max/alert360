import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Switch } from '@/shared/components/ui/switch';
import { Label } from '@/shared/components/ui/label';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/components/ui/dropdown-menu';
import { Eye, TestTube, Edit3, Trash2 } from 'lucide-react';
import type { NotificationChannel } from '@/features/notifications/constants/notification.types';
import { getChannelIcon, getStatusIcon, getStatusColor, getChannelTypeColor, getSeverityColor, formatTimeAgo } from '@/features/notifications/constants/notification.constants';

interface ChannelCardProps {
    channel: NotificationChannel;
    isMobile: boolean;
    colors: any;
    typography: any;
    onToggle: (id: string) => void;
    onSeverityToggle: (id: string, severity: keyof NotificationChannel['settings']) => void;
    onTest: (id: string) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

export const ChannelCard = ({
    channel,
    isMobile,
    colors,
    typography,
    onToggle,
    onSeverityToggle,
    onTest,
    onEdit,
    onDelete
}: ChannelCardProps) => {
    const Icon = getChannelIcon(channel.type);
    const StatusIcon = getStatusIcon(channel.status);

    return (
        <Card className="glass border-white/5 overflow-hidden">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 min-w-0 flex-1">
                        <div className={`p-3 rounded-xl`} style={{ backgroundColor: channel.enabled ? `${colors.accent.primary}30` : `${colors.text.muted}20`, border: `1px solid ${channel.enabled ? colors.accent.primary : colors.text.muted}40` }}>
                            <Icon className={`w-6 h-6`} style={{ color: channel.enabled ? colors.accent.primary : colors.text.muted }} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                                <CardTitle style={{ ...typography.body, fontWeight: '700', color: colors.text.primary }} className="truncate">{channel.name}</CardTitle>
                                <Badge variant="outline" style={getChannelTypeColor(channel.type, colors)}>
                                    {channel.type.toUpperCase()}
                                </Badge>
                            </div>
                            <p style={typography.caption} className="truncate">{channel.address}</p>
                            <div className={`flex items-center mt-2 ${isMobile ? 'flex-wrap gap-1' : 'space-x-4'}`}>
                                <div className="flex items-center space-x-1">
                                    <StatusIcon size={14} style={{ color: getStatusColor(channel.status, colors) }} />
                                    <span style={{ fontSize: '11px', color: getStatusColor(channel.status, colors), fontWeight: '700' }}>
                                        {channel.status.toUpperCase()}
                                    </span>
                                </div>
                                {channel.responseTime && (
                                    <span style={typography.caption}>
                                        {channel.responseTime.toFixed(1)}s
                                    </span>
                                )}
                                <span style={typography.caption}>
                                    {channel.successRate}% success
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch
                            checked={channel.enabled}
                            onCheckedChange={() => onToggle(channel.id)}
                        />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <Eye className="h-4 w-4" style={{ color: colors.text.muted }} />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" style={{ backgroundColor: colors.background.surface, borderColor: colors.background.border }}>
                                <DropdownMenuItem onClick={() => onTest(channel.id)} style={{ color: colors.text.secondary }}>
                                    <TestTube className="w-4 h-4 mr-2" />
                                    Test Channel
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onEdit(channel.id)} style={{ color: colors.text.secondary }}>
                                    <Edit3 className="w-4 h-4 mr-2" />
                                    Edit Settings
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onDelete(channel.id)} style={{ color: colors.status.critical.main }}>
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete Channel
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* Severity Settings */}
                    <div>
                        <Label className="text-sm text-gray-300 mb-2 block">Alert Severities</Label>
                        <div className={`flex gap-2 ${isMobile ? 'flex-wrap' : 'flex-wrap'}`}>
                            {(['critical', 'high', 'medium', 'low'] as const).map((severity) => (
                                <div key={severity} className="flex items-center space-x-2">
                                    <Switch
                                        id={`${channel.id}-${severity}`}
                                        checked={channel.settings[severity]}
                                        onCheckedChange={() => onSeverityToggle(channel.id, severity)}
                                        disabled={!channel.enabled}
                                    />
                                    <Label
                                        htmlFor={`${channel.id}-${severity}`}
                                        style={{
                                            fontSize: '11px',
                                            textTransform: 'capitalize',
                                            color: getSeverityColor(severity, colors)
                                        }}
                                    >
                                        {severity}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Advanced Settings Preview */}
                    <div className="pt-2" style={{ borderTop: `1px solid ${colors.background.border}` }}>
                        <div className={`grid gap-2 text-xs ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
                            {[
                                { label: 'Quiet Hours:', value: channel.settings.quietHours.enabled ? 'Enabled' : 'Disabled' },
                                { label: 'Rate Limit:', value: `${channel.settings.rateLimiting.maxPerHour}/hour` },
                                { label: 'Max Retries:', value: channel.settings.retryPolicy.maxRetries },
                                { label: 'Last Tested:', value: channel.lastTested ? formatTimeAgo(channel.lastTested) : 'Never' },
                            ].map((setting, idx) => (
                                <div key={idx} className="flex justify-between">
                                    <span style={typography.caption}>{setting.label}</span>
                                    <span style={{ ...typography.caption, color: colors.text.primary, fontWeight: '700' }}>{setting.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
