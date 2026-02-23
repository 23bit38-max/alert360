import React, { useState, useMemo } from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  FileText,
  TrendingDown,
  Activity,
  Zap,
  Target,
  ArrowRight,
  Brain,
  Layers,
  Download as DownloadIcon,
  AlertTriangle,
  CheckCircle,
  Mail,
  Shield,
  Repeat,
  Settings,
  Filter,
  ArrowUpRight,
  Clock,
  Info,
  Globe,
  Box,
  Crosshair,
  UserCheck,
} from 'lucide-react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  ReferenceLine,
  Area,
  Line,
  Treemap,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PieChart,
  Pie,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import { motion } from 'framer-motion';

export const ReportsAnalytics = () => {
  // --- MOCK DATA ARCHITECTURE ---

  // Daily granularity
  const velocityData = [
    { date: 'Feb 14', incident: 42, resolution: 38, anomaly: false },
    { date: 'Feb 15', incident: 35, resolution: 36, anomaly: false },
    { date: 'Feb 16', incident: 85, resolution: 62, anomaly: true },
    { date: 'Feb 17', incident: 65, resolution: 68, anomaly: false },
    { date: 'Feb 18', incident: 94, resolution: 75, anomaly: true },
    { date: 'Feb 19', incident: 55, resolution: 58, anomaly: false },
    { date: 'Feb 20', incident: 48, resolution: 50, anomaly: false },
  ];

  const slaBySeverity = [
    { severity: 'Critical', compliance: 92, target: 98, fill: '#EF4444' },
    { severity: 'High', compliance: 95, target: 95, fill: '#F59E0B' },
    { severity: 'Medium', compliance: 98, target: 95, fill: '#3B82F6' },
    { severity: 'Low', compliance: 100, target: 95, fill: '#10B981' },
  ];

  const forecastData = [
    { date: 'Feb 21', actual: 65, prediction: 60, low: 55, high: 65 },
    { date: 'Feb 22', actual: 72, prediction: 68, low: 62, high: 74 },
    { date: 'Feb 23', actual: 81, prediction: 75, low: 70, high: 82 },
    { date: 'Feb 24', actual: null, prediction: 72, low: 65, high: 78 },
    { date: 'Feb 25', actual: null, prediction: 78, low: 70, high: 86 },
    { date: 'Feb 26', actual: null, prediction: 85, low: 75, high: 95 },
  ];

  // Operator Activeness Heatmap (GitHub style)
  const operatorActiveness = useMemo(() => {
    return Array.from({ length: 53 }).map((_, weekIndex) => ({
      week: weekIndex,
      days: Array.from({ length: 7 }).map(() => ({
        value: Math.floor(Math.random() * 10),
        label: `Operator Response: ${Math.floor(Math.random() * 100)}% reliability`
      }))
    }));
  }, []);

  const categoryData = [
    { name: 'System Intrusion', size: 400, color: '#EF4444' },
    { name: 'Device Failure', size: 300, color: '#F59E0B' },
    { name: 'Access Violation', size: 200, color: '#3B82F6' },
    { name: 'Sensor Drift', size: 150, color: '#10B981' },
    { name: 'Protocol Lag', size: 100, color: '#8B5CF6' },
  ];

  const radarData = [
    { subject: 'Resolution Time', A: 120, B: 110, fullMark: 150 },
    { subject: 'Accuracy', A: 98, B: 130, fullMark: 150 },
    { subject: 'Protocol Adherence', A: 86, B: 130, fullMark: 150 },
    { subject: 'Reporting Speed', A: 99, B: 100, fullMark: 150 },
    { subject: 'SLA Maintenance', A: 85, B: 90, fullMark: 150 },
  ];

  const postureData = [
    { name: 'Secure', value: 85, fill: '#10B981' },
    { name: 'Risk', value: 15, fill: 'rgba(255,255,255,0.05)' },
  ];

  const severityTimeline = [
    { date: 'Mon', critical: 12, high: 24, mid: 45 },
    { date: 'Tue', critical: 18, high: 32, mid: 38 },
    { date: 'Wed', critical: 8, high: 28, mid: 52 },
    { date: 'Thu', critical: 24, high: 45, mid: 31 },
    { date: 'Fri', critical: 15, high: 38, mid: 44 },
    { date: 'Sat', critical: 5, high: 15, mid: 22 },
    { date: 'Sun', critical: 7, high: 12, mid: 25 },
  ];

  const MetricCard = ({ title, value, change, icon: Icon, colorClass }: any) => (
    <Card className="glass border-white/5 rounded-2xl p-4 premium-shadow hover:bg-white/[0.02] transition-all relative overflow-hidden group border-l-2" style={{ borderLeftColor: colorClass }}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">{title}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-black text-white tracking-tighter">{value}</p>
            <span className={`text-[8px] font-black flex items-center ${change.includes('+') && !title.includes('Response') ? 'text-primary' : 'text-red-400'}`}>
              {change.includes('+') ? <ArrowUpRight size={10} /> : <TrendingDown size={10} />} {change}
            </span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center">
          <Icon size={18} style={{ color: colorClass }} />
        </div>
      </div>
    </Card>
  );

  const CustomTreemapContent = (props: any) => {
    const { x, y, width, height, name, color } = props;
    if (width < 30 || height < 20) return null;
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill: color,
            fillOpacity: 0.2,
            stroke: color,
            strokeWidth: 2,
            strokeOpacity: 0.5,
          }}
        />
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          fill="#fff"
          fontSize={10}
          fontWeight="900"
          className="uppercase tracking-tighter"
        >
          {name}
        </text>
      </g>
    );
  };

  return (
    <div className="page-container animate-in fade-in duration-800 max-w-[1700px] mx-auto pb-12 p-8 space-y-8">

      {/* 1. STRATEGIC EXECUTIVE SUMMARY */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard title="Total Managed Incidents" value="1,280" change="+12%" icon={AlertTriangle} colorClass="#EF4444" />
          <MetricCard title="Avg Resolution Velocity" value="4.3m" change="-8%" icon={Zap} colorClass="#F59E0B" />
          <MetricCard title="Compliance Stabilization" value="94.2%" change="+2%" icon={CheckCircle} colorClass="#10B981" />
          <MetricCard title="Command Uptime" value="99.98%" change="STABLE" icon={Activity} colorClass="#3B82F6" />
        </div>
        <div className="w-full lg:w-[400px]">
          <Card className="glass h-full rounded-2xl border-white/5 p-4 flex items-center gap-6">
            <div className="relative w-24 h-24">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={postureData}
                    cx="50%"
                    cy="50%"
                    innerRadius={32}
                    outerRadius={44}
                    startAngle={90}
                    endAngle={450}
                    dataKey="value"
                    stroke="none"
                  >
                    {postureData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-lg font-black text-white leading-none">85%</span>
                <span className="text-[7px] font-black text-white/30 uppercase tracking-widest mt-1">Safe</span>
              </div>
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <Shield size={12} className="text-primary" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Command Posture</span>
              </div>
              <p className="text-2xl font-black text-white tracking-tighter">64.2</p>
              <div className="flex items-center gap-2">
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-400 w-[64%]" />
                </div>
                <span className="text-[8px] font-black text-orange-400 uppercase">Moderate ↑</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* 2. OPERATIONAL INTELLIGENCE (DAILY TRENDS) */}
      <div className="grid grid-cols-12 gap-6">
        <Card className="glass col-span-12 lg:col-span-8 rounded-3xl border-white/5 p-6 premium-shadow">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Target size={16} className="text-primary" />
              <h3 className="text-[11px] font-black text-white tracking-[0.2em] uppercase">Daily Incident vs Resolution Flux</h3>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500" /><span className="text-[9px] font-black text-white/40 uppercase">Incidents</span></div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary" /><span className="text-[9px] font-black text-white/40 uppercase">Resolutions</span></div>
            </div>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={velocityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.2)" fontSize={9} axisLine={false} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={9} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '10px', textTransform: 'uppercase' }}
                />
                <Area type="monotone" dataKey="incident" fill="rgba(239, 68, 68, 0.05)" stroke="#EF4444" strokeWidth={2} />
                <Line type="monotone" dataKey="resolution" stroke="#10B981" strokeWidth={2} dot={{ r: 3, fill: '#10B981' }} />
                {velocityData.filter(d => d.anomaly).map((d, i) => (
                  <ReferenceLine key={i} x={d.date} stroke="rgba(239, 68, 68, 0.3)" strokeDasharray="3 3" label={{ position: 'top', value: '⚠ SPIKE', fill: '#EF4444', fontSize: 8, fontWeight: 'black' }} />
                ))}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="glass col-span-12 lg:col-span-4 rounded-3xl border-white/5 p-6 premium-shadow flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Crosshair size={16} className="text-red-400" />
              <h3 className="text-[11px] font-black text-white tracking-[0.2em] uppercase">Daily Severity Distribution</h3>
            </div>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={severityTimeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.2)" fontSize={9} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
                <Bar dataKey="critical" stackId="a" fill="#EF4444" radius={[0, 0, 0, 0]} />
                <Bar dataKey="high" stackId="a" fill="#F59E0B" />
                <Bar dataKey="mid" stackId="a" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* 3. OPERATOR READINESS & ACTIVENESS AUDIT */}
      <Card className="glass rounded-3xl border-white/5 p-6 premium-shadow">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <UserCheck size={16} className="text-primary" />
            <h3 className="text-[11px] font-black text-white tracking-[0.2em] uppercase">Operator Activeness & Response Consistency</h3>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">365-Day Performance Archive</span>
            <Badge className="bg-primary/10 text-primary border-primary/20 text-[8px] font-black">EXPERT RANK</Badge>
          </div>
        </div>
        <div className="overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex gap-1.5 min-w-[1200px]">
            {operatorActiveness.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-1.5">
                {week.days.map((day, di) => {
                  const opacity = 0.05 + (day.value / 10) * 0.9;
                  return (
                    <div
                      key={di}
                      className="w-4 h-4 rounded-[3px] transition-all hover:scale-125 cursor-help"
                      style={{ backgroundColor: `rgba(16, 185, 129, ${opacity})`, border: '1px solid rgba(255,255,255,0.02)' }}
                      title={day.label}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-[9px] font-black text-white/30 uppercase tracking-widest">
            <span>Low Engagement</span>
            <div className="flex gap-1">
              {[0.1, 0.3, 0.6, 1].map(v => <div key={v} className="w-3 h-3 rounded-[2px] bg-primary" style={{ opacity: v }} />)}
            </div>
            <span>Peak Readiness</span>
          </div>
          <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Historical Reliability Index: <span className="text-white">98.4%</span></p>
        </div>
      </Card>

      {/* 4. PERFORMANCE BREAKDOWN (RADAR & TREEMAP) */}
      <div className="grid grid-cols-12 gap-6">
        <Card className="glass col-span-12 lg:col-span-12 rounded-3xl border-white/5 p-6 premium-shadow flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Shield size={16} className="text-blue-400" />
              <h3 className="text-[11px] font-black text-white tracking-[0.2em] uppercase">SLA Compliance & Reliability Thresholds</h3>
            </div>
            <Badge className="bg-primary/10 text-primary border-primary/20 text-[8px] font-black tracking-widest">88.4% TOTAL COMPLIANCE</Badge>
          </div>
          <div className="space-y-6 flex-1 flex flex-col justify-center max-w-4xl mx-auto w-full">
            {slaBySeverity.map(item => (
              <div key={item.severity} className="space-y-3">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em]">
                  <span className="text-white/60">{item.severity} Clearance Rate</span>
                  <span className={item.compliance < item.target ? 'text-red-400' : 'text-primary'}>{item.compliance}% <span className="text-white/20">/ TARGET {item.target}%</span></span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden relative border border-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.compliance}%` }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: item.fill, boxShadow: `0 0 10px ${item.fill}30` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="glass col-span-12 lg:col-span-7 rounded-3xl border-white/5 p-6 premium-shadow">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Box size={16} className="text-primary" />
              <h3 className="text-[11px] font-black text-white tracking-[0.2em] uppercase">Categorical Impact Analysis</h3>
            </div>
            <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 text-[8px] font-black uppercase tracking-widest">Classification Density</Badge>
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <Treemap
                data={categoryData}
                dataKey="size"
                aspectRatio={4 / 3}
                stroke="rgba(255,255,255,0.1)"
                content={<CustomTreemapContent />}
              >
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
              </Treemap>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="glass col-span-12 lg:col-span-5 rounded-3xl border-white/5 p-6 premium-shadow">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Globe size={16} className="text-blue-400" />
              <h3 className="text-[11px] font-black text-white tracking-[0.2em] uppercase">Operator Vector Performance</h3>
            </div>
          </div>
          <div className="h-[320px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.05)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 9, fontWeight: 'bold' }} />
                <Radar name="Operator Alpha" dataKey="A" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                <Radar name="Benchmark" dataKey="B" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* 5. INTELLIGENCE HUD & ACTIONS */}
      <div className="grid grid-cols-12 gap-6">
        <Card className="glass col-span-12 lg:col-span-12 rounded-3xl border-white/5 p-6 premium-shadow flex flex-col bg-primary/[0.01]">
          <div className="flex items-center justify-between mb-6 text-center">
            <div className="flex items-center gap-3">
              <Brain size={16} className="text-primary" />
              <h3 className="text-[11px] font-black text-white tracking-[0.2em] uppercase">Tactical Intelligence Layer</h3>
            </div>
            <Badge className="bg-primary/5 text-primary border-primary/10 text-[8px] font-black animate-pulse uppercase px-2 tracking-widest">Heuristic Analysis Online</Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-4">
              <span className="text-[9px] font-black text-primary uppercase tracking-widest">Heuristic Insights:</span>
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                  <p className="text-[10px] font-bold text-white uppercase leading-tight">Response lag detected in High-Prio sectors.</p>
                  <p className="text-[9px] text-white/40 uppercase">Action required to maintain SLA compliance thresholds.</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                  <p className="text-[10px] font-bold text-white uppercase leading-tight">Anomaly detected in Operator Sequence #42.</p>
                  <p className="text-[9px] text-white/40 uppercase">Drift in reporting accuracy noted over last 48 hours.</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Tactical Directives:</span>
              <div className="space-y-3">
                <button className="w-full p-4 rounded-2xl bg-primary/10 border border-primary/20 text-[10px] font-black text-primary text-left uppercase hover:bg-primary/20 transition-all flex items-center justify-between group">
                  Audit Protocol Sequence #12
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black text-white/60 text-left uppercase hover:bg-white/10 transition-all flex items-center justify-between group">
                  Initialize Operator Recalibration
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <span className="text-[9px] font-black text-red-400/50 uppercase tracking-widest">Active Watchlist:</span>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-center justify-between p-3 rounded-xl bg-red-500/5 border border-red-500/10">
                  <span className="text-[9px] font-black text-red-400 uppercase">SLA Breach Risk (Critical)</span>
                  <Badge className="bg-red-500/20 text-red-400 border-none text-[8px]">HIGH</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-orange-500/5 border border-orange-500/10">
                  <span className="text-[9px] font-black text-orange-400 uppercase">Resource Overflow (Grid A)</span>
                  <Badge className="bg-orange-500/20 text-orange-400 border-none text-[8px]">92%</Badge>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* 6. FORECASTING & AUTOMATION */}
      <div className="grid grid-cols-12 gap-6">
        <Card className="glass col-span-12 lg:col-span-12 rounded-3xl border-white/5 p-6 premium-shadow">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Repeat size={16} className="text-blue-400" />
              <h3 className="text-[11px] font-black text-white tracking-[0.2em] uppercase">Predictive Forecasting & Reliability Bounds</h3>
            </div>
            <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[8px] font-black uppercase px-3 tracking-widest">Daily Forecasting Horizon</Badge>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={forecastData}>
                <defs>
                  <linearGradient id="bandGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.05} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.2)" fontSize={9} axisLine={false} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={9} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
                <Area type="monotone" dataKey="high" stroke="transparent" fill="url(#bandGrad)" />
                <Area type="monotone" dataKey="low" stroke="transparent" fill="transparent" />
                <Area type="monotone" dataKey="actual" fill="rgba(16, 185, 129, 0.1)" stroke="#10B981" strokeWidth={3} />
                <Line type="monotone" dataKey="prediction" stroke="#10B981" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3, fill: '#0B0F1A', strokeWidth: 2, stroke: '#10B981' }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
            <div className="flex-1 max-w-2xl">
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Forecast Intelligence:</p>
              <p className="text-[11px] font-bold text-white/60 uppercase leading-relaxed">System load is <span className="text-white">stabilizing</span> with a projected surge on Feb 23. Operator readiness levels must remain at <span className="text-primary">94.2%</span>.</p>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" className="h-12 border-white/5 bg-white/[0.02] text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/5 px-8">
                Recalibrate
              </Button>
              <Button className="h-12 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-2xl px-8 group">
                Schedule Brief <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Improved Reports Section */}
        <div className="col-span-12 mt-12 space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center gap-4">
              <FileText size={18} className="text-white/40" />
              <h2 className="text-lg font-black text-white tracking-[0.2em] uppercase">Intelligence Automation Packs</h2>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" className="h-10 text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white">
                <Filter size={12} className="mr-2" /> Filter
              </Button>
              <Button variant="ghost" className="h-10 text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white">
                <Settings size={12} className="mr-2" /> Rules
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Operational Intel', role: 'Ops Admin', period: 'Daily 08:00', icon: Shield, color: '#3B82F6' },
              { title: 'Executive Brief', role: 'Command Council', period: 'Weekly / Sun', icon: Zap, color: '#F59E0B' },
              { title: 'Compliance Audit', role: 'Legal Specialist', period: 'Monthly 01', icon: CheckCircle, color: '#10B981' }
            ].map((report, i) => (
              <Card key={i} className="glass border-white/5 rounded-2xl p-5 hover:bg-white/[0.02] transition-all group">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/10 group-hover:bg-white/5 transition-all" style={{ color: report.color }}>
                    <report.icon size={18} />
                  </div>
                  <Badge className="bg-white/5 text-white/40 border-white/5 text-[8px] font-black uppercase tracking-widest">{report.period}</Badge>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-wider">{report.title}</h4>
                    <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mt-1">Role: {report.role}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg text-white/40 hover:text-white">
                        <DownloadIcon size={14} />
                      </Button>
                      <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg text-white/40 hover:text-white">
                        <Mail size={14} />
                      </Button>
                    </div>
                    <Button variant="ghost" className="h-8 px-3 text-[9px] font-black text-primary hover:text-primary hover:bg-primary/5 uppercase tracking-widest">
                      Configure
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;