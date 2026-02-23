import { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Bell,
  Mail,
  MessageSquare,
  Phone,
  Volume2,
  VolumeX,
  Settings,
  User,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Send,
  Slack,
  Activity,
  Wifi,
  WifiOff,
  Plus,
  Edit3,
  Trash2,
  TestTube,
  Shield,
  Users,
  Download,
  Eye,
  Server,
  Link,
  FileText,
  MapPin,
} from 'lucide-react';
import { Textarea } from '../ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useTheme, GlobalStyles } from '../../theme';

interface NotificationChannel {
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

interface NotificationLog {
  id: string;
  timestamp: Date;
  channel: string;
  recipient: string;
  message: string;
  status: 'sent' | 'failed' | 'pending';
  severity: 'critical' | 'high' | 'medium' | 'low';
  retries: number;
}

interface RecentNotification {
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

export const NotificationControl = () => {
  const { user } = useAuth();
  const { colors, typography } = useTheme();
  const [muteAll, setMuteAll] = useState(false);
  const [muteUntil, setMuteUntil] = useState<Date | null>(null);
  const [testMessage, setTestMessage] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const [channels, setChannels] = useState<NotificationChannel[]>([
    {
      id: 'email-1',
      type: 'email',
      name: 'Primary Email',
      enabled: true,
      address: user?.email || 'admin@Mumbaiemergency.gov.in',
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
  ]);

  const mockNotificationLogs: NotificationLog[] = [
    {
      id: 'log-1',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      channel: 'email',
      recipient: user?.email || 'admin@Mumbaiemergency.gov.in',
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
      recipient: user?.email || 'admin@Mumbaiemergency.gov.in',
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

  // Recent notifications matching the reference image exactly
  const recentNotifications: RecentNotification[] = [
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
      user: user?.name || 'System Administrator',
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
      user: user?.name || 'System Administrator',
      status: 'completed'
    },
    {
      id: 'recent-6',
      type: 'preference_update',
      timestamp: new Date(Date.now() - 75 * 60 * 1000),
      title: 'Notification Preferences Updated',
      message: 'Quiet hours enabled for SMS channel (23:00 - 07:00)',
      severity: 'low',
      user: user?.name || 'System Administrator',
      status: 'completed'
    }
  ];

  // Utility functions
  const getChannelIcon = (type: string) => {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return colors.status.safe.main;
      case 'disconnected': return colors.text.muted;
      case 'error': return colors.status.critical.main;
      case 'testing': return colors.status.warning.main;
      default: return colors.text.muted;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return Wifi;
      case 'disconnected': return WifiOff;
      case 'error': return AlertTriangle;
      case 'testing': return TestTube;
      default: return Clock;
    }
  };

  const getChannelTypeColor = (type: string) => {
    const channelColor = colors.notification?.[type as keyof typeof colors.notification] || colors.text.muted;
    return {
      backgroundColor: `${channelColor}20`,
      color: channelColor,
      borderColor: `${channelColor}40`,
      borderWidth: '1px'
    };
  };

  const getDeliveryStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return colors.status.safe.main;
      case 'failed': return colors.status.critical.main;
      case 'pending': return colors.status.warning.main;
      default: return colors.text.muted;
    }
  };

  const getDeliveryStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return CheckCircle;
      case 'failed': return XCircle;
      case 'pending': return Clock;
      default: return Clock;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return colors.status.critical.main;
      case 'high': return colors.status.warning.main;
      case 'medium': return colors.accent.primary;
      case 'low': return colors.status.safe.main;
      default: return colors.text.muted;
    }
  };

  const getNotificationTypeIcon = (type: string) => {
    switch (type) {
      case 'alert': return AlertTriangle;
      case 'channel_update': return Settings;
      case 'test': return TestTube;
      case 'preference_update': return User;
      default: return Bell;
    }
  };

  const getNotificationTypeColor = (type: string) => {
    switch (type) {
      case 'alert': return colors.status.critical.main;
      case 'channel_update': return colors.accent.primary;
      case 'test': return colors.notification.push;
      case 'preference_update': return colors.status.safe.main;
      default: return colors.text.muted;
    }
  };

  const getDeliveryStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered': return 'DELI';
      case 'completed': return 'COMP';
      case 'failed': return 'FAIL';
      default: return 'PEND';
    }
  };

  const getDeliveryStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'delivered': return colors.status.safe.main;
      case 'completed': return colors.accent.primary;
      case 'failed': return colors.status.critical.main;
      default: return colors.status.warning.main;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

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

  const exportChannelConfig = () => {
    const config = JSON.stringify(channels, null, 2);
    const blob = new Blob([config], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'notification-channels-config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 max-w-full overflow-hidden pb-20 md:pb-6">
      {/* Header */}
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
            onClick={muteAll ? handleUnmute : () => handleMuteAll(15)}
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
        <Card style={GlobalStyles.card}>
          <CardHeader>
            <CardTitle style={{ ...typography.body, fontWeight: '700', color: colors.text.primary }} className="flex items-center">
              <VolumeX className="w-5 h-5 mr-2" />
              Quick Mute
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`flex gap-3 ${isMobile ? 'flex-col' : 'flex-wrap'}`}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleMuteAll(15)}
                className="border-amber-500/50 text-amber-500 bg-amber-500/10 hover:bg-amber-500/20"
              >
                <Clock className="w-4 h-4 mr-2" />
                15 Minutes
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleMuteAll(60)}
                className="border-amber-500/40 text-amber-500 bg-amber-500/5 hover:bg-amber-500/10"
              >
                <Clock className="w-4 h-4 mr-2" />
                1 Hour
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleMuteAll(480)}
                className="border-red-500/50 text-red-500 bg-red-500/10 hover:bg-red-500/20"
              >
                <Clock className="w-4 h-4 mr-2" />
                8 Hours
              </Button>
            </div>
          </CardContent>
        </Card>
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
              <Button style={GlobalStyles.button.secondary} size="sm" onClick={exportChannelConfig}>
                <Download className="w-4 h-4 mr-2" />
                Export Config
              </Button>
              <Button size="sm" onClick={addNewChannel} style={GlobalStyles.button.primary}>
                <Plus className="w-4 h-4 mr-2" />
                Add Channel
              </Button>
            </div>
          </div>

          {/* Channel Health Overview */}
          <div className={`grid gap-4 ${isMobile ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-4'}`}>
            {[
              { label: 'Avg Latency', value: `${(channels.reduce((sum, c) => sum + (c.responseTime || 0), 0) / channels.filter(c => c.responseTime).length).toFixed(1)}s`, icon: Activity, color: colors.accent.primary },
              { label: 'Uptime Score', value: `${(channels.reduce((sum, c) => sum + c.successRate, 0) / channels.length).toFixed(1)}%`, icon: CheckCircle, color: colors.status.safe.main },
              { label: 'Nodes Tracked', value: channels.length, icon: Server, color: colors.accent.primary, hideOnMobile: true },
              { label: 'Failures Blocked', value: '184', icon: Shield, color: colors.status.critical.main, hideOnMobile: true },
            ].map((item, i) => (
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

          {/* Enhanced Channel Cards */}
          <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 xl:grid-cols-2'}`}>
            {channels.map((channel) => {
              const Icon = getChannelIcon(channel.type);
              const StatusIcon = getStatusIcon(channel.status);
              return (
                <Card key={channel.id} className="glass border-white/5 overflow-hidden">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 min-w-0 flex-1">
                        <div className={`p-3 rounded-xl`} style={{ backgroundColor: channel.enabled ? `${colors.accent.primary}30` : `${colors.text.muted}20`, border: `1px solid ${channel.enabled ? colors.accent.primary : colors.text.muted}40` }}>
                          <Icon className={`w-6 h-6`} style={{ color: channel.enabled ? colors.accent.primary : colors.text.muted }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <CardTitle style={{ ...typography.body, fontWeight: '700', color: colors.text.primary }} className="truncate">{channel.name}</CardTitle>
                            <Badge variant="outline" style={getChannelTypeColor(channel.type)}>
                              {channel.type.toUpperCase()}
                            </Badge>
                          </div>
                          <p style={typography.caption} className="truncate">{channel.address}</p>
                          <div className={`flex items-center mt-2 ${isMobile ? 'flex-wrap gap-1' : 'space-x-4'}`}>
                            <div className="flex items-center space-x-1">
                              <StatusIcon size={14} style={{ color: getStatusColor(channel.status) }} />
                              <span style={{ fontSize: '11px', color: getStatusColor(channel.status), fontWeight: '700' }}>
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
                          onCheckedChange={() => handleChannelToggle(channel.id)}
                        />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <Eye className="h-4 w-4" style={{ color: colors.text.muted }} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" style={{ backgroundColor: colors.background.surface, borderColor: colors.background.border }}>
                            <DropdownMenuItem onClick={() => testChannel(channel.id)} style={{ color: colors.text.secondary }}>
                              <TestTube className="w-4 h-4 mr-2" />
                              Test Channel
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => editChannel(channel.id)} style={{ color: colors.text.secondary }}>
                              <Edit3 className="w-4 h-4 mr-2" />
                              Edit Settings
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => deleteChannel(channel.id)} style={{ color: colors.status.critical.main }}>
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
                                onCheckedChange={() => handleSeverityToggle(channel.id, severity)}
                                disabled={!channel.enabled}
                              />
                              <Label
                                htmlFor={`${channel.id}-${severity}`}
                                style={{
                                  fontSize: '11px',
                                  textTransform: 'capitalize',
                                  color: getSeverityColor(severity)
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
            })}
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
                // Mobile Card Layout
                <div className="space-y-3 p-4">
                  {mockNotificationLogs.map((log) => {
                    const StatusIcon = getDeliveryStatusIcon(log.status);
                    return (
                      <div key={log.id} className="glass border-white/5 p-4 rounded-xl">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" style={getChannelTypeColor(log.channel)}>
                              {log.channel.toUpperCase()}
                            </Badge>
                            <span style={typography.caption}>
                              {formatTimeAgo(log.timestamp)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <StatusIcon size={12} style={{ color: getDeliveryStatusColor(log.status) }} />
                            <Badge
                              variant="outline"
                              style={{
                                fontSize: '10px',
                                color: getDeliveryStatusColor(log.status),
                                borderColor: `${getDeliveryStatusColor(log.status)}40`,
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
                // Desktop Table Layout
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
                              <Badge variant="outline" style={getChannelTypeColor(log.channel)}>
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
                                <StatusIcon size={14} style={{ color: getDeliveryStatusColor(log.status) }} />
                                <Badge
                                  variant="outline"
                                  style={{
                                    fontSize: '10px',
                                    color: getDeliveryStatusColor(log.status),
                                    borderColor: `${getDeliveryStatusColor(log.status)}40`,
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
                  onChange={(e) => setTestMessage(e.target.value)}
                  style={{ backgroundColor: colors.background.app, borderColor: colors.background.border, color: colors.text.primary }}
                  rows={3}
                />
              </div>
              <Button
                onClick={sendTestNotification}
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

        {/* Recent Notifications - Fixed to match reference image exactly */}
        <TabsContent value="recent" className="space-y-0">
          <div className="space-y-0">
            {recentNotifications.map((notification) => {
              const TypeIcon = getNotificationTypeIcon(notification.type);

              return (
                <div key={notification.id} className="p-4" style={{ borderBottom: `1px solid ${colors.background.border}` }}>
                  <div className="flex items-start space-x-3">
                    {/* Type Icon */}
                    <div className={`p-2 rounded-lg flex-shrink-0`} style={{ backgroundColor: `${getNotificationTypeColor(notification.type)}20` }}>
                      <TypeIcon size={16} style={{ color: getNotificationTypeColor(notification.type) }} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h4 style={{ ...typography.body, fontWeight: '700', color: colors.text.primary }}>{notification.title}</h4>
                        <div className="flex items-center space-x-2 ml-2">
                          <Badge className="text-[9px] font-black tracking-widest px-3 py-1 bg-slate-800/90" style={{ color: getSeverityColor(notification.severity), border: `1px solid ${getSeverityColor(notification.severity)}40` }}>
                            {notification.severity.toUpperCase()}
                          </Badge>
                        </div>
                      </div>

                      <p style={{ ...typography.body, color: colors.text.secondary, fontSize: '12px' }} className="mb-3 break-words leading-relaxed opacity-80">
                        {notification.message}
                      </p>

                      {/* Location */}
                      {notification.location && (
                        <div className="flex items-center space-x-1 mb-2">
                          <MapPin size={12} style={{ color: colors.text.muted }} />
                          <span style={typography.caption}>{notification.location}</span>
                        </div>
                      )}

                      {/* User */}
                      {notification.user && (
                        <div className="flex items-center space-x-1 mb-2">
                          <span style={typography.caption}>by {notification.user}</span>
                        </div>
                      )}

                      {/* Time and Status */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Clock size={12} style={{ color: colors.text.muted }} />
                          <span style={typography.caption}>{formatTimeAgo(notification.timestamp)}</span>
                        </div>

                        <Badge className="text-[9px] font-black tracking-[0.3em] px-3 py-1" style={{ backgroundColor: `${getDeliveryStatusBadgeColor(notification.status)}30`, color: getDeliveryStatusBadgeColor(notification.status), border: `1px solid ${getDeliveryStatusBadgeColor(notification.status)}50` }}>
                          {getDeliveryStatusBadge(notification.status)}
                        </Badge>
                      </div>

                      {/* Delivered to channels */}
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
                                style={getChannelTypeColor(channel)}
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
