import L from 'leaflet';

export interface MapMarker {
    id: string;
    type: 'incident' | 'camera' | 'responder' | 'hospital';
    position: [number, number];
    title: string;
    status: 'active' | 'inactive' | 'responding' | 'resolved';
    details: any;
    severity?: 'critical' | 'high' | 'medium' | 'low';
}

export const createTacticalIcon = (color: string, IconComponent: string, isPulsing = false, severityColor?: string) => {
    const finalColor = severityColor || color;
    return L.divIcon({
        className: 'tactical-marker',
        html: `
      <div style="position: relative; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
        ${isPulsing ? `<div class="marker-ripple" style="border-color: ${finalColor};"></div>` : ''}
        <div style="
          position: relative;
          width: 38px; height: 38px;
          background: rgba(7, 11, 20, 0.9);
          border: 2px solid ${finalColor};
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 20px ${finalColor}50, inset 0 0 10px ${finalColor}20;
          backdrop-filter: blur(12px);
          transform: rotate(45deg);
        ">
          <div style="transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; color: ${finalColor};">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              ${IconComponent}
            </svg>
          </div>
        </div>
      </div>
    `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
    });
};

export const USER_LOCATION_ICON = L.divIcon({
    className: 'user-location-marker',
    html: `
    <div style="position: relative; width: 24px; height: 24px;">
      <div style="position: absolute; inset: -8px; background: rgba(59, 130, 246, 0.2); border-radius: 50%; animation: ripple 2s infinite;"></div>
      <div style="position: relative; width: 100%; height: 100%; background: #3B82F6; border: 3px solid white; border-radius: 50%; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>
    </div>
  `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
});

export const SEVERITY_COLORS = {
    critical: '#EF4444',
    high: '#F97316',
    medium: '#3B82F6',
    low: '#10B981'
};

export const getSeverityColor = (severity?: string) => {
    return SEVERITY_COLORS[severity?.toLowerCase() as keyof typeof SEVERITY_COLORS] || '#3B82F6';
};

export const INCIDENT_ICON_TEMPLATE = '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3ZM12 9v4M12 17h.01"/>';
export const CAMERA_ICON = createTacticalIcon('#10B981', '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>');
export const RESPONDER_ICON = createTacticalIcon('#F59E0B', '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>');
export const HOSPITAL_ICON = createTacticalIcon('#3B82F6', '<path d="M4 8V4m16 4V4m-9 4V4M4 20v-4m16 4v-4m-9 4v-4M4 12h16M4 16h16M4 8h16"/>');

export const getOtherNodes = (): MapMarker[] => [
    { id: 'cam-1', type: 'camera', position: [19.0760 + 0.005, 72.8777 + 0.008], title: 'Worli Sea Link Entrance', status: 'active', details: { timestamp: 'Live', sector: 'Sector Alpha' } },
    { id: 'cam-2', type: 'camera', position: [19.0760 - 0.012, 72.8777 + 0.015], title: 'Marine Drive North', status: 'active', details: { timestamp: 'Live', sector: 'Sector Gamma' } },
    { id: 'cam-3', type: 'camera', position: [19.0760 + 0.018, 72.8777 - 0.010], title: 'Bandra Junction', status: 'active', details: { timestamp: 'Live', sector: 'Sector Beta' } },
    { id: 'resp-1', type: 'responder', position: [19.0760 + 0.002, 72.8777 - 0.005], title: 'Police Unit 402', status: 'responding', details: { timestamp: 'En Route', sector: 'Sector Alpha' } },
    { id: 'resp-2', type: 'responder', position: [19.0760 - 0.020, 72.8777 + 0.030], title: 'Fire Truck 07', status: 'responding', details: { timestamp: 'On Site', sector: 'Sector Zeta' } },
    { id: 'hosp-1', type: 'hospital', position: [19.0550, 72.8300], title: 'Lilavati Hospital', status: 'active', details: { timestamp: 'Emergency Ready', sector: 'Bandra' } },
    { id: 'hosp-2', type: 'hospital', position: [18.9400, 72.8200], title: 'GT Hospital', status: 'active', details: { timestamp: 'Trauma Unit Op', sector: 'Fort' } },
];
