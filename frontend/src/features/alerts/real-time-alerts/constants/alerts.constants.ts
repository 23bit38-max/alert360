import L from 'leaflet';

export const createTacticalIcon = (color: string, IconComponent: string, isPulsing = false, severityColor?: string) => {
    const finalColor = severityColor || color;
    return L.divIcon({
        className: 'tactical-marker',
        html: `
      <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
        ${isPulsing ? `<div class="marker-ripple" style="border-color: ${finalColor};"></div>` : ''}
        <div style="
          position: relative;
          width: 30px; height: 30px;
          background: rgba(7, 11, 20, 0.9);
          border: 2px solid ${finalColor};
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 15px ${finalColor}50, inset 0 0 8px ${finalColor}20;
          backdrop-filter: blur(12px);
          transform: rotate(45deg);
        ">
          <div style="transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; color: ${finalColor};">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              ${IconComponent}
            </svg>
          </div>
        </div>
      </div>
    `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
    });
};

export const INCIDENT_ICON_TEMPLATE = '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3ZM12 9v4M12 17h.01"/>';

export const trendData = [
    { time: '08:00', detected: 4, resolved: 2 },
    { time: '10:00', detected: 7, resolved: 5 },
    { time: '12:00', detected: 3, resolved: 6 },
    { time: '14:00', detected: 8, resolved: 4 },
    { time: '16:00', detected: 5, resolved: 7 },
    { time: '18:00', detected: 9, resolved: 5 },
    { time: '20:00', detected: 6, resolved: 8 },
];
