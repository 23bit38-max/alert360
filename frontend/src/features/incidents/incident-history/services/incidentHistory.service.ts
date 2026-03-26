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

                const priorityStr = (item.priority || 'P2 - Medium').toLowerCase();
                const isHigh = priorityStr.includes('high') || priorityStr.includes('p1') || priorityStr.includes('critical');
                const isMedium = priorityStr.includes('medium') || priorityStr.includes('p2');

                // Correctly access officer notes array
                const officerNote = Array.isArray(item.officerNotes) && item.officerNotes.length > 0
                    ? item.officerNotes[0]
                    : (item.officerNotes || {});

                return {
                    id: item.id,
                    title: item.title || item.id || `INCIDENT_${item.id?.substring(0, 8).toUpperCase()}` || 'INCIDENT',
                    type: (isHigh ? 'critical' : isMedium ? 'high' : 'medium') as any,
                    incidentType: (item.category || 'other').toLowerCase(),
                    severity: (isHigh ? 'severe' : 'moderate') as any,
                    location: item.address || item.location || 'Unknown',
                    zone: item.zone || 'GAMMA',
                    timestamp: item.observedAt || item.createdAt || new Date(),
                    vehicles: involvement.count || 0,
                    casualties: (casualty.injuredCount || 0) + (casualty.fatalities || 0),
                    responseTime: item.responseTime || 3.8,
                    assignedUnits: dispatch.agencies || [],
                    status: (item.status || 'active').toLowerCase() as any,
                    confidence: item.confidence || 85,
                    cameraId: item.road_identifier || 'SENSOR-NODE',
                    coordinates: { lat: item.latitude || 19.0760, lng: item.longitude || 72.8777 },
                    images: images.length > 0 ? images : [{
                        id: 'placeholder',
                        url: 'https://images.unsplash.com/photo-1544829099-b9a0c5303bea?w=800&h=600&fit=crop',
                        timestamp: new Date(),
                        type: 'during',
                        description: 'Detection Frame',
                        cameraAngle: 'Center'
                    }],
                    description: officerNote.text || item.description || item.category || 'N/A',
                    actions: ['ACKNOWLEDGE'],
                    city: item.city,
                    district: item.district,
                    stateName: item.state,
                    roadHighwayId: item.road_identifier,
                    vehicleTypes: involvement.types || [],
                    infrastructureInvolved: involvement.infrastructure || [],
                    injuredCount: casualty.injuredCount || 0,
                    criticalInjuries: casualty.criticalInjuries || 0,
                    fatalities: casualty.fatalities || 0,
                    trappedPersons: casualty.trappedPersons || false,
                    weatherCondition: environment.weather || 'Clear',
                    visibilityLevel: environment.visibility || 'Good',
                    roadCondition: environment.road || 'Dry',
                    fireFlag: environment.fire || false,
                    fuelLeakFlag: environment.fuelLeak || false,
                    chemicalHazardFlag: environment.chemicalHazard || false,
                    agenciesToNotify: dispatch.agencies || [],
                    trafficDiversionRequired: item.trafficDiversionRequired || false,
                    confidentialFlag: item.confidentialFlag || false,
                    reportGenerated: true,
                    responsibleDepartment: (item.department || 'Police').toLowerCase() as any,
                    handledBy: officerNote.officerId || 'SYSTEM',
                    officerId: officerNote.officerId || 'SYSTEM',
                    officerDepartment: officerNote.department || item.department || 'HQ_MAINFRAME',
                    detectionSource: item.source || 'AI',
                    casualtyLikelihood: (casualty.fatalities > 0 ? 'high' : casualty.injuredCount > 1 ? 'moderate' : 'low') as any,
                    weather: (environment.weather || 'clear').toLowerCase() as any,
                    roadConditionVal: (environment.road || 'dry').toLowerCase() as any
                };
            }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        } catch (err) {
            console.error('Failed to load history:', err);
            return [];
        }
    }
};
