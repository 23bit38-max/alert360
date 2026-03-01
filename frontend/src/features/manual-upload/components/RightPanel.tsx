import React from 'react';
import { Play, Activity, MapPin, StopCircle, Shield, Clock, HeartPulse, HardHat, CloudSun, Siren, Lock, Info, Landmark } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/components/ui/select';
import type { DetectionResult, UploadStats } from '@/features/manual-upload/types/index';

interface RightPanelProps {
    disabled: boolean;
    incidentCategory: string;
    setIncidentCategory: (v: string) => void;
    priority: string;
    setPriority: (v: string) => void;
    location: string;
    setLocation: (v: string) => void;
    zone: string;
    setZone: (v: string) => void;
    city: string;
    setCity: (v: string) => void;
    district: string;
    setDistrict: (v: string) => void;
    stateName: string;
    setStateName: (v: string) => void;
    roadHighwayId: string;
    setRoadHighwayId: (v: string) => void;
    latitude: string;
    setLatitude: (v: string) => void;
    longitude: string;
    setLongitude: (v: string) => void;
    incidentTime: string;
    setIncidentTime: (v: string) => void;
    uploadSource: string;
    setUploadSource: (v: string) => void;
    vehiclesInvolved: string;
    setVehiclesInvolved: (v: string) => void;
    vehicleTypes: string[];
    setVehicleTypes: (v: string[]) => void;
    infrastructureInvolved: string[];
    setInfrastructureInvolved: (v: string[]) => void;
    injuredCount: string;
    setInjuredCount: (v: string) => void;
    criticalInjuries: string;
    setCriticalInjuries: (v: string) => void;
    fatalities: string;
    setFatalities: (v: string) => void;
    trappedPersons: boolean;
    setTrappedPersons: (v: boolean) => void;
    weatherCondition: string;
    setWeatherCondition: (v: string) => void;
    visibilityLevel: string;
    setVisibilityLevel: (v: string) => void;
    roadCondition: string;
    setRoadCondition: (v: string) => void;
    fireFlag: boolean;
    setFireFlag: (v: boolean) => void;
    fuelLeakFlag: boolean;
    setFuelLeakFlag: (v: boolean) => void;
    chemicalHazardFlag: boolean;
    setChemicalHazardFlag: (v: boolean) => void;
    agenciesToNotify: string[];
    setAgenciesToNotify: (v: string[]) => void;
    responseStatus: string;
    setResponseStatus: (v: string) => void;
    trafficDiversionRequired: boolean;
    setTrafficDiversionRequired: (v: boolean) => void;
    description: string;
    setDescription: (v: string) => void;
    enableEmail: boolean;
    setEnableEmail: (v: boolean) => void;
    enableSms: boolean;
    setEnableSms: (v: boolean) => void;
    enableCall: boolean;
    setEnableCall: (v: boolean) => void;
    confidentialFlag: boolean;
    setConfidentialFlag: (v: boolean) => void;
    officerId: string;
    setOfficerId: (v: string) => void;
    officerDepartment: string;
    setOfficerDepartment: (v: string) => void;
    cameraId: string;
    setCameraId: (v: string) => void;
    availableZones: readonly string[];
    onGetCurrentLocation: () => void;
    detectionResult: DetectionResult | null;
    stats: UploadStats;
    uploading: boolean;
    hasFiles: boolean;
    onReset: () => void;
    onStop: () => void;
}

export const RightPanel: React.FC<RightPanelProps> = ({
    disabled,
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
    enableEmail, setEnableEmail,
    enableSms, setEnableSms,
    enableCall, setEnableCall,
    confidentialFlag, setConfidentialFlag,
    officerId, setOfficerId,
    officerDepartment, setOfficerDepartment,
    cameraId, setCameraId,
    availableZones,
    onGetCurrentLocation,
    detectionResult,
    uploading,
    hasFiles,
    onStop
}) => {
    const isRunning = uploading || detectionResult;

    const toggleArrayItem = (arr: string[], val: string, setFn: (v: string[]) => void) => {
        if (arr.includes(val)) {
            setFn(arr.filter(a => a !== val));
        } else {
            setFn([...arr, val]);
        }
    };

    return (
        <div className="flex flex-col h-full gap-6 select-none animate-fade-in pb-10">

            {/* ─── Command Console Card ────────────────────────────────────────── */}
            <div className="glass border-white/5 rounded-[32px] p-6 lg:p-8 premium-shadow relative overflow-hidden group shrink-0">
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-[80px] -z-10 animate-pulse-soft" />

                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                            <Activity className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-white text-[10px] font-black tracking-[0.3em] uppercase opacity-50">Surveillance</h3>
                            <p className="text-[11px] font-black tracking-widest text-white uppercase">Command Ops</p>
                        </div>
                    </div>
                    {detectionResult && (
                        <div className="flex flex-col items-end">
                            <span className="text-[9px] font-black text-primary uppercase tracking-widest">Confidence</span>
                            <span className="text-base font-black text-white font-mono">{((detectionResult.bestConfidence || 0) * 100).toFixed(1)}%</span>
                        </div>
                    )}
                </div>

                <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 mb-8">
                    <p className="text-[11px] text-muted-foreground font-bold tracking-widest leading-relaxed uppercase opacity-70 mb-4">
                        Initialize <span className="text-primary italic">YOLOv8</span> analysis sequence. System will intercept feed and auto-calculate tactical metrics.
                    </p>

                    {/* Granular Alert Controls */}
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mr-2">Dispatches:</span>
                        <GlobalToggle label="EMAIL" active={enableEmail} onClick={() => setEnableEmail(!enableEmail)} disabled={!!isRunning} />
                        <GlobalToggle label="SMS" active={enableSms} onClick={() => setEnableSms(!enableSms)} disabled={!!isRunning} />
                        <GlobalToggle label="CALL" active={enableCall} onClick={() => setEnableCall(!enableCall)} disabled={!!isRunning} />
                    </div>
                </div>

                <button
                    type={isRunning ? 'button' : 'submit'}
                    onClick={isRunning ? onStop : undefined}
                    disabled={!hasFiles && !isRunning}
                    className={`
            w-full py-6 rounded-2xl font-black text-[12px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 transition-all duration-500 premium-shadow
            ${isRunning
                            ? 'bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500/20 shadow-red-500/10'
                            : (!hasFiles ? 'bg-white/5 text-muted-foreground/30 cursor-not-allowed border border-white/5 opacity-50'
                                : 'bg-primary text-white hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] border-none hover:scale-[1.01] active:scale-[0.99]')
                        }
          `}
                >
                    {uploading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Establishing Core...
                        </>
                    ) : detectionResult ? (
                        <>
                            <StopCircle className="w-5 h-5 fill-current" />
                            Terminate Feed
                        </>
                    ) : (
                        <>
                            <Play className="w-5 h-5 fill-current" />
                            Initiate Feed
                        </>
                    )}
                </button>
            </div>

            {/* ─── Tactical Override Form ─────────────────────────────────────── */}
            <div className="glass border-white/5 rounded-[32px] p-6 lg:p-8 premium-shadow flex flex-col">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                        <Lock className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                        <h3 className="text-white text-[10px] font-black tracking-[0.3em] uppercase opacity-50">Operational</h3>
                        <p className="text-[11px] font-black tracking-widest text-white uppercase">Intelligence Intake</p>
                    </div>
                </div>

                <div className="space-y-8 pr-1">
                    {/* 1. Incident Context */}
                    <div className="space-y-6">
                        <SectionHeader title="1. Incident Context" icon={<MapPin className="w-3 h-3 text-blue-400" />} />
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <FormLabel>Zone / Sector</FormLabel>
                                <Select value={zone} onValueChange={setZone} disabled={disabled}>
                                    <SelectTrigger className="tactical-input flex items-center justify-between">
                                        <SelectValue placeholder="Select Zone" />
                                    </SelectTrigger>
                                    <SelectContent className="glass border-white/10">
                                        {availableZones.map(z => (
                                            <SelectItem key={z} value={z}>
                                                {z}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <FormLabel>Road / Highway ID</FormLabel>
                                <input
                                    type="text"
                                    value={roadHighwayId}
                                    onChange={e => setRoadHighwayId(e.target.value)}
                                    placeholder="e.g. NH-48 / SEC-4"
                                    className="tactical-input"
                                    disabled={disabled}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <InputField label="City" value={city} onChange={setCity} disabled={disabled} />
                            <InputField label="District" value={district} onChange={setDistrict} disabled={disabled} />
                            <InputField label="State" value={stateName} onChange={setStateName} disabled={disabled} />
                        </div>
                        <div className="space-y-2">
                            <FormLabel>Exact Location / Landmark</FormLabel>
                            <input
                                type="text"
                                value={location}
                                onChange={e => setLocation(e.target.value)}
                                placeholder="Main Junction / Sector 5 Entrance"
                                className="tactical-input"
                                disabled={disabled}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative">
                                <InputField label="Latitude" value={latitude} onChange={setLatitude} disabled={disabled} />
                                <button type="button" onClick={onGetCurrentLocation} className="absolute right-2 bottom-2 text-[8px] text-primary uppercase font-black hover:underline">GPS Match</button>
                            </div>
                            <InputField label="Longitude" value={longitude} onChange={setLongitude} disabled={disabled} />
                        </div>
                    </div>

                    {/* 2. Incident Classification */}
                    <div className="space-y-6">
                        <SectionHeader title="2. Incident Classification" icon={<Shield className="w-3 h-3 text-red-400" />} />
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <FormLabel>Incident Category</FormLabel>
                                <Select value={incidentCategory} onValueChange={setIncidentCategory} disabled={disabled}>
                                    <SelectTrigger className="tactical-input flex items-center justify-between">
                                        <SelectValue placeholder="Operational Select" />
                                    </SelectTrigger>
                                    <SelectContent className="glass border-white/10">
                                        <SelectItem value="Road Accident">Road Accident</SelectItem>
                                        <SelectItem value="Industrial Accident">Industrial Accident</SelectItem>
                                        <SelectItem value="Fire">Fire</SelectItem>
                                        <SelectItem value="HAZMAT">HAZMAT</SelectItem>
                                        <SelectItem value="Infrastructure Failure">Infrastructure Failure</SelectItem>
                                        <SelectItem value="Public Disturbance">Public Disturbance</SelectItem>
                                        <SelectItem value="Medical Emergency">Medical Emergency</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <FormLabel>Operational Priority</FormLabel>
                                <Select value={priority} onValueChange={setPriority} disabled={disabled}>
                                    <SelectTrigger className={`tactical-input flex items-center justify-between ${priority === 'P1 - High' ? 'text-red-500' : ''}`}>
                                        <SelectValue placeholder="Priority Select" />
                                    </SelectTrigger>
                                    <SelectContent className="glass border-white/10">
                                        <SelectItem value="P1 - High">P1 - High (Immediate)</SelectItem>
                                        <SelectItem value="P2 - Medium">P2 - Medium (Standard)</SelectItem>
                                        <SelectItem value="P3 - Low">P3 - Low (Routine)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* 3. Time & Source */}
                    <div className="space-y-6">
                        <SectionHeader title="3. Time & Source" icon={<Clock className="w-3 h-3 text-purple-400" />} />
                        <div className="grid grid-cols-2 gap-4">
                            <InputField label="Incident Observed Time" value={incidentTime} onChange={setIncidentTime} type="time" disabled={disabled} />
                            <div className="space-y-2">
                                <FormLabel>Upload Source</FormLabel>
                                <Select value={uploadSource} onValueChange={setUploadSource} disabled={disabled}>
                                    <SelectTrigger className="tactical-input flex items-center justify-between">
                                        <SelectValue placeholder="Select Source" />
                                    </SelectTrigger>
                                    <SelectContent className="glass border-white/10">
                                        <SelectItem value="CCTV">CCTV Feed</SelectItem>
                                        <SelectItem value="Mobile App">Reporting App</SelectItem>
                                        <SelectItem value="Internal BodyCam">Officer BodyCam</SelectItem>
                                        <SelectItem value="Drone">Drone Visual</SelectItem>
                                        <SelectItem value="Public Social">Social Intake</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* 4. Vehicle & Object Involvement */}
                    <div className="space-y-6">
                        <SectionHeader title="4. Vehicle & Object Involvement" icon={<HardHat className="w-3 h-3 text-amber-500" />} />
                        <div className="grid grid-cols-1 gap-4">
                            <InputField label="Estimated Number of Vehicles" value={vehiclesInvolved} onChange={setVehiclesInvolved} type="number" placeholder="0" disabled={disabled} />
                        </div>
                        <div className="space-y-3">
                            <FormLabel>Vehicle Types Involved</FormLabel>
                            <div className="flex flex-wrap gap-2">
                                {['2-Wheeler', 'Sedan/Hatchback', 'SUV/MPV', 'Truck/LCV', 'Bus', 'Emergency Vehicle'].map(type => (
                                    <Tag key={type} label={type} active={vehicleTypes.includes(type)} onClick={() => toggleArrayItem(vehicleTypes, type, setVehicleTypes)} disabled={disabled} />
                                ))}
                            </div>
                        </div>
                        <div className="space-y-3">
                            <FormLabel>Infrastructure Involved</FormLabel>
                            <div className="flex flex-wrap gap-2">
                                {['Traffic Signal', 'Public Building', 'Utility Pole', 'Pedestrian Walkway', 'Road Barrier', 'Trees/Landscape'].map(item => (
                                    <Tag key={item} label={item} active={infrastructureInvolved.includes(item)} onClick={() => toggleArrayItem(infrastructureInvolved, item, setInfrastructureInvolved)} disabled={disabled} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 5. Casualties & Medical Impact */}
                    <div className="space-y-6">
                        <SectionHeader title="5. Casualties & Medical Impact" icon={<HeartPulse className="w-3 h-3 text-pink-500" />} />
                        <div className="grid grid-cols-3 gap-4">
                            <InputField label="Injured Count" value={injuredCount} onChange={setInjuredCount} type="number" placeholder="0" disabled={disabled} />
                            <InputField label="Critical Injuries" value={criticalInjuries} onChange={setCriticalInjuries} type="number" placeholder="0" disabled={disabled} />
                            <InputField label="Fatalities" value={fatalities} onChange={setFatalities} type="number" placeholder="0" disabled={disabled} />
                        </div>
                        <div className="pt-2">
                            <Checkbox label="Trapped Persons Detected" checked={trappedPersons} onChange={setTrappedPersons} disabled={disabled} />
                        </div>
                    </div>

                    {/* 6. Environment & Risk Factors */}
                    <div className="space-y-6">
                        <SectionHeader title="6. Environment & Risk Factors" icon={<CloudSun className="w-3 h-3 text-yellow-500" />} />
                        <div className="grid grid-cols-2 gap-4">
                            <InputField label="Weather Condition" value={weatherCondition} onChange={setWeatherCondition} placeholder="Clear / Rain / Fog" disabled={disabled} />
                            <InputField label="Road Condition" value={roadCondition} onChange={setRoadCondition} placeholder="Dry / Wet / Under Repair" disabled={disabled} />
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            <InputField label="Visibility Level" value={visibilityLevel} onChange={setVisibilityLevel} placeholder="High / Moderate / Low" disabled={disabled} />
                        </div>
                        <div className="space-y-4 pt-2">
                            <Checkbox label="Active Fire Detected" checked={fireFlag} onChange={setFireFlag} disabled={disabled} />
                            <Checkbox label="Fuel / Fluid Leakage" checked={fuelLeakFlag} onChange={setFuelLeakFlag} disabled={disabled} />
                            <Checkbox label="Chemical / Hazardous Material" checked={chemicalHazardFlag} onChange={setChemicalHazardFlag} disabled={disabled} />
                        </div>
                    </div>

                    {/* 7. Response & Dispatch Control */}
                    <div className="space-y-6">
                        <SectionHeader title="7. Response & Dispatch Control" icon={<Siren className="w-3 h-3 text-red-500" />} />
                        <div className="space-y-3">
                            <FormLabel>Agencies to Notify</FormLabel>
                            <div className="flex flex-wrap gap-2">
                                {['Police', 'Ambulance', 'Fire Brigade', 'Disaster Mgmt', 'Towing Service', 'Hospitals'].map(agency => (
                                    <Tag key={agency} label={agency} active={agenciesToNotify.includes(agency)} onClick={() => toggleArrayItem(agenciesToNotify, agency, setAgenciesToNotify)} disabled={disabled} />
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <FormLabel>Response Status</FormLabel>
                                <Select value={responseStatus} onValueChange={setResponseStatus} disabled={disabled}>
                                    <SelectTrigger className="tactical-input flex items-center justify-between">
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent className="glass border-white/10">
                                        <SelectItem value="Pending">Pending Dispatch</SelectItem>
                                        <SelectItem value="Dispatched">Unit Dispatched</SelectItem>
                                        <SelectItem value="On-Scene">Unit On-Scene</SelectItem>
                                        <SelectItem value="Resolved">Incident Resolved</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-end pb-3">
                                <Checkbox label="Traffic Diversion Required" checked={trafficDiversionRequired} onChange={setTrafficDiversionRequired} disabled={disabled} />
                            </div>
                        </div>
                    </div>

                    {/* 8. Officer Observations */}
                    <div className="space-y-6">
                        <SectionHeader title="8. Officer Observations" icon={<Shield className="w-3 h-3 text-primary" />} />
                        <div className="space-y-2">
                            <FormLabel>Tactical Notes</FormLabel>
                            <textarea
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                rows={4}
                                placeholder="Details of observations, preliminary analysis, and on-scene assessment..."
                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-[10px] text-white font-bold tracking-widest focus:border-primary/50 focus:bg-white/[0.05] outline-none resize-none transition-all placeholder:text-white/20 uppercase"
                                disabled={disabled}
                            />
                        </div>
                        <div className="pt-2">
                            <Checkbox label="Confidential / Sensitive Incident" checked={confidentialFlag} onChange={setConfidentialFlag} disabled={disabled} />
                        </div>
                    </div>

                    {/* 10. Metadata */}
                    <div className="space-y-6">
                        <SectionHeader title="10. Metadata" icon={<Info className="w-3 h-3 text-white/50" />} />
                        <div className="grid grid-cols-2 gap-4">
                            <InputField label="Uploaded By (ID/Badge)" value={officerId} onChange={setOfficerId} disabled={disabled} />
                            <InputField label="Department" value={officerDepartment} onChange={setOfficerDepartment} disabled={disabled} />
                        </div>
                        <div className="space-y-2">
                            <FormLabel>Camera / Surveillance ID</FormLabel>
                            <div className="relative">
                                <Landmark className="absolute left-4 top-3.5 w-4 h-4 text-primary opacity-50" />
                                <input
                                    type="text"
                                    value={cameraId}
                                    onChange={e => setCameraId(e.target.value)}
                                    placeholder="CAM-SOURCE-ID..."
                                    className="w-full h-11 bg-white/[0.03] border border-white/10 rounded-xl pl-11 pr-4 text-[10px] text-white font-bold tracking-widest focus:border-primary/50 focus:bg-white/[0.05] outline-none transition-all placeholder:text-white/20 uppercase"
                                    disabled={disabled}
                                />
                            </div>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                            <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest leading-relaxed">System Fingerprint</span>
                            <span className="text-[8px] font-black text-white/40 font-mono tracking-widest leading-relaxed">TRM-AX-992-OPERATIONAL</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SectionHeader = ({ title, icon }: { title: string; icon: React.ReactNode }) => (
    <div className="flex items-center gap-3 pb-2 border-b border-white/5">
        <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center">
            {icon}
        </div>
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">{title}</h4>
    </div>
);

const FormLabel = ({ children }: { children: React.ReactNode }) => (
    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground block mb-1">
        {children}
    </label>
);

const InputField = ({ label, value, onChange, type = "text", placeholder = "", disabled = false }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; disabled?: boolean }) => (
    <div className={`space-y-2 transition-opacity ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
        <FormLabel>{label}</FormLabel>
        <input
            type={type}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className="tactical-input"
        />
    </div>
);

const Tag = ({ label, active, onClick, disabled = false }: { label: string; active: boolean; onClick: () => void; disabled?: boolean }) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${active
            ? 'bg-primary text-white border-none shadow-[0_0_10px_rgba(16,185,129,0.3)]'
            : 'bg-white/5 text-muted-foreground border border-white/10 hover:border-white/20'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
        {label}
    </button>
);

const Checkbox = ({ label, checked, onChange, disabled = false }: { label: string; checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) => (
    <button
        type="button"
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={`flex items-center gap-3 group ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
        <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${checked
            ? 'bg-primary border-primary shadow-[0_0_10px_rgba(16,185,129,0.3)]'
            : 'border-white/10 group-hover:border-white/20'
            }`}>
            {checked && <div className="w-2 h-2 bg-white rounded-sm animate-scale-in" />}
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-white/80 group-hover:text-white transition-colors">
            {label}
        </span>
    </button>
);

const GlobalToggle = ({ label, active, onClick, disabled }: { label: string; active: boolean; onClick: () => void; disabled: boolean }) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`px-3 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest transition-all ${active
            ? 'bg-primary/20 text-primary border border-primary/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
            : 'bg-white/5 text-muted-foreground border border-white/10 opacity-50'
            } ${disabled ? 'opacity-30 cursor-not-allowed' : 'hover:border-primary/50 hover:bg-primary/10'}`}
    >
        {label}
    </button>
);
