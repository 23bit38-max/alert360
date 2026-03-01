import { useState, useEffect, useRef } from 'react';
import { fetchAccidents } from '@/services/supabase.service';
import type { MapMarker } from '@/features/alerts/map-view/constants/map.constants';
import { getOtherNodes } from '@/features/alerts/map-view/constants/map.constants';

export const useMapData = () => {
    const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [mapCenter, setMapCenter] = useState<[number, number]>([19.0760, 72.8777]);
    const [zoom, setZoom] = useState(12);
    const [layers, setLayers] = useState({
        incidents: true,
        cameras: true,
        responders: true,
        hospitals: true,
    });
    const [mapBounds, setMapBounds] = useState<any>(null); // any used due to strict L.LatLngBoundsExpression typing conflict without importing leaflet into hook unnecessarily

    const [loading, setLoading] = useState(true);
    const [accidents, setAccidents] = useState<any[]>([]);
    const [proximityAccidents, setProximityAccidents] = useState<MapMarker[]>([]);

    const [trackingEnabled, setTrackingEnabled] = useState(true);
    const watchId = useRef<number | null>(null);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await fetchAccidents();
            setAccidents(data || []);

            if (data && data.length > 0) {
                const validIncidents = data.filter((a: any) => !isNaN(parseFloat(a.latitude)) && !isNaN(parseFloat(a.longitude)));
                if (validIncidents.length === 1) {
                    setMapCenter([parseFloat(validIncidents[0].latitude), parseFloat(validIncidents[0].longitude)]);
                    setZoom(15);
                }
            }
        } catch (error) {
            console.error('Failed to fetch map data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        const generateMocks = (baseLat: number, baseLng: number) => {
            const mockAlerts: MapMarker[] = [
                {
                    id: 'sim-1',
                    type: 'incident',
                    position: [baseLat + (Math.random() - 0.5) * 0.003, baseLng + (Math.random() - 0.5) * 0.003],
                    title: 'PROXIMITY: Vehicle Stall',
                    status: 'active',
                    severity: 'medium',
                    details: { vehicles: 1, casualties: 0, timestamp: 'LIVE', sector: 'IMMEDIATE' }
                },
                {
                    id: 'sim-2',
                    type: 'incident',
                    position: [baseLat + (Math.random() - 0.5) * 0.007, baseLng + (Math.random() - 0.5) * 0.007],
                    title: 'PROXIMITY: High-Speed Collision',
                    status: 'active',
                    severity: 'high',
                    details: { vehicles: 2, casualties: 2, timestamp: 'LIVE', sector: 'LOCAL' }
                },
                {
                    id: 'sim-3',
                    type: 'incident',
                    position: [baseLat + (Math.random() - 0.5) * 0.002, baseLng + (Math.random() - 0.5) * 0.002],
                    title: 'CRITICAL: Pedestrian Down',
                    status: 'active',
                    severity: 'critical',
                    details: { vehicles: 1, casualties: 1, timestamp: 'URGENT', sector: 'IMMEDIATE' }
                },
                {
                    id: 'sim-4',
                    type: 'incident',
                    position: [baseLat + (Math.random() - 0.5) * 0.005, baseLng + (Math.random() - 0.5) * 0.005],
                    title: 'PROXIMITY: Fire Hazard',
                    status: 'active',
                    severity: 'high',
                    details: { vehicles: 1, casualties: 0, timestamp: 'STABLE', sector: 'LOCAL' }
                },
                {
                    id: 'sim-5',
                    type: 'incident',
                    position: [baseLat + (Math.random() - 0.5) * 0.004, baseLng + (Math.random() - 0.5) * 0.004],
                    title: 'IMMEDIATE: Lane Obstruction',
                    status: 'active',
                    severity: 'low',
                    details: { vehicles: 1, casualties: 0, timestamp: 'LIVE', sector: 'IMMEDIATE' }
                }
            ];
            setProximityAccidents(mockAlerts);
            setZoom(16);
        };

        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const newPos: [number, number] = [pos.coords.latitude, pos.coords.longitude];
                    setUserLocation(newPos);
                    setMapCenter(newPos);
                    generateMocks(newPos[0], newPos[1]);
                },
                (err) => {
                    console.warn("Location check failed, generating mocks around default center", err);
                    generateMocks(mapCenter[0], mapCenter[1]);
                }
            );
        } else {
            generateMocks(mapCenter[0], mapCenter[1]);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (trackingEnabled) {
            if ("geolocation" in navigator) {
                watchId.current = navigator.geolocation.watchPosition(
                    (pos) => {
                        const newPos: [number, number] = [pos.coords.latitude, pos.coords.longitude];
                        setUserLocation(newPos);
                        setMapCenter(newPos);
                    },
                    (err) => console.error("Location tracking failed", err),
                    { enableHighAccuracy: true }
                );
            }
        } else {
            if (watchId.current) navigator.geolocation.clearWatch(watchId.current);
        }
        return () => { if (watchId.current) navigator.geolocation.clearWatch(watchId.current); };
    }, [trackingEnabled]);

    const incidentMarkers: MapMarker[] = (accidents || [])
        .map((a: any): MapMarker | null => {
            const lat = parseFloat(a.latitude);
            const lng = parseFloat(a.longitude);

            if (isNaN(lat) || isNaN(lng)) {
                return null;
            }

            return {
                id: a.id,
                type: 'incident',
                position: [lat, lng],
                title: a.accident_code || a.incident_category || 'Incident Record',
                status: (a.response_status || 'active').toLowerCase() as any,
                severity: (a.operational_priority || 'medium').toLowerCase() as any,
                details: {
                    vehicles: a.vehicle_involvement?.[0]?.vehicle_count || 0,
                    casualties: a.casualty_report?.[0]?.injured_count || 0,
                    timestamp: new Date(a.observed_at || a.created_at).toLocaleTimeString(),
                    responders: [],
                    sector: a.zone || 'SECTOR-GAMMA'
                }
            };
        })
        .filter((m): m is MapMarker => m !== null);

    const otherNodes = getOtherNodes();

    const mockMarkers: MapMarker[] = [
        ...incidentMarkers,
        ...proximityAccidents,
        ...otherNodes
    ];

    return {
        state: {
            selectedMarker,
            userLocation,
            mapCenter,
            zoom,
            layers,
            mapBounds,
            loading,
            proximityAccidents,
            incidentMarkers,
            otherNodes,
            mockMarkers,
            trackingEnabled
        },
        handlers: {
            setSelectedMarker,
            setMapCenter,
            setZoom,
            setLayers,
            setMapBounds,
            setTrackingEnabled
        }
    };
};
