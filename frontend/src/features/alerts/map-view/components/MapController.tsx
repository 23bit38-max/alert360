import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

export const MapController = ({ center, zoom, bounds }: { center?: [number, number], zoom?: number, bounds?: L.LatLngBoundsExpression }) => {
    const map = useMap();
    useEffect(() => {
        if (bounds) {
            map.fitBounds(bounds, { padding: [50, 50], animate: true });
        } else if (center && zoom !== undefined) {
            map.setView(center, zoom, { animate: true, duration: 1 });
        }
        // Force a resize check to fix tile rendering issues
        setTimeout(() => {
            map.invalidateSize();
        }, 100);
    }, [center, zoom, bounds, map]);
    return null;
};
