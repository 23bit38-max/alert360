import type { Alert } from '@/features/incidents/incident-history/types/incidentHistory.types';
import { fetchAccidents } from '@/services/supabase.service';

/**
 * Service to handle data fetching and transformation for the Incident History page.
 */
export const incidentHistoryService = {
    /**
     * Loads accidents from Supabase and transforms them into the unified Alert format.
     */
    async loadIncidents(): Promise<Alert[]> {
        try {
            const data = await fetchAccidents();

            if (!data) return [];

            return data.map((item: any) => {
                const involvement = item.vehicle_involvement?.[0] || {};
                const casualty = item.casualty_report?.[0] || {};
                const environment = item.environmental_conditions?.[0] || {};
                const analysis = item.ai_analysis?.[0] || {};
                const mediaRecords = item.accidents_media || [];

                const images: any[] = [];
                if (mediaRecords.length > 0) {
                    const m = mediaRecords[0];
                    if (m.before_image_url) {
                        images.push({
                            id: `${m.id}-before`,
                            url: m.before_image_url,
                            timestamp: new Date(m.created_at),
                            type: 'before',
                            description: 'Pre-Incident Capture',
                            cameraAngle: 'Center'
                        });
                    }
                    if (m.after_image_url) {
                        images.push({
                            id: `${m.id}-after`,
                            url: m.after_image_url,
                            timestamp: new Date(m.created_at),
                            type: 'after',
                            description: 'Incident Frame',
                            cameraAngle: 'Center'
                        });
                    }
                }

                return {
                    id: item.id,
                    title: item.accident_code || item.incident_category?.toUpperCase() || 'INCIDENT',
                    type: (item.operational_priority || 'medium').toLowerCase() as any,
                    incidentType: (item.incident_category || 'other').toLowerCase(),
                    severity: (item.operational_priority === 'High' ? 'severe' : 'moderate') as any,
                    location: item.address || item.location || 'Unknown',
                    zone: item.zone || 'GAMMA',
                    timestamp: new Date(item.observed_at || item.created_at),
                    vehicles: involvement.vehicle_count || 0,
                    casualties: (casualty.injured_count || 0) + (casualty.fatalities || 0),
                    responseTime: 3.8,
                    assignedUnits: item.agency_dispatch?.[0]?.agencies_to_notify || [],
                    status: (item.response_status || 'resolved').toLowerCase() as any,
                    confidence: (analysis.confidence_score || 0) * 100 || 85,
                    cameraId: item.road_identifier || 'SENSOR-NODE',
                    coordinates: { lat: parseFloat(item.latitude) || 0, lng: parseFloat(item.longitude) || 0 },
                    images: images.length > 0 ? images : [{
                        id: 'placeholder',
                        url: 'https://images.unsplash.com/photo-1544829099-b9a0c5303bea?w=800&h=600&fit=crop',
                        timestamp: new Date(),
                        type: 'during',
                        description: 'Detection Frame',
                        cameraAngle: 'Center'
                    }],
                    description: item.incident_category || 'N/A',
                    actions: ['ACKNOWLEDGE'],
                    city: item.city,
                    district: item.district,
                    stateName: item.state_name,
                    roadHighwayId: item.road_identifier,
                    vehicleTypes: involvement.vehicle_types,
                    infrastructureInvolved: involvement.infrastructure_involved,
                    injuredCount: casualty.injured_count,
                    criticalInjuries: casualty.critical_injuries,
                    fatalities: casualty.fatalities,
                    trappedPersons: casualty.trapped_persons,
                    weatherCondition: environment.weather_condition,
                    visibilityLevel: environment.visibility_level,
                    roadCondition: environment.road_condition,
                    fireFlag: environment.fire_flag,
                    fuelLeakFlag: environment.fuel_leak_flag,
                    chemicalHazardFlag: environment.chemical_hazard_flag,
                    agenciesToNotify: item.agency_dispatch?.[0]?.agencies_to_notify,
                    reportGenerated: true,
                    responsibleDepartment: (item.department || 'police').toLowerCase() as any,
                    handledBy: item.officer_notes?.[0]?.officer_id || 'SYSTEM',
                    weather: (environment.weather_condition || 'clear').toLowerCase() as any,
                    roadConditionVal: (environment.road_condition || 'dry').toLowerCase() as any
                };
            });
        } catch (err) {
            console.error('Failed to load history:', err);
            return [];
        }
    }
};
