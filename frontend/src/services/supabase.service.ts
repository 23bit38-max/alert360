import { supabase } from '@/core/config/supabase.config';

/**
 * Uploads a file (File or Blob) to Supabase Storage.
 */
export const uploadBlob = async (blob: Blob | File, fileName: string, bucket: string) => {
    const targetBucket = import.meta.env.VITE_SUPABASE_BUCKET || bucket;

    const { data, error } = await supabase.storage
        .from(targetBucket)
        .upload(fileName, blob, {
            cacheControl: '3600',
            upsert: true
        });

    if (error) {
        console.error(`Storage Error (${targetBucket}):`, error);
        throw error;
    }
    return data.path;
};

/**
 * Downloads a file from a URL and uploads it to Supabase.
 */
export const uploadFromUrl = async (url: string, accidentId: string, type: string) => {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const extension = url.split('.').pop()?.split('?')[0] || 'jpg';
        const fileName = `${accidentId}/${type}_snapshot.${extension}`;
        return await uploadBlob(blob, fileName, 'accidents');
    } catch (e) {
        console.warn(`Failed to archive AI snapshot (${type}):`, e);
        return null;
    }
};

/**
 * Fetches all accidents with their associated data for the RealTimeAlerts page.
 */
export const fetchAccidents = async () => {
    const { data, error } = await supabase
        .from('accidents')
        .select(`
            *,
            vehicle_involvement(*),
            casualty_report(*),
            environmental_conditions(*),
            accidents_media(*)
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching accidents:', error);
        throw error;
    }
    return data;
};

/**
 * Fetches a single accident with full intelligence detail.
 */
export const fetchAccidentDetail = async (accidentId: string) => {
    const { data, error } = await supabase
        .from('accidents')
        .select(`
            *,
            vehicle_involvement(*),
            casualty_report(*),
            environmental_conditions(*),
            agency_dispatch(*),
            officer_notes(*),
            accidents_media(*),
            ai_analysis(*)
        `)
        .eq('id', accidentId)
        .single();

    if (error) {
        console.error('Error fetching accident detail:', error);
        throw error;
    }
    return data;
};

/**
 * Persists a complete accident record and all its related operational intelligence.
 * MANDATORY: ONLY ONE BUCKET (accidents), structured folders, no videos.
 */
export const saveAccidentToSupabase = async (
    incidentData: any,
    files: File[],
    accidentId: string // Passed from frontend generated UUID
) => {
    console.log('--- [SUPABASE_DEBUG] Starting Persistence Cycle ---');

    // 1. PRIMARY RECORD: accidents (using pre-generated ID)
    let observedAt: string | null = null;
    try {
        if (incidentData.incidentTime) {
            const parsedDate = new Date(incidentData.incidentTime);
            if (!isNaN(parsedDate.getTime())) {
                observedAt = parsedDate.toISOString();
            }
        }
    } catch (e) {
        console.warn('Date parsing failed');
    }

    if (!observedAt) observedAt = new Date().toISOString();

    const accidentPayload: any = {
        id: accidentId,
        observed_at: observedAt,
        zone: incidentData.zone || 'Default Zone',
        city: incidentData.city || 'Default City',
        district: incidentData.district || null,
        state_name: incidentData.state || 'Default State',
        address: incidentData.location || null,
        location: incidentData.location || null,
        latitude: parseFloat(incidentData.latitude) || null,
        longitude: parseFloat(incidentData.longitude) || null,
        road_identifier: incidentData.roadHighwayId || null,
        incident_category: incidentData.category || 'Undetermined',
        operational_priority: incidentData.priority || 'Medium',
        source_type: incidentData.uploadSource || 'Manual',
        response_status: incidentData.responseStatus || 'Responding',
        traffic_diversion_required: incidentData.trafficDiversionRequired || false,
        confidential_flag: incidentData.confidentialFlag || false,
        department: incidentData.officerDepartment || 'Manual Systems',
    };

    const { error: accidentError } = await supabase
        .from('accidents')
        .insert(accidentPayload);

    if (accidentError) {
        console.error('CRITICAL ERROR: Failed to create accident record:', accidentError);
        throw accidentError;
    }

    // 2. SECONDARY DATA
    const insertStep = async (tableName: string, payload: any) => {
        const { error } = await supabase.from(tableName).insert(payload);
        return { success: !error, error };
    };

    const secondaryPromises = [
        insertStep('vehicle_involvement', {
            accident_id: accidentId,
            vehicle_count: parseInt(incidentData.vehiclesInvolved) || 0,
            vehicle_types: incidentData.vehicleTypes || [],
            infrastructure_involved: incidentData.infrastructureInvolved || [],
        }),
        insertStep('casualty_report', {
            accident_id: accidentId,
            injured_count: parseInt(incidentData.injuredCount) || 0,
            critical_injuries: parseInt(incidentData.criticalInjuries) || 0,
            fatalities: parseInt(incidentData.fatalities) || 0,
            trapped_persons: incidentData.trappedPersons || false,
        }),
        insertStep('environmental_conditions', {
            accident_id: accidentId,
            weather_condition: incidentData.weatherCondition,
            visibility_level: incidentData.visibilityLevel,
            road_condition: incidentData.roadCondition,
            fire_flag: incidentData.fireFlag || false,
            fuel_leak_flag: incidentData.fuelLeakFlag || false,
            chemical_hazard_flag: incidentData.chemicalHazardFlag || false,
        }),
        insertStep('agency_dispatch', {
            accident_id: accidentId,
            agencies_to_notify: incidentData.agenciesToNotify || [],
            dispatch_status: incidentData.responseStatus || 'Responding',
        }),
        insertStep('officer_notes', {
            accident_id: accidentId,
            note_text: incidentData.description || 'N/A',
            officer_id: incidentData.officerId || 'SYS',
            officer_department: incidentData.officerDepartment || 'HQ',
            is_confidential: incidentData.confidentialFlag || false,
        })
    ];

    // 3. MEDIA HANDLING (MANDATORY STRUCTURE)
    let beforeImageUrl = null;
    let afterImageUrl = null;

    if (files.length > 0) {
        for (const [index, file] of files.entries()) {
            if (file.type.startsWith('video')) continue;

            const isBefore = index === 0 && files.length > 1;
            const folder = isBefore ? 'before' : 'after';
            const filePath = `${accidentId}/${folder}/${isBefore ? 'before_accident.jpg' : 'after_accident.jpg'}`;

            try {
                const { error: uploadError } = await supabase.storage
                    .from('accidents')
                    .upload(filePath, file, { contentType: 'image/jpeg', upsert: true });

                if (!uploadError || uploadError.message.includes('already exists')) {
                    const { data: urlData } = supabase.storage.from('accidents').getPublicUrl(filePath);
                    if (isBefore) beforeImageUrl = urlData.publicUrl;
                    else afterImageUrl = urlData.publicUrl;
                }
            } catch (e) {
                console.error(`Manual image upload failed for ${folder}:`, e);
            }
        }
    }

    if (beforeImageUrl || afterImageUrl) {
        secondaryPromises.push(insertStep('accidents_media', {
            accident_id: accidentId,
            before_image_url: beforeImageUrl,
            after_image_url: afterImageUrl
        }));
    }

    await Promise.allSettled(secondaryPromises);
    return { id: accidentId };
};
