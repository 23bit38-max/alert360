import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNotifications } from '../shared/NotificationService';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { IncidentDetail } from './IncidentDetail';
import { useTheme } from '../../theme';
import {
  getAccessibleZones,
  canAccessZone,
  isSuperAdmin,
} from '../../utils/rbac';
import {
  Search,
  MapPin,
  Car,
  CheckCircle,
  Eye,
  RefreshCw,
  Download,
  Activity,
  Clock,
  Zap,
  Maximize2,
  Shield,
  BarChart3,
  Map as MapIcon,
  Play,
  Check,
  ChevronRight,
  ShieldAlert,
  Flame,
  User as UserIcon,
  CloudSun
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { ScrollArea } from '../ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface IncidentImage {
  id: string;
  url: string;
  timestamp: Date;
  type: 'before' | 'during' | 'after';
  description: string;
  cameraAngle: string;
}

interface TimelineEvent {
  time: string;
  event: string;
  status: 'info' | 'success' | 'warning' | 'critical';
}

interface Alert {
  id: string;
  type: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  location: string;
  zone: string;
  timestamp: Date;
  vehicles: number;
  confidence: number;
  status: 'active' | 'responding' | 'resolved' | 'escalated';
  assignedTo?: string;
  cameraId: string;
  coordinates: { lat: number; lng: number };
  description: string;
  actions: string[];
  images: IncidentImage[];
  videoUrl?: string;
  injuries?: number;
  severity: 'minor' | 'moderate' | 'severe' | 'fatal';
  responsibleDepartment: 'police' | 'fire' | 'hospital' | 'multi-department';
  detectionSource: 'camera' | 'sensor' | 'AI' | 'manual';
  eta?: string;
  responseStage?: 'dispatched' | 'en_route' | 'on_site';
  casualtyLikelihood?: 'low' | 'moderate' | 'high';
  unitsResponding?: {
    police?: boolean;
    fire?: boolean;
    medical?: boolean;
  };
  timeline?: TimelineEvent[];

  // Expanded Intelligence Fields (Matched with Manual Upload)
  city?: string;
  district?: string;
  stateName?: string;
  roadHighwayId?: string;
  vehicleTypes?: string[];
  infrastructureInvolved?: string[];
  injuredCount?: number;
  criticalInjuries?: number;
  fatalities?: number;
  trappedPersons?: boolean;
  weatherCondition?: string;
  visibilityLevel?: string;
  roadCondition?: string;
  fireFlag?: boolean;
  fuelLeakFlag?: boolean;
  chemicalHazardFlag?: boolean;
  agenciesToNotify?: string[];
  trafficDiversionRequired?: boolean;
  confidentialFlag?: boolean;
  officerId?: string;
  officerDepartment?: string;
}

const trendData = [
  { time: '08:00', detected: 4, resolved: 2 },
  { time: '10:00', detected: 7, resolved: 5 },
  { time: '12:00', detected: 3, resolved: 6 },
  { time: '14:00', detected: 8, resolved: 4 },
  { time: '16:00', detected: 5, resolved: 7 },
  { time: '18:00', detected: 9, resolved: 5 },
  { time: '20:00', detected: 6, resolved: 8 },
];

export const RealTimeAlerts = () => {
  const { user } = useAuth();
  const { showToast } = useNotifications();
  useTheme();

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const accessibleZones = getAccessibleZones(user);

  const loadData = async () => {
    try {
      setLoading(true);
      const { fetchAccidents } = await import('../../services/supabase.service');
      const data = await fetchAccidents();

      if (!data) return;

      const transformedAlerts: Alert[] = data.map((item: any) => {
        const mediaRecords = item.accidents_media || [];
        const involvement = item.vehicle_involvement?.[0] || {};
        const casualty = item.casualty_report?.[0] || {};
        const environment = item.environmental_conditions?.[0] || {};

        const images: IncidentImage[] = [];

        if (mediaRecords.length > 0) {
          const m = mediaRecords[0];
          if (m.before_image_url) {
            images.push({
              id: `${m.id}-before`,
              url: m.before_image_url,
              timestamp: new Date(m.created_at),
              type: 'before',
              description: 'Pre-Incident Capture',
              cameraAngle: 'Center'
            });
          }
          if (m.after_image_url) {
            images.push({
              id: `${m.id}-after`,
              url: m.after_image_url,
              timestamp: new Date(m.created_at),
              type: 'after',
              description: 'Incident Frame',
              cameraAngle: 'Center'
            });
          }
        }

        const mainImageUrl = images.find(img => img.type === 'after')?.url || images[0]?.url || 'https://images.unsplash.com/photo-1544829099-b9a0c5303bea?w=800&h=600&fit=crop';

        return {
          id: item.id,
          type: (item.operational_priority || 'medium').toLowerCase() as any,
          title: item.accident_code || item.incident_category?.toUpperCase() || 'INCIDENT',
          location: item.address || item.location || 'Unknown Location',
          zone: item.zone || 'GAMMA',
          timestamp: new Date(item.observed_at || item.created_at),
          vehicles: involvement.vehicle_count || 0,
          confidence: (item.ai_analysis?.[0]?.confidence_score || 0) * 100 || 85,
          status: (item.response_status || 'active').toLowerCase() as any,
          cameraId: item.road_identifier || 'SENSOR-NODE',
          coordinates: { lat: parseFloat(item.latitude) || 0, lng: parseFloat(item.longitude) || 0 },
          description: item.incident_category || 'N/A',
          actions: ['ACKNOWLEDGE'],
          images: images.length > 0 ? images : [{
            id: 'placeholder',
            url: mainImageUrl,
            timestamp: new Date(),
            type: 'during',
            description: 'Detection Frame',
            cameraAngle: 'Center'
          }],
          severity: (item.operational_priority === 'High' ? 'severe' : 'moderate') as any,
          responsibleDepartment: item.department === 'Police' ? 'police' : 'multi-department',
          detectionSource: (item.source_type || 'AI') as any,
          city: item.city,
          district: item.district,
          stateName: item.state_name,
          roadHighwayId: item.road_identifier,
          vehicleTypes: involvement.vehicle_types,
          infrastructureInvolved: involvement.infrastructure_involved,
          injuredCount: casualty.injured_count,
          criticalInjuries: casualty.critical_injuries,
          fatalities: casualty.fatalities,
          trappedPersons: casualty.trapped_persons,
          weatherCondition: environment.weather_condition,
          visibilityLevel: environment.visibility_level,
          roadCondition: environment.road_condition,
          fireFlag: environment.fire_flag,
          fuelLeakFlag: environment.fuel_leak_flag,
          chemicalHazardFlag: environment.chemical_hazard_flag
        };
      });

      setAlerts(transformedAlerts);
    } catch (err) {
      console.error('Failed to load real intelligence:', err);
      showToast('error', 'SYNC ERROR', 'Could not establish connection to Government Database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const stats = useMemo(() => {
    const active = alerts.filter(a => a.status === 'active').length;
    const responding = alerts.filter(a => a.status === 'responding').length;
    const resolved = alerts.filter(a => a.status === 'resolved').length;
    return { active, responding, resolved };
  }, [alerts]);

  const filteredAlerts = alerts.filter(alert => {
    const matchesZoneScope = accessibleZones.includes('all') || canAccessZone(user, alert.zone);
    const matchesDeptScope = isSuperAdmin(user) || user?.department === alert.responsibleDepartment;
    const matchesSearch = alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilterZone = selectedZone === 'all' || alert.zone === selectedZone;
    const matchesSeverity = selectedSeverity === 'all' || alert.type === selectedSeverity;

    return matchesZoneScope && matchesDeptScope && matchesSearch && matchesFilterZone && matchesSeverity;
  }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  const handleActionFlow = async (alertId: string, currentStatus: Alert['status']) => {
    let nextStatus: Alert['status'] = 'responding';
    if (currentStatus === 'responding') {
      nextStatus = 'pending' as any;
      showToast('success', 'ACKNOWLEDGED', `PROCESSING ACTION FOR ${alertId}`);
    } else if (currentStatus === 'pending' as any) {
      nextStatus = 'resolved';
      showToast('success', 'RESOLVED', `ALERT ${alertId} DE-ESCALATED AND ARCHIVED`);
    } else if (currentStatus === 'active') {
      nextStatus = 'responding';
      showToast('success', 'DEPLOYED', `RESPONDERS DISPATCHED TO ${alertId}`);
    } else {
      return;
    }

    try {
      const { supabase } = await import('../../lib/supabase');
      const { error } = await supabase
        .from('accidents')
        .update({ response_status: nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1) })
        .eq('id', alertId);

      if (error) throw error;
      setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: nextStatus } : a));
    } catch (err) {
      console.error('Failed to persist status change:', err);
    }
  };

  const AlertCard = ({ alert }: { alert: Alert }) => {
    const isCritical = alert.type === 'critical';
    const [previewType, setPreviewType] = useState<'before' | 'after'>('after');
    const beforeImg = alert.images.find(img => img.type === 'before');
    const afterImg = alert.images.find(img => img.type === 'after');

    const getStatusConfig = (status: Alert['status']) => {
      switch (status) {
        case 'responding': return { label: 'ACKNOWLEDGE', color: 'bg-red-500', icon: Play, next: 'pending' };
        case 'pending' as any: return { label: 'MARK RESOLVED', color: 'bg-orange-500', icon: Check, next: 'resolved' };
        case 'resolved': return { label: 'COMPLETED', color: 'bg-primary/50', icon: CheckCircle, next: null };
        case 'active': return { label: 'RESPOND NOW', color: 'bg-blue-500', icon: Play, next: 'responding' };
        default: return { label: 'UNKNOWN', color: 'bg-slate-500', icon: Activity, next: null };
      }
    };

    const config = getStatusConfig(alert.status);
    const Icon = config.icon;

    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="group relative h-[500px] bg-slate-900/40 rounded-[2.5rem] border border-white/5 overflow-hidden flex flex-col premium-shadow-lg transition-all duration-500 hover:border-white/20 hover:shadow-primary/5 shadow-2xl"
      >
        {/* TOP IMAGE PANEL */}
        <div className="relative h-52 overflow-hidden shrink-0 bg-slate-950">
          <motion.img
            key={previewType}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            src={previewType === 'before' ? (beforeImg?.url || alert.images[0].url) : (afterImg?.url || alert.images[0].url)}
            alt="Incident"
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 brightness-75 group-hover:brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

          {/* PREVIEW TOGGLE */}
          {beforeImg && afterImg && (
            <div className="absolute bottom-4 left-4 flex gap-1 bg-black/40 backdrop-blur-xl p-1 rounded-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={(e) => { e.stopPropagation(); setPreviewType('before'); }}
                className={`px-3 py-1.5 rounded-lg text-[8px] font-black tracking-widest transition-all ${previewType === 'before' ? 'bg-primary text-white' : 'text-white/40 hover:text-white'}`}
              >
                BEFORE
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setPreviewType('after'); }}
                className={`px-3 py-1.5 rounded-lg text-[8px] font-black tracking-widest transition-all ${previewType === 'after' ? 'bg-primary text-white' : 'text-white/40 hover:text-white'}`}
              >
                AFTER
              </button>
            </div>
          )}

          <div className="absolute top-6 left-6 flex gap-2">
            <Badge className={`text-[10px] font-black tracking-widest px-4 py-1.5 rounded-full shadow-2xl ${isCritical ? 'bg-red-500 text-white' : 'bg-orange-500 text-slate-950'}`}>
              {alert.type.toUpperCase()}
            </Badge>
          </div>

          <div className="absolute top-6 right-6 flex items-end justify-between">
            <Button variant="ghost" className="h-10 w-10 p-0 bg-black/40 border border-white/10 rounded-2xl backdrop-blur-xl hover:bg-white/10 transition-all" onClick={() => setSelectedIncident(alert.id)}>
              <Maximize2 size={14} className="text-white" />
            </Button>
          </div>

          <div className="absolute bottom-4 right-6">
            <div className="flex items-center gap-1.5 text-[8px] font-black text-white/40 uppercase tracking-widest bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/5">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> LIVE_THREAD • {alert.cameraId}
            </div>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 p-6 flex flex-col space-y-5">
          <div className="flex justify-between items-start">
            <div className="space-y-1 max-w-[70%]">
              <h3 className="text-lg font-black text-white tracking-widest uppercase leading-tight line-clamp-1">{alert.title}</h3>
              <div className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                <MapPin size={12} className="text-primary" /> {alert.location}
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-mono text-white/30 tabular-nums">{alert.timestamp.toLocaleTimeString()}</p>
              <Badge variant="outline" className="mt-1 border-white/5 bg-white/5 text-[8px] font-black text-white/20">{alert.zone}</Badge>
            </div>
          </div>

          {/* TELEMETRY DATA GRID */}
          <div className="grid grid-cols-2 gap-3">
            <motion.div
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.06)' }}
              className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1.5 transition-colors relative overflow-hidden group/item cursor-default"
            >
              <div className="absolute top-0 right-0 w-12 h-12 bg-primary/5 rounded-full blur-xl group-hover/item:bg-primary/20 transition-colors" />
              <span className="text-[8px] font-black text-white/20 uppercase tracking-widest flex items-center gap-2 relative z-10"><Zap size={10} className="text-primary" /> Confidence</span>
              <p className="text-xs font-black text-white/80 relative z-10">{alert.confidence.toFixed(1)}% Intel</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.06)' }}
              className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1.5 transition-colors relative overflow-hidden group/item cursor-default"
            >
              <div className="absolute top-0 right-0 w-12 h-12 bg-blue-500/5 rounded-full blur-xl group-hover/item:bg-blue-500/20 transition-colors" />
              <span className="text-[8px] font-black text-white/20 uppercase tracking-widest flex items-center gap-2 relative z-10"><Clock size={10} className="text-blue-400" /> Response</span>
              <p className="text-xs font-black text-white/80 relative z-10">{alert.eta || '3:45M'}</p>
            </motion.div>
          </div>

          {/* OPERATIONAL TELEMETRY STRIP */}
          <div className="flex items-center justify-between px-2 py-3 border-y border-white/5 bg-white/[0.01]">
            <div className="flex flex-col gap-1 items-center">
              <span className="text-[7px] font-black text-white/20 uppercase tracking-widest">Casualties</span>
              <div className="flex items-center gap-1.5">
                <UserIcon size={10} className={alert.injuredCount || alert.injuries ? 'text-orange-400' : 'text-white/20'} />
                <span className={`text-[10px] font-black ${alert.injuredCount || alert.injuries ? 'text-white' : 'text-white/30'}`}>{alert.injuredCount || alert.injuries || 0}</span>
              </div>
            </div>
            <div className="w-px h-6 bg-white/5" />
            <div className="flex flex-col gap-1 items-center">
              <span className="text-[7px] font-black text-white/20 uppercase tracking-widest">Vehicles</span>
              <div className="flex items-center gap-1.5">
                <Car size={10} className="text-white/40" />
                <span className="text-[10px] font-black">{alert.vehicles}</span>
              </div>
            </div>
            <div className="w-px h-6 bg-white/5" />
            <div className="flex flex-col gap-1 items-center">
              <span className="text-[7px] font-black text-white/20 uppercase tracking-widest">Weather</span>
              <div className="flex items-center gap-1.5">
                <CloudSun size={10} className="text-white/40" />
                <span className="text-[10px] font-black truncate max-w-[60px]">{alert.weatherCondition || 'N/A'}</span>
              </div>
            </div>
            {alert.fireFlag && (
              <>
                <div className="w-px h-6 bg-white/5" />
                <div className="flex flex-col gap-1 items-center">
                  <span className="text-[7px] font-black text-red-500 uppercase tracking-widest">Hazard</span>
                  <div className="flex items-center gap-1.5 text-red-500 animate-pulse">
                    <Flame size={10} />
                    <span className="text-[10px] font-black">FIRE</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* ACTION PANEL */}
          <div className="mt-auto space-y-3">
            <Button
              variant="outline"
              className="w-full h-11 border-white/5 bg-white/[0.02] text-[10px] font-black uppercase tracking-widest hover:bg-white/5 hover:border-white/10 rounded-2xl transition-all"
              onClick={() => setSelectedIncident(alert.id)}
            >
              <Eye size={14} className="mr-3 text-primary" /> View Incident Details
            </Button>

            <motion.div whileTap={{ scale: 0.98 }}>
              <Button
                disabled={alert.status === 'resolved'}
                className={`w-full h-14 rounded-2xl flex items-center justify-between px-6 group/btn relative overflow-hidden transition-all duration-500 ${config.color} text-white shadow-2xl`}
                onClick={() => handleActionFlow(alert.id, alert.status)}
              >
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                    <Icon size={14} className="group-hover/btn:scale-125 transition-transform" />
                  </div>
                  <span className="text-[11px] font-black tracking-[0.2em]">{config.label}</span>
                </div>
                <ChevronRight size={18} className="relative z-10 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  };

  if (selectedIncident) {
    const incident = alerts.find(a => a.id === selectedIncident);
    if (incident) return <IncidentDetail incident={incident} onBack={() => setSelectedIncident(null)} />;
  }

  return (
    <div className="flex-1 flex flex-col bg-[#05080E] h-full overflow-hidden select-none">

      {/* HEADER: COMMAND CENTER */}
      <div className="shrink-0 border-b border-white/5 px-8 h-20 flex items-center justify-between bg-[#0A0E17]/80 backdrop-blur-xl z-20">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-[0_0_20px_rgba(16,185,129,0.1)]">
              <Activity size={24} />
            </div>
            <div>
              <h1 className="text-sm font-black tracking-[0.4em] uppercase text-white leading-none">Command Hub</h1>
              <div className="flex gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                  <span className="text-[9px] font-black text-red-500/80 uppercase tracking-widest">{stats.active} PENDING</span>
                </div>
                <div className="flex items-center gap-2 text-white/20">•</div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                  <span className="text-[9px] font-black text-orange-400/80 uppercase tracking-widest">{stats.responding} ACTIVE</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/[0.02] border border-white/5">
            <Shield size={14} className="text-primary" />
            <span className="text-[9px] font-black text-white/60 uppercase tracking-widest">Signal Integrity: Stable</span>
          </div>
          <Button variant="ghost" className="h-11 px-6 text-[10px] font-black uppercase tracking-widest text-white/40 border border-white/5 rounded-2xl hover:bg-white/5" onClick={loadData}>
            <RefreshCw size={14} className={`mr-3 ${loading ? 'animate-spin' : ''}`} /> System Audit
          </Button>
          <Button className="h-11 px-8 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
            <Download size={14} className="mr-3" /> Intel Pack
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* FEED AREA */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* TACTICAL SEARCH */}
          <div className="h-16 shrink-0 border-b border-white/5 bg-[#080C14] px-8 flex items-center justify-between">
            <div className="relative group flex-1 max-w-xl">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary opacity-30 group-focus-within:opacity-100 transition-opacity" />
              <Input
                placeholder="QUERY GLOBAL SECTOR MATRIX..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 pl-12 bg-white/[0.02] border-white/5 text-[11px] uppercase font-black tracking-widest focus:ring-1 focus:ring-primary/20 rounded-xl"
              />
            </div>
            <div className="flex gap-3 ml-6">
              <Select value={selectedZone} onValueChange={setSelectedZone}>
                <SelectTrigger className="h-11 w-40 bg-white/[0.02] border-white/5 text-[10px] font-black uppercase text-white/60 rounded-xl">
                  <SelectValue placeholder="ZONE" />
                </SelectTrigger>
                <SelectContent className="bg-[#0A0E17] border-white/10 text-white font-black uppercase text-[10px] rounded-xl">
                  <SelectItem value="all">ALL_ZONES</SelectItem>
                  <SelectItem value="SECTOR ALPHA">ALPHA</SelectItem>
                  <SelectItem value="SECTOR BETA">BETA</SelectItem>
                  <SelectItem value="SECTOR GAMMA">GAMMA</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                <SelectTrigger className="h-11 w-40 bg-white/[0.02] border-white/5 text-[10px] font-black uppercase text-white/60 rounded-xl">
                  <SelectValue placeholder="PRIORITY" />
                </SelectTrigger>
                <SelectContent className="bg-[#0A0E17] border-white/10 text-white font-black uppercase text-[10px] rounded-xl">
                  <SelectItem value="all">ALL_LVLS</SelectItem>
                  <SelectItem value="critical">CRITICAL</SelectItem>
                  <SelectItem value="high">HIGH</SelectItem>
                  <SelectItem value="medium">MEDIUM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* ALERTS GRID */}
          <ScrollArea className="flex-1 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredAlerts.length > 0 ? (
                  filteredAlerts.map(alert => <AlertCard key={alert.id} alert={alert} />)
                ) : (
                  <div className="col-span-full h-96 flex flex-col items-center justify-center space-y-4 opacity-10">
                    <ShieldAlert size={64} />
                    <p className="text-sm font-black uppercase tracking-[0.5em]">Sector Cleared</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
            <div className="h-10" />
          </ScrollArea>
        </div>

        {/* INTELLIGENCE PANE (RIGHT) */}
        <aside className="w-[420px] shrink-0 border-l border-white/5 bg-[#070B13]/80 flex flex-col hidden xl:flex">

          <div className="p-8 space-y-10 flex-1 overflow-y-auto custom-scrollbar">
            {/* MINI MAP CLUSTER */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-[11px] font-black text-white tracking-[0.3em] uppercase flex items-center gap-2">
                  <MapIcon size={14} className="text-primary" /> Sector Topology
                </h2>
                <Button variant="ghost" className="h-6 px-2 text-[8px] font-black text-primary uppercase">FULL_MAP</Button>
              </div>
              <div className="h-56 rounded-3xl border border-white/5 relative bg-slate-950/50 overflow-hidden shadow-inner">
                <div className="absolute inset-0 opacity-[0.05]" style={{
                  backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }} />
                <div className="absolute inset-x-0 top-1/2 h-[1px] bg-primary/10" />
                <div className="absolute inset-y-0 left-1/2 w-[1px] bg-primary/10" />

                <div className="absolute top-1/2 left-1/2 w-[350px] h-[350px] -translate-x-1/2 -translate-y-1/2 border border-primary/10 rounded-full animate-[spin_10s_linear_infinite]"
                  style={{ background: 'conic-gradient(from 0deg, rgba(16,185,129,0.05) 0deg, transparent 60deg)' }} />

                <div className="absolute top-[35%] left-[30%]">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-ping opacity-50" />
                  <div className="w-2 h-2 bg-red-500 rounded-full absolute top-0.5 left-0.5 shadow-[0_0_10px_rgba(239,68,68,1)]" />
                </div>
                <div className="absolute bottom-[25%] right-[35%]">
                  <div className="w-3 h-3 bg-orange-400 rounded-full animate-ping opacity-50" />
                  <div className="w-2 h-2 bg-orange-400 rounded-full absolute top-0.5 left-0.5" />
                </div>

                <div className="absolute bottom-4 left-4 p-3 bg-black/60 rounded-xl border border-white/10 backdrop-blur-md">
                  <p className="text-[8px] font-black text-white/50 uppercase tracking-widest">Active Scan Focus</p>
                  <p className="text-[10px] font-mono text-primary mt-0.5">LAT 40.71 | LONG -74.00</p>
                </div>
              </div>
            </div>

            {/* ANALYTICS TREND */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-[11px] font-black text-white tracking-[0.3em] uppercase flex items-center gap-2">
                  <BarChart3 size={14} className="text-primary" /> Incident Flux
                </h2>
              </div>

              <div className="h-52 w-full bg-white/[0.02] rounded-3xl border border-white/5 p-6 hover:bg-white/[0.03] transition-colors">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="colorD" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorR" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 8, fill: 'rgba(255,255,255,0.3)', fontWeight: 'bold' }} />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0A0E17', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '9px', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="detected" stroke="#EF4444" fillOpacity={1} fill="url(#colorD)" strokeWidth={3} dot={false} />
                    <Area type="monotone" dataKey="resolved" stroke="#10B981" fillOpacity={1} fill="url(#colorR)" strokeWidth={3} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-white/[0.01] border-white/5 p-4 rounded-3xl group hover:border-primary/20 transition-all">
                  <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Clearance Efficiency</p>
                  <p className="text-xl font-black text-primary">94.2%</p>
                </Card>
                <Card className="bg-white/[0.01] border-white/5 p-4 rounded-3xl group hover:border-orange-400/20 transition-all">
                  <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Response Load</p>
                  <p className="text-xl font-black text-orange-400 uppercase tracking-tighter">Steady</p>
                </Card>
              </div>
            </div>

            {/* TACTICAL BRIEF */}
            <div className="p-6 rounded-[2rem] bg-primary/[0.03] border border-primary/20 space-y-3 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl rounded-full" />
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] flex items-center gap-2 relative z-10"><Zap size={12} /> Heuristic Alert</p>
              <p className="text-xs font-bold text-white/60 leading-relaxed italic relative z-10">
                “Anomaly detected in Sector Beta throughput. Deploying additional sensor verification nodes.”
              </p>
              <Button variant="ghost" className="h-8 w-full border border-primary/10 text-[8px] font-black uppercase tracking-widest hover:bg-primary/10 text-primary relative z-10">
                Apply Optimization
              </Button>
            </div>
          </div>
        </aside>
      </div>

      {/* FOOTER SYMBOLIC LEGEND */}
      <div className="fixed bottom-8 left-12 flex gap-10 px-8 py-3 rounded-full border border-white/10 bg-[#0A0E17]/95 backdrop-blur-2xl z-40 shadow-2xl transition-all hover:scale-105 active:scale-95 group">
        <div className="flex items-center gap-4">
          <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.6)] animate-pulse" />
          <span className="text-[9px] font-black text-white/40 uppercase tracking-widest group-hover:text-white transition-colors">Pending Action</span>
        </div>
        <div className="w-px h-4 bg-white/10" />
        <div className="flex items-center gap-4">
          <div className="w-2 h-2 rounded-full bg-orange-400 shadow-[0_0_12px_rgba(251,146,60,0.6)]" />
          <span className="text-[9px] font-black text-white/40 uppercase tracking-widest group-hover:text-white transition-colors">Active Response</span>
        </div>
        <div className="w-px h-4 bg-white/10" />
        <div className="flex items-center gap-4">
          <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_12px_rgba(16,185,129,0.6)]" />
          <span className="text-[9px] font-black text-white/40 uppercase tracking-widest group-hover:text-white transition-colors">Cleared Sector</span>
        </div>
      </div>
    </div>
  );
};

export default RealTimeAlerts;