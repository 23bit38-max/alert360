// Enhanced Role-Based Access Control System for AI Accident Detection Dashboard

export type UserRole = 'super_admin' | 'police_admin' | 'fire_admin' | 'hospital_admin';

export type Permission = 
  // Analytics & Monitoring (Read-only for Super Admin)
  | 'view_analytics' | 'view_all_incidents' | 'view_system_health' | 'view_ai_metrics'
  | 'export_reports' | 'view_performance_metrics' | 'view_audit_logs'
  
  // Alert Management (Operational for Department Admins)
  | 'respond_to_alerts' | 'resolve_incidents' | 'dispatch_teams' | 'update_incident_status'
  | 'create_incident_reports' | 'assign_resources' | 'contact_other_departments'
  
  // Camera Management
  | 'request_camera_installation' | 'approve_camera_requests' | 'reject_camera_requests'
  | 'view_camera_feed' | 'control_camera_settings' | 'manage_camera_zones'
  | 'configure_ai_detection' | 'calibrate_cameras'
  
  // User & System Management (Super Admin only)
  | 'manage_users' | 'create_admin_accounts' | 'deactivate_accounts' | 'assign_zones'
  | 'system_configuration' | 'backup_system' | 'update_ai_models' | 'manage_api_keys'
  
  // Department Specific Operations
  | 'deploy_police_units' | 'coordinate_traffic_control' | 'issue_citations'
  | 'deploy_fire_units' | 'coordinate_rescue_operations' | 'manage_fire_equipment'
  | 'dispatch_ambulances' | 'coordinate_medical_response' | 'manage_hospital_resources'
  
  // Communication & Notifications
  | 'send_emergency_broadcasts' | 'contact_media' | 'update_public_status'
  | 'manage_notification_channels' | 'configure_alert_priorities';

// Enhanced role-based permissions mapping
export const rolePermissions: Record<UserRole, Permission[]> = {
  super_admin: [
    // Analytics & System Monitoring (Read-only analytical access)
    'view_analytics', 'view_all_incidents', 'view_system_health', 'view_ai_metrics',
    'export_reports', 'view_performance_metrics', 'view_audit_logs',
    
    // Camera Management (Administrative approval powers)
    'approve_camera_requests', 'reject_camera_requests', 'view_camera_feed',
    'manage_camera_zones', 'configure_ai_detection', 'calibrate_cameras',
    
    // User & System Management (Full administrative control)
    'manage_users', 'create_admin_accounts', 'deactivate_accounts', 'assign_zones',
    'system_configuration', 'backup_system', 'update_ai_models', 'manage_api_keys',
    
    // Communication (System-level notifications)
    'manage_notification_channels', 'configure_alert_priorities'
  ],
  
  police_admin: [
    // Operational Response (Full operational control in assigned zones)
    'respond_to_alerts', 'resolve_incidents', 'dispatch_teams', 'update_incident_status',
    'create_incident_reports', 'assign_resources', 'contact_other_departments',
    
    // Camera Operations
    'request_camera_installation', 'view_camera_feed', 'control_camera_settings',
    
    // Police-specific Operations
    'deploy_police_units', 'coordinate_traffic_control', 'issue_citations',
    
    // Communication
    'send_emergency_broadcasts', 'contact_media', 'update_public_status'
  ],
  
  fire_admin: [
    // Operational Response (Full operational control in assigned zones)
    'respond_to_alerts', 'resolve_incidents', 'dispatch_teams', 'update_incident_status',
    'create_incident_reports', 'assign_resources', 'contact_other_departments',
    
    // Camera Operations
    'request_camera_installation', 'view_camera_feed', 'control_camera_settings',
    
    // Fire-specific Operations
    'deploy_fire_units', 'coordinate_rescue_operations', 'manage_fire_equipment',
    
    // Communication
    'send_emergency_broadcasts', 'contact_media', 'update_public_status'
  ],
  
  hospital_admin: [
    // Operational Response (Full operational control in assigned zones)
    'respond_to_alerts', 'resolve_incidents', 'dispatch_teams', 'update_incident_status',
    'create_incident_reports', 'assign_resources', 'contact_other_departments',
    
    // Camera Operations
    'request_camera_installation', 'view_camera_feed', 'control_camera_settings',
    
    // Hospital-specific Operations
    'dispatch_ambulances', 'coordinate_medical_response', 'manage_hospital_resources',
    
    // Communication
    'send_emergency_broadcasts', 'update_public_status'
  ]
};

// Enhanced permission checking utility
export const hasPermission = (userRole: UserRole, permission: Permission): boolean => {
  return rolePermissions[userRole]?.includes(permission) ?? false;
};

// Check multiple permissions (requires ALL permissions)
export const hasAllPermissions = (userRole: UserRole, permissions: Permission[]): boolean => {
  return permissions.every(permission => hasPermission(userRole, permission));
};

// Check multiple permissions (requires ANY permission)
export const hasAnyPermission = (userRole: UserRole, permissions: Permission[]): boolean => {
  return permissions.some(permission => hasPermission(userRole, permission));
};

// Get all permissions for a role
export const getRolePermissions = (userRole: UserRole): Permission[] => {
  return rolePermissions[userRole] || [];
};

// Role hierarchy and capabilities
export const roleCapabilities = {
  super_admin: {
    title: 'Super Administrator',
    description: 'Full system oversight with analytical and approval powers',
    accessLevel: 'System-wide',
    primaryFunction: 'Analytics, Monitoring & System Management',
    limitations: 'Cannot perform operational responses to incidents',
    color: 'from-purple-500 to-pink-500',
    badge: 'SUPER',
    icon: '👑'
  },
  police_admin: {
    title: 'Police Administrator',
    description: 'Law enforcement operational control',
    accessLevel: 'Assigned zones only',
    primaryFunction: 'Traffic Control, Law Enforcement & Emergency Response',
    limitations: 'Limited to police jurisdiction and assigned zones',
    color: 'from-blue-500 to-cyan-500',
    badge: 'POLICE',
    icon: '🚔'
  },
  fire_admin: {
    title: 'Fire Department Administrator',
    description: 'Fire safety and rescue operations control',
    accessLevel: 'Assigned zones only',
    primaryFunction: 'Fire Safety, Rescue Operations & Emergency Response',
    limitations: 'Limited to fire department jurisdiction and assigned zones',
    color: 'from-red-500 to-orange-500',
    badge: 'FIRE',
    icon: '🚒'
  },
  hospital_admin: {
    title: 'Hospital Administrator',
    description: 'Medical emergency response control',
    accessLevel: 'Assigned zones only',
    primaryFunction: 'Medical Response, Ambulance Dispatch & Patient Care',
    limitations: 'Limited to medical emergency responses and assigned zones',
    color: 'from-green-500 to-emerald-500',
    badge: 'MEDICAL',
    icon: '🚑'
  }
};

// Zone-based access control
export const checkZoneAccess = (userZones: string[], targetZone: string): boolean => {
  // Super admin has access to all zones
  if (userZones.includes('all')) return true;
  
  // Check if user has access to specific zone
  return userZones.includes(targetZone);
};

// Enhanced incident priority levels with role-specific access
export const incidentPriorities = {
  critical: {
    level: 5,
    label: 'Critical',
    description: 'Life-threatening emergencies requiring immediate multi-department response',
    responseTime: '< 2 minutes',
    autoDispatch: true,
    requiredRoles: ['police_admin', 'fire_admin', 'hospital_admin'],
    color: 'bg-red-500'
  },
  high: {
    level: 4,
    label: 'High',
    description: 'Serious incidents requiring urgent departmental response',
    responseTime: '< 5 minutes',
    autoDispatch: true,
    requiredRoles: ['police_admin', 'fire_admin', 'hospital_admin'],
    color: 'bg-orange-500'
  },
  medium: {
    level: 3,
    label: 'Medium',
    description: 'Moderate incidents requiring departmental attention',
    responseTime: '< 15 minutes',
    autoDispatch: false,
    requiredRoles: ['police_admin', 'fire_admin', 'hospital_admin'],
    color: 'bg-yellow-500'
  },
  low: {
    level: 2,
    label: 'Low',
    description: 'Minor incidents for monitoring and documentation',
    responseTime: '< 30 minutes',
    autoDispatch: false,
    requiredRoles: ['police_admin'],
    color: 'bg-blue-500'
  },
  info: {
    level: 1,
    label: 'Informational',
    description: 'Information alerts for system awareness',
    responseTime: 'No specific requirement',
    autoDispatch: false,
    requiredRoles: ['super_admin'],
    color: 'bg-gray-500'
  }
};