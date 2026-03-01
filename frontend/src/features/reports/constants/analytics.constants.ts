export const velocityData = [
    { date: 'Feb 14', incident: 42, resolution: 38, anomaly: false },
    { date: 'Feb 15', incident: 35, resolution: 36, anomaly: false },
    { date: 'Feb 16', incident: 85, resolution: 62, anomaly: true },
    { date: 'Feb 17', incident: 65, resolution: 68, anomaly: false },
    { date: 'Feb 18', incident: 94, resolution: 75, anomaly: true },
    { date: 'Feb 19', incident: 55, resolution: 58, anomaly: false },
    { date: 'Feb 20', incident: 48, resolution: 50, anomaly: false },
];

export const zonalTrendData = [
    { name: 'Week 1', north: 45, south: 32, east: 58, west: 30, central: 70 },
    { name: 'Week 2', north: 52, south: 45, east: 48, west: 35, central: 65 },
    { name: 'Week 3', north: 38, south: 55, east: 62, west: 42, central: 80 },
    { name: 'Week 4', north: 60, south: 40, east: 55, west: 38, central: 75 },
];

export const notificationLatency = [
    { channel: 'Email', latency: 450, target: 500 },
    { channel: 'SMS', latency: 850, target: 400 },
    { channel: 'Push', latency: 120, target: 200 },
    { channel: 'Call', latency: 1500, target: 1000 },
    { channel: 'Alarm', latency: 50, target: 100 },
];

export const systemHealth = [
    { name: 'Inference Node', status: 'Optimal', value: 98, color: '#10B981' },
    { name: 'Stream Proxy', status: 'Warning', value: 84, color: '#F59E0B' },
    { name: 'Dispatch API', status: 'Optimal', value: 99, color: '#3B82F6' },
];

export const zonalData = [
    { zone: 'North Sector', accidents: 145, resolved: 138, fill: '#3B82F6' },
    { zone: 'South Sector', accidents: 98, resolved: 90, fill: '#F59E0B' },
    { zone: 'East Sector', accidents: 122, resolved: 110, fill: '#10B981' },
    { zone: 'West Sector', accidents: 85, resolved: 82, fill: '#EF4444' },
    { zone: 'Central Hub', accidents: 210, resolved: 195, fill: '#8B5CF6' },
];

export const casualtyData = [
    { name: 'Fatal Events', value: 3, fill: '#EF4444' },
    { name: 'Critical Injury', value: 12, fill: '#F59E0B' },
    { name: 'Minor Injury', value: 45, fill: '#3B82F6' },
    { name: 'Property Damage Only', value: 85, fill: '#10B981' },
];

export const resolutionMetrics = [
    { name: 'Resolved', value: 450, fill: '#10B981' },
    { name: 'In-Progress', value: 24, fill: '#3B82F6' },
    { name: 'Dismissed', value: 15, fill: '#EF4444' },
];

export const categoryData = [
    { name: 'Bus', value: 45, color: '#3B82F6' },
    { name: 'Motorcycle', value: 32, color: '#F59E0B' },
    { name: 'Passenger Car', value: 88, color: '#10B981' },
    { name: 'Pedestrian', value: 15, color: '#EF4444' },
    { name: 'Heavy Truck', value: 24, color: '#8B5CF6' },
];

export const radarData = [
    { subject: 'Email Alert', A: 120, B: 110, fullMark: 150 },
    { subject: 'SMS Dispatch', A: 98, B: 130, fullMark: 150 },
    { subject: 'Push Notify', A: 86, B: 130, fullMark: 150 },
    { subject: 'Voice Call', A: 99, B: 100, fullMark: 150 },
    { subject: 'On-Site Alarm', A: 85, B: 90, fullMark: 150 },
];

export const severityTimeline = [
    { date: 'Mon', critical: 12, high: 24, mid: 45 },
    { date: 'Tue', critical: 8, high: 28, mid: 42 },
    { date: 'Wed', critical: 15, high: 32, mid: 38 },
    { date: 'Thu', critical: 10, high: 22, mid: 50 },
    { date: 'Fri', critical: 20, high: 35, mid: 45 },
    { date: 'Sat', critical: 5, high: 15, mid: 30 },
    { date: 'Sun', critical: 7, high: 12, mid: 25 },
];
