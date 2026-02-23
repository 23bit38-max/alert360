import {
    MoreVertical,
    Eye,
    Settings,
    MapPin,
    Users,
    Wifi,
    WifiOff,
    AlertTriangle,
} from 'lucide-react';
import { Card, CardContent } from '../../../ui/card';
import { Badge } from '../../../ui/badge';
import { Button } from '../../../ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../../../ui/dropdown-menu';
import type { CameraFeed } from '../types';

export const DesktopCameraCard = ({ camera }: { camera: CameraFeed }) => (
    <Card className="glass border-glass-border hover:scale-105 transition-all duration-300 overflow-hidden group neon-glow">
        <div className="relative">
            {/* Thumbnail/Stream */}
            <div className="aspect-video bg-gray-900 relative overflow-hidden">
                <img
                    src={camera.thumbnail}
                    alt={camera.name}
                    className="w-full h-full object-cover"
                />

                {/* Status indicator */}
                <div className="absolute top-2 left-2">
                    <Badge
                        variant="secondary"
                        className={`text-xs ${camera.status === 'online' ? 'bg-green-500/80 text-white' :
                            camera.status === 'offline' ? 'bg-red-500/80 text-white' :
                                'bg-yellow-500/80 text-black'
                            }`}
                    >
                        {camera.status === 'online' ? (
                            <Wifi className="w-3 h-3 mr-1" />
                        ) : (
                            <WifiOff className="w-3 h-3 mr-1" />
                        )}
                        {camera.status.toUpperCase()}
                    </Badge>
                </div>

                {/* Department indicator */}
                <div className="absolute top-2 right-2">
                    <Badge
                        variant="secondary"
                        className={`text-xs ${camera.department === 'police' ? 'bg-blue-500/80 text-white' :
                            camera.department === 'fire' ? 'bg-red-500/80 text-white' :
                                'bg-green-500/80 text-white'
                            }`}
                    >
                        {camera.department?.toUpperCase()}
                    </Badge>
                </div>

                {/* Last detection indicator */}
                {camera.lastDetection && (
                    <div className="absolute bottom-12 right-2">
                        <Badge className="bg-red-500/80 text-white text-xs animate-pulse">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            DETECTED
                        </Badge>
                    </div>
                )}

                {/* Control overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <div className="flex space-x-2">
                        <Button size="sm" variant="secondary" className="bg-white/20 backdrop-blur">
                            <Eye className="w-4 h-4 mr-1" /> View
                        </Button>
                        <Button size="sm" variant="secondary" className="bg-white/20 backdrop-blur">
                            <Settings className="w-4 h-4 mr-1" /> Config
                        </Button>
                    </div>
                </div>

                {/* Live indicator */}
                {camera.status === 'online' && (
                    <div className="absolute bottom-2 left-2 flex items-center space-x-1 bg-red-600 px-2 py-1 rounded text-xs text-white">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <span>LIVE</span>
                    </div>
                )}
            </div>

            {/* Camera Info */}
            <CardContent className="p-3">
                <div className="space-y-2">
                    <div className="flex items-start justify-between">
                        <div className="min-w-0 flex-1">
                            <h3 className="text-sm font-medium text-white truncate mb-1">{camera.name}</h3>
                            <div className="flex items-center text-xs text-gray-400 mb-1">
                                <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                                <span className="truncate">{camera.location}</span>
                            </div>
                            {camera.requestedBy && (
                                <div className="flex items-center text-xs text-gray-500">
                                    <Users className="w-3 h-3 mr-1 flex-shrink-0" />
                                    <span className="truncate">By {camera.requestedBy}</span>
                                </div>
                            )}
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-400 hover:text-white">
                                    <MoreVertical className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="glass border-glass-border">
                                <DropdownMenuItem className="text-gray-300 hover:bg-white/5 hover:text-white">
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Full Screen
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-gray-300 hover:bg-white/5 hover:text-white">
                                    <Settings className="w-4 h-4 mr-2" />
                                    Camera Settings
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-400 hover:bg-red-500/10 hover:text-red-300">
                                    Remove Camera
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </CardContent>

            <CardContent className="pt-0">
                <div className="space-y-2">
                    {/* Technical Details */}
                    <div className="flex justify-between text-xs text-gray-400">
                        <span>Zone: {camera.zone.replace('-', ' ').toUpperCase()}</span>
                        <span>{camera.resolution} • {camera.fps}fps</span>
                    </div>

                    {/* Last Detection */}
                    {camera.lastDetection && (
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-400">Last Detection:</span>
                            <span className="text-red-400 font-medium">{camera.lastDetection}</span>
                        </div>
                    )}

                    {/* Confidence Score */}
                    {camera.confidence && (
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-400">AI Confidence:</span>
                            <Badge
                                variant="secondary"
                                className={`text-xs ${camera.confidence >= 90 ? 'bg-green-500/20 text-green-400' :
                                    camera.confidence >= 70 ? 'bg-yellow-500/20 text-yellow-400' :
                                        'bg-red-500/20 text-red-400'
                                    }`}
                            >
                                {camera.confidence}%
                            </Badge>
                        </div>
                    )}
                </div>
            </CardContent>
        </div>
    </Card>
);
