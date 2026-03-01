export interface CameraFeed {
    id: string;
    name: string;
    location: string;
    zone: string;
    status: 'online' | 'offline' | 'maintenance';
    lastDetection?: string;
    confidence?: number;
    resolution: string;
    fps: number;
    thumbnail: string;
    department?: string;
    requestedBy?: string;
    approvedBy?: string;
    youtubeId?: string;
}
