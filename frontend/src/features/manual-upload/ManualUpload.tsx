import { useState, useEffect } from 'react';
import { LoadingScreen } from '@/shared/components/LoadingScreen';
import { ShieldOff, Upload, Shield, Cpu } from 'lucide-react';
import { useManualUpload } from '@/features/manual-upload/hooks/useManualUpload';
import { LeftPanel } from '@/features/manual-upload/components/LeftPanel';
import { RightPanel } from '@/features/manual-upload/components/RightPanel';
import { getRoleDisplayName } from '@/shared/utils/rbac';
import { Badge } from '@/shared/components/ui/badge';
import { StatsOverview } from '@/features/manual-upload/components/StatsOverview';
import { SnapshotsDisplay } from '@/features/manual-upload/components/SnapshotsDisplay';

/* ─── Page-level header bar ───────────────────────────────────────────────── */
const OperationalBar = ({ userName, userRole }: { userName?: string; userRole?: string }) => {
  return (
    <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-8">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Upload size={14} className="text-primary animate-pulse" />
          <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Forensic Terminal: </span>
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] animate-pulse">Evidence Ingestion Active</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Badge variant="outline" className="glass border-white/10 bg-white/5 text-[8px] font-black uppercase tracking-widest px-3 py-1 flex items-center gap-2">
          <Cpu size={12} className="text-primary" /> YOLOv8
        </Badge>
        {userName && (
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-[8px] font-black uppercase tracking-widest px-3 py-1 flex items-center gap-2">
            <Shield size={12} /> {getRoleDisplayName(userRole as any)}
          </Badge>
        )}
      </div>
    </div>
  );
};

/* ─── Access restricted screen ────────────────────────────────────────────── */
const AccessRestricted = ({ userRole }: { userRole?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-8 py-32 text-center animate-in fade-in zoom-in duration-700">
      <div className="w-24 h-24 bg-red-500/10 border border-red-500/20 rounded-[32px] flex items-center justify-center shadow-[0_0_40px_rgba(239,68,68,0.2)]">
        <ShieldOff size={40} className="text-red-500" />
      </div>
      <div className="space-y-3">
        <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Restricted Channel</h2>
        <p className="text-muted-foreground font-medium max-w-sm mx-auto leading-relaxed">
          The forensic upload terminal is restricted to Department Administrators.
          Currently authenticated as <span className="text-primary font-bold">{getRoleDisplayName(userRole as any)}</span>.
        </p>
      </div>
      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] opacity-40">Contact Command Center for Clearance</p>
    </div>
  );
};

/* ─── Main page ───────────────────────────────────────────────────────────── */
export const ManualUpload = () => {
  const {
    user, canUpload, canViewStats,
    availableZones, uploadedFiles,
    uploading, detectionResult, isDragging, uploadProgress, fileInputRef,
    stats,
    incidentCategory, setIncidentCategory,
    priority, setPriority,
    location, setLocation,
    zone, setZone,
    city, setCity,
    district, setDistrict,
    stateName, setStateName,
    roadHighwayId, setRoadHighwayId,
    latitude, setLatitude,
    longitude, setLongitude,
    incidentTime, setIncidentTime,
    uploadSource, setUploadSource,
    vehiclesInvolved, setVehiclesInvolved,
    vehicleTypes, setVehicleTypes,
    infrastructureInvolved, setInfrastructureInvolved,
    injuredCount, setInjuredCount,
    criticalInjuries, setCriticalInjuries,
    fatalities, setFatalities,
    trappedPersons, setTrappedPersons,
    weatherCondition, setWeatherCondition,
    visibilityLevel, setVisibilityLevel,
    roadCondition, setRoadCondition,
    fireFlag, setFireFlag,
    fuelLeakFlag, setFuelLeakFlag,
    chemicalHazardFlag, setChemicalHazardFlag,
    agenciesToNotify, setAgenciesToNotify,
    responseStatus, setResponseStatus,
    trafficDiversionRequired, setTrafficDiversionRequired,
    description, setDescription,
    confidentialFlag, setConfidentialFlag,
    enableEmail, setEnableEmail,
    enableSms, setEnableSms,
    enableCall, setEnableCall,
    officerId, setOfficerId,
    officerDepartment, setOfficerDepartment,
    cameraId, setCameraId,
    handleFileUpload, handleDragOver, handleDragLeave, handleDrop,
    openFilePicker, removeFile, getCurrentLocation,
    handleSubmit, resetForm, stopAnalysis
  } = useManualUpload();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 950);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingScreen message="Initializing Forensic Ingestion Terminal..." />;
  }

  return (
    <div className="min-h-screen bg-background text-white flex flex-col relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] select-none">
      {/* Decorative Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-blue-500/5 blur-[100px] rounded-full" />
      </div>

      <div className="flex-1 p-6 lg:p-10 relative z-10 flex flex-col min-h-0">
        {!canUpload ? (
          <AccessRestricted userRole={user?.role} />
        ) : (
          <div className="flex-1 flex flex-col gap-10 max-w-[1600px] mx-auto w-full min-h-0">
            <OperationalBar userName={user?.name} userRole={user?.role} />

            {canViewStats && (
              <div className="animate-fade-in shrink-0">
                <StatsOverview stats={stats} />
              </div>
            )}

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-10 pb-20">
              {/* 1. Visual Feed Terminal (Top) */}
              <div className="w-full animate-fade-in [animation-delay:200ms]">
                <LeftPanel
                  uploadedFiles={uploadedFiles}
                  uploading={uploading}
                  isDragging={isDragging}
                  uploadProgress={uploadProgress}
                  fileInputRef={fileInputRef}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onFileUpload={handleFileUpload}
                  onOpenFilePicker={openFilePicker}
                  onRemoveFile={removeFile}
                  onClearAll={resetForm}
                  detectionResult={detectionResult}
                />
              </div>

              {/* 1.5 Forensic Evidence Log (Snapshots) */}
              <SnapshotsDisplay detectionResult={detectionResult} />

              {/* 2. Operational Intel Center (Below) */}
              <form onSubmit={handleSubmit} className="w-full animate-fade-in [animation-delay:400ms]">
                <RightPanel
                  disabled={uploading}
                  incidentCategory={incidentCategory} setIncidentCategory={setIncidentCategory}
                  priority={priority} setPriority={setPriority}
                  location={location} setLocation={setLocation}
                  zone={zone} setZone={setZone}
                  city={city} setCity={setCity}
                  district={district} setDistrict={setDistrict}
                  stateName={stateName} setStateName={setStateName}
                  roadHighwayId={roadHighwayId} setRoadHighwayId={setRoadHighwayId}
                  latitude={latitude} setLatitude={setLatitude}
                  longitude={longitude} setLongitude={setLongitude}
                  incidentTime={incidentTime} setIncidentTime={setIncidentTime}
                  uploadSource={uploadSource} setUploadSource={setUploadSource}
                  vehiclesInvolved={vehiclesInvolved} setVehiclesInvolved={setVehiclesInvolved}
                  vehicleTypes={vehicleTypes} setVehicleTypes={setVehicleTypes}
                  infrastructureInvolved={infrastructureInvolved} setInfrastructureInvolved={setInfrastructureInvolved}
                  injuredCount={injuredCount} setInjuredCount={setInjuredCount}
                  criticalInjuries={criticalInjuries} setCriticalInjuries={setCriticalInjuries}
                  fatalities={fatalities} setFatalities={setFatalities}
                  trappedPersons={trappedPersons} setTrappedPersons={setTrappedPersons}
                  weatherCondition={weatherCondition} setWeatherCondition={setWeatherCondition}
                  visibilityLevel={visibilityLevel} setVisibilityLevel={setVisibilityLevel}
                  roadCondition={roadCondition} setRoadCondition={setRoadCondition}
                  fireFlag={fireFlag} setFireFlag={setFireFlag}
                  fuelLeakFlag={fuelLeakFlag} setFuelLeakFlag={setFuelLeakFlag}
                  chemicalHazardFlag={chemicalHazardFlag} setChemicalHazardFlag={setChemicalHazardFlag}
                  agenciesToNotify={agenciesToNotify} setAgenciesToNotify={setAgenciesToNotify}
                  responseStatus={responseStatus} setResponseStatus={setResponseStatus}
                  trafficDiversionRequired={trafficDiversionRequired} setTrafficDiversionRequired={setTrafficDiversionRequired}
                  description={description} setDescription={setDescription}
                  confidentialFlag={confidentialFlag} setConfidentialFlag={setConfidentialFlag}
                  enableEmail={enableEmail} setEnableEmail={setEnableEmail}
                  enableSms={enableSms} setEnableSms={setEnableSms}
                  enableCall={enableCall} setEnableCall={setEnableCall}
                  officerId={officerId} setOfficerId={setOfficerId}
                  officerDepartment={officerDepartment} setOfficerDepartment={setOfficerDepartment}
                  cameraId={cameraId} setCameraId={setCameraId}
                  availableZones={availableZones}
                  onGetCurrentLocation={getCurrentLocation}
                  detectionResult={detectionResult}
                  stats={stats}
                  uploading={uploading}
                  hasFiles={uploadedFiles.length > 0}
                  onReset={resetForm}
                  onStop={stopAnalysis}
                />
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
