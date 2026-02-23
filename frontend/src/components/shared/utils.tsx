import { SEVERITY_LEVELS, STATUS_LEVELS, INCIDENT_TYPES, USER_ROLES } from './constants';

// Type definitions for better type safety
type SeverityLevel = keyof typeof SEVERITY_LEVELS;
type StatusLevel = keyof typeof STATUS_LEVELS;
type IncidentType = keyof typeof INCIDENT_TYPES;
type UserRole = keyof typeof USER_ROLES;

/**
 * Get color class for severity level
 */
export const getSeverityColor = (severity: SeverityLevel): string => {
  return SEVERITY_LEVELS[severity]?.color || 'bg-gray-500/80 text-white';
};

/**
 * Get color class for status level
 */
export const getStatusColor = (status: StatusLevel): string => {
  return STATUS_LEVELS[status]?.color || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
};

/**
 * Get color class for incident type
 */
export const getIncidentTypeColor = (type: IncidentType): string => {
  return INCIDENT_TYPES[type]?.color || 'bg-gray-500/20 text-gray-400';
};

/**
 * Get color class for user role
 */
export const getUserRoleColor = (role: UserRole): string => {
  return USER_ROLES[role]?.color || 'from-gray-500 to-gray-600';
};

/**
 * Format date and time with relative time
 */
export const formatDateTime = (date: Date) => {
  return {
    date: date.toLocaleDateString(),
    time: date.toLocaleTimeString(),
    relative: getRelativeTime(date)
  };
};

/**
 * Get relative time string (e.g., "2h ago", "Just now")
 */
export const getRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
};

/**
 * Generate mock data for development and testing
 */
export const generateMockData = {
  /**
   * Generate mock incidents data
   */
  incidents: (count: number = 10) => {
    const types = Object.keys(INCIDENT_TYPES) as IncidentType[];
    const severities = Object.keys(SEVERITY_LEVELS) as SeverityLevel[];
    const statuses = Object.keys(STATUS_LEVELS) as StatusLevel[];
    const locations = [
      'Anna Salai', 'Mount Road', 'Poonamallee High Road', 'GST Road', 'ECR Road',
      'OMR Road', 'Velachery Main Road', 'Porur Junction', 'T.Nagar', 'Adyar',
      'Tambaram', 'Chrompet', 'Guindy', 'Perungudi', 'Sholinganallur'
    ];
    const zones = ['north-Mumbai', 'south-Mumbai', 'central-Mumbai', 'west-Mumbai', 'east-Mumbai'];
    
    return Array.from({ length: count }, (_, i) => ({
      id: `inc-${String(i + 1).padStart(3, '0')}`,
      title: `Incident ${i + 1}`,
      type: types[Math.floor(Math.random() * types.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      zone: zones[Math.floor(Math.random() * zones.length)],
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      vehicles: Math.floor(Math.random() * 4) + 1,
      casualties: Math.floor(Math.random() * 3),
      responseTime: Math.random() * 10 + 2,
      confidence: Math.floor(Math.random() * 20) + 80
    }));
  },

  /**
   * Generate mock users data
   */
  users: (count: number = 20) => {
    const roles = Object.keys(USER_ROLES) as UserRole[];
    const departments = ['Police', 'Fire', 'Medical', 'Administration'];
    const zones = ['north-Mumbai', 'south-Mumbai', 'central-Mumbai', 'west-Mumbai', 'east-Mumbai'];
    const indianNames = [
      'Labbai Irfan', 'Rajesh Kumar', 'Priya Sharma', 'Aman Singh', 'Deepika Patel', 
      'Arjun Reddy', 'Sneha Iyer', 'Vikram Gupta', 'Kavya Nair', 'Rohit Mehta',
      'Anitha Krishnan', 'Suresh Babu', 'Meera Joshi', 'Anil Verma', 'Pooja Agarwal',
      'Karthik Subramanian', 'Divya Rao', 'Manoj Tiwari', 'Shilpa Shetty', 'Ravi Chauhan'
    ];
    
    return Array.from({ length: count }, (_, i) => {
      const name = indianNames[i] || `User ${i + 1}`;
      const email = `${name.toLowerCase().replace(' ', '.')}@dept.gov.in`;
      const userZones = [
        zones[Math.floor(Math.random() * zones.length)], 
        zones[Math.floor(Math.random() * zones.length)]
      ];

      return {
        id: `user-${String(i + 1).padStart(3, '0')}`,
        name,
        email,
        role: roles[Math.floor(Math.random() * roles.length)],
        department: departments[Math.floor(Math.random() * departments.length)],
        status: Math.random() > 0.2 ? 'active' : 'inactive',
        lastLogin: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        zones: userZones
      };
    });
  }
};

/**
 * Utility function to safely parse JSON
 */
export function safeJsonParse(jsonString: string, fallback: any): any {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('JSON parse error:', error);
    return fallback;
  }
}

/**
 * Utility function to safely stringify JSON
 */
export const safeJsonStringify = (data: any): string => {
  try {
    return JSON.stringify(data);
  } catch (error) {
    console.error('JSON stringify error:', error);
    return '{}';
  }
};

/**
 * Generate a random ID
 */
export const generateId = (prefix: string = ''): string => {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 7);
  return `${prefix}${timestamp}_${randomPart}`;
};

/**
 * Debounce function for search inputs
 */
export function debounce(func: Function, wait: number): Function {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
