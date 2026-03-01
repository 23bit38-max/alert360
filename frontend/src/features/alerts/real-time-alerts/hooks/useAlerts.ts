import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/core/auth/AuthContext';
import { useNotifications } from '@/shared/components/NotificationService';
import { getAccessibleZones, canAccessZone, isSuperAdmin } from '@/shared/utils/rbac';
import type { Alert, IncidentImage } from '@/features/alerts/real-time-alerts/constants/alerts.types';
import { fetchAlertsData } from '@/features/alerts/real-time-alerts/services/alerts.service';

export const useAlerts = () => {
    const { user } = useAuth();
    const { showToast } = useNotifications();

    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedZone, setSelectedZone] = useState('all');
    const [selectedSeverity, setSelectedSeverity] = useState('all');
    const [selectedIncident, setSelectedIncident] = useState<string | null>(null);
    const [mapCenter, setMapCenter] = useState<[number, number]>([19.0760, 72.8777]); // Mumbai Center
    const [loading, setLoading] = useState(true);

    const accessibleZones = getAccessibleZones(user);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await fetchAlertsData();

            if (!data) return;

            const transformedAlerts: Alert[] = data.map((item: any) => {
                const mediaRecords = item.accidents_media || [];
                const involvement = item.vehicle_involvement?.[0] || {};
                const casualty = item.casualty_report?.[0] || {};
                const environment = item.environmental_conditions?.[0] || {};

                const images: IncidentImage[] = [];

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

                const mainImageUrl = images.find(img => img.type === 'after')?.url || images[0]?.url || 'https://images.unsplash.com/photo-1544829099-b9a0c5303bea?w=800&h=600&fit=crop';

                return {
                    id: item.id,
                    type: (item.operational_priority || 'medium').toLowerCase() as any,
                    title: item.accident_code || item.incident_category?.toUpperCase() || 'INCIDENT',
                    location: item.address || item.location || 'Unknown Location',
                    zone: item.zone || 'GAMMA',
                    timestamp: new Date(item.observed_at || item.created_at),
                    vehicles: involvement.vehicle_count || 0,
                    confidence: (item.ai_analysis?.[0]?.confidence_score || 0) * 100 || 85,
                    status: (item.response_status || 'active').toLowerCase() as any,
                    cameraId: item.road_identifier || 'SENSOR-NODE',
                    coordinates: { lat: parseFloat(item.latitude) || 0, lng: parseFloat(item.longitude) || 0 },
                    description: item.incident_category || 'N/A',
                    actions: ['ACKNOWLEDGE'],
                    images: images.length > 0 ? images : [{
                        id: 'placeholder',
                        url: mainImageUrl,
                        timestamp: new Date(),
                        type: 'during',
                        description: 'Detection Frame',
                        cameraAngle: 'Center'
                    }],
                    severity: (item.operational_priority === 'High' ? 'severe' : 'moderate') as any,
                    responsibleDepartment: item.department === 'Police' ? 'police' : 'multi-department',
                    detectionSource: (item.source_type || 'AI') as any,
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
                    chemicalHazardFlag: environment.chemical_hazard_flag
                };
            });

            setAlerts(transformedAlerts);
            // Auto-center on latest if available
            if (transformedAlerts.length > 0) {
                const first = transformedAlerts[0];
                if (first.coordinates.lat && first.coordinates.lng) {
                    setMapCenter([first.coordinates.lat, first.coordinates.lng]);
                }
            }
        } catch (err) {
            console.error('Failed to load real intelligence:', err);
            showToast('error', 'SYNC ERROR', 'Could not establish connection to Government Database.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const stats = useMemo(() => {
        const active = alerts.filter(a => a.status === 'active').length;
        const responding = alerts.filter(a => a.status === 'responding').length;
        const resolved = alerts.filter(a => a.status === 'resolved').length;
        return { active, responding, resolved };
    }, [alerts]);

    const filteredAlerts = alerts.filter(alert => {
        const matchesZoneScope = accessibleZones.includes('all') || canAccessZone(user, alert.zone);
        const matchesDeptScope = isSuperAdmin(user) || user?.department === alert.responsibleDepartment;
        const matchesSearch = alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            alert.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
            alert.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilterZone = selectedZone === 'all' || alert.zone === selectedZone;
        const matchesSeverity = selectedSeverity === 'all' || alert.type === selectedSeverity;

        return matchesZoneScope && matchesDeptScope && matchesSearch && matchesFilterZone && matchesSeverity;
    }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    const handleActionFlow = async (alertId: string, currentStatus: Alert['status']) => {
        let nextStatus: Alert['status'] = 'responding';
        if (currentStatus === 'responding') {
            nextStatus = 'pending' as any;
            showToast('success', 'ACKNOWLEDGED', `PROCESSING ACTION FOR ${alertId}`);
        } else if (currentStatus === 'pending' as any) {
            nextStatus = 'resolved';
            showToast('success', 'RESOLVED', `ALERT ${alertId} DE-ESCALATED AND ARCHIVED`);
        } else if (currentStatus === 'active') {
            nextStatus = 'responding';
            showToast('success', 'DEPLOYED', `RESPONDERS DISPATCHED TO ${alertId}`);
        } else {
            return;
        }

        try {
            const { supabase } = await import('@/core/config/supabase.config');
            const { error } = await supabase
                .from('accidents')
                .update({ response_status: nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1) })
                .eq('id', alertId);

            if (error) throw error;
            setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: nextStatus } : a));
        } catch (err) {
            console.error('Failed to persist status change:', err);
        }
    };

    return {
        state: {
            alerts,
            searchQuery,
            selectedZone,
            selectedSeverity,
            selectedIncident,
            mapCenter,
            loading,
            stats,
            filteredAlerts
        },
        handlers: {
            setSearchQuery,
            setSelectedZone,
            setSelectedSeverity,
            setSelectedIncident,
            setMapCenter,
            loadData,
            handleActionFlow
        }
    };
};
