import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { useTheme } from '@/core/theme';
import { motion, AnimatePresence } from 'framer-motion';
import { LoadingScreen } from '@/shared/components/LoadingScreen';

import {
    Camera,
    AlertTriangle,
    Car,
    Layers,
    Navigation,
    Shield,
    Activity,
    Zap,
    Target,
    Locate,
    Users,
    Clock,
} from 'lucide-react';

import { useMapData } from '@/features/alerts/map-view/hooks/useMapData';
import { MapController } from '@/features/alerts/map-view/components/MapController';
import { LayerToggle } from '@/features/alerts/map-view/components/LayerToggle';
import {
    createTacticalIcon,
    USER_LOCATION_ICON,
    getSeverityColor,
    INCIDENT_ICON_TEMPLATE,
    CAMERA_ICON,
    RESPONDER_ICON,
    HOSPITAL_ICON,
} from '@/features/alerts/map-view/constants/map.constants';

export const MapView = () => {
    useTheme();
    const { state, handlers } = useMapData();
    const {
        selectedMarker,
        userLocation,
        mapCenter,
        zoom,
        layers,
        mapBounds,
        loading,
        proximityAccidents,
        incidentMarkers,
        otherNodes,
        mockMarkers,
        trackingEnabled
    } = state;

    if (loading) {
        return <LoadingScreen message="Calibrating Surveillance Matrix..." />;
    }

    return (
        <div className="page-container animate-in fade-in duration-800 max-w-[1700px] mx-auto pb-8 flex flex-col h-[calc(100vh-140px)]">
            {/* Precision Operational Header */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-4 md:mb-6 pb-4 border-b border-white/5 shrink-0 gap-4">
                <div className="flex flex-wrap items-center gap-4 md:gap-6 w-full md:w-auto">
                    <div className="flex items-center gap-2 md:gap-3 px-3 py-1.5 bg-primary/5 border border-primary/20 rounded-xl">
                        <Target size={14} className="text-primary" />
                        <div className="flex items-center gap-2">
                            <span className="text-[9px] md:text-[10px] font-black text-white uppercase tracking-[0.1em] md:tracking-[0.2em]">Matrix: </span>
                            <span className="text-[9px] md:text-[10px] font-black text-primary uppercase tracking-[0.1em] md:tracking-[0.2em] animate-pulse">Alpha Online</span>
                        </div>
                    </div>
                    <div className="hidden sm:block h-4 w-[1px] bg-white/10" />
                    <div className="flex items-center gap-3">
                        <Activity size={14} className="text-blue-400" />
                        <span className="text-[9px] md:text-[10px] font-black text-white/60 uppercase tracking-[0.1em] md:tracking-[0.2em]">Tactical Feed</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Button
                        variant="outline"
                        className={`flex-1 md:flex-none h-9 px-3 md:px-4 rounded-xl glass border-white/10 hover:bg-white/5 text-[9px] font-black uppercase tracking-widest transition-all ${trackingEnabled ? 'bg-primary/20 border-primary/40 text-primary shadow-[0_0_15px_rgba(16,185,129,0.25)]' : ''}`}
                        onClick={() => handlers.setTrackingEnabled(!trackingEnabled)}
                    >
                        <Locate size={14} className={`mr-2 ${trackingEnabled ? 'animate-pulse' : ''}`} />
                        {trackingEnabled ? 'Tracking' : 'Secure GPS'}
                    </Button>
                    <Button variant="outline" className="flex-1 md:flex-none h-9 px-3 md:px-4 rounded-xl glass border-white/10 hover:bg-white/5 text-[9px] font-black uppercase tracking-widest"
                        onClick={() => {
                            if (mockMarkers.length > 0) {
                                const bounds = L.latLngBounds(mockMarkers.map(m => m.position));
                                handlers.setMapBounds(bounds);
                                setTimeout(() => handlers.setMapBounds(null), 500);
                            }
                        }}>
                        <Layers size={14} className="mr-2 text-primary" /> Fit All
                    </Button>
                    <Button variant="outline" className="flex-1 md:flex-none h-9 px-3 md:px-4 rounded-xl glass border-white/10 hover:bg-white/5 text-[9px] font-black uppercase tracking-widest"
                        onClick={() => { handlers.setMapCenter([19.0760, 72.8777]); handlers.setZoom(12); handlers.setMapBounds(null); }}>
                        <Navigation size={14} className="mr-2 text-primary" /> Center
                    </Button>
                </div>
            </div>

            <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 flex-1 overflow-hidden relative">
                {/* Navigation & Layers Column */}
                <div className="hidden lg:flex lg:col-span-3 flex-col gap-6">
                    <Card className="glass border-white/5 rounded-[24px] overflow-hidden flex flex-col flex-1">
                        <CardHeader className="p-5 pb-2">
                            <span className="text-[9px] font-black tracking-[0.25em] text-muted-foreground uppercase opacity-50 flex items-center gap-2">
                                <Layers size={12} className="text-primary" /> Operational Nodes
                            </span>
                        </CardHeader>
                        <CardContent className="p-5 pt-4 space-y-3 overflow-y-auto custom-scrollbar">
                            <LayerToggle type="incidents" label="Alert Matrix" icon={AlertTriangle} color="#EF4444" count={incidentMarkers.length} layers={layers} setLayers={handlers.setLayers} />
                            <LayerToggle type="cameras" label="Optical Sensors" icon={Camera} color="#10B981" count={otherNodes.filter(n => n.type === 'camera').length} layers={layers} setLayers={handlers.setLayers} />
                            <LayerToggle type="responders" label="Mobile Units" icon={Car} color="#F59E0B" count={otherNodes.filter(n => n.type === 'responder').length} layers={layers} setLayers={handlers.setLayers} />
                            <LayerToggle type="hospitals" label="Rescue Centers" icon={Shield} color="#3B82F6" count={otherNodes.filter(n => n.type === 'hospital').length} layers={layers} setLayers={handlers.setLayers} />

                            <div className="mt-6 pt-6 border-t border-white/5 space-y-3">
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50">Local Telemetry</span>
                                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-4">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <Zap size={14} className="text-yellow-400" />
                                            <span className="text-[9px] font-black text-white uppercase tracking-widest">Network Speed</span>
                                        </div>
                                        <span className="text-[10px] font-bold text-primary italic">94%</span>
                                    </div>
                                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary" style={{ width: '94%' }} />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Central Tactical Map */}
                <div className="col-span-12 lg:col-span-9 grid grid-cols-12 gap-6 h-full min-h-[400px]">
                    <div className="col-span-12 lg:col-span-8 relative rounded-[20px] md:rounded-[28px] overflow-hidden glass border-white/5 premium-shadow h-full">
                        <MapContainer
                            center={mapCenter}
                            zoom={zoom}
                            style={{ height: '100%', width: '100%', background: '#070B14' }}
                            zoomControl={false}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <MapController center={mapCenter} zoom={zoom} bounds={mapBounds || undefined} />

                            {userLocation && (
                                <Marker position={userLocation} icon={USER_LOCATION_ICON}>
                                    <Popup className="tactical-popup">
                                        <div className="p-4 bg-[#0B0F1A] rounded-2xl border border-white/10 min-w-[180px] shadow-2xl">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Operator Location</p>
                                            </div>
                                            <p className="text-[9px] text-white/70 leading-relaxed font-medium">Situational awareness active. GPS lock stabilized at current sector coordinates.</p>
                                            <div className="mt-3 pt-3 border-t border-white/5 flex justify-between">
                                                <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Status: active</span>
                                                <span className="text-[8px] font-bold text-primary uppercase tracking-widest">Signal: strong</span>
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                            )}

                            {layers.incidents && proximityAccidents.map(m => (
                                <Marker
                                    key={m.id}
                                    position={m.position}
                                    icon={createTacticalIcon('#EF4444', INCIDENT_ICON_TEMPLATE, true, getSeverityColor(m.severity))}
                                    eventHandlers={{ click: () => handlers.setSelectedMarker(m) }}
                                >
                                    <Circle
                                        center={m.position}
                                        radius={150}
                                        pathOptions={{ color: '#EF4444', fillColor: '#EF4444', fillOpacity: 0.1, weight: 1.5, dashArray: '4, 4' }}
                                    />
                                    <Popup className="tactical-popup">
                                        <div className="p-2 bg-[#0B0F1A] rounded-xl border border-red-500/20">
                                            <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">{m.title}</p>
                                            <p className="text-[8px] text-white/60 mt-1 uppercase font-bold tracking-tight">Status: Active Threat</p>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}

                            <MarkerClusterGroup chunkedLoading maxClusterRadius={50}>
                                {mockMarkers.filter((m: any) => !m.id.startsWith('sim-')).map((m: any) => {
                                    if (m.type === 'incident' && !layers.incidents) return null;
                                    if (m.type === 'camera' && !layers.cameras) return null;
                                    if (m.type === 'responder' && !layers.responders) return null;
                                    if (m.type === 'hospital' && !layers.hospitals) return null;

                                    const severityColor = getSeverityColor(m.severity);
                                    const icon = m.type === 'camera' ? CAMERA_ICON :
                                        m.type === 'responder' ? RESPONDER_ICON :
                                            m.type === 'hospital' ? HOSPITAL_ICON :
                                                createTacticalIcon('#EF4444', INCIDENT_ICON_TEMPLATE, m.severity?.toLowerCase() === 'critical' || m.severity?.toLowerCase() === 'high', severityColor);

                                    return (
                                        <Marker
                                            key={m.id}
                                            position={m.position}
                                            icon={icon}
                                            eventHandlers={{ click: () => handlers.setSelectedMarker(m) }}
                                        >
                                            {m.type === 'incident' && (
                                                <Circle
                                                    center={m.position}
                                                    radius={300}
                                                    pathOptions={{ color: severityColor, fillColor: severityColor, fillOpacity: 0.05, weight: 1.5, dashArray: '6, 6' }}
                                                />
                                            )}
                                        </Marker>
                                    );
                                })}
                            </MarkerClusterGroup>
                        </MapContainer>

                        {/* Strategic HUD Overlays */}
                        <div className="absolute top-4 left-4 z-[1000]">
                            <div className="glass border-white/10 px-3 py-1.5 md:px-4 md:py-2 rounded-xl flex items-center gap-2 md:gap-3 backdrop-blur-xl">
                                <Activity size={10} className="text-primary animate-pulse" />
                                <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-white/90">Alpha Stream</span>
                            </div>
                        </div>

                        <div className="absolute bottom-4 right-4 z-[1000] hidden md:block">
                            <Card className="glass border-white/10 p-4 rounded-2xl backdrop-blur-xl w-44">
                                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-3 block opacity-60">System Legend</span>
                                <div className="space-y-2.5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                                        <span className="text-[9px] font-black text-white/70 uppercase">Incident Core</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                                        <span className="text-[9px] font-black text-white/70 uppercase">Optical Node</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                                        <span className="text-[9px] font-black text-white/70 uppercase">Patrol Vector</span>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>

                    {/* Intelligence Column */}
                    <div className={`${selectedMarker ? 'fixed inset-x-4 bottom-24 z-[1001] h-auto max-h-[60%]' : 'hidden'} lg:relative lg:inset-auto lg:z-0 lg:block lg:col-span-4 lg:h-full`}>
                        <Card className="glass border-white/5 rounded-[24px] md:rounded-[28px] h-full overflow-hidden flex flex-col shadow-2xl">
                            <CardHeader className="p-6 pb-2">
                                <span className="text-[9px] font-black tracking-[0.25em] text-muted-foreground uppercase opacity-50 flex items-center gap-2">
                                    <Target size={12} className="text-red-500" /> Forensic Intelligence
                                </span>
                            </CardHeader>
                            <CardContent className="p-6 pt-4 flex-1 overflow-y-auto custom-scrollbar">
                                <AnimatePresence mode="wait">
                                    {selectedMarker ? (
                                        <motion.div
                                            key={selectedMarker.id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-6"
                                        >
                                            <div className="p-4 rounded-[20px] bg-white/[0.03] border border-white/5 space-y-4">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center border border-white/10 ${selectedMarker.type === 'incident' ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary'}`}>
                                                        {selectedMarker.type === 'incident' ? <AlertTriangle size={24} /> : <Camera size={24} />}
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Badge className={`${selectedMarker.type === 'incident' ? 'bg-red-500/15 text-red-500 border-red-500/30' : 'bg-primary/15 text-primary border-primary/30'} text-[8px] font-black tracking-widest px-2 uppercase`}>
                                                            Node: {selectedMarker.status}
                                                        </Badge>
                                                        <h3 className="text-sm font-black text-white tracking-tight leading-tight">{selectedMarker.title}</h3>
                                                    </div>
                                                </div>
                                            </div>

                                            {selectedMarker.type === 'incident' && (
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50">Vehicles</span>
                                                        <div className="flex items-center gap-2">
                                                            <Car size={14} className="text-blue-400" />
                                                            <span className="text-sm font-black text-white">{selectedMarker.details.vehicles}</span>
                                                        </div>
                                                    </div>
                                                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50">Casualties</span>
                                                        <div className="flex items-center gap-2">
                                                            <Users size={14} className="text-red-400" />
                                                            <span className="text-sm font-black text-white">{selectedMarker.details.casualties}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="space-y-2">
                                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50">Matrix Coordinates</span>
                                                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                                                    <div className="flex justify-between items-center group">
                                                        <span className="text-[9px] font-bold text-white/40 uppercase">Latitude</span>
                                                        <span className="text-[10px] font-mono text-white/90 tracking-tighter">{selectedMarker.position[0].toFixed(6)}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center group">
                                                        <span className="text-[9px] font-bold text-white/40 uppercase">Longitude</span>
                                                        <span className="text-[10px] font-mono text-white/90 tracking-tighter">{selectedMarker.position[1].toFixed(6)}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50">Tactical Detail</span>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Clock size={12} className="text-primary" />
                                                    <span className="text-[10px] font-black text-white/80">{selectedMarker.details.timestamp}</span>
                                                </div>
                                                <p className="text-[10px] font-bold text-primary uppercase tracking-[0.1em]">{selectedMarker.details.sector}</p>
                                                <p className="text-[9px] text-white/50 leading-relaxed italic">
                                                    {selectedMarker.type === 'incident'
                                                        ? '" live forensic stream authenticated. multiple vehicle impact detected. initializing emergency protocols. "'
                                                        : '" optical node active. situational telemetry stabilized. persistent monitoring engaged. "'}
                                                </p>
                                            </div>

                                            <Button
                                                className="w-full h-11 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-[0_8px_15px_rgba(16,185,129,0.25)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2 group"
                                            >
                                                Initialize Forensic Interface <Zap size={14} className="group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                className="w-full lg:hidden text-white/40 text-[9px] font-black uppercase"
                                                onClick={() => handlers.setSelectedMarker(null)}
                                            >
                                                Minimize Intelligence
                                            </Button>
                                        </motion.div>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-20 py-10 lg:py-20 border border-dashed border-white/10 rounded-[28px]">
                                            <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full border border-white/40 flex items-center justify-center">
                                                <Target className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                                            </div>
                                            <div className="space-y-1 px-4 lg:px-6">
                                                <p className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.25em] text-white">Passive Mode</p>
                                                <p className="text-[8px] lg:text-[9px] font-medium leading-relaxed">Interrogate a node to load telemetry</p>
                                            </div>
                                        </div>
                                    )}
                                </AnimatePresence>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};
