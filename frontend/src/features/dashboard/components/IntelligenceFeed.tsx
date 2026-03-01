import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import {
    Bell,
    ArrowRight,
    Flame,
    Siren,
    Activity,
    MapPin,
    Clock,
    Car,
    Users,
    ChevronRight
} from 'lucide-react';

interface IntelligenceFeedProps {
    alerts: any[];
}

export const IntelligenceFeed: React.FC<IntelligenceFeedProps> = ({ alerts }) => {
    return (
        <Card className="glass border-white/5 rounded-[40px] overflow-hidden p-0 shadow-2xl flex flex-col h-full bg-[#070B14]/40">
            <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 pb-8 px-10 pt-10 bg-white/[0.01]">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                        <Bell size={28} className="animate-pulse" />
                    </div>
                    <div>
                        <CardTitle className="text-2xl font-black tracking-tight text-white uppercase italic">Detection Stream</CardTitle>
                        <CardDescription className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-40">
                            Real-time Event Validation Feed
                        </CardDescription>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Badge className="bg-white/5 text-muted-foreground border-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl">
                        {alerts.length} VERIFIED DETECTIONS
                    </Badge>
                    <Button variant="ghost" className="h-10 px-5 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 rounded-xl group">
                        Archive <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </CardHeader>

            <ScrollArea className="flex-1">
                <div className="p-8 space-y-6">
                    {alerts.map((alert) => (
                        <div key={alert.id} className="group relative transition-all duration-500">
                            {/* Priority Indicator Line */}
                            <div className={`absolute left-0 top-3 bottom-3 w-1.5 rounded-full z-20 transition-all duration-500 group-hover:w-2 ${alert.type === 'critical' ? 'bg-red-500 shadow-[0_0_20px_#ef4444]' :
                                alert.type === 'high' ? 'bg-orange-500 shadow-[0_0_15px_#f97316]' :
                                    alert.type === 'medium' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-slate-500'
                                }`} />

                            <div className="ml-4 p-6 glass border-white/5 rounded-[32px] hover:bg-white/[0.06] transition-all cursor-pointer border hover:border-white/10 premium-shadow relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 -mr-16 -mt-16 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 relative z-10">
                                    <div className="flex items-start gap-6 flex-1 min-w-0">
                                        <div className={`w-16 h-16 shrink-0 rounded-[22px] flex items-center justify-center transition-all duration-500 group-hover:rotate-6 ${alert.type === 'critical' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                            alert.type === 'high' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                                                'bg-primary/10 text-primary border-primary/20'
                                            } border`}>
                                            {alert.department === 'fire' ? <Flame size={28} /> :
                                                alert.department === 'police' ? <Siren size={28} /> :
                                                    <Activity size={28} />}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-4 mb-2">
                                                <h4 className="text-xl font-black text-white uppercase tracking-tight truncate group-hover:text-primary transition-colors">
                                                    {alert.location}
                                                </h4>
                                                <Badge className={`${alert.type === 'critical' ? 'bg-red-500 text-white' :
                                                    alert.type === 'high' ? 'bg-orange-500 text-white' :
                                                        'bg-slate-700 text-slate-300'
                                                    } text-[8px] font-black uppercase tracking-[0.2em] border-none px-3 py-1 rounded-lg shrink-0`}>
                                                    {alert.type}
                                                </Badge>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-6">
                                                <div className="flex items-center gap-2 text-zinc-500">
                                                    <MapPin size={12} className="text-primary opacity-60" />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">{alert.zone} Sector</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-zinc-500">
                                                    <Clock size={12} className="text-primary opacity-60" />
                                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">{alert.time}</span>
                                                </div>
                                                <div className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                                                    REF: {alert.id.substring(0, 8)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between xl:justify-end gap-10 xl:pl-10 xl:border-l border-white/5">
                                        <div className="flex gap-10">
                                            <div className="text-center group-hover:scale-110 transition-transform">
                                                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-2">Vehicles</p>
                                                <div className="flex items-center justify-center gap-2.5">
                                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                                                        <Car size={16} />
                                                    </div>
                                                    <span className="text-lg font-black text-white">{alert.vehicles}</span>
                                                </div>
                                            </div>
                                            <div className="text-center group-hover:scale-110 transition-transform delay-75">
                                                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-2">Impact</p>
                                                <div className="flex items-center justify-center gap-2.5">
                                                    <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400">
                                                        <Users size={16} />
                                                    </div>
                                                    <span className="text-lg font-black text-white">{alert.casualties}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Button className="h-14 w-14 rounded-[22px] bg-white/5 border border-white/10 hover:bg-primary hover:text-white hover:border-primary transition-all p-0 group/btn shadow-xl hover:shadow-primary/20">
                                            <ChevronRight size={24} className="group-hover/btn:translate-x-1 transition-transform" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </Card>
    );
};
