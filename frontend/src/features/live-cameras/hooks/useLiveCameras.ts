import { useState, useEffect } from 'react';
import { useAuth } from '@/core/auth/AuthContext';
import type { CameraFeed } from '@/features/live-cameras/types';
import { mockCameras } from '@/features/live-cameras/constants';
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

    // RBAC: Get accessible zones and permissions
    const accessibleZones = getAccessibleZones(user);
    const canRequestCamera = hasPermission(user, PERMISSIONS.CAMERA_REQUEST_INSTALL);

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

    // Set default selected camera
    useEffect(() => {
        if (!selectedCamera && mockCameras.length > 0) {
            setSelectedCamera(mockCameras[0]);
        }
    }, []);

    // RBAC: Filter cameras based on accessible zones
    const getFilteredCameras = () => {
        let cameras = mockCameras;

        // Zone-based filtering
        cameras = cameras.filter(camera =>
            accessibleZones.includes('all') || canAccessZone(user, camera.zone)
        );

        // Department filtering (if not Super Admin)
        if (!isSuperAdmin(user) && user?.department) {
            cameras = cameras.filter(camera =>
                camera.department === user.department
            );
        }

        // Search filtering
        if (searchQuery) {
            cameras = cameras.filter(camera =>
                camera.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                camera.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                camera.zone.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Zone filtering
        if (selectedZone !== 'all') {
            cameras = cameras.filter(camera => camera.zone === selectedZone);
        }

        // Status filtering
        if (selectedStatus !== 'all') {
            cameras = cameras.filter(camera => camera.status === selectedStatus);
        }

        return cameras;
    };

    const filteredCameras = getFilteredCameras();

    const handleRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
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
        user
    };
};
