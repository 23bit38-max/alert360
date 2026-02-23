import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useTheme } from '../../theme';
import { motion, AnimatePresence } from 'framer-motion';

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
} from 'lucide-react';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';

// Tactical Icon Generators
const createTacticalIcon = (color: string, IconComponent: any, isPulsing = false) => {
  return L.divIcon({
    className: 'tactical-marker',
    html: `
      <div style="position: relative; width: 32px; height: 32px; display: flex; items-center; justify-content: center;">
        ${isPulsing ? `<div class="marker-ripple" style="color: ${color}"></div>` : ''}
        <div style="
          position: relative;
          width: 32px; height: 32px;
          background: ${color}20;
          border: 1px solid ${color};
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 15px ${color}40;
          backdrop-filter: blur(4px);
        ">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            ${IconComponent}
          </svg>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

const USER_LOCATION_ICON = L.divIcon({
  className: 'user-location-marker',
  html: `
    <div style="position: relative; width: 24px; height: 24px;">
      <div style="position: absolute; inset: -8px; background: rgba(59, 130, 246, 0.2); border-radius: 50%; animation: ripple 2s infinite;"></div>
      <div style="position: relative; width: 100%; height: 100%; background: #3B82F6; border: 3px solid white; border-radius: 50%; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

interface MapMarker {
  id: string;
  type: 'incident' | 'camera' | 'responder' | 'hospital';
  position: [number, number];
  title: string;
  status: 'active' | 'inactive' | 'responding' | 'resolved';
  details: any;
  severity?: 'critical' | 'high' | 'medium' | 'low';
}

const MapController = ({ center, zoom }: { center: [number, number], zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true, duration: 1 });
    // Force a resize check to fix tile rendering issues
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [center, zoom, map]);
  return null;
};

export const MapView = () => {
  useTheme();
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([40.7128, -74.006]);
  const [zoom, setZoom] = useState(13);
  const [layers, setLayers] = useState({
    incidents: true,
    cameras: true,
    responders: true,
    hospitals: true,
  });

  const [trackingEnabled, setTrackingEnabled] = useState(false);
  const watchId = useRef<number | null>(null);

  // Custom Icons Definitions
  const INCIDENT_ICON = createTacticalIcon('#EF4444', '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3ZM12 9v4M12 17h.01"/>', true);
  const CAMERA_ICON = createTacticalIcon('#10B981', '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>');
  const RESPONDER_ICON = createTacticalIcon('#F59E0B', '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>');
  const HOSPITAL_ICON = createTacticalIcon('#3B82F6', '<path d="M4 8V4m16 4V4m-9 4V4M4 20v-4m16 4v-4m-9 4v-4M4 12h16M4 16h16M4 8h16"/>');

  const mockMarkers: MapMarker[] = [
    {
      id: 'incident-1',
      type: 'incident',
      position: [40.7128, -74.006],
      title: 'Structural Breach: S-Sector',
      status: 'active',
      severity: 'critical',
      details: {
        vehicles: 3,
        casualties: 2,
        timestamp: '17:42:05',
        responders: ['Tactical-12', 'Ambulance-3'],
        sector: 'NY-FORENSIC-882'
      }
    },
    {
      id: 'camera-1',
      type: 'camera',
      position: [40.7305, -73.9934],
      title: 'Optical Node: Hudson',
      status: 'active',
      details: {
        id: 'cam-001',
        resolution: '1920x1080',
        fps: 30,
        sector: 'NY-SURVEILLANCE-881'
      }
    },
    {
      id: 'responder-1',
      type: 'responder',
      position: [40.7205, -74.0134],
      title: 'Mobile Unit: Alpha-7',
      status: 'responding',
      details: {
        id: 'unit-12',
        personnel: 2,
        eta: '2.4 mins',
        sector: 'NY-DYNAMIC-882'
      }
    }
  ];

  useEffect(() => {
    if (trackingEnabled) {
      if ("geolocation" in navigator) {
        watchId.current = navigator.geolocation.watchPosition(
          (pos) => {
            const newPos: [number, number] = [pos.coords.latitude, pos.coords.longitude];
            setUserLocation(newPos);
            setMapCenter(newPos);
          },
          (err) => console.error("Location tracking failed", err),
          { enableHighAccuracy: true }
        );
      }
    } else {
      if (watchId.current) navigator.geolocation.clearWatch(watchId.current);
    }
    return () => { if (watchId.current) navigator.geolocation.clearWatch(watchId.current); };
  }, [trackingEnabled]);

  const LayerToggle = ({ type, label, icon: Icon, count, color }: {
    type: keyof typeof layers;
    label: string;
    icon: any;
    count: number;
    color: string;
  }) => (
    <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-all cursor-pointer group"
      onClick={() => setLayers(prev => ({ ...prev, [type]: !prev[type] }))}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center border border-white/10 group-hover:scale-105 transition-transform"
          style={{ backgroundColor: `${color}10`, color }}>
          <Icon size={14} />
        </div>
        <div>
          <Label className="text-[11px] font-black text-white/90 cursor-pointer block tracking-tight">{label}</Label>
          <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">
            {count} Sensors
          </span>
        </div>
      </div>
      <Switch checked={layers[type]} className="scale-75 data-[state=checked]:bg-primary pointer-events-none" />
    </div>
  );

  return (
    <div className="page-container animate-in fade-in duration-800 max-w-[1700px] mx-auto pb-8 flex flex-col h-[calc(100vh-140px)]">
      {/* Precision Operational Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 px-3 py-1.5 bg-primary/5 border border-primary/20 rounded-xl">
            <Target size={14} className="text-primary" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Surveillance Matrix: </span>
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] animate-pulse">Alpha Online</span>
            </div>
          </div>
          <div className="h-4 w-[1px] bg-white/10" />
          <div className="flex items-center gap-3">
            <Activity size={14} className="text-blue-400" />
            <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em]">Tactical Feed 08.2.B</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className={`h-9 px-4 rounded-xl glass border-white/10 hover:bg-white/5 text-[9px] font-black uppercase tracking-widest transition-all ${trackingEnabled ? 'bg-primary/20 border-primary/40 text-primary shadow-[0_0_15px_rgba(16,185,129,0.2)]' : ''}`}
            onClick={() => setTrackingEnabled(!trackingEnabled)}
          >
            <Locate size={14} className={`mr-2 ${trackingEnabled ? 'animate-pulse' : ''}`} />
            {trackingEnabled ? 'Tracking' : 'Secure GPS'}
          </Button>
          <Button variant="outline" className="h-9 px-4 rounded-xl glass border-white/10 hover:bg-white/5 text-[9px] font-black uppercase tracking-widest"
            onClick={() => { setMapCenter([40.7128, -74.006]); setZoom(13); }}>
            <Navigation size={14} className="mr-2 text-primary" /> Center
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1 overflow-hidden">
        {/* Navigation & Layers Column */}
        <div className="col-span-3 flex flex-col gap-6">
          <Card className="glass border-white/5 rounded-[24px] overflow-hidden flex flex-col flex-1">
            <CardHeader className="p-5 pb-2">
              <span className="text-[9px] font-black tracking-[0.25em] text-muted-foreground uppercase opacity-50 flex items-center gap-2">
                <Layers size={12} className="text-primary" /> Operational Nodes
              </span>
            </CardHeader>
            <CardContent className="p-5 pt-4 space-y-3 overflow-y-auto custom-scrollbar">
              <LayerToggle type="incidents" label="Alert Matrix" icon={AlertTriangle} color="#EF4444" count={1} />
              <LayerToggle type="cameras" label="Optical Sensors" icon={Camera} color="#10B981" count={14} />
              <LayerToggle type="responders" label="Mobile Units" icon={Car} color="#F59E0B" count={8} />
              <LayerToggle type="hospitals" label="Rescue Centers" icon={Shield} color="#3B82F6" count={4} />

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
        <div className="col-span-9 grid grid-cols-12 gap-6">
          <div className="col-span-8 relative rounded-[28px] overflow-hidden glass border-white/5 premium-shadow">
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
              <MapController center={mapCenter} zoom={zoom} />

              {userLocation && (
                <Marker position={userLocation} icon={USER_LOCATION_ICON}>
                  <Popup className="tactical-popup">
                    <div className="p-3 bg-[#0B0F1A] rounded-xl border border-white/10 min-w-[140px]">
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Dispatch Core</p>
                      <p className="text-[9px] text-white/50 leading-tight">Situational awareness active for current sector.</p>
                    </div>
                  </Popup>
                </Marker>
              )}

              <MarkerClusterGroup chunkedLoading maxClusterRadius={50}>
                {mockMarkers.map(m => {
                  if (m.type === 'incident' && !layers.incidents) return null;
                  if (m.type === 'camera' && !layers.cameras) return null;
                  if (m.type === 'responder' && !layers.responders) return null;
                  if (m.type === 'hospital' && !layers.hospitals) return null;

                  const icon = m.type === 'camera' ? CAMERA_ICON :
                    m.type === 'responder' ? RESPONDER_ICON :
                      m.type === 'hospital' ? HOSPITAL_ICON :
                        INCIDENT_ICON;

                  return (
                    <Marker
                      key={m.id}
                      position={m.position}
                      icon={icon}
                      eventHandlers={{ click: () => setSelectedMarker(m) }}
                    >
                      {m.type === 'incident' && (
                        <Circle
                          center={m.position}
                          radius={300}
                          pathOptions={{ color: '#EF4444', fillColor: '#EF4444', fillOpacity: 0.1, weight: 1.5, dashArray: '8, 8' }}
                        />
                      )}
                    </Marker>
                  );
                })}
              </MarkerClusterGroup>
            </MapContainer>

            {/* Strategic HUD Overlays */}
            <div className="absolute top-5 left-5 z-[1000]">
              <div className="glass border-white/10 px-4 py-2 rounded-xl flex items-center gap-3 backdrop-blur-xl">
                <Activity size={12} className="text-primary animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-widest text-white/90">Situational Alpha Stream</span>
              </div>
            </div>

            <div className="absolute bottom-5 right-5 z-[1000]">
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

          {/* Intelligence Intelligence Right Column */}
          <div className="col-span-4 h-full">
            <Card className="glass border-white/5 rounded-[28px] h-full overflow-hidden flex flex-col">
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

                      <div className="space-y-4">
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
                          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50">Internal Sector</span>
                          <p className="text-[10px] font-bold text-primary uppercase tracking-[0.1em]">{selectedMarker.details.sector}</p>
                          <p className="text-[9px] text-white/50 leading-relaxed italic">
                            " forensic stream authenticated. node integrity stable. analyzing potential propagation. "
                          </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50">Confidence</span>
                            <span className="text-[10px] font-black text-primary">94.8%</span>
                          </div>
                          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: '94.8%' }} />
                          </div>
                        </div>
                      </div>

                      <Button className="w-full h-11 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-[0_8px_15px_rgba(16,185,129,0.25)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2 group">
                        Initalize Forensic Interface <Zap size={14} className="group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </motion.div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-20 py-20 border border-dashed border-white/10 rounded-[28px]">
                      <div className="w-16 h-16 rounded-full border border-white/40 flex items-center justify-center">
                        <Target size={24} className="text-white" />
                      </div>
                      <div className="space-y-1 px-6">
                        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white">Passive Mode</p>
                        <p className="text-[9px] font-medium leading-relaxed">Interrogate a specific node to load situational telemetry</p>
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
