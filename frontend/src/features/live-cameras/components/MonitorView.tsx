import {
    MapPin,
    Users,
    AlertTriangle,
    Wifi,
    Settings,
    List,
    Camera,
    Pause,
    Volume2,
    Rewind,
    Maximize,
    FileText
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Card } from '@/shared/components/ui/card';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import type { CameraFeed } from '@/features/live-cameras/types';

interface MonitorViewProps {
    selectedCamera: CameraFeed | null;
    filteredCameras: CameraFeed[];
    onSelectCamera: (camera: CameraFeed) => void;
}

export const MonitorView = ({ selectedCamera, filteredCameras, onSelectCamera }: MonitorViewProps) => {
    if (!selectedCamera) return (
        <div className="flex items-center justify-center h-[60vh] text-muted-foreground bg-black/40 rounded-xl border border-white/10">
            Select a camera to view feed
        </div>
    );

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-180px)] min-h-[600px]">
            {/* Main Player Area */}
            <div className="flex-1 flex flex-col gap-4">
                <div className="relative flex-1 bg-black/90 rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
                    {/* Video Feed */}
                    {selectedCamera.youtubeId ? (
                        <iframe
                            src={`https://www.youtube.com/embed/${selectedCamera.youtubeId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&loop=1&playlist=${selectedCamera.youtubeId}`}
                            title={selectedCamera.name}
                            className="w-full h-full object-cover pointer-events-none"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    ) : (
                        <img
                            src={selectedCamera.thumbnail}
                            alt={selectedCamera.name}
                            className="w-full h-full object-cover opacity-80"
                        />
                    )}

                    {/* Live Indicator Overlay */}
                    <div className="absolute top-6 left-6 flex items-start flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <div className="bg-red-600 text-white px-3 py-1 rounded-md text-xs font-bold tracking-wider flex items-center gap-2 shadow-lg shadow-red-900/40 animate-pulse">
                                <div className="w-2 h-2 bg-white rounded-full" />
                                LIVE
                            </div>
                            <div className="bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-md text-xs font-mono border border-white/10">
                                REC • {new Date().toLocaleTimeString()}
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-white drop-shadow-md tracking-tight mt-2">
                            {selectedCamera.name}
                        </h2>
                        <div className="flex items-center text-gray-300 text-sm gap-2">
                            <MapPin className="w-4 h-4 text-electric-blue" />
                            {selectedCamera.location} • Zone: {selectedCamera.zone.toUpperCase()}
                        </div>
                    </div>

                    {/* Top Right Status */}
                    <div className="absolute top-6 right-6 flex flex-col items-end gap-2">
                        <Badge className={`backdrop-blur-md border border-white/10 ${selectedCamera.status === 'online' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                            }`}>
                            Signal: Good (45ms)
                        </Badge>
                        <div className="text-xs text-gray-400 font-mono">
                            {selectedCamera.resolution} @ {selectedCamera.fps}FPS
                        </div>
                    </div>

                    {/* Controls Overlay (Hover) */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                        {/* Scrubber */}
                        <div className="w-full h-1 bg-gray-700 rounded-full mb-4 overflow-hidden cursor-pointer hover:h-2 transition-all">
                            <div className="w-[98%] h-full bg-red-600 relative">
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg scale-0 group-hover:scale-100 transition-transform" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Button size="icon" variant="ghost" className="text-white hover:bg-white/10 hover:text-electric-blue">
                                    <Pause className="w-5 h-5 fill-current" />
                                </Button>
                                <Button size="icon" variant="ghost" className="text-white hover:bg-white/10 hover:text-electric-blue">
                                    <Rewind className="w-5 h-5" />
                                </Button>
                                <div className="flex items-center gap-2 group/vol">
                                    <Volume2 className="w-5 h-5 text-gray-300 group-hover/vol:text-white cursor-pointer" />
                                    <div className="w-0 overflow-hidden group-hover/vol:w-24 transition-all duration-300">
                                        <div className="h-1 bg-gray-600 rounded-full w-20 ml-2">
                                            <div className="h-full w-2/3 bg-white rounded-full" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button size="sm" variant="outline" className="h-8 border-white/10 bg-black/40 text-xs hover:bg-white/10">
                                    <Camera className="w-3 h-3 mr-2" />
                                    Snap
                                </Button>
                                <Button size="icon" variant="ghost" className="text-white hover:bg-white/10">
                                    <Maximize className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Context Panels (Below Player) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-48">
                    <Card className="glass border-glass-border p-4 bg-black/20">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Users className="w-3 h-3" /> Dept Info
                        </h3>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Department</span>
                                <span className="text-white capitalize">{selectedCamera.department}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Requested By</span>
                                <span className="text-white truncate max-w-[120px]" title={selectedCamera.requestedBy}>
                                    {selectedCamera.requestedBy}
                                </span>
                            </div>
                            <div className="mt-4 pt-4 border-t border-white/5 flex gap-2">
                                <Button size="sm" variant="outline" className="w-full text-xs h-7 border-electric-blue/30 text-electric-blue hover:bg-electric-blue/10">
                                    Contact
                                </Button>
                            </div>
                        </div>
                    </Card>

                    <Card className="glass border-glass-border p-4 bg-black/20">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <AlertTriangle className="w-3 h-3" /> Recent Alerts
                        </h3>
                        <ScrollArea className="h-28 pr-2">
                            <div className="space-y-2">
                                {selectedCamera.lastDetection ? (
                                    <div className="flex items-start gap-3 p-2 rounded bg-red-500/10 border border-red-500/20">
                                        <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                                        <div>
                                            <div className="text-xs font-bold text-red-400">Motion Detected</div>
                                            <div className="text-[10px] text-gray-400">{selectedCamera.lastDetection} • High Conf.</div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-xs text-gray-500 italic text-center py-4">No recent alerts</div>
                                )}
                                <div className="flex items-start gap-3 p-2 rounded bg-white/5 border border-white/5">
                                    <Wifi className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                                    <div>
                                        <div className="text-xs font-bold text-gray-300">System Online</div>
                                        <div className="text-[10px] text-gray-500">2 hours ago</div>
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>
                    </Card>

                    <Card className="glass border-glass-border p-4 bg-black/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-electric-blue/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Settings className="w-3 h-3" /> Quick Actions
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                            <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-1 border-white/10 hover:bg-white/5 hover:border-electric-blue/30 group/btn">
                                <AlertTriangle className="w-4 h-4 text-orange-400 group-hover/btn:scale-110 transition-transform" />
                                <span className="text-[10px] text-gray-300">Flag Incident</span>
                            </Button>
                            <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-1 border-white/10 hover:bg-white/5 hover:border-electric-blue/30 group/btn">
                                <FileText className="w-4 h-4 text-blue-400 group-hover/btn:scale-110 transition-transform" />
                                <span className="text-[10px] text-gray-300">Export Log</span>
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Side List (Cameras) */}
            <div className="w-full lg:w-80 xl:w-96 flex flex-col glass border-glass-border rounded-xl overflow-hidden h-full">
                <div className="p-4 border-b border-white/5 bg-black/20">
                    <h3 className="font-bold text-white text-sm flex items-center gap-2">
                        <List className="w-4 h-4 text-electric-blue" />
                        Available Feeds ({filteredCameras.length})
                    </h3>
                </div>
                <ScrollArea className="flex-1 p-3">
                    <div className="space-y-3">
                        {filteredCameras.map((cam) => (
                            <div
                                key={cam.id}
                                onClick={() => onSelectCamera(cam)}
                                className={`p-2 rounded-lg border transition-all cursor-pointer flex gap-3 group items-center ${selectedCamera.id === cam.id
                                    ? 'bg-electric-blue/10 border-electric-blue/50 shadow-[0_0_15px_rgba(59,130,246,0.15)]'
                                    : 'bg-black/20 border-transparent hover:bg-white/5 hover:border-white/10'
                                    }`}
                            >
                                {/* Thumb */}
                                <div className="w-20 h-14 bg-gray-900 rounded overflow-hidden relative shrink-0 border border-white/10">
                                    <img src={cam.thumbnail} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                                    {cam.status === 'online' && <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]" />}
                                </div>
                                {/* Info */}
                                <div className="min-w-0 flex-1">
                                    <div className={`text-xs font-bold truncate mb-0.5 ${selectedCamera.id === cam.id ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                                        {cam.name}
                                    </div>
                                    <div className="text-[10px] text-gray-500 truncate flex items-center gap-1">
                                        <MapPin className="w-3 h-3" /> {cam.zone}
                                    </div>
                                </div>
                                {selectedCamera.id === cam.id && (
                                    <div className="w-1 h-8 bg-electric-blue rounded-full absolute left-0 top-1/2 -translate-y-1/2 blur-[1px]" />
                                )}
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
};
