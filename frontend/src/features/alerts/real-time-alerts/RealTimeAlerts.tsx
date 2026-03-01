import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { IncidentDetail } from '@/features/incidents/incident-detail/IncidentDetail';
import { LoadingScreen } from '@/shared/components/LoadingScreen';
import { useTheme } from '@/core/theme';
import {
    Search,
    RefreshCw,
    Download,
    Activity,
    BarChart3,
    Map as MapIcon,
    ShieldAlert,
    Zap
} from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/components/ui/select';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { AnimatePresence } from 'framer-motion';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import { useAlerts } from '@/features/alerts/real-time-alerts/hooks/useAlerts';
import { MapController } from '@/features/alerts/real-time-alerts/components/MapController';
import { AlertCard } from '@/features/alerts/real-time-alerts/components/AlertCard';
import { trendData, INCIDENT_ICON_TEMPLATE, createTacticalIcon } from '@/features/alerts/real-time-alerts/constants/alerts.constants';

export const RealTimeAlerts = ({ setCurrentPage }: { setCurrentPage?: (page: any) => void }) => {
    useTheme();
    const { state, handlers } = useAlerts();

    const {
        searchQuery,
        selectedZone,
        selectedSeverity,
        selectedIncident,
        mapCenter,
        loading,
        stats,
        filteredAlerts,
        alerts
    } = state;

    if (selectedIncident) {
        const incident = alerts.find(a => a.id === selectedIncident);
        if (incident) return <IncidentDetail incident={incident} onBack={() => handlers.setSelectedIncident(null)} />;
    }

    if (loading) {
        return <LoadingScreen message="Establishing Real-Time Intelligence Uplink..." />;
    }

    return (
        <div className="flex-1 flex flex-col bg-[#05080E] h-full overflow-hidden select-none">

            {/* HEADER: COMMAND CENTER */}
            <div className="shrink-0 border-b border-white/5 px-4 md:px-8 h-auto min-h-[5rem] py-4 md:py-0 flex flex-col md:flex-row items-center justify-between bg-[#0A0E17]/80 backdrop-blur-xl z-20 gap-4">
                <div className="flex items-center gap-8 w-full md:w-auto">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                            <Activity className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <div>
                            <h1 className="text-xs md:text-sm font-black tracking-[0.2em] md:tracking-[0.4em] uppercase text-white leading-none">Command Hub</h1>
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

                <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto">
                    <Button variant="ghost" className="flex-1 md:flex-none h-10 md:h-11 px-3 md:px-6 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white/40 border border-white/5 rounded-xl md:rounded-2xl hover:bg-white/5" onClick={handlers.loadData}>
                        <RefreshCw className={`w-3.5 h-3.5 md:w-4 md:h-4 mr-2 md:mr-3 ${loading ? 'animate-spin' : ''}`} /> Sync
                    </Button>
                    <Button className="flex-1 md:flex-none h-10 md:h-11 px-4 md:px-8 bg-primary text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-xl md:rounded-2xl shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                        <Download className="w-3.5 h-3.5 md:w-4 md:h-4 mr-2 md:mr-3" /> Intel Pack
                    </Button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* FEED AREA */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* TACTICAL SEARCH */}
                    <div className="h-auto md:h-16 shrink-0 border-b border-white/5 bg-[#080C14] px-4 md:px-8 py-4 md:py-0 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="relative group w-full md:flex-1 md:max-w-xl">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary opacity-30 group-focus-within:opacity-100 transition-opacity" />
                            <Input
                                placeholder="QUERY SECTOR MATRIX..."
                                value={searchQuery}
                                onChange={(e) => handlers.setSearchQuery(e.target.value)}
                                className="h-11 pl-12 bg-white/[0.02] border-white/5 text-[10px] md:text-[11px] uppercase font-black tracking-widest focus:ring-1 focus:ring-primary/20 rounded-xl"
                            />
                        </div>
                        <div className="flex gap-2 md:gap-3 w-full md:w-auto md:ml-6">
                            <Select value={selectedZone} onValueChange={handlers.setSelectedZone}>
                                <SelectTrigger className="flex-1 md:w-40 h-10 md:h-11 bg-white/[0.02] border-white/5 text-[9px] md:text-[10px] font-black uppercase text-white/60 rounded-xl">
                                    <SelectValue placeholder="ZONE" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#0A0E17] border-white/10 text-white font-black uppercase text-[10px] rounded-xl">
                                    <SelectItem value="all">ALL_ZONES</SelectItem>
                                    <SelectItem value="SECTOR ALPHA">ALPHA</SelectItem>
                                    <SelectItem value="SECTOR BETA">BETA</SelectItem>
                                    <SelectItem value="SECTOR GAMMA">GAMMA</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={selectedSeverity} onValueChange={handlers.setSelectedSeverity}>
                                <SelectTrigger className="flex-1 md:w-40 h-10 md:h-11 bg-white/[0.02] border-white/5 text-[9px] md:text-[10px] font-black uppercase text-white/60 rounded-xl">
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
                    <ScrollArea className="flex-1 p-4 md:p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6 md:gap-8">
                            <AnimatePresence mode="popLayout">
                                {filteredAlerts.length > 0 ? (
                                    filteredAlerts.map(alert => (
                                        <AlertCard
                                            key={alert.id}
                                            alert={alert}
                                            setMapCenter={handlers.setMapCenter}
                                            setSelectedIncident={handlers.setSelectedIncident}
                                            handleActionFlow={handlers.handleActionFlow}
                                        />
                                    ))
                                ) : (
                                    <div className="col-span-full h-96 flex flex-col items-center justify-center space-y-4 opacity-10">
                                        <ShieldAlert size={64} />
                                        <p className="text-sm font-black uppercase tracking-[0.5em]">Sector Cleared</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                        <div className="h-24 md:h-10" />
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
                                <Button
                                    variant="ghost"
                                    className="h-6 px-2 text-[8px] font-black text-primary uppercase"
                                    onClick={() => setCurrentPage?.('map')}
                                >
                                    FULL_MAP
                                </Button>
                            </div>
                            <div className="h-56 rounded-3xl border border-white/5 relative bg-slate-950/50 overflow-hidden shadow-inner group">
                                <MapContainer
                                    center={mapCenter}
                                    zoom={12}
                                    style={{ height: '100%', width: '100%', background: '#070B14' }}
                                    zoomControl={false}
                                >
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; OpenStreetMap'
                                    />
                                    <MapController center={mapCenter} />
                                    {filteredAlerts.map(alert => (
                                        <Marker
                                            key={alert.id}
                                            position={[alert.coordinates.lat, alert.coordinates.lng]}
                                            icon={createTacticalIcon(
                                                alert.type === 'critical' ? '#EF4444' : '#F97316',
                                                INCIDENT_ICON_TEMPLATE,
                                                alert.type === 'critical',
                                                alert.type === 'critical' ? '#EF4444' : '#F97316'
                                            )}
                                            eventHandlers={{
                                                click: () => {
                                                    handlers.setMapCenter([alert.coordinates.lat, alert.coordinates.lng]);
                                                }
                                            }}
                                        />
                                    ))}
                                </MapContainer>

                                <div className="absolute top-4 right-4 z-[1000]">
                                    <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                        <span className="text-[7px] font-black text-white/60 tracking-widest uppercase">Live Vector</span>
                                    </div>
                                </div>

                                <div className="absolute bottom-4 left-4 p-3 bg-black/60 rounded-xl border border-white/10 backdrop-blur-md z-[1000] opacity-0 group-hover:opacity-100 transition-opacity">
                                    <p className="text-[8px] font-black text-white/50 uppercase tracking-widest">Selected Coordinates</p>
                                    <p className="text-[10px] font-mono text-primary mt-0.5">{mapCenter[0].toFixed(4)} | {mapCenter[1].toFixed(4)}</p>
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
            <div className="fixed bottom-24 left-1/2 -translate-x-1/2 lg:translate-x-0 lg:bottom-8 lg:left-12 flex gap-6 lg:gap-10 px-6 lg:px-8 py-3 rounded-full border border-white/10 bg-[#0A0E17]/95 backdrop-blur-2xl z-40 shadow-2xl transition-all hover:scale-105 active:scale-95 group hidden sm:flex">
                <div className="flex items-center gap-2 lg:gap-4">
                    <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.6)] animate-pulse" />
                    <span className="text-[9px] font-black text-white/40 uppercase tracking-widest group-hover:text-white transition-colors">Pending</span>
                </div>
                <div className="w-px h-4 bg-white/10" />
                <div className="flex items-center gap-2 lg:gap-4">
                    <div className="w-2 h-2 rounded-full bg-orange-400 shadow-[0_0_12px_rgba(251,146,60,0.6)]" />
                    <span className="text-[9px] font-black text-white/40 uppercase tracking-widest group-hover:text-white transition-colors">Active</span>
                </div>
                <div className="w-px h-4 bg-white/10" />
                <div className="flex items-center gap-2 lg:gap-4">
                    <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_12px_rgba(16,185,129,0.6)]" />
                    <span className="text-[9px] font-black text-white/40 uppercase tracking-widest group-hover:text-white transition-colors">Cleared</span>
                </div>
            </div>
        </div>
    );
};
