import type { CameraFeed } from './types';

// Mock camera data with Mumbai locations
export const mockCameras: CameraFeed[] = [
    {
        id: 'cam-001',
        name: 'Anna Salai Junction',
        location: 'Anna Salai & Nungambakkam High Road',
        zone: 'central-Mumbai',
        status: 'online',
        lastDetection: '2 min ago',
        confidence: 94,
        resolution: '1920x1080',
        fps: 30,
        thumbnail: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
        department: 'police',
        requestedBy: 'Inspector Rajesh Kumar',
        approvedBy: 'System Administrator',
        youtubeId: 'DgJlC8WemnE' // Tokyo Shibuya Crossing
    },
    {
        id: 'cam-002',
        name: 'OMR IT Corridor',
        location: 'Old Mahabalipuram Road, Sholinganallur',
        zone: 'south-Mumbai',
        status: 'online',
        resolution: '1920x1080',
        fps: 25,
        thumbnail: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
        department: 'police',
        requestedBy: 'Sub-Inspector Arjun',
        approvedBy: 'System Administrator'
    },
    {
        id: 'cam-003',
        name: 'Marina Beach Entrance',
        location: 'Marina Beach Main Entrance',
        zone: 'central-Mumbai',
        status: 'offline',
        resolution: '1280x720',
        fps: 0,
        thumbnail: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
        department: 'fire',
        requestedBy: 'Chief Fire Officer Murugan',
        approvedBy: 'System Administrator'
    },
    {
        id: 'cam-004',
        name: 'Guindy Industrial Estate',
        location: 'Guindy Industrial Estate Gate',
        zone: 'south-Mumbai',
        status: 'online',
        lastDetection: '15 min ago',
        confidence: 87,
        resolution: '1920x1080',
        fps: 30,
        thumbnail: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
        department: 'Traffic Control',
        requestedBy: 'Traffic Wing',
        approvedBy: 'Commissioner',
        youtubeId: 'g8N_viHgT4k' // Venice Live Cam
    },
    {
        id: 'cam-005',
        name: 'General Hospital Emergency',
        location: 'Rajiv Gandhi Government General Hospital',
        zone: 'central-Mumbai',
        status: 'maintenance',
        resolution: '1920x1080',
        fps: 0,
        thumbnail: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
        department: 'hospital',
        requestedBy: 'Emergency Coordinator',
        approvedBy: 'System Administrator'
    },
    {
        id: 'cam-006',
        name: 'ECR Toll Plaza',
        location: 'East Coast Road Toll Plaza',
        zone: 'south-Mumbai',
        status: 'online',
        resolution: '1280x720',
        fps: 24,
        thumbnail: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
        department: 'police',
        requestedBy: 'Highway Patrol Unit',
        approvedBy: 'System Administrator'
    }
];

