import { useState, useEffect } from 'react';
import { useAuth } from '@/core/auth/AuthContext';
import type { CameraFeed } from '@/features/live-cameras/types';
import { fetchCameras } from '@/services/firebase.service';
import {
    canAccessZone,
    getAccessibleZones,
    hasPermission,
    isSuperAdmin,
    PERMISSIONS,
} from '@/shared/utils/rbac';

export const useLiveCameras = () => {
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedZone, setSelectedZone] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [gridSize, setGridSize] = useState('medium');
    const [viewMode, setViewMode] = useState<'grid' | 'list' | 'monitor'>('monitor');
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedCamera, setSelectedCamera] = useState<CameraFeed | null>(null);
    const [cameras, setCameras] = useState<CameraFeed[]>([]);
    const [loading, setLoading] = useState(true);

    // RBAC: Get accessible zones and permissions
    const accessibleZones = getAccessibleZones(user);
    const canRequestCamera = hasPermission(user, PERMISSIONS.CAMERA_REQUEST_INSTALL);

    const loadCameras = async () => {
        try {
            setLoading(true);
            const data = await fetchCameras();

            if (data) {
                const mapped: CameraFeed[] = data.map(c => ({
                    id: c.id,
                    name: c.name,
                    location: c.location || 'N/A',
                    zone: c.zone,
                    status: c.status as any,
                    lastDetection: 'N/A',
                    confidence: 0,
                    resolution: c.resolution,
                    fps: c.fps,
                    thumbnail: c.thumbnailUrl || 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
                    department: c.department,
                    requestedBy: c.requestedBy,
                    approvedBy: c.approvedBy,
                    youtubeId: c.streamUrl
                }));
                setCameras(mapped);
                if (!selectedCamera && mapped.length > 0) {
                    setSelectedCamera(mapped[0]);
                }
            }
        } catch (e) {
            console.error('Failed to load cameras:', e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadCameras();
    }, []);

    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            // Auto-adjust grid size on mobile
            if (mobile && gridSize === 'large') {
                setGridSize('medium');
            }
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, [gridSize]);

    // RBAC: Filter cameras based on accessible zones
    const getFilteredCameras = () => {
        let filtered = [...cameras];

        // Zone-based filtering
        filtered = filtered.filter(camera =>
            accessibleZones.includes('all') || canAccessZone(user, camera.zone)
        );

        // Department filtering (if not Super Admin)
        if (!isSuperAdmin(user) && user?.department) {
            filtered = filtered.filter(camera =>
                camera.department === user.department
            );
        }

        // Search filtering
        if (searchQuery) {
            filtered = filtered.filter(camera =>
                camera.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                camera.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                camera.zone.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Zone filtering
        if (selectedZone !== 'all') {
            filtered = filtered.filter(camera => camera.zone === selectedZone);
        }

        // Status filtering
        if (selectedStatus !== 'all') {
            filtered = filtered.filter(camera => camera.status === selectedStatus);
        }

        return filtered;
    };

    const filteredCameras = getFilteredCameras();

    const handleRefresh = () => {
        setRefreshing(true);
        fetchCameras();
    };

    const getGridCols = () => {
        if (isMobile) {
            return 'grid-cols-1';
        }
        switch (gridSize) {
            case 'small': return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5';
            case 'medium': return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
            case 'large': return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
            default: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
        }
    };

    return {
        searchQuery, setSearchQuery,
        selectedZone, setSelectedZone,
        selectedStatus, setSelectedStatus,
        gridSize, setGridSize,
        viewMode, setViewMode,
        showRequestModal, setShowRequestModal,
        isMobile,
        refreshing,
        selectedCamera, setSelectedCamera,
        canRequestCamera,
        filteredCameras,
        handleRefresh,
        getGridCols,
        user,
        loading
    };
};
