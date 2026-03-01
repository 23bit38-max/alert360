import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { motion } from 'framer-motion';
import {
    MapPin,
    CheckCircle,
    Activity,
    Maximize2,
    Play,
    Check,
    ChevronRight,
    Flame,
    User as UserIcon,
    CloudSun,
    Car,
    Clock,
    Zap,
    Eye
} from 'lucide-react';
import type { Alert } from '@/features/alerts/real-time-alerts/constants/alerts.types';

interface AlertCardProps {
    alert: Alert;
    setMapCenter: (center: [number, number]) => void;
    setSelectedIncident: (id: string | null) => void;
    handleActionFlow: (id: string, status: Alert['status']) => void;
}

export const AlertCard = ({ alert, setMapCenter, setSelectedIncident, handleActionFlow }: AlertCardProps) => {
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
            onClick={() => setMapCenter([alert.coordinates.lat, alert.coordinates.lng])}
            className="group relative cursor-pointer h-[500px] bg-slate-900/40 rounded-[2.5rem] border border-white/5 overflow-hidden flex flex-col premium-shadow-lg transition-all duration-500 hover:border-white/20 hover:shadow-primary/5 shadow-2xl"
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
                        onClick={(e) => { e.stopPropagation(); setSelectedIncident(alert.id); }}
                    >
                        <Eye size={14} className="mr-3 text-primary" /> View Incident Details
                    </Button>

                    <motion.div whileTap={{ scale: 0.98 }}>
                        <Button
                            disabled={alert.status === 'resolved'}
                            className={`w-full h-14 rounded-2xl flex items-center justify-between px-6 group/btn relative overflow-hidden transition-all duration-500 ${config.color} text-white shadow-2xl`}
                            onClick={(e) => { e.stopPropagation(); handleActionFlow(alert.id, alert.status); }}
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
