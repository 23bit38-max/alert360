import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

export const MapController = ({ center }: { center: [number, number] }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, 13, { animate: true, duration: 1 });
        setTimeout(() => map.invalidateSize(), 200);
    }, [center, map]);
    return null;
};
