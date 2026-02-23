/**
 * CENTRALIZED DATA STORE
 * 
 * This file contains all the mock data used throughout the AI Accident Detection System.
 * All data is organized by feature/component for easy maintenance and updates.
 * 
 * 🎯 For Beginners:
 * - This file acts as a "database" for our application
 * - Instead of having data scattered across different files, everything is here
 * - You can easily modify data here and it will update across the entire app
 * - Real applications would connect to an actual database instead of using this mock data
 */

import type { UserRole, Permission } from '../utils/rbac';
import { DEFAULT_PERMISSION_TEMPLATES } from '../utils/rbac';

// ===== USER TYPE =====
export interface User {
  id: string;
  email: string;
  password?: string; // Only for mock authentication
  name: string;
  role: UserRole;
  avatar?: string;
  department: string;
  assignedZones: string[];
  permissionToggles?: Record<string, boolean>;
  status: 'active' | 'suspended' | 'pending';
  createdAt: Date;
  lastModified: Date;
  modifiedBy?: string;
  emergencyOverride?: {
    permissions: Permission[];
    expiresAt: number;
    grantedBy: string;
  };
  // Legacy fields for backward compatibility
  zones?: string[];
  permissions?: string[];
}

// Helper to convert permission array to toggles
const permissionsToToggles = (permissions: readonly Permission[]): Record<string, boolean> => {
  const toggles: Record<string, boolean> = {};
  permissions.forEach(permission => {
    toggles[permission] = true;
  });
  return toggles;
};

// ===== USER DATA =====
// This represents different types of users in our system
export const MOCK_USERS: Record<string, User> = {
  // Super Admin - Has access to everything but can only monitor, not make changes
  super_admin: {
    id: 'super-001',
    email: 'admin@aidashboard.com',
    password: 'admin123', // In real apps, passwords are encrypted!
    name: 'System Administrator',
    role: 'super_admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    department: 'system',
    assignedZones: ['all'], // Can see all zones
    permissionToggles: permissionsToToggles(DEFAULT_PERMISSION_TEMPLATES.super_admin),
    status: 'active',
    createdAt: new Date('2025-01-01'),
    lastModified: new Date('2025-02-17'),
    zones: ['all'], // Legacy
    permissions: ['view_all', 'contact_admins', 'system_settings', 'analytics'] // Legacy
  },

  // Police Admin - Can respond to and manage police-related incidents
  police_admin: {
    id: 'police-001',
    email: 'police@Mumbai.gov.in',
    password: 'police123',
    name: 'Inspector Rajesh Kumar',
    role: 'police_admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    department: 'police',
    assignedZones: ['central-Mumbai', 'south-Mumbai', 'north-Mumbai'],
    permissionToggles: permissionsToToggles(DEFAULT_PERMISSION_TEMPLATES.police_admin),
    status: 'active',
    createdAt: new Date('2025-01-15'),
    lastModified: new Date('2025-02-17'),
    zones: ['central-Mumbai', 'south-Mumbai', 'north-Mumbai'], // Legacy
    permissions: ['respond_alerts', 'manage_incidents', 'traffic_control', 'investigation'] // Legacy
  },

  // Fire Department Admin - Handles fire emergencies and rescue operations
  fire_admin: {
    id: 'fire-001',
    email: 'fire@Mumbai.gov.in',
    password: 'fire123',
    name: 'Chief Fire Officer Murugan',
    role: 'fire_admin',
    avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
    department: 'fire',
    assignedZones: ['central-Mumbai', 'south-Mumbai', 'north-Mumbai'],
    permissionToggles: permissionsToToggles(DEFAULT_PERMISSION_TEMPLATES.fire_admin),
    status: 'active',
    createdAt: new Date('2025-01-15'),
    lastModified: new Date('2025-02-17'),
    zones: ['central-Mumbai', 'south-Mumbai', 'north-Mumbai'], // Legacy
    permissions: ['respond_alerts', 'fire_response', 'rescue_operations', 'hazmat_handling'] // Legacy
  },

  // Hospital Admin - Manages medical emergencies and ambulance services
  hospital_admin: {
    id: 'hospital-001',
    email: 'medical@Mumbai.gov.in',
    password: 'hospital123',
    name: 'Dr. Priya Sharma',
    role: 'hospital_admin',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
    department: 'hospital',
    assignedZones: ['central-Mumbai', 'south-Mumbai', 'north-Mumbai'],
    permissionToggles: permissionsToToggles(DEFAULT_PERMISSION_TEMPLATES.hospital_admin),
    status: 'active',
    createdAt: new Date('2025-01-15'),
    lastModified: new Date('2025-02-17'),
    zones: ['central-Mumbai', 'south-Mumbai', 'north-Mumbai'], // Legacy
    permissions: ['respond_alerts', 'medical_response', 'ambulance_dispatch', 'casualty_management'] // Legacy
  },

  // Police Officer - Field officer
  police_officer: {
    id: 'police-002',
    email: 'officer@Mumbai.gov.in',
    password: 'officer123',
    name: 'Officer Vikram Singh',
    role: 'police_officer',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
    department: 'police',
    assignedZones: ['central-Mumbai'],
    permissionToggles: permissionsToToggles(DEFAULT_PERMISSION_TEMPLATES.police_officer),
    status: 'active',
    createdAt: new Date('2025-02-01'),
    lastModified: new Date('2025-02-17'),
    zones: ['central-Mumbai'],
    permissions: []
  },

  // Fire Operator - Control room operator
  fire_operator: {
    id: 'fire-002',
    email: 'fire.op@Mumbai.gov.in',
    password: 'fireop123',
    name: 'Operator Rajesh',
    role: 'fire_operator',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop&crop=face',
    department: 'fire',
    assignedZones: ['south-Mumbai'],
    permissionToggles: permissionsToToggles(DEFAULT_PERMISSION_TEMPLATES.fire_operator),
    status: 'active',
    createdAt: new Date('2025-02-01'),
    lastModified: new Date('2025-02-17'),
    zones: ['south-Mumbai'],
    permissions: []
  },

  // Hospital Staff - Medical staff
  hospital_staff: {
    id: 'hospital-002',
    email: 'staff@Mumbai.gov.in',
    password: 'staff123',
    name: 'Nurse Sarah Jenkins',
    role: 'hospital_staff',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    department: 'hospital',
    assignedZones: ['north-Mumbai'],
    permissionToggles: permissionsToToggles(DEFAULT_PERMISSION_TEMPLATES.hospital_staff),
    status: 'active',
    createdAt: new Date('2025-02-01'),
    lastModified: new Date('2025-02-17'),
    zones: ['north-Mumbai'],
    permissions: []
  },

  // Monitoring Operator - General monitoring
  monitoring_operator: {
    id: 'monitor-001',
    email: 'monitor@aidashboard.com',
    password: 'monitor123',
    name: 'System Monitor',
    role: 'monitoring_operator',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&crop=face',
    department: 'system',
    assignedZones: ['central-Mumbai', 'south-Mumbai'],
    permissionToggles: permissionsToToggles(DEFAULT_PERMISSION_TEMPLATES.monitoring_operator),
    status: 'active',
    createdAt: new Date('2025-02-01'),
    lastModified: new Date('2025-02-17'),
    zones: ['central-Mumbai', 'south-Mumbai'],
    permissions: []
  },

  // Auditor - Read-only access for compliance
  auditor: {
    id: 'auditor-001',
    email: 'auditor@aidashboard.com',
    password: 'auditor123',
    name: 'Compliance Officer',
    role: 'auditor',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    department: 'system',
    assignedZones: ['all'],
    permissionToggles: permissionsToToggles(DEFAULT_PERMISSION_TEMPLATES.auditor),
    status: 'active',
    createdAt: new Date('2025-02-01'),
    lastModified: new Date('2025-02-17'),
    zones: ['all'],
    permissions: []
  },

  // General User - Basic access
  general_user: {
    id: 'user-001',
    email: 'user@aidashboard.com',
    password: 'user123',
    name: 'Guest User',
    role: 'general_user',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
    department: 'public',
    assignedZones: [],
    permissionToggles: permissionsToToggles(DEFAULT_PERMISSION_TEMPLATES.general_user),
    status: 'active',
    createdAt: new Date('2025-02-01'),
    lastModified: new Date('2025-02-17'),
    zones: [],
    permissions: []
  }
};

// ===== DASHBOARD DATA =====
// Statistics and metrics shown on the main dashboard
export const DASHBOARD_STATS = {
  // Super Admin sees data from all departments
  super_admin: {
    totalAccidents: 47,
    alertsSent: 324,
    liveCameras: 187,
    activeResponders: 89,
    departmentBreakdown: {
      police: { accidents: 18, alerts: 145, responders: 32 },
      fire: { accidents: 15, alerts: 98, responders: 28 },
      hospital: { accidents: 14, alerts: 81, responders: 29 }
    }
  },

  // Each department admin sees only their department's data
  police_admin: { accidents: 18, alerts: 145, cameras: 65, responders: 32 },
  fire_admin: { accidents: 15, alerts: 98, cameras: 58, responders: 28 },
  hospital_admin: { accidents: 14, alerts: 81, cameras: 42, responders: 29 }
};

// ===== REAL-TIME ALERTS DATA =====
// Current active alerts in the system with detailed information
export const REALTIME_ALERTS = [
  {
    id: 'alert-001',
    type: 'critical' as const,
    title: 'Multi-Vehicle Collision',
    location: 'Anna Salai & Nungambakkam Junction, Mumbai',
    zone: 'central-Mumbai',
    timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
    vehicles: 3,
    confidence: 95, // AI confidence level in percentage
    status: 'active' as const,
    assignedTo: 'Unit-12',
    cameraId: 'cam-001',
    coordinates: { lat: 13.0827, lng: 80.2707 }, // Mumbai coordinates
    description: 'Severe multi-vehicle collision involving 3 cars with potential casualties at major Mumbai intersection',
    actions: ['Emergency Response Dispatched', 'Hospital Alert Sent', 'Traffic Control Active'],
    injuries: 4,
    severity: 'severe' as const,
    responsibleDepartment: 'police' as const,
    responsibleAdmin: 'Inspector Rajesh Kumar',
    contactedAdmins: [],
    // Images captured by AI cameras
    images: [
      {
        id: 'img-001',
        url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop',
        timestamp: new Date(Date.now() - 3 * 60 * 1000),
        type: 'before' as const,
        description: 'Normal traffic flow before incident at Anna Salai',
        cameraAngle: 'North-facing'
      },
      {
        id: 'img-002',
        url: 'https://images.unsplash.com/photo-1544829099-b9a0c5303bea?w=800&h=600&fit=crop',
        timestamp: new Date(Date.now() - 2 * 60 * 1000),
        type: 'during' as const,
        description: 'Active collision scene with multiple vehicles',
        cameraAngle: 'North-facing'
      },
      {
        id: 'img-003',
        url: 'https://images.unsplash.com/photo-1508618159764-513a105449b5?w=800&h=600&fit=crop',
        timestamp: new Date(Date.now() - 1 * 60 * 1000),
        type: 'during' as const,
        description: 'Emergency responders and ambulances arriving',
        cameraAngle: 'South-facing'
      }
    ],
    videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
  },

  {
    id: 'alert-002',
    type: 'high' as const,
    title: 'Vehicle Fire Incident',
    location: 'OMR Road near Sholinganallur, Mumbai',
    zone: 'south-Mumbai',
    timestamp: new Date(Date.now() - 8 * 60 * 1000),
    vehicles: 1,
    confidence: 92,
    status: 'responding' as const,
    assignedTo: 'Fire Station #7',
    responseTime: 4.2,
    cameraId: 'cam-002',
    coordinates: { lat: 12.9010, lng: 80.2279 },
    description: 'Single vehicle caught fire on OMR, fire department responding with 2 units',
    actions: ['Fire Department Dispatched', 'Traffic Diverted', 'Ambulance Standby'],
    injuries: 1,
    severity: 'moderate' as const,
    responsibleDepartment: 'fire' as const,
    responsibleAdmin: 'Chief Fire Officer Murugan',
    contactedAdmins: ['Super Admin'],
    images: [
      {
        id: 'img-004',
        url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
        timestamp: new Date(Date.now() - 9 * 60 * 1000),
        type: 'before' as const,
        description: 'OMR highway normal conditions',
        cameraAngle: 'East-facing'
      },
      {
        id: 'img-005',
        url: 'https://images.unsplash.com/photo-1471479917193-f00955256257?w=800&h=600&fit=crop',
        timestamp: new Date(Date.now() - 8 * 60 * 1000),
        type: 'during' as const,
        description: 'Vehicle fire with smoke visible',
        cameraAngle: 'East-facing'
      }
    ]
  },

  {
    id: 'alert-003',
    type: 'medium' as const,
    title: 'Medical Emergency - Two Vehicle Collision',
    location: 'ECR Road near Mahabalipuram Toll',
    zone: 'south-Mumbai',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    vehicles: 2,
    confidence: 88,
    status: 'responding' as const,
    assignedTo: 'Ambulance Unit-15',
    responseTime: 6.1,
    cameraId: 'cam-003',
    coordinates: { lat: 12.8642, lng: 80.2526 },
    description: 'Two vehicle collision on ECR with injuries, ambulance dispatched from MIOT Hospital',
    actions: ['Ambulance Dispatched', 'Hospital Notified', 'Police En Route'],
    injuries: 2,
    severity: 'moderate' as const,
    responsibleDepartment: 'hospital' as const,
    responsibleAdmin: 'Dr. Priya Sharma',
    contactedAdmins: [],
    images: [
      {
        id: 'img-006',
        url: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        type: 'during' as const,
        description: 'Two vehicle collision on ECR highway',
        cameraAngle: 'West-facing'
      },
      {
        id: 'img-007',
        url: 'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?w=800&h=600&fit=crop',
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        type: 'during' as const,
        description: 'Emergency medical response in progress',
        cameraAngle: 'West-facing'
      }
    ]
  },

  // Additional alerts...
  {
    id: 'alert-004',
    type: 'high' as const,
    title: 'Chain Collision on GNT Road',
    location: 'GNT Road near Redhills, Mumbai',
    zone: 'north-Mumbai',
    timestamp: new Date(Date.now() - 22 * 60 * 1000),
    vehicles: 4,
    confidence: 91,
    status: 'resolved' as const,
    assignedTo: 'Multi-Unit Response',
    responseTime: 5.3,
    cameraId: 'cam-004',
    coordinates: { lat: 13.2043, lng: 80.1755 },
    description: 'Four vehicle chain collision during morning rush hour, all vehicles cleared',
    actions: ['All Departments Coordinated', 'Scene Cleared', 'Traffic Restored'],
    injuries: 3,
    severity: 'moderate' as const,
    responsibleDepartment: 'police' as const,
    responsibleAdmin: 'Sub-Inspector Lakshmi',
    contactedAdmins: [],
    images: [
      {
        id: 'img-008',
        url: 'https://images.unsplash.com/photo-1502161254066-6c74afbf07aa?w=800&h=600&fit=crop',
        timestamp: new Date(Date.now() - 22 * 60 * 1000),
        type: 'during' as const,
        description: 'Multiple vehicle collision on GNT Road',
        cameraAngle: 'North-facing'
      },
      {
        id: 'img-009',
        url: 'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?w=800&h=600&fit=crop',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        type: 'after' as const,
        description: 'Scene cleared, traffic resuming normally',
        cameraAngle: 'North-facing'
      }
    ]
  },

  {
    id: 'alert-005',
    type: 'low' as const,
    title: 'Minor Fender Bender',
    location: 'Velachery Main Road, Mumbai',
    zone: 'south-Mumbai',
    timestamp: new Date(Date.now() - 35 * 60 * 1000),
    vehicles: 2,
    confidence: 76,
    status: 'resolved' as const,
    assignedTo: 'Traffic Constable',
    responseTime: 4.8,
    cameraId: 'cam-005',
    coordinates: { lat: 12.9759, lng: 80.2207 },
    description: 'Minor rear-end collision at Velachery signal, no injuries, insurance details exchanged',
    actions: ['Traffic Report Filed', 'Insurance Contacted', 'Scene Cleared'],
    injuries: 0,
    severity: 'minor' as const,
    responsibleDepartment: 'police' as const,
    responsibleAdmin: 'Constable Ravi',
    contactedAdmins: [],
    images: [
      {
        id: 'img-010',
        url: 'https://images.unsplash.com/photo-1502161254066-6c74afbf07aa?w=800&h=600&fit=crop',
        timestamp: new Date(Date.now() - 35 * 60 * 1000),
        type: 'during' as const,
        description: 'Minor collision at Velachery intersection',
        cameraAngle: 'South-facing'
      }
    ]
  }
];

// ===== INCIDENT HISTORY DATA =====
// Past incidents that have been resolved or dismissed
export const INCIDENT_HISTORY = [
  {
    id: 'inc-001',
    title: 'Multi-Vehicle Collision at Anna Salai',
    type: 'collision' as const,
    severity: 'critical' as const,
    location: 'Anna Salai & Nungambakkam Junction, Mumbai',
    zone: 'central-Mumbai',
    timestamp: new Date('2025-01-25T14:30:00'),
    resolvedAt: new Date('2025-01-25T15:15:00'),
    vehicles: 3,
    casualties: 4,
    responseTime: 4.2, // in minutes
    assignedUnits: ['Unit-12', 'Ambulance-3', 'Fire-07'],
    status: 'resolved' as const,
    confidence: 95,
    cameraId: 'cam-001',
    reportGenerated: true,
    cost: 125000, // in rupees
    responsibleDepartment: 'police' as const,
    handledBy: 'Inspector Rajesh Kumar'
  },

  {
    id: 'inc-002',
    title: 'Vehicle Fire on OMR Highway',
    type: 'fire' as const,
    severity: 'high' as const,
    location: 'OMR Road near Sholinganallur, Mumbai',
    zone: 'south-Mumbai',
    timestamp: new Date('2025-01-25T09:15:00'),
    resolvedAt: new Date('2025-01-25T10:00:00'),
    vehicles: 1,
    casualties: 1,
    responseTime: 3.8,
    assignedUnits: ['Fire Station #7', 'Ambulance-2'],
    status: 'resolved' as const,
    confidence: 92,
    cameraId: 'cam-002',
    reportGenerated: true,
    cost: 45000,
    responsibleDepartment: 'fire' as const,
    handledBy: 'Chief Fire Officer Murugan'
  },

  // More incident records...
  {
    id: 'inc-003',
    title: 'Medical Emergency - ECR Collision',
    type: 'medical' as const,
    severity: 'high' as const,
    location: 'ECR Road near Mahabalipuram Toll',
    zone: 'south-Mumbai',
    timestamp: new Date('2025-01-24T16:45:00'),
    resolvedAt: new Date('2025-01-24T17:30:00'),
    vehicles: 2,
    casualties: 2,
    responseTime: 5.1,
    assignedUnits: ['Ambulance Unit-15', 'Police Backup'],
    status: 'resolved' as const,
    confidence: 88,
    cameraId: 'cam-003',
    reportGenerated: true,
    cost: 78000,
    responsibleDepartment: 'hospital' as const,
    handledBy: 'Dr. Priya Sharma'
  }

  // Continue with more incidents... (I'll add more in a follow-up)
];

// ===== AI INSIGHTS DATA =====
// Smart predictions and recommendations from the AI system
export const AI_INSIGHTS = {
  // Super Admin gets system-wide insights
  super_admin: [
    {
      type: 'warning' as const,
      title: 'Multi-Department Coordination Alert',
      message: 'Zone 3 (Central Mumbai) showing 40% increase in multi-department incidents. Enhanced coordination protocols recommended.',
      confidence: 92,
      time: '5 minutes ago',
      department: 'system'
    },
    {
      type: 'prediction' as const,
      title: 'Evening Rush Hour Forecast',
      message: 'Predicted 65% spike in accidents across all zones during 17:00-19:00. All departments should increase readiness.',
      confidence: 89,
      time: '12 minutes ago',
      department: 'analytics'
    },
    {
      type: 'optimization' as const,
      title: 'Resource Allocation Optimization',
      message: 'Police resources in North Mumbai are 25% underutilized. Consider redistribution to Central zones.',
      confidence: 78,
      time: '25 minutes ago',
      department: 'resource-management'
    },
    {
      type: 'critical' as const,
      title: 'System Performance Alert',
      message: 'Camera #47, #52, and #61 showing reduced AI accuracy. Immediate maintenance required.',
      confidence: 95,
      time: '45 minutes ago',
      department: 'system'
    },
    {
      type: 'insight' as const,
      title: 'Department Efficiency Analysis',
      message: 'Fire Department showing 15% faster response times this week. Best practices to be shared across departments.',
      confidence: 87,
      time: '1 hour ago',
      department: 'analytics'
    }
  ],

  // Department-specific insights
  police_admin: [
    {
      type: 'warning' as const,
      title: 'Traffic Pattern Alert',
      message: 'Unusual traffic congestion detected in your zones. Accident probability increased by 35%.',
      confidence: 88,
      time: '5 minutes ago',
      department: 'police'
    },
    {
      type: 'prediction' as const,
      title: 'Peak Hour Incident Forecast',
      message: 'Expected 45% increase in traffic violations during evening rush in your patrol zones.',
      confidence: 82,
      time: '15 minutes ago',
      department: 'police'
    }
    // More police insights...
  ],

  fire_admin: [
    {
      type: 'warning' as const,
      title: 'Vehicle Fire Risk Alert',
      message: 'Hot weather conditions increasing vehicle fire probability by 28% in your response zones.',
      confidence: 85,
      time: '8 minutes ago',
      department: 'fire'
    }
    // More fire insights...
  ],

  hospital_admin: [
    {
      type: 'warning' as const,
      title: 'Ambulance Availability Alert',
      message: 'Only 2 ambulances available in South Mumbai zone. Consider requesting backup from Central zone.',
      confidence: 90,
      time: '3 minutes ago',
      department: 'hospital'
    }
    // More hospital insights...
  ]
};

// ===== CHART DATA =====
// Data for various charts and graphs in the dashboard
export const CHART_DATA = {
  // Accidents throughout the day
  accidentTrend: [
    { time: '00:00', accidents: 2, severity: 'low' },
    { time: '02:00', accidents: 1, severity: 'medium' },
    { time: '04:00', accidents: 0, severity: 'low' },
    { time: '06:00', accidents: 3, severity: 'high' },
    { time: '08:00', accidents: 5, severity: 'critical' },
    { time: '10:00', accidents: 4, severity: 'high' },
    { time: '12:00', accidents: 6, severity: 'medium' },
    { time: '14:00', accidents: 3, severity: 'low' },
    { time: '16:00', accidents: 7, severity: 'high' },
    { time: '18:00', accidents: 4, severity: 'medium' },
    { time: '20:00', accidents: 2, severity: 'low' },
    { time: '22:00', accidents: 1, severity: 'low' }
  ],

  // Breakdown by severity level
  severityDistribution: [
    { name: 'Critical', value: 8, color: '#FF0040' },
    { name: 'High', value: 15, color: '#FF8C00' },
    { name: 'Medium', value: 28, color: '#FFD700' },
    { name: 'Low', value: 49, color: '#00FF88' }
  ],

  // Response time by zone
  responseTime: [
    { zone: 'Zone 1', avgTime: 4.2, target: 5.0 },
    { zone: 'Zone 2', avgTime: 3.8, target: 5.0 },
    { zone: 'Zone 3', avgTime: 6.1, target: 5.0 },
    { zone: 'Zone 4', avgTime: 4.7, target: 5.0 },
    { zone: 'Zone 5', avgTime: 3.9, target: 5.0 }
  ]
};

// ===== UTILITY FUNCTIONS =====
// Helper functions to work with the data

/**
 * Get dashboard data based on user role
 * @param role - The user's role (super_admin, police_admin, etc.)
 * @returns Dashboard statistics for that role
 */
export const getDashboardData = (role: string) => {
  return DASHBOARD_STATS[role as keyof typeof DASHBOARD_STATS] || DASHBOARD_STATS.super_admin;
};

/**
 * Get alerts filtered by user role and department
 * @param role - The user's role
 * @param department - The user's department (for department admins)
 * @param zones - The zones the user has access to
 * @returns Filtered array of alerts
 */
export const getFilteredAlerts = (role: string, department?: string, zones?: string[]) => {
  if (role === 'super_admin') {
    return REALTIME_ALERTS; // Super admin sees all alerts
  }

  // Department admins only see their department's alerts in their zones
  return REALTIME_ALERTS.filter(alert =>
    alert.responsibleDepartment === department &&
    zones?.includes(alert.zone)
  );
};

/**
 * Get AI insights based on user role
 * @param role - The user's role
 * @returns Array of AI insights for that role
 */
export const getAIInsights = (role: string) => {
  return AI_INSIGHTS[role as keyof typeof AI_INSIGHTS] || AI_INSIGHTS.super_admin;
};

/**
 * Get incident history filtered by user role
 * @param role - The user's role
 * @param department - The user's department
 * @param zones - The zones the user has access to
 * @returns Filtered array of incidents
 */
export const getFilteredIncidents = (role: string, department?: string, zones?: string[]) => {
  if (role === 'super_admin') {
    return INCIDENT_HISTORY; // Super admin sees all incidents
  }

  // Department admins only see their department's incidents
  return INCIDENT_HISTORY.filter(incident =>
    incident.responsibleDepartment === department &&
    zones?.includes(incident.zone)
  );
};

// ===== PENDING APPROVALS DATA =====
// User approval requests and camera installation requests

export const PENDING_USER_APPROVALS = [
  {
    id: 'user-req-001',
    fullName: 'Sub-Inspector Arjun Reddy',
    email: 'arjun.reddy@tnpolice.gov.in',
    department: 'police',
    position: 'Sub-Inspector',
    phoneNumber: '+91 98765 43210',
    emergencyId: 'TN-POL-4578',
    reason: 'Newly appointed as Sub-Inspector for T.Nagar zone. Need access to monitor traffic accidents and coordinate with emergency services in my jurisdiction.',
    urgency: 'medium',
    submittedAt: new Date('2025-01-25T10:30:00'),
    status: 'pending' as const,
    requestedRole: 'police_admin' as const,
    requestedZones: ['central-Mumbai'],
    documents: [
      { type: 'id_proof', name: 'Police_ID_AR.pdf', verified: false },
      { type: 'appointment_letter', name: 'Appointment_Letter.pdf', verified: false }
    ],
    reviews: []
  },
  {
    id: 'user-req-002',
    fullName: 'Dr. Kavitha Krishnan',
    email: 'kavitha.k@miot.in',
    department: 'medical',
    position: 'Emergency Physician',
    phoneNumber: '+91 87654 32109',
    emergencyId: 'MIOT-ER-890',
    reason: 'Senior Emergency Physician at MIOT Hospital. Require access to coordinate ambulance dispatch and receive real-time accident alerts for faster medical response.',
    urgency: 'high',
    submittedAt: new Date('2025-01-25T14:15:00'),
    status: 'pending' as const,
    requestedRole: 'hospital_admin' as const,
    requestedZones: ['south-Mumbai', 'central-Mumbai'],
    documents: [
      { type: 'medical_license', name: 'Medical_License_KK.pdf', verified: true },
      { type: 'hospital_id', name: 'MIOT_ID_Card.pdf', verified: true }
    ],
    reviews: [
      {
        reviewerId: 'super-001',
        reviewerName: 'System Administrator',
        comments: 'Documents verified. Awaiting final approval.',
        timestamp: new Date('2025-01-25T15:00:00'),
        status: 'under_review' as const
      }
    ]
  },
  {
    id: 'user-req-003',
    fullName: 'Fire Officer Muthu Kumar',
    email: 'muthu.kumar@Mumbaifire.gov.in',
    department: 'fire',
    position: 'Station Fire Officer',
    phoneNumber: '+91 76543 21098',
    emergencyId: 'CFD-SFO-234',
    reason: 'Appointed as Station Fire Officer for Velachery Fire Station. Need system access to receive fire-related accident alerts and coordinate rescue operations.',
    urgency: 'medium',
    submittedAt: new Date('2025-01-24T16:45:00'),
    status: 'pending' as const,
    requestedRole: 'fire_admin' as const,
    requestedZones: ['south-Mumbai'],
    documents: [
      { type: 'service_record', name: 'Fire_Service_Record.pdf', verified: true },
      { type: 'appointment_order', name: 'SFO_Appointment.pdf', verified: false }
    ],
    reviews: []
  }
];

export const PENDING_CAMERA_APPROVALS = [
  {
    id: 'cam-req-001',
    requesterId: 'police-001',
    requesterName: 'Inspector Rajesh Kumar',
    requesterDepartment: 'police',
    location: 'Besant Nagar Beach Road Junction',
    zone: 'south-Mumbai',
    coordinates: { lat: 12.9986, lng: 80.2668 },
    reason: 'High accident zone during beach traffic. Multiple vehicle collisions reported in past 3 months. Need AI monitoring for faster response.',
    priority: 'high' as const,
    estimatedCost: 45000,
    installationType: 'new_installation' as const,
    technicalSpecs: {
      cameraType: 'PTZ AI Camera',
      resolution: '4K Ultra HD',
      nightVision: true,
      weatherProof: 'IP67',
      aiCapabilities: ['accident_detection', 'traffic_analysis', 'vehicle_counting']
    },
    submittedAt: new Date('2025-01-25T09:30:00'),
    requestedDate: new Date('2025-01-28T00:00:00'),
    status: 'pending' as const,
    approvals: [],
    attachments: [
      { type: 'location_map', name: 'Besant_Nagar_Junction_Map.pdf' },
      { type: 'accident_reports', name: 'Q4_2024_Accident_Reports.pdf' }
    ]
  },
  {
    id: 'cam-req-002',
    requesterId: 'fire-001',
    requesterName: 'Chief Fire Officer Murugan',
    requesterDepartment: 'fire',
    location: 'IT Corridor - Rajiv Gandhi Salai',
    zone: 'south-Mumbai',
    coordinates: { lat: 12.9127, lng: 80.2284 },
    reason: 'Critical IT corridor with heavy traffic. Recent increase in vehicle fires due to traffic congestion. Enhanced monitoring needed for fire prevention.',
    priority: 'medium' as const,
    estimatedCost: 52000,
    installationType: 'upgrade_existing' as const,
    technicalSpecs: {
      cameraType: 'Thermal + AI Camera',
      resolution: '4K Ultra HD',
      nightVision: true,
      weatherProof: 'IP68',
      aiCapabilities: ['fire_detection', 'smoke_detection', 'thermal_monitoring', 'accident_detection']
    },
    submittedAt: new Date('2025-01-24T14:20:00'),
    requestedDate: new Date('2025-01-30T00:00:00'),
    status: 'under_review' as const,
    approvals: [
      {
        approverId: 'super-001',
        approverName: 'System Administrator',
        status: 'reviewing' as const,
        comments: 'Evaluating thermal camera specifications and cost-benefit analysis.',
        timestamp: new Date('2025-01-25T10:00:00')
      }
    ],
    attachments: [
      { type: 'thermal_analysis', name: 'IT_Corridor_Thermal_Study.pdf' },
      { type: 'budget_proposal', name: 'Thermal_Camera_Budget.pdf' }
    ]
  },
  {
    id: 'cam-req-003',
    requesterId: 'hospital-001',
    requesterName: 'Dr. Priya Sharma',
    requesterDepartment: 'hospital',
    location: 'Guindy Industrial Estate Main Gate',
    zone: 'south-Mumbai',
    coordinates: { lat: 12.9165, lng: 80.2071 },
    reason: 'Major industrial area with ambulance route challenges. Need camera for monitoring accident severity to dispatch appropriate medical teams.',
    priority: 'high' as const,
    estimatedCost: 41000,
    installationType: 'new_installation' as const,
    technicalSpecs: {
      cameraType: 'AI Smart Camera',
      resolution: '4K Ultra HD',
      nightVision: true,
      weatherProof: 'IP67',
      aiCapabilities: ['accident_detection', 'severity_assessment', 'casualty_estimation']
    },
    submittedAt: new Date('2025-01-23T11:15:00'),
    requestedDate: new Date('2025-01-27T00:00:00'),
    status: 'approved' as const,
    approvals: [
      {
        approverId: 'super-001',
        approverName: 'System Administrator',
        status: 'approved' as const,
        comments: 'Approved for installation. High priority due to industrial area safety requirements.',
        timestamp: new Date('2025-01-24T09:30:00')
      }
    ],
    attachments: [
      { type: 'site_survey', name: 'Guindy_Site_Survey.pdf' },
      { type: 'medical_justification', name: 'Medical_Response_Analysis.pdf' }
    ]
  }
];


