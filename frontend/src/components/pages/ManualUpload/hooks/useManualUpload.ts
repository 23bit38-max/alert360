import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../../../auth/AuthContext';
import {
    getAccessibleZones,
    getUserDepartment,
} from '../../../../utils/rbac';
import { ZONES } from '../../../shared/constants';
import type { UploadedFile, DetectionResult, UploadStats } from '../types';
import { MAX_IMAGE_SIZE, MAX_VIDEO_SIZE } from '../constants';
import { analyzeIncident } from '../services/manualUpload.service';

export const useManualUpload = () => {
    const { user } = useAuth();
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [uploading, setUploading] = useState(false);
    const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null) as React.RefObject<HTMLInputElement>;

    // Stats
    const [stats, setStats] = useState<UploadStats>({
        totalUploads: 0,
        accidentsDetected: 0,
        avgConfidence: 0,
        recentUploads: 0,
    });

    // ─── Expanded Form States for Emergency Response ───

    // 1. Incident Context
    const [location, setLocation] = useState('');
    const [zone, setZone] = useState('');
    const [city, setCity] = useState('');
    const [district, setDistrict] = useState('');
    const [stateName, setStateName] = useState('');
    const [roadHighwayId, setRoadHighwayId] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');

    // 2. Incident Classification
    const [incidentCategory, setIncidentCategory] = useState('');
    const [priority, setPriority] = useState('');

    // 3. Time & Source
    const [incidentTime, setIncidentTime] = useState('');
    const [uploadSource, setUploadSource] = useState('CCTV');

    // 4. Vehicle & Object Involvement
    const [vehiclesInvolved, setVehiclesInvolved] = useState('');
    const [vehicleTypes, setVehicleTypes] = useState<string[]>([]);
    const [infrastructureInvolved, setInfrastructureInvolved] = useState<string[]>([]);

    // 5. Casualties & Medical Impact
    const [injuredCount, setInjuredCount] = useState('');
    const [criticalInjuries, setCriticalInjuries] = useState('');
    const [fatalities, setFatalities] = useState('');
    const [trappedPersons, setTrappedPersons] = useState(false);

    // 6. Environment & Risk Factors
    const [weatherCondition, setWeatherCondition] = useState('');
    const [visibilityLevel, setVisibilityLevel] = useState('');
    const [roadCondition, setRoadCondition] = useState('');
    const [fireFlag, setFireFlag] = useState(false);
    const [fuelLeakFlag, setFuelLeakFlag] = useState(false);
    const [chemicalHazardFlag, setChemicalHazardFlag] = useState(false);

    // 7. Response & Dispatch Control
    const [agenciesToNotify, setAgenciesToNotify] = useState<string[]>([]);
    const [responseStatus, setResponseStatus] = useState('Pending');
    const [trafficDiversionRequired, setTrafficDiversionRequired] = useState(false);

    // 8. Officer Observations
    const [description, setDescription] = useState('');
    const [confidentialFlag, setConfidentialFlag] = useState(false);

    // 10. Metadata
    const [officerId, setOfficerId] = useState('');
    const [officerDepartment, setOfficerDepartment] = useState('');
    const [cameraId, setCameraId] = useState('');

    // RBAC: Check permissions - BYPASS for demo
    const canUpload = true;
    const canViewStats = true;
    const accessibleZones = getAccessibleZones(user);
    const userDepartment = getUserDepartment(user);

    const availableZones = accessibleZones.includes('all')
        ? ZONES
        : ZONES.filter((z) => accessibleZones.includes(z));

    useEffect(() => {
        const statsKey = userDepartment ? `uploadStats_${userDepartment}` : 'uploadStats';
        const savedStats = localStorage.getItem(statsKey);
        if (savedStats) {
            setStats(JSON.parse(savedStats));
        }
    }, [userDepartment]);

    // Auto-fill from AI Detection
    useEffect(() => {
        if (detectionResult?.accidentDetected) {
            setIncidentCategory(detectionResult.label || 'Accident');
            setPriority('High');
            setResponseStatus('Responding');
            if (detectionResult.boxes) {
                setVehiclesInvolved(detectionResult.boxes.length.toString());
            }
            if (!description) {
                setDescription(`AI AUTO-DETECTION: ${detectionResult.label} verified with ${(detectionResult.bestConfidence! * 100).toFixed(1)}% confidence.`);
            }
        } else if (detectionResult && !detectionResult.accidentDetected) {
            setResponseStatus('Resolved');
            setPriority('Low');
        }
    }, [detectionResult]);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            processFiles(Array.from(files));
        }
    };

    const processFiles = (files: File[]) => {
        const validFiles = files.filter((file) => {
            const isImage = file.type.startsWith('image');
            const isVideo = file.type.startsWith('video');
            const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;

            if (!isImage && !isVideo) {
                toast.error(`${file.name} is not a valid image or video file`);
                return false;
            }

            if (file.size > maxSize) {
                toast.error(`${file.name} exceeds maximum size (${isImage ? '10MB' : '100MB'})`);
                return false;
            }

            return true;
        });

        const uploaded = validFiles.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
            type: file.type.startsWith('image') ? 'image' : ('video' as 'image' | 'video'),
            uploadProgress: 0,
        }));

        setUploadedFiles((prev) => [...prev, ...uploaded]);
        setDetectionResult(null);

        if (uploaded.length > 0) {
            toast.success(`${uploaded.length} file(s) added successfully`);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        processFiles(files);
    };

    const openFilePicker = () => {
        fileInputRef.current?.click();
    };

    const removeFile = (index: number) => {
        const newFiles = [...uploadedFiles];
        URL.revokeObjectURL(newFiles[index].preview);
        newFiles.splice(index, 1);
        setUploadedFiles(newFiles);
        setDetectionResult(null);
        toast.info('File removed');
    };

    const getCurrentLocation = () => {
        if ('geolocation' in navigator) {
            toast.info('Getting your location...');
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLatitude(position.coords.latitude.toString());
                    setLongitude(position.coords.longitude.toString());
                    toast.success('Location detected successfully');
                },
                (error) => {
                    toast.error('Failed to get location: ' + error.message);
                }
            );
        } else {
            toast.error('Geolocation is not supported by your browser');
        }
    };

    const updateStats = (result: DetectionResult) => {
        const newStats = {
            totalUploads: stats.totalUploads + 1,
            accidentsDetected: stats.accidentsDetected + (result.accidentDetected ? 1 : 0),
            avgConfidence: (stats.avgConfidence * stats.totalUploads + (result.bestConfidence || 0)) / (stats.totalUploads + 1),
            recentUploads: stats.recentUploads + 1,
        };
        setStats(newStats);
        const statsKey = userDepartment ? `uploadStats_${userDepartment}` : 'uploadStats';
        localStorage.setItem(statsKey, JSON.stringify(newStats));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const mainFile = uploadedFiles[0]?.file;
        if (!mainFile) {
            toast.error('No file selected for analysis');
            return;
        }

        setUploading(true);
        setDetectionResult(null);
        setUploadProgress(0);

        try {
            const progressInterval = setInterval(() => {
                setUploadProgress((prev) => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return 90;
                    }
                    return prev + 10;
                });
            }, 200);

            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            abortControllerRef.current = new AbortController();
            const signal = abortControllerRef.current.signal;

            // 1. Generate Accident ID FIRST (MANDATORY)
            const accidentId = crypto.randomUUID();

            // 2. PRE-CREATE Accident Record and Operational Data
            // This ensures the ID exists in the DB so backend can write media
            const incidentData = {
                category: incidentCategory,
                priority,
                location,
                zone,
                city,
                district,
                state: stateName,
                roadHighwayId,
                latitude: latitude || null,
                longitude: longitude || null,
                incidentTime: incidentTime || new Date().toTimeString().split(' ')[0],
                uploadSource,
                vehicles: {
                    count: vehiclesInvolved || null,
                    types: vehicleTypes,
                    infrastructure: infrastructureInvolved
                },
                medical: {
                    injuredCount,
                    criticalInjuries,
                    fatalities,
                    trappedPersons
                },
                environment: {
                    weatherCondition,
                    visibilityLevel,
                    roadCondition,
                    hazards: {
                        fire: fireFlag,
                        fuelLeak: fuelLeakFlag,
                        chemical: chemicalHazardFlag
                    }
                },
                response: {
                    agenciesToNotify,
                    status: responseStatus,
                    trafficDiversion: trafficDiversionRequired
                },
                description,
                isConfidential: confidentialFlag,
                meta: {
                    officerId,
                    department: officerDepartment,
                    cameraId,
                    uploadedBy: user?.name,
                    uploadedByRole: user?.role
                },
                createdAt: new Date().toISOString(),
            };

            const syncToastId = toast.loading('Establishing Operational Log...');
            const { saveAccidentToSupabase } = await import('../../../../services/supabase.service');

            // Pass all files except if we only have one video (which we don't store)
            const manualFiles = uploadedFiles
                .map(f => f.file)
                .filter(f => !f.type.startsWith('video'));

            await saveAccidentToSupabase(incidentData, manualFiles, accidentId);
            toast.success('Log Established', { id: syncToastId });

            // 3. START ANALYSIS
            const result = await analyzeIncident(
                mainFile,
                cameraId,
                location,
                accidentId,
                (updated) => setDetectionResult(updated),
                signal
            );

            clearInterval(progressInterval);
            setUploadProgress(100);
            setDetectionResult(result);
            setUploading(false);
            setUploadProgress(0);
            updateStats(result);

            // 4. Update Accident and AI Analysis Record with final results
            const { supabase } = await import('../../../../lib/supabase');
            if (result.accidentDetected) {
                // Update parent accident record with AI results
                await supabase.from('accidents').update({
                    incident_category: result.label || incidentCategory || 'Accident',
                    operational_priority: 'High',
                    response_status: 'Responding'
                }).eq('id', accidentId);

                // Update vehicle involvement if we have counts
                if (result.boxes) {
                    await supabase.from('vehicle_involvement').update({
                        vehicle_count: result.boxes.length
                    }).eq('accident_id', accidentId);
                }

                // Insert AI analysis detail
                await supabase.from('ai_analysis').insert({
                    accident_id: accidentId,
                    accident_detected: true,
                    confidence_score: result.bestConfidence,
                    engine_version: 'YOLOv11-PROD-GOV',
                    detection_labels: result.label ? [result.label] : []
                });
            } else {
                // Update parent to resolved/no-accident if nothing found
                await supabase.from('accidents').update({
                    response_status: 'Resolved'
                }).eq('id', accidentId);
            }

            if (mainFile.type.startsWith('video')) {
                toast.info('Video analysis stream established');
            } else {
                if (result.accidentDetected) {
                    toast.success('Incident verified and operational log updated');
                } else {
                    toast.info('Normal status verified');
                }
            }
        } catch (error) {
            console.error('Upload error:', error);
            const msg = error instanceof Error ? error.message : 'Unknown error';
            toast.error('Analysis failed', { description: msg });
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    const stopAnalysis = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }

        if (uploading) {
            setUploading(false);
            setUploadProgress(0);
            toast.info('Analysis cancelled');
        } else if (detectionResult) {
            setDetectionResult(null);
            toast.info('Analysis stopped');
        }
    };

    const resetForm = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        uploadedFiles.forEach((f) => URL.revokeObjectURL(f.preview));
        setUploadedFiles([]);
        setDetectionResult(null);

        setIncidentCategory('');
        setPriority('');
        setLocation('');
        setZone('');
        setCity('');
        setDistrict('');
        setStateName('');
        setRoadHighwayId('');
        setLatitude('');
        setLongitude('');
        setIncidentTime('');
        setUploadSource('CCTV');
        setVehiclesInvolved('');
        setVehicleTypes([]);
        setInfrastructureInvolved([]);
        setInjuredCount('');
        setCriticalInjuries('');
        setFatalities('');
        setTrappedPersons(false);
        setWeatherCondition('');
        setVisibilityLevel('');
        setRoadCondition('');
        setFireFlag(false);
        setFuelLeakFlag(false);
        setChemicalHazardFlag(false);
        setAgenciesToNotify([]);
        setResponseStatus('Pending');
        setTrafficDiversionRequired(false);
        setDescription('');
        setConfidentialFlag(false);
        setOfficerId('');
        setOfficerDepartment('');
        setCameraId('');
    };

    return {
        user, canUpload, canViewStats, availableZones,
        uploadedFiles, setUploadedFiles, uploading, detectionResult, isDragging, uploadProgress, fileInputRef,
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
        officerId, setOfficerId,
        officerDepartment, setOfficerDepartment,
        cameraId, setCameraId,
        handleFileUpload, handleDragOver, handleDragLeave, handleDrop,
        openFilePicker, removeFile, getCurrentLocation,
        handleSubmit, resetForm, stopAnalysis,
    };
};
