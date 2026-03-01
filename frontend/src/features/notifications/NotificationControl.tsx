import { LoadingScreen } from '@/shared/components/LoadingScreen';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Switch } from '@/shared/components/ui/switch';
import { Label } from '@/shared/components/ui/label';
import { Badge } from '@/shared/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import {
    Bell,
    Volume2,
    VolumeX,
    Settings,
    Plus,
    Download,
    FileText,
    MapPin,
    Clock,
    TestTube,
    Send,
} from 'lucide-react';
import { Textarea } from '@/shared/components/ui/textarea';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/shared/components/ui/table';
import { GlobalStyles } from '@/core/theme';

import { useNotification } from '@/features/notifications/hooks/useNotification';
import { QuickMuteCard } from '@/features/notifications/components/QuickMuteCard';
import { ChannelHealthGrid } from '@/features/notifications/components/ChannelHealthGrid';
import { ChannelCard } from '@/features/notifications/components/ChannelCard';
import {
    getChannelTypeColor,
    getDeliveryStatusColor,
    getDeliveryStatusIcon,
    getNotificationTypeIcon,
    getNotificationTypeColor,
    getSeverityColor,
    formatTimeAgo,
    getDeliveryStatusBadgeColor,
    getDeliveryStatusBadge
} from '@/features/notifications/constants/notification.constants';

export const NotificationControl = () => {
    const { state, handlers } = useNotification();
    const {
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
    } = state;

    if (loading) {
        return <LoadingScreen message="Linking Communication Channels..." />;
    }

    return (
        <div className="space-y-4 max-w-full overflow-hidden pb-20 md:pb-6">
            {/* Notification Ops Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <Bell size={14} className="text-primary" />
                        <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Comms Matrix: </span>
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Live Monitoring</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {muteAll && muteUntil && (
                        <Badge className="bg-red-500/10 text-red-500 border-red-500/20 px-3 py-1 text-[9px] font-black tracking-[0.2em] animate-pulse">
                            MUTED: {muteUntil.toLocaleTimeString()}
                        </Badge>
                    )}
                    <Button
                        onClick={muteAll ? handlers.handleUnmute : () => handlers.handleMuteAll(15)}
                        className={`h-10 px-6 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${muteAll
                            ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                            : 'bg-white/[0.03] border border-white/10 text-muted-foreground hover:bg-white/[0.08]'
                            }`}
                    >
                        {muteAll ? <Volume2 size={14} className="mr-2" /> : <VolumeX size={14} className="mr-2" />}
                        {muteAll ? 'Unmute' : 'Mute All'}
                    </Button>
                </div>
            </div>

            {/* Quick Mute Controls */}
            {!muteAll && (
                <QuickMuteCard
                    isMobile={isMobile}
                    colors={colors}
                    typography={typography}
                    onMuteAll={handlers.handleMuteAll}
                />
            )}

            <Tabs defaultValue="channels" className="space-y-6">
                <div className="overflow-x-auto">
                    <TabsList className="bg-slate-900/80 border border-white/10 premium-shadow">
                        <TabsTrigger value="channels" className="text-[10px] font-black uppercase tracking-widest">Channels</TabsTrigger>
                        <TabsTrigger value="preferences" className="text-[10px] font-black uppercase tracking-widest">Preferences</TabsTrigger>
                        <TabsTrigger value="logs" className="text-[10px] font-black uppercase tracking-widest">Delivery Logs</TabsTrigger>
                        <TabsTrigger value="test" className="text-[10px] font-black uppercase tracking-widest">Test Notifications</TabsTrigger>
                        <TabsTrigger value="recent" className="text-[10px] font-black uppercase tracking-widest">Recent Notifications</TabsTrigger>
                    </TabsList>
                </div>

                {/* Notification Channels */}
                <TabsContent value="channels" className="space-y-6">
                    {/* Channel Management Header */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                        <div className={`flex gap-2 ${isMobile ? 'flex-wrap' : 'items-center space-x-4'}`}>
                            <Badge style={{ color: colors.status.safe.main, border: `1px solid ${colors.status.safe.outline}40`, backgroundColor: colors.status.safe.soft }} className="whitespace-nowrap">
                                {channels.filter(c => c.status === 'connected').length} Active
                            </Badge>
                            <Badge style={{ color: colors.status.critical.main, border: `1px solid ${colors.status.critical.outline}40`, backgroundColor: colors.status.critical.soft }} className="whitespace-nowrap">
                                {channels.filter(c => c.status === 'error').length} Issues
                            </Badge>
                            <Badge style={{ color: colors.text.muted, border: `1px solid ${colors.background.border}`, backgroundColor: colors.background.surface }} className="whitespace-nowrap">
                                {channels.filter(c => !c.enabled).length} Disabled
                            </Badge>
                        </div>
                        <div className={`flex gap-3 ${isMobile ? 'flex-col' : 'items-center'}`}>
                            <Button style={GlobalStyles.button.secondary} size="sm" onClick={handlers.handleExportChannelConfig}>
                                <Download className="w-4 h-4 mr-2" />
                                Export Config
                            </Button>
                            <Button size="sm" onClick={handlers.addNewChannel} style={GlobalStyles.button.primary}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Channel
                            </Button>
                        </div>
                    </div>

                    {/* Channel Health Overview */}
                    <ChannelHealthGrid
                        channels={channels}
                        isMobile={isMobile}
                        colors={colors}
                        typography={typography}
                    />

                    {/* Enhanced Channel Cards */}
                    <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 xl:grid-cols-2'}`}>
                        {channels.map((channel) => (
                            <ChannelCard
                                key={channel.id}
                                channel={channel}
                                isMobile={isMobile}
                                colors={colors}
                                typography={typography}
                                onToggle={handlers.handleChannelToggle}
                                onSeverityToggle={handlers.handleSeverityToggle}
                                onTest={handlers.testChannel}
                                onEdit={handlers.editChannel}
                                onDelete={handlers.deleteChannel}
                            />
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="preferences" className="space-y-6">
                    <Card className="glass-primary border-white/5">
                        <CardHeader>
                            <CardTitle style={{ ...typography.body, fontWeight: '700', color: colors.text.primary }} className="flex items-center">
                                <Settings className="w-5 h-5 mr-2" style={{ color: colors.accent.primary }} />
                                General Preferences
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {[
                                { label: 'Sound Alerts', desc: 'Play sound for notifications', checked: true },
                                { label: 'Desktop Notifications', desc: 'Show browser notifications', checked: true },
                                { label: 'Email Digest', desc: 'Daily summary email', checked: false },
                                { label: 'Weekend Notifications', desc: 'Receive alerts on weekends', checked: true },
                                { label: 'Group Similar Alerts', desc: 'Combine related notifications', checked: true },
                                { label: 'Auto-Acknowledge', desc: 'Auto-ack after viewing', checked: false },
                            ].map((pref, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div>
                                        <Label style={{ color: colors.text.primary }}>{pref.label}</Label>
                                        <p style={typography.caption}>{pref.desc}</p>
                                    </div>
                                    <Switch defaultChecked={pref.checked} />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Delivery Logs */}
                <TabsContent value="logs" className="space-y-6">
                    <Card className="glass-primary border-white/5">
                        <CardHeader>
                            <CardTitle style={{ ...typography.body, fontWeight: '700', color: colors.text.primary }} className="flex items-center">
                                <FileText className="w-5 h-5 mr-2" style={{ color: colors.accent.primary }} />
                                Delivery Logs
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {isMobile ? (
                                <div className="space-y-3 p-4">
                                    {mockNotificationLogs.map((log) => {
                                        const StatusIcon = getDeliveryStatusIcon(log.status);
                                        return (
                                            <div key={log.id} className="glass border-white/5 p-4 rounded-xl">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex items-center space-x-2">
                                                        <Badge variant="outline" style={getChannelTypeColor(log.channel, colors)}>
                                                            {log.channel.toUpperCase()}
                                                        </Badge>
                                                        <span style={typography.caption}>
                                                            {formatTimeAgo(log.timestamp)}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <StatusIcon size={12} style={{ color: getDeliveryStatusColor(log.status, colors) }} />
                                                        <Badge
                                                            variant="outline"
                                                            style={{
                                                                fontSize: '10px',
                                                                color: getDeliveryStatusColor(log.status, colors),
                                                                borderColor: `${getDeliveryStatusColor(log.status, colors)}40`,
                                                                backgroundColor: 'transparent'
                                                            }}
                                                        >
                                                            {log.status.toUpperCase()}
                                                        </Badge>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <div style={typography.caption}>
                                                        To: {log.recipient}
                                                    </div>
                                                    <div style={{ ...typography.body, fontSize: '13px', color: colors.text.primary }} className="break-words leading-relaxed">
                                                        {log.message}
                                                    </div>
                                                    {log.retries > 0 && (
                                                        <div className="flex items-center space-x-1">
                                                            <span style={typography.caption}>Retries:</span>
                                                            <Badge variant="outline" style={{ color: colors.status.warning.main, borderColor: colors.status.warning.outline, fontSize: '10px' }}>
                                                                {log.retries}
                                                            </Badge>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow style={{ borderColor: colors.background.border }}>
                                                <TableHead style={{ ...typography.label, color: colors.text.muted }} className="whitespace-nowrap">Time</TableHead>
                                                <TableHead style={{ ...typography.label, color: colors.text.muted }} className="whitespace-nowrap">Channel</TableHead>
                                                <TableHead style={{ ...typography.label, color: colors.text.muted }} className="whitespace-nowrap">Recipient</TableHead>
                                                <TableHead style={{ ...typography.label, color: colors.text.muted }} className="whitespace-nowrap w-auto min-w-0">Message</TableHead>
                                                <TableHead style={{ ...typography.label, color: colors.text.muted }} className="whitespace-nowrap">Status</TableHead>
                                                <TableHead style={{ ...typography.label, color: colors.text.muted }} className="whitespace-nowrap">Retries</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {mockNotificationLogs.map((log) => {
                                                const StatusIcon = getDeliveryStatusIcon(log.status);
                                                return (
                                                    <TableRow key={log.id} style={{ borderColor: colors.background.border }}>
                                                        <TableCell style={typography.caption} className="whitespace-nowrap">
                                                            {formatTimeAgo(log.timestamp)}
                                                        </TableCell>
                                                        <TableCell className="whitespace-nowrap">
                                                            <Badge variant="outline" style={getChannelTypeColor(log.channel, colors)}>
                                                                {log.channel.toUpperCase()}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell style={typography.caption} className="max-w-32">
                                                            <div className="truncate" title={log.recipient}>
                                                                {log.recipient}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell style={typography.caption} className="text-xs min-w-0 max-w-md">
                                                            <div
                                                                className="break-words whitespace-normal leading-relaxed"
                                                                title={log.message}
                                                                style={{ wordBreak: 'break-word', hyphens: 'auto', color: colors.text.secondary }}
                                                            >
                                                                {log.message}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="whitespace-nowrap">
                                                            <div className="flex items-center space-x-1">
                                                                <StatusIcon size={14} style={{ color: getDeliveryStatusColor(log.status, colors) }} />
                                                                <Badge
                                                                    variant="outline"
                                                                    style={{
                                                                        fontSize: '10px',
                                                                        color: getDeliveryStatusColor(log.status, colors),
                                                                        borderColor: `${getDeliveryStatusColor(log.status, colors)}40`,
                                                                        backgroundColor: 'transparent'
                                                                    }}
                                                                >
                                                                    {log.status.toUpperCase()}
                                                                </Badge>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="whitespace-nowrap">
                                                            {log.retries > 0 && (
                                                                <Badge variant="outline" style={{ color: colors.status.warning.main, borderColor: colors.status.warning.outline }}>
                                                                    {log.retries}
                                                                </Badge>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Test Notifications */}
                <TabsContent value="test" className="space-y-6">
                    <Card className="glass-primary border-white/5">
                        <CardHeader>
                            <CardTitle style={{ ...typography.body, fontWeight: '700', color: colors.text.primary }} className="flex items-center">
                                <TestTube className="w-5 h-5 mr-2" style={{ color: colors.notification.push }} />
                                Test Notifications
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="testMessage" style={{ color: colors.text.primary }}>Test Message</Label>
                                <Textarea
                                    id="testMessage"
                                    placeholder="Enter test notification message..."
                                    value={testMessage}
                                    onChange={(e) => handlers.setTestMessage(e.target.value)}
                                    style={{ backgroundColor: colors.background.app, borderColor: colors.background.border, color: colors.text.primary }}
                                    rows={3}
                                />
                            </div>
                            <Button
                                onClick={handlers.sendTestNotification}
                                disabled={!testMessage.trim()}
                                style={GlobalStyles.button.primary}
                                className="w-full"
                            >
                                <Send className="w-4 h-4 mr-2" />
                                Send Test Notification
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Recent Notifications */}
                <TabsContent value="recent" className="space-y-0">
                    <div className="space-y-0">
                        {recentNotifications.map((notification) => {
                            const TypeIcon = getNotificationTypeIcon(notification.type);

                            return (
                                <div key={notification.id} className="p-4" style={{ borderBottom: `1px solid ${colors.background.border}` }}>
                                    <div className="flex items-start space-x-3">
                                        <div className={`p-2 rounded-lg flex-shrink-0`} style={{ backgroundColor: `${getNotificationTypeColor(notification.type, colors)}20` }}>
                                            <TypeIcon size={16} style={{ color: getNotificationTypeColor(notification.type, colors) }} />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between mb-1">
                                                <h4 style={{ ...typography.body, fontWeight: '700', color: colors.text.primary }}>{notification.title}</h4>
                                                <div className="flex items-center space-x-2 ml-2">
                                                    <Badge className="text-[9px] font-black tracking-widest px-3 py-1 bg-slate-800/90" style={{ color: getSeverityColor(notification.severity, colors), border: `1px solid ${getSeverityColor(notification.severity, colors)}40` }}>
                                                        {notification.severity.toUpperCase()}
                                                    </Badge>
                                                </div>
                                            </div>

                                            <p style={{ ...typography.body, color: colors.text.secondary, fontSize: '12px' }} className="mb-3 break-words leading-relaxed opacity-80">
                                                {notification.message}
                                            </p>

                                            {notification.location && (
                                                <div className="flex items-center space-x-1 mb-2">
                                                    <MapPin size={12} style={{ color: colors.text.muted }} />
                                                    <span style={typography.caption}>{notification.location}</span>
                                                </div>
                                            )}

                                            {notification.user && (
                                                <div className="flex items-center space-x-1 mb-2">
                                                    <span style={typography.caption}>by {notification.user}</span>
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <Clock size={12} style={{ color: colors.text.muted }} />
                                                    <span style={typography.caption}>{formatTimeAgo(notification.timestamp)}</span>
                                                </div>

                                                <Badge className="text-[9px] font-black tracking-[0.3em] px-3 py-1" style={{ backgroundColor: `${getDeliveryStatusBadgeColor(notification.status, colors)}30`, color: getDeliveryStatusBadgeColor(notification.status, colors), border: `1px solid ${getDeliveryStatusBadgeColor(notification.status, colors)}50` }}>
                                                    {getDeliveryStatusBadge(notification.status)}
                                                </Badge>
                                            </div>

                                            {notification.channels && (
                                                <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${colors.background.border}` }}>
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <span style={typography.caption}>Delivered to:</span>
                                                    </div>
                                                    <div className="flex gap-2 flex-wrap">
                                                        {notification.channels.map((channel, index) => (
                                                            <Badge
                                                                key={index}
                                                                variant="outline"
                                                                style={getChannelTypeColor(channel, colors)}
                                                            >
                                                                {channel.toUpperCase()}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};
