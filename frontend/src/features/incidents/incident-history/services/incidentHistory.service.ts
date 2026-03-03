import type { Alert } from '@/features/incidents/incident-history/types/incidentHistory.types';
import { fetchAccidents } from '@/services/firebase.service';

/**
 * Service to handle data fetching and transformation for the Incident History page.
 */
export const incidentHistoryService = {
    /**
     * Loads accidents from Firestore and transforms them into the unified Alert format.
     */
    async loadIncidents(): Promise<Alert[]> {
        try {
            const data = await fetchAccidents();

            if (!data) return [];

            return data.map((item: any) => {
                const involvement = item.vehicleInvolvement || {};
                const casualty = item.casualtyReport || {};
                const environment = item.environmentalConditions || {};
                const dispatch = item.agencyDispatch || {};
                const notes = item.officerNotes || {};

                const images: any[] = [];
                if (item.beforeImageUrl) {
                    images.push({
                        id: `${item.id}-before`,
                        url: item.beforeImageUrl,
                        timestamp: item.observedAt,
                        type: 'before',
                        description: 'Pre-Incident Capture',
                        cameraAngle: 'Center'
                    });
                }
                if (item.afterImageUrl) {
                    images.push({
                        id: `${item.id}-after`,
                        url: item.afterImageUrl,
                        timestamp: item.observedAt,
                        type: 'after',
                        description: 'Incident Frame',
                        cameraAngle: 'Center'
                    });
                }

                return {
                    id: item.id,
                    title: item.id || item.category?.toUpperCase() || 'INCIDENT',
                    type: (item.priority || 'medium').toLowerCase() as any,
                    incidentType: (item.category || 'other').toLowerCase(),
                    severity: (item.priority === 'High' || item.priority === 'Critical' ? 'severe' : 'moderate') as any,
                    location: item.address || item.location || 'Unknown',
                    zone: item.zone || 'GAMMA',
                    timestamp: item.observedAt || item.createdAt,
                    vehicles: involvement.count || 0,
                    casualties: (casualty.injuredCount || 0) + (casualty.fatalities || 0),
                    responseTime: item.responseTime || 3.8,
                    assignedUnits: dispatch.agencies || [],
                    status: (item.status || 'resolved').toLowerCase() as any,
                    confidence: item.confidence || 85,
                    cameraId: item.road_identifier || 'SENSOR-NODE',
                    coordinates: { lat: item.latitude || 0, lng: item.longitude || 0 },
                    images: images.length > 0 ? images : [{
                        id: 'placeholder',
                        url: 'https://images.unsplash.com/photo-1544829099-b9a0c5303bea?w=800&h=600&fit=crop',
                        timestamp: new Date(),
                        type: 'during',
                        description: 'Detection Frame',
                        cameraAngle: 'Center'
                    }],
                    description: item.category || 'N/A',
                    actions: ['ACKNOWLEDGE'],
                    city: item.city,
                    district: item.district,
                    stateName: item.state,
                    roadHighwayId: item.road_identifier,
                    vehicleTypes: involvement.types,
                    infrastructureInvolved: involvement.infrastructure,
                    injuredCount: casualty.injuredCount,
                    criticalInjuries: casualty.criticalInjuries,
                    fatalities: casualty.fatalities,
                    trappedPersons: casualty.trappedPersons,
                    weatherCondition: environment.weather,
                    visibilityLevel: environment.visibility,
                    roadCondition: environment.road,
                    fireFlag: environment.fire,
                    fuelLeakFlag: environment.fuelLeak,
                    chemicalHazardFlag: environment.chemicalHazard,
                    agenciesToNotify: dispatch.agencies,
                    reportGenerated: true,
                    responsibleDepartment: (item.department || 'police').toLowerCase() as any,
                    handledBy: notes.officerId || 'SYSTEM',
                    weather: (environment.weather || 'clear').toLowerCase() as any,
                    roadConditionVal: (environment.road || 'dry').toLowerCase() as any
                };
            });
        } catch (err) {
            console.error('Failed to load history:', err);
            return [];
        }
    }
};
