import { useState } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  ArrowLeft,
  MapPin,
  Car,
  Camera,
  Download,
  Share2,
  AlertTriangle,
  User,
  Maximize2,
  Activity,
  Shield,
  Navigation,
  Play,
  Check,
  ChevronRight,
  Target,
  Layers,
  Map as MapIcon,
  Image as ImageIcon,
  History,
  Cpu,
  Wifi,
  Zap,
  Info,
  HeartPulse,
  HardHat,
  CloudSun,
  Siren,
  Lock,
  Landmark,
  ShieldAlert
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTrigger
} from '../ui/dialog';
import { motion } from 'framer-motion';

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

interface IncidentDetailProps {
  incident: Alert;
  onBack: () => void;
}

const VisualCard = ({ img, index }: { img: IncidentImage; index: number }) => (
  <Dialog key={img.id}>
    <DialogTrigger asChild>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ scale: 1.02 }}
        className="group relative aspect-video rounded-[2rem] overflow-hidden border border-white/5 bg-white/[0.02] cursor-pointer"
      >
        <img src={img.url} className="w-full h-full object-cover transition-all duration-700 group-hover:brightness-110" alt="Evidence" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 p-8 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <Badge variant="outline" className="bg-black/60 backdrop-blur-md border-white/10 text-[8px] font-mono text-primary py-1 px-3">
              CAM_ID: {img.id.slice(0, 8)}
            </Badge>
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[8px] font-mono text-white/40 uppercase">REC_LIVE</span>
            </div>
          </div>

          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <p className="text-[11px] font-black text-white uppercase tracking-widest">{img.description}</p>
              <div className="flex items-center gap-3">
                <p className="text-[9px] font-mono text-white/40">{img.timestamp.toLocaleTimeString()}</p>
                <span className="text-[8px] font-mono text-primary/40">F: 1.8 | ISO: 400</span>
              </div>
            </div>
            <motion.div whileHover={{ scale: 1.1 }} className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
              <Maximize2 size={16} />
            </motion.div>
          </div>
        </div>

        {/* CORNER ACCENTS */}
        <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
      </motion.div>
    </DialogTrigger>
    <DialogContent className="max-w-[90vw] h-[90vh] bg-[#0A0E17]/95 border-white/10 p-0 overflow-hidden rounded-[2.5rem]">
      <img src={img.url} className="w-full h-full object-contain" />
    </DialogContent>
  </Dialog>
);

export const IncidentDetail = ({ incident: initialIncident, onBack }: IncidentDetailProps) => {
  const [incident, setIncident] = useState(initialIncident);

  const handleStatusTransition = async () => {
    let nextStatus: Alert['status'] = 'active';
    if (incident.status === 'responding') {
      nextStatus = 'pending' as any;
    } else if (incident.status === 'pending' as any) {
      nextStatus = 'resolved';
    } else {
      return;
    }

    try {
      const { supabase } = await import('../../lib/supabase');
      const { error } = await supabase
        .from('accidents')
        .update({ response_status: nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1) })
        .eq('id', incident.id);

      if (error) throw error;

      setIncident(prev => ({ ...prev, status: nextStatus }));
    } catch (err) {
      console.error('Failed to persist status change:', err);
    }
  };

  const getStatusConfig = (status: Alert['status']) => {
    switch (status) {
      case 'responding': return { label: 'ACKNOWLEDGE ACTION', color: 'bg-red-500', icon: Play, sub: 'IMMEDIATE RESPONSE REQ' };
      case 'pending' as any: return { label: 'MARK AS RESOLVED', color: 'bg-orange-500', icon: Check, sub: 'CASE UNDER INVESTIGATION' };
      case 'resolved': return { label: 'INCIDENT SECURED', color: 'bg-primary/50', icon: Shield, sub: 'AREA CLEARED' };
      case 'active': return { label: 'INITIATE RESPONSE', color: 'bg-blue-500', icon: Play, sub: 'ACTIVE ALERT' };
      default: return { label: 'UNKNOWN', color: 'bg-slate-500', icon: Activity, sub: 'N/A' };
    }
  };

  const config = getStatusConfig(incident.status);
  const StatusIcon = config.icon;

  return (
    <div className="flex flex-col h-full bg-[#05080E] text-white select-none">

      {/* COMPACT TACTICAL HEADER */}
      <header className="h-20 shrink-0 border-b border-white/5 bg-[#0A0E17]/80 backdrop-blur-xl px-8 flex items-center justify-between z-30">
        <div className="flex items-center gap-6">
          <Button variant="ghost" onClick={onBack} className="h-10 w-10 p-0 rounded-xl border border-white/5 hover:bg-white/5">
            <ArrowLeft size={18} />
          </Button>
          <div className="space-y-0.5">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Operational Dossier:</span>
              <span className="text-sm font-black text-white tracking-widest">{incident.id}</span>
              <Badge className={`text-[9px] font-black px-3 py-1 rounded-full ${incident.type === 'critical' ? 'bg-red-500' : 'bg-orange-500'}`}>
                {incident.type.toUpperCase()}
              </Badge>
            </div>
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest flex items-center gap-2">
              <MapPin size={10} className="text-primary" /> {incident.location} • {incident.city || 'TERRITORY_UNKNOWN'}, {incident.stateName || 'COORD_LOCKED'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {incident.confidentialFlag && (
            <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 text-[9px] font-black uppercase tracking-widest px-4 py-2 flex items-center gap-2 mr-4">
              <Lock size={12} /> Confidential File
            </Badge>
          )}
          <Button variant="outline" className="h-10 px-5 border-white/5 bg-white/[0.02] text-[9px] font-black uppercase tracking-widest hover:bg-white/5 rounded-xl">
            <Download size={14} className="mr-2" /> PDF Archive
          </Button>
          <Button variant="outline" className="h-10 px-5 border-white/5 bg-white/[0.02] text-[9px] font-black uppercase tracking-widest hover:bg-white/5 rounded-xl">
            <Share2 size={14} className="mr-2" /> Dispatch Intel
          </Button>
        </div>
      </header>

      {/* INTELLIGENCE PULSE BAR */}
      <div className="h-10 shrink-0 bg-primary/5 border-b border-white/5 flex items-center px-10 justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <Wifi size={10} className="text-primary" />
            <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Signal: Stable</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu size={10} className="text-primary" />
            <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Engine: YOLOv11 Operational</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap size={10} className="text-primary" />
            <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Inference: 44ms</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[8px] font-mono text-primary animate-pulse">● FEED_ENCRYPTED_SECURE</span>
          <div className="h-3 w-px bg-white/10" />
          <span className="text-[8px] font-mono text-white/20 uppercase tracking-[0.2em]">{incident.timestamp.toLocaleString()}</span>
        </div>
      </div>

      <main className="flex-1 overflow-hidden flex">

        {/* LEFT: VISUAL EVIDENCE FLOW */}
        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar space-y-20">

          {/* COMPARATIVE MATRIX: SIDE BY SIDE */}
          <div className="grid grid-cols-2 gap-12">

            {/* COL 01: PRE-INCIDENT ARCHIVE */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary/80 border border-primary/20">
                  <History size={18} />
                </div>
                <div>
                  <h2 className="text-[11px] font-black text-white tracking-[0.4em] uppercase leading-none">Archival Reference</h2>
                  <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mt-2">(PRE-INCIDENT DATA)</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {incident.images.filter(img => img.type === 'before').length > 0 ? (
                  incident.images.filter(img => img.type === 'before').map((img, i) => (
                    <VisualCard key={img.id} img={img} index={i} />
                  ))
                ) : (
                  <div className="h-48 rounded-[2.5rem] border border-dashed border-white/5 flex flex-col items-center justify-center bg-white/[0.01]">
                    <ImageIcon size={28} className="text-white/5 mb-3" />
                    <span className="text-[9px] font-black text-white/10 uppercase tracking-[0.2em] italic">Archive Exhausted</span>
                  </div>
                )}
              </div>
            </div>

            {/* COL 02: ACTIVE EVIDENCE */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500/80 border border-rose-500/20">
                  <Camera size={18} />
                </div>
                <div>
                  <h2 className="text-[11px] font-black text-white tracking-[0.4em] uppercase leading-none">Operational Evidence</h2>
                  <p className="text-[9px] font-bold text-rose-500/30 uppercase tracking-widest mt-2">(ACTIVE THREAD DATA)</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {incident.images.filter(img => img.type !== 'before').length > 0 ? (
                  incident.images.filter(img => img.type !== 'before').map((img, i) => (
                    <VisualCard key={img.id} img={img} index={i} />
                  ))
                ) : (
                  <div className="h-48 rounded-[2.5rem] border border-dashed border-white/5 flex flex-col items-center justify-center bg-white/[0.01]">
                    <ImageIcon size={28} className="text-white/5 mb-3" />
                    <span className="text-[9px] font-black text-white/10 uppercase tracking-[0.2em] italic">No Active Captures</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SPATIAL SECTOR MAP */}
          <div className="space-y-8 pt-12 border-t border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary/80 border border-primary/20">
                  <MapIcon size={18} />
                </div>
                <div>
                  <h2 className="text-[11px] font-black text-white tracking-[0.4em] uppercase leading-none">Geospatial Awareness</h2>
                  <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mt-2">ACTIVE VECTOR LOCK</p>
                </div>
              </div>
              <Badge variant="outline" className="border-white/10 bg-white/5 text-[9px] font-mono py-2 px-4 rounded-xl text-primary uppercase">
                Ref: {incident.zone} / {incident.coordinates.lat.toFixed(4)}, {incident.coordinates.lng.toFixed(4)}
              </Badge>
            </div>

            <div className="h-[450px] rounded-[3rem] overflow-hidden border border-white/5 relative group p-1 bg-[#0A0E17]">
              <div className="absolute inset-0 z-10 pointer-events-none border-[12px] border-[#0A0E17] rounded-[3rem]" />
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                title="Incident Map"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${incident.coordinates.lng - 0.01},${incident.coordinates.lat - 0.01},${incident.coordinates.lng + 0.01},${incident.coordinates.lat + 0.01}&layer=mapnik&marker=${incident.coordinates.lat},${incident.coordinates.lng}`}
                className="grayscale group-hover:grayscale-0 opacity-40 group-hover:opacity-100 transition-all duration-1000 rounded-[2.5rem]"
              />
              <Button className="absolute bottom-10 right-10 z-20 h-12 px-8 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-2xl shadow-primary/30 active:scale-95 transition-all">
                <Navigation size={16} className="mr-3" /> Launch Field Nav
              </Button>
            </div>
          </div>

          {/* DESCRIPTION BRIEF */}
          <div className="space-y-10 pt-12 border-t border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                <Info size={18} />
              </div>
              <div>
                <h2 className="text-[11px] font-black text-white tracking-[0.4em] uppercase leading-none">Operational Brief</h2>
                <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mt-2">DETAILED CASE NOTES</p>
              </div>
            </div>
            <div className="p-8 rounded-[2.5rem] bg-white/[0.01] border border-white/5 premium-shadow">
              <p className="text-xs font-bold text-white/50 leading-relaxed uppercase tracking-widest italic leading-loose">
                {incident.description || 'NO ADDITIONAL NOTES PROVIDED BY SYSTEM OR ANALYST.'}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT: TACTICAL INTELLIGENCE PANE (SCROLLABLE) */}
        <aside className="w-[500px] shrink-0 border-l border-white/5 bg-[#070B13]/80 flex flex-col backdrop-blur-md relative overflow-hidden">

          {/* DECORATIVE GRID PATTERN */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '16px 16px' }} />

          <div className="flex-1 overflow-y-auto custom-scrollbar p-10 space-y-12">

            {/* 1. SECTOR CONTEXT */}
            <section className="space-y-6">
              <SectionHeader title="01. Sector Context" icon={<MapPin className="text-blue-400" />} />
              <div className="grid grid-cols-2 gap-4">
                <IntelItem label="Zone Ref" val={incident.zone} icon={<Layers className="text-white/20" />} />
                <IntelItem label="Road/Hwy ID" val={incident.roadHighwayId || 'LOCAL_RD'} icon={<Navigation className="text-white/20" />} />
                <IntelItem label="City Sector" val={incident.city || 'N/A'} icon={<Landmark className="text-white/20" />} />
                <IntelItem label="Territory" val={incident.district || 'UNMAPPED'} icon={<Target className="text-white/20" />} />
              </div>
            </section>

            {/* 2. MEDICAL & HUMAN IMPACT */}
            <section className="space-y-6">
              <SectionHeader title="02. Medical Impact" icon={<HeartPulse className="text-pink-500" />} />
              <div className="grid grid-cols-2 gap-4">
                <IntelItem label="Injured Count" val={incident.injuredCount?.toString() || (incident.injuries?.toString() ?? '0')} icon={<User className="text-white/20" />} />
                <IntelItem label="Critical Impact" val={incident.criticalInjuries?.toString() || '0'} icon={<Activity className="text-white/20" />} color="text-orange-400" />
                <IntelItem label="Fatalities" val={incident.fatalities?.toString() || '0'} icon={<AlertTriangle className="text-white/20" />} color={incident.fatalities ? 'text-red-500' : ''} />
                <IntelItem label="Casualty Risk" val={incident.casualtyLikelihood?.toUpperCase() || 'LOW'} icon={<ShieldAlert className="text-white/20" />} />
              </div>
              {incident.trappedPersons && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 animate-pulse">
                  <AlertTriangle className="text-red-500" size={16} />
                  <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Active Search & Rescue: Trapped Persons Detected</span>
                </div>
              )}
            </section>

            {/* 3. VEHICLES & LOGISTICS */}
            <section className="space-y-6">
              <SectionHeader title="03. Vehicle Logistics" icon={<HardHat className="text-amber-500" />} />
              <div className="grid grid-cols-2 gap-4">
                <IntelItem label="Active Units" val={`${incident.vehicles} Units`} icon={<Car className="text-white/20" />} />
                <IntelItem label="Intel Confidence" val={`${incident.confidence}%`} icon={<Zap className="text-white/20" />} color="text-primary" />
              </div>
              {incident.vehicleTypes && incident.vehicleTypes.length > 0 && (
                <div className="space-y-3">
                  <p className="text-[8px] font-black text-white/20 uppercase tracking-widest px-1">Detected Classes</p>
                  <div className="flex flex-wrap gap-2">
                    {incident.vehicleTypes.map(t => <Badge key={t} className="bg-white/5 border border-white/10 text-[8px] font-black uppercase text-white/50">{t}</Badge>)}
                  </div>
                </div>
              )}
            </section>

            {/* 4. ENVIRONMENTAL RISKS */}
            <section className="space-y-6">
              <SectionHeader title="04. Environmental State" icon={<CloudSun className="text-emerald-400" />} />
              <div className="grid grid-cols-2 gap-4">
                <IntelItem label="Weather" val={incident.weatherCondition || 'STABLE'} />
                <IntelItem label="Visibility" val={incident.visibilityLevel || 'OPTIMAL'} />
                <IntelItem label="Road State" val={incident.roadCondition || 'NORMAL'} className="col-span-2" />
              </div>
              <div className="flex flex-wrap gap-4 pt-2">
                <StatusDot label="FIRE" active={incident.fireFlag} color="bg-red-500" />
                <StatusDot label="FUEL_LEAK" active={incident.fuelLeakFlag} color="bg-orange-500" />
                <StatusDot label="CHEMICAL" active={incident.chemicalHazardFlag} color="bg-purple-500" />
              </div>
            </section>

            {/* 5. RESPONSE STATUS */}
            <section className="space-y-6">
              <SectionHeader title="05. Agency Dispatch" icon={<Siren className="text-red-400" />} />
              <div className="grid grid-cols-2 gap-4">
                <IntelItem label="Source" val={incident.detectionSource?.toUpperCase() || 'AI'} />
                <IntelItem label="Response ETA" val={incident.eta || 'N/A'} color="text-primary" />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <p className="text-[8px] font-black text-white/20 uppercase tracking-widest font-mono">Dispatch Channel</p>
                  {incident.trafficDiversionRequired && <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest border border-amber-500/20 px-2 py-0.5 rounded">Diversion Active</span>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {incident.agenciesToNotify?.map(a => (
                    <div key={a} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/5 border border-blue-500/20 text-[9px] font-black text-blue-400 uppercase tracking-widest">
                      <Check size={10} /> {a}
                    </div>
                  )) || <p className="text-[9px] font-bold text-white/10 italic">No agencies tagged for dispatch</p>}
                </div>
              </div>
            </section>

            {/* 6. ADMINISTRATIVE */}
            <section className="space-y-6 pb-20">
              <SectionHeader title="06. Chain of Custody" icon={<Shield className="text-slate-400" />} />
              <div className="grid grid-cols-2 gap-4">
                <IntelItem label="Officer/ID" val={incident.officerId || 'SYS_AGENT'} />
                <IntelItem label="Unit/Dept" val={incident.officerDepartment || 'HQ_MAINFRAME'} />
                <IntelItem label="Primary Sensor" val={incident.cameraId} className="col-span-2" />
              </div>
            </section>
          </div>

          {/* OPERATIONAL ACTION TRAY (STICKY AT BOTTOM) */}
          <div className="shrink-0 p-8 border-t border-white/5 bg-[#0A0D16] space-y-4 z-20">
            <div className="flex flex-col gap-1 px-2">
              <span className="text-[9px] font-black text-primary uppercase tracking-widest">{config.sub}</span>
              <p className="text-[10px] font-bold text-white/20 uppercase">Tactical State Machine Active</p>
            </div>

            <motion.div whileTap={{ scale: 0.98 }}>
              <Button
                disabled={incident.status === 'resolved'}
                onClick={handleStatusTransition}
                className={`w-full h-16 rounded-2xl flex items-center justify-between px-6 group relative overflow-hidden transition-all duration-500 ${config.color} text-white shadow-2xl`}
              >
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <StatusIcon size={20} className="group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-left">
                    <span className="block text-[11px] font-black tracking-[0.2em]">{config.label}</span>
                    <span className="text-[8px] font-bold opacity-60 uppercase">{incident.status === 'active' ? 'Click to Dispatch Units' : 'Case Fully Archived'}</span>
                  </div>
                </div>
                <ChevronRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>

            <Button variant="ghost" className="w-full h-12 rounded-xl border border-white/5 text-[10px] font-black text-white/20 uppercase hover:text-white" onClick={onBack}>
              TERMINATE_DOSSIER_VIEW
            </Button>
          </div>
        </aside>

      </main>
    </div>
  );
};

const SectionHeader = ({ title, icon }: { title: string; icon: React.ReactNode }) => (
  <div className="flex items-center gap-3 pb-3 border-b border-white/5">
    <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center">
      {icon}
    </div>
    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70">{title}</h3>
  </div>
);

const IntelItem = ({ label, val, icon, color, className = "" }: { label: string; val: string | number; icon?: React.ReactNode; color?: string; className?: string }) => (
  <div className={`p-4 rounded-2xl bg-white/[0.02] border border-white/5 transition-all hover:bg-white/[0.04] space-y-1.5 ${className}`}>
    <div className="flex items-center gap-2">
      {icon && icon}
      <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">{label}</span>
    </div>
    <p className={`text-[11px] font-black uppercase tracking-widest ${color || 'text-white/80'}`}>{val}</p>
  </div>
);

const StatusDot = ({ label, active, color }: { label: string; active?: boolean; color: string }) => (
  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${active ? `bg-${color.replace('bg-', '')}/10 border-${color.replace('bg-', '')}/30 text-white` : 'bg-white/5 border-white/10 text-white/20'}`}>
    <div className={`w-1.5 h-1.5 rounded-full ${active ? `${color} animate-pulse shadow-[0_0_8px_rgba(0,0,0,0.5)]` : 'bg-white/10'}`} />
    <span className="text-[8px] font-black uppercase tracking-widest">{label}</span>
  </div>
);

export default IncidentDetail;