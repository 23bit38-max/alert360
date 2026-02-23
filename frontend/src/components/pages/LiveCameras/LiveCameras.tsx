import {
    Camera,
    Grid3X3,
    RefreshCw,
    AppWindow,
    Plus
} from 'lucide-react';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { AccessGuard } from '../../common/AccessGuard';
import { PERMISSIONS, isSuperAdmin } from '../../../utils/rbac';
import { useTheme } from '../../../theme';

import { useLiveCameras } from './hooks/useLiveCameras';
import { MonitorView } from './components/MonitorView';
import { DesktopCameraCard } from './components/DesktopCameraCard';
import { MobileCameraCard } from './components/MobileCameraCard';
import { FilterBar } from './components/FilterBar';
import { CameraRequestDialog } from './components/CameraRequestDialog';

export const LiveCameras = () => {
    useTheme();
    const {
        searchQuery, setSearchQuery,
        selectedZone, setSelectedZone,
        selectedStatus, setSelectedStatus,
        viewMode, setViewMode,
        showRequestModal, setShowRequestModal,
        isMobile,
        refreshing,
        selectedCamera, setSelectedCamera,
        filteredCameras,
        handleRefresh,
        getGridCols,
        user
    } = useLiveCameras();

    return (
        <div className="page-container animate-in fade-in duration-1000 max-w-[1600px] mx-auto pb-12 flex flex-col h-full">
            {/* Tactical Control Bar */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5 shrink-0">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Node Matrix: </span>
                        <Badge className="bg-primary/10 text-primary border-primary/20 px-2 py-0.5 text-[9px] font-black tracking-widest">
                            v4.2.0 LIVE
                        </Badge>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* View Switcher */}
                    <div className="glass border-white/5 p-1 rounded-xl flex items-center shadow-xl">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setViewMode('monitor')}
                            className={`h-9 px-4 rounded-lg text-[9px] font-black tracking-widest uppercase transition-all ${viewMode === 'monitor' ? 'bg-primary text-white shadow-lg' : 'text-muted-foreground hover:bg-white/5'
                                }`}
                        >
                            <AppWindow size={14} className="mr-2" /> Monitor
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setViewMode('grid')}
                            className={`h-9 px-4 rounded-lg text-[9px] font-black tracking-widest uppercase transition-all ${viewMode === 'grid' ? 'bg-primary text-white shadow-lg' : 'text-muted-foreground hover:bg-white/5'
                                }`}
                        >
                            <Grid3X3 size={14} className="mr-2" /> Grid
                        </Button>
                    </div>

                    <Button
                        variant="outline"
                        onClick={handleRefresh}
                        className="h-10 px-5 rounded-xl glass border-white/10 hover:bg-white/5 text-[10px] font-black uppercase tracking-widest"
                    >
                        <RefreshCw size={14} className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                        Sync
                    </Button>

                    <AccessGuard permission={PERMISSIONS.CAMERA_REQUEST_INSTALL} hideIfDenied>
                        {!isSuperAdmin(user) && (
                            <Button
                                onClick={() => setShowRequestModal(true)}
                                className="h-10 px-6 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-[0_8px_20px_rgba(16,185,129,0.2)] hover:scale-105 transition-all"
                            >
                                <Plus size={14} className="mr-2" /> Deploy Node
                            </Button>
                        )}
                    </AccessGuard>
                </div>
            </div>

            {/* Glass Filter Bar */}
            <div className="glass border-white/5 rounded-[24px] overflow-hidden premium-shadow">
                <FilterBar
                    selectedZone={selectedZone}
                    setSelectedZone={setSelectedZone}
                    selectedStatus={selectedStatus}
                    setSelectedStatus={setSelectedStatus}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                />
            </div>

            {/* Main Monitoring Area */}
            <div className="flex-1 min-h-0 bg-black/20 rounded-[32px] p-6 border border-white/5 overflow-y-auto custom-scrollbar">
                {viewMode === 'monitor' ? (
                    <div className="h-full animate-in zoom-in-95 duration-700">
                        <MonitorView
                            selectedCamera={selectedCamera}
                            filteredCameras={filteredCameras}
                            onSelectCamera={setSelectedCamera}
                        />
                    </div>
                ) : (
                    /* Tactical Grid View */
                    filteredCameras.length === 0 ? (
                        <Card className="glass border-white/5 border-dashed rounded-[32px] h-[400px] flex flex-col items-center justify-center">
                            <Camera size={64} className="text-muted-foreground/20 mb-6" />
                            <h3 className="text-xl font-bold text-white tracking-tight uppercase">No Optical Data</h3>
                            <p className="text-sm font-medium text-muted-foreground mt-2">Adjust search parameters to initialize node detection.</p>
                        </Card>
                    ) : (
                        <div className={`grid gap-8 ${getGridCols()} animate-in slide-in-from-bottom-8 duration-700`}>
                            {filteredCameras.map((camera) => (
                                isMobile ? (
                                    <MobileCameraCard key={camera.id} camera={camera} />
                                ) : (
                                    <div
                                        key={camera.id}
                                        onClick={() => { setSelectedCamera(camera); setViewMode('monitor'); }}
                                        className="cursor-pointer"
                                    >
                                        <DesktopCameraCard camera={camera} />
                                    </div>
                                )
                            ))}
                        </div>
                    )
                )}
            </div>

            <AccessGuard permission={PERMISSIONS.CAMERA_REQUEST_INSTALL} hideIfDenied>
                <CameraRequestDialog open={showRequestModal} onOpenChange={setShowRequestModal} />
            </AccessGuard>
        </div >
    );
};
