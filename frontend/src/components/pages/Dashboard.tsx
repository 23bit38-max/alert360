import { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useTheme } from '../../theme';
import type {
  DashboardData,
  Alert,
  AIInsight
} from '../../types/dashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  getAccessibleZones,
  canAccessZone
} from '../../utils/rbac';
import { ScrollArea } from '../ui/scroll-area';

import {
  getDashboardData,
  getFilteredAlerts,
  getAIInsights,
  CHART_DATA
} from '../../data/data';

import {
  AlertTriangle,
  Camera,
  Shield,
  Users,
  Activity,
  Zap,
  Bell,
  ArrowRight,
  RefreshCw,
  Database,
  Cpu,
  Clock,
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

export const Dashboard = () => {
  const { user } = useAuth();
  const { colors } = useTheme();

  if (!user) return null;
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const accessibleZones = getAccessibleZones(user);
  const rawDashboard: any = getDashboardData(user?.role);

  const dashboardData: DashboardData = {
    totalAccidents: rawDashboard?.totalAccidents ?? rawDashboard?.accidents ?? 0,
    alertsSent: rawDashboard?.alertsSent ?? rawDashboard?.alerts ?? 0,
    liveCameras: rawDashboard?.liveCameras ?? rawDashboard?.cameras ?? 0,
    activeResponders: rawDashboard?.activeResponders ?? rawDashboard?.responders ?? 0,
    departmentBreakdown: rawDashboard?.departmentBreakdown ?? {
      police: { accidents: 0, alerts: 0, responders: 0 },
      fire: { accidents: 0, alerts: 0, responders: 0 },
      hospital: { accidents: 0, alerts: 0, responders: 0 },
    }
  };

  const rawAlerts: any[] = (getFilteredAlerts(user?.role, user?.department, user?.assignedZones) ?? [])
    .filter((alert: any) =>
      accessibleZones.includes('all') || canAccessZone(user, alert.zone)
    );
  const recentAlerts: Alert[] = rawAlerts
    .map((a: any) => ({
      ...a,
      time: a.time ?? (a.timestamp ? (new Date(a.timestamp)).toLocaleTimeString().slice(0, -3) : '')
    } as Alert))
    .slice(0, 6);

  const rawInsights: any[] = getAIInsights(user?.role) ?? [];
  const aiInsights: AIInsight[] = rawInsights
    .map((i: any) => ({
      type: ['warning', 'prediction', 'analysis', 'optimization', 'critical'].includes(i?.type) ? i.type : 'analysis',
      title: i?.title ?? '',
      message: i?.message ?? '',
      confidence: i?.confidence ?? 0,
      time: i?.time ?? '',
      department: i?.department ?? ''
    }))
    .slice(0, 4);

  const { accidentTrend, responseTime } = CHART_DATA;

  const handleRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const QuickMetric = ({ title, value, change, icon: Icon, color }: any) => {
    const statusColor = color === 'red' ? '#EF4444' :
      color === 'blue' ? '#3B82F6' :
        color === 'green' ? colors.accent.primary :
          colors.accent.primary;

    return (
      <div
        className="glass hover-lift premium-shadow group relative overflow-hidden p-6 rounded-[20px]"
      >
        <div
          className="absolute top-0 right-0 w-32 h-32 bg-current opacity-[0.03] rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"
          style={{ color: statusColor }}
        />

        <div className="flex items-center justify-between mb-4 relative z-10">
          <div
            className="w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110"
            style={{
              backgroundColor: `${statusColor}15`,
              color: statusColor,
              boxShadow: `0 0 15px ${statusColor}20`
            }}
          >
            <Icon size={24} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase opacity-60">Status</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-bold text-primary">LIVE</span>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">{title}</p>
          <div className="flex items-baseline gap-3">
            <h3 className="text-3xl font-black text-white tracking-tight">{value}</h3>
            <Badge className="bg-white/5 border-white/10 text-primary text-[10px] font-bold">
              {change}
            </Badge>
          </div>
        </div>
      </div>
    );
  };

  const SystemStatusItem = ({ icon: Icon, label, status }: any) => {
    return (
      <div className="glass px-4 py-3 rounded-xl border-white/5 flex items-center gap-3 hover:bg-white/5 transition-colors group">
        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
          <Icon size={16} />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60 mb-0.5">{label}</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
            <span className="text-[10px] font-bold text-white uppercase">{status}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="page-container animate-in fade-in duration-1000 pb-24 lg:pb-12 max-w-[1600px] mx-auto">
      {/* ===== OPERATIONAL CONTROL BAR ===== */}
      <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/5">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 border border-primary/20 rounded-xl">
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{currentTime.toLocaleTimeString()}</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
            <Activity size={14} className="text-slate-500" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Efficiency: 99.9%</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
            className="h-10 px-5 rounded-xl glass border-white/10 hover:bg-white/5 text-[10px] font-black uppercase tracking-widest"
          >
            <RefreshCw size={14} className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Sync Pulse
          </Button>
          <Button
            className="h-10 px-6 rounded-xl bg-primary text-white font-black uppercase tracking-widest text-[10px] shadow-[0_8px_20px_rgba(16,185,129,0.2)] hover:scale-105 transition-all"
          >
            <Zap size={14} className="mr-2" />
            Override
          </Button>
        </div>
      </div>

      {/* ===== SYSTEM PULSE BAR ===== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <SystemStatusItem icon={Shield} label="Security" status="Shielded" />
        <SystemStatusItem icon={Database} label="Intelligence" status="Synced" />
        <SystemStatusItem icon={Cpu} label="Compute" status="Optimal" />
        <SystemStatusItem icon={Activity} label="Traffic" status="Nominal" />
      </div>

      {/* ===== PRIMARY KPI GRID ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <QuickMetric title="Incidents Logged" value={dashboardData.totalAccidents} change="+2.4%" color="red" icon={AlertTriangle} />
        <QuickMetric title="Alerts Dispatched" value={dashboardData.alertsSent} change="+14.1%" color="blue" icon={Bell} />
        <QuickMetric title="Responding Units" value={dashboardData.activeResponders} change="Active" color="green" icon={Users} />
        <QuickMetric title="Live Visuals" value={dashboardData.liveCameras} change="Online" color="blue" icon={Camera} />
      </div>

      {/* ===== ANALYTICS SECTION ===== */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mb-10">
        <Card className="xl:col-span-8 glass border-white/5 rounded-[32px] overflow-hidden p-8">
          <CardHeader className="flex flex-row items-start justify-between pb-10">
            <div>
              <CardTitle className="text-2xl font-bold tracking-tight text-white">Neural Incident Map</CardTitle>
              <CardDescription className="text-sm font-medium text-muted-foreground mt-1 uppercase tracking-widest opacity-60">24H Activity Timeline</CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge className="bg-primary/10 text-primary border-primary/20">Frequency</Badge>
              <Badge variant="outline" className="border-white/10 text-muted-foreground opacity-50">Volume</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={accidentTrend}>
                  <defs>
                    <linearGradient id="colorAccidents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={colors.accent.primary} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={colors.accent.primary} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis
                    dataKey="time"
                    stroke="rgba(255,255,255,0.4)"
                    fontSize={10}
                    fontWeight="bold"
                    axisLine={false}
                    tickLine={false}
                    dy={15}
                  />
                  <YAxis
                    stroke="rgba(255,255,255,0.4)"
                    fontSize={10}
                    fontWeight="bold"
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '16px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.6)'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="accidents"
                    stroke={colors.accent.primary}
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorAccidents)"
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="xl:col-span-4 space-y-8">
          <Card className="glass border-white/5 rounded-[24px] p-6 shadow-2xl">
            <CardHeader className="pb-6">
              <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-primary">Departmental Pulse</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {dashboardData.departmentBreakdown && Object.entries(dashboardData.departmentBreakdown).map(([dept, data]: [string, any]) => (
                <div key={dept} className="group">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${dept === 'police' ? 'bg-blue-500' : dept === 'fire' ? 'bg-red-500' : 'bg-primary'}`} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{dept} COMMAND</span>
                    </div>
                    <span className="text-xs font-black text-white">{data.responders} Units</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (data.responders / 40) * 100)}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full rounded-full ${dept === 'police' ? 'bg-blue-500' : dept === 'fire' ? 'bg-red-500' : 'bg-primary'} shadow-[0_0_10px_currentColor] opacity-70 group-hover:opacity-100 transition-opacity`}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="glass border-white/5 rounded-[24px] overflow-hidden p-6 relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Cpu size={64} />
            </div>
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60">System Efficiency</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={responseTime}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                    <XAxis dataKey="zone" stroke="rgba(255,255,255,0.3)" fontSize={9} fontWeight="bold" axisLine={false} tickLine={false} />
                    <Bar dataKey="avgTime" radius={[6, 6, 0, 0]}>
                      {responseTime.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.avgTime > entry.target ? '#EF4444' : colors.accent.primary} className="opacity-80 hover:opacity-100 transition-opacity" />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ===== OPERATIONAL FEED & INTEL ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 glass border-white/5 rounded-[32px] overflow-hidden p-0 shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 pb-6 px-10 pt-10">
            <div>
              <CardTitle className="text-2xl font-bold tracking-tight text-white">Tactical Log</CardTitle>
              <CardDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground opacity-60">Live alert sequence delta</CardDescription>
            </div>
            <Button variant="ghost" className="text-xs font-black uppercase tracking-widest text-primary hover:bg-primary/10">
              Full Archive <ArrowRight size={14} className="ml-2" />
            </Button>
          </CardHeader>
          <ScrollArea className="h-[450px]">
            <div className="px-6 py-2">
              {recentAlerts.map((alert) => (
                <div key={alert.id} className="m-4 p-6 glass border-white/5 rounded-[20px] hover:bg-white/5 hover:scale-[1.01] transition-all cursor-pointer group">
                  <div className="flex items-start gap-6">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-colors ${alert.type === 'critical'
                        ? 'bg-red-600/90 border-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]'
                        : 'bg-primary/20 border-primary/40 text-primary'
                        }`}
                    >
                      <AlertTriangle size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-lg font-bold text-white tracking-tight group-hover:text-primary transition-colors truncate">{alert.location}</h4>
                        <Badge className="bg-white/5 text-muted-foreground text-[10px]">{alert.time}</Badge>
                      </div>
                      <p className="text-sm font-medium text-muted-foreground mb-4">{alert.vehicles} Vehicles Involved • <span className="text-white opacity-80">{alert.status}</span></p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-full border border-primary/10">
                          <Shield size={12} className="text-primary" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-primary">Priority Alpha</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users size={12} className="text-muted-foreground" />
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">3 Units ONSITE</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" className="glass border-white/10 h-10 px-6 rounded-xl self-center font-bold text-xs uppercase tracking-widest group-hover:bg-primary group-hover:text-white transition-all">Details</Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>

        <Card className="glass border-primary/20 rounded-[32px] overflow-hidden p-8 shadow-[0_0_30px_rgba(16,185,129,0.1)] relative">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
          <CardHeader className="relative z-10 pb-8">
            <CardTitle className="text-xl font-bold tracking-tight text-white flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <Zap size={20} />
              </div>
              Strategic Intel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 relative z-10">
            {aiInsights.map((insight, index) => (
              <div key={index} className="p-5 glass border-white/5 rounded-2xl hover:bg-white/5 transition-all group">
                <div className="flex justify-between items-center mb-3">
                  <Badge className="bg-primary/20 text-primary border-none text-[9px] font-black tracking-widest uppercase">{insight.type}</Badge>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1 h-1 bg-primary rounded-full" />
                    <span className="text-[9px] font-black text-muted-foreground tracking-widest">{insight.confidence}% ACCURACY</span>
                  </div>
                </div>
                <h5 className="text-sm font-bold text-white mb-2 group-hover:text-primary transition-colors">{insight.title}</h5>
                <p className="text-xs leading-relaxed text-muted-foreground opacity-80">{insight.message}</p>
              </div>
            ))}
          </CardContent>
          <div className="p-4 mt-auto relative z-10">
            <Button className="w-full h-12 rounded-xl glass border-primary/30 text-primary font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-primary hover:text-white transition-all">
              Initialize Intel Protocol
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};