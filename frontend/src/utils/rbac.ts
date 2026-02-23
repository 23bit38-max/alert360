import type { User } from '../data/data';

// ============================================================================
// ROLE DEFINITIONS
// ============================================================================

export const ROLES = {
    SUPER_ADMIN: 'super_admin',
    POLICE_ADMIN: 'police_admin',
    POLICE_OFFICER: 'police_officer',
    FIRE_ADMIN: 'fire_admin',
    FIRE_OPERATOR: 'fire_operator',
    HOSPITAL_ADMIN: 'hospital_admin',
    HOSPITAL_STAFF: 'hospital_staff',
    MONITORING_OPERATOR: 'monitoring_operator',
    AUDITOR: 'auditor',
    GENERAL_USER: 'general_user',
} as const;

export type UserRole = typeof ROLES[keyof typeof ROLES];

// ============================================================================
// PERMISSION TAXONOMY (52 Permissions across 7 Domains)
// ============================================================================

export const PERMISSIONS = {
    // NAVIGATION (10 permissions)
    NAV_DASHBOARD: 'nav_dashboard',
    NAV_ALERTS: 'nav_alerts',
    NAV_INCIDENTS: 'nav_incidents',
    NAV_CAMERAS: 'nav_cameras',
    NAV_MAP: 'nav_map',
    NAV_ANALYTICS: 'nav_analytics',
    NAV_AUDIT_LOGS: 'nav_audit_logs',
    NAV_SETTINGS: 'nav_settings',
    NAV_USER_MGMT: 'nav_user_mgmt',
    NAV_MANUAL_UPLOAD: 'nav_manual_upload',

    // ALERT ACTIONS (5 permissions)
    ALERT_VIEW: 'alert_view',
    ALERT_ACKNOWLEDGE: 'alert_acknowledge',
    ALERT_ESCALATE: 'alert_escalate',
    ALERT_DISMISS: 'alert_dismiss',
    ALERT_ASSIGN: 'alert_assign',

    // INCIDENT ACTIONS (8 permissions)
    INCIDENT_VIEW: 'incident_view',
    INCIDENT_CREATE: 'incident_create',
    INCIDENT_UPDATE: 'incident_update',
    INCIDENT_CLOSE: 'incident_close',
    INCIDENT_ASSIGN: 'incident_assign',
    INCIDENT_UPLOAD_MEDIA: 'incident_upload_media',
    INCIDENT_DELETE_MEDIA: 'incident_delete_media',
    INCIDENT_EXPORT: 'incident_export',

    // CAMERA ACTIONS (6 permissions)
    CAMERA_VIEW: 'camera_view',
    CAMERA_CONTROL: 'camera_control',
    CAMERA_REQUEST_INSTALL: 'camera_request_install',
    CAMERA_APPROVE_INSTALL: 'camera_approve_install',
    CAMERA_DISABLE: 'camera_disable',
    CAMERA_EXPORT_FOOTAGE: 'camera_export_footage',

    // USER MANAGEMENT (8 permissions)
    USER_VIEW: 'user_view',
    USER_CREATE: 'user_create',
    USER_EDIT: 'user_edit',
    USER_DEACTIVATE: 'user_deactivate',
    USER_ASSIGN_ROLE: 'user_assign_role',
    USER_ASSIGN_ZONES: 'user_assign_zones',
    USER_MODIFY_PERMISSIONS: 'user_modify_permissions',
    USER_VIEW_AUDIT: 'user_view_audit',

    // ANALYTICS (5 permissions)
    ANALYTICS_VIEW: 'analytics_view',
    ANALYTICS_FILTER: 'analytics_filter',
    ANALYTICS_EXPORT: 'analytics_export',
    ANALYTICS_ALL_DEPTS: 'analytics_all_depts',
    ANALYTICS_HISTORICAL: 'analytics_historical',

    // SYSTEM (4 permissions)
    SYSTEM_SETTINGS: 'system_settings',
    SYSTEM_MAINTENANCE: 'system_maintenance',
    SYSTEM_NOTIFICATIONS: 'system_notifications',
    SYSTEM_EMERGENCY_OVERRIDE: 'system_emergency_override',

    // LEGACY (for backward compatibility)
    VIEW_DASHBOARD: 'nav_dashboard',
    VIEW_ALERTS: 'alert_view',
    UPLOAD_INCIDENTS: 'incident_create',
    VIEW_UPLOAD_STATS: 'analytics_view',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

// ============================================================================
// DEFAULT PERMISSION TEMPLATES (Role-based defaults)
// ============================================================================

export const DEFAULT_PERMISSION_TEMPLATES: Record<UserRole, readonly Permission[]> = {
    [ROLES.SUPER_ADMIN]: [
        // Navigation - ALL
        PERMISSIONS.NAV_DASHBOARD,
        PERMISSIONS.NAV_ALERTS,
        PERMISSIONS.NAV_INCIDENTS,
        PERMISSIONS.NAV_CAMERAS,
        PERMISSIONS.NAV_MAP,
        PERMISSIONS.NAV_ANALYTICS,
        PERMISSIONS.NAV_AUDIT_LOGS,
        PERMISSIONS.NAV_SETTINGS,
        PERMISSIONS.NAV_USER_MGMT,
        PERMISSIONS.NAV_MANUAL_UPLOAD,
        // Alerts - View only
        PERMISSIONS.ALERT_VIEW,
        // Incidents - View only
        PERMISSIONS.INCIDENT_VIEW,
        PERMISSIONS.INCIDENT_EXPORT,
        // Cameras - View only
        PERMISSIONS.CAMERA_VIEW,
        PERMISSIONS.CAMERA_APPROVE_INSTALL,
        // User Management - ALL
        PERMISSIONS.USER_VIEW,
        PERMISSIONS.USER_CREATE,
        PERMISSIONS.USER_EDIT,
        PERMISSIONS.USER_DEACTIVATE,
        PERMISSIONS.USER_ASSIGN_ROLE,
        PERMISSIONS.USER_ASSIGN_ZONES,
        PERMISSIONS.USER_MODIFY_PERMISSIONS,
        PERMISSIONS.USER_VIEW_AUDIT,
        // Analytics - ALL
        PERMISSIONS.ANALYTICS_VIEW,
        PERMISSIONS.ANALYTICS_FILTER,
        PERMISSIONS.ANALYTICS_EXPORT,
        PERMISSIONS.ANALYTICS_ALL_DEPTS,
        PERMISSIONS.ANALYTICS_HISTORICAL,
        // System - ALL
        PERMISSIONS.SYSTEM_SETTINGS,
        PERMISSIONS.SYSTEM_MAINTENANCE,
        PERMISSIONS.SYSTEM_NOTIFICATIONS,
        PERMISSIONS.SYSTEM_EMERGENCY_OVERRIDE,
    ],

    [ROLES.POLICE_ADMIN]: [
        // Navigation
        PERMISSIONS.NAV_DASHBOARD,
        PERMISSIONS.NAV_ALERTS,
        PERMISSIONS.NAV_INCIDENTS,
        PERMISSIONS.NAV_CAMERAS,
        PERMISSIONS.NAV_MAP,
        PERMISSIONS.NAV_ANALYTICS,
        PERMISSIONS.NAV_MANUAL_UPLOAD,
        // Alerts
        PERMISSIONS.ALERT_VIEW,
        PERMISSIONS.ALERT_ACKNOWLEDGE,
        PERMISSIONS.ALERT_ESCALATE,
        PERMISSIONS.ALERT_DISMISS,
        PERMISSIONS.ALERT_ASSIGN,
        // Incidents
        PERMISSIONS.INCIDENT_VIEW,
        PERMISSIONS.INCIDENT_CREATE,
        PERMISSIONS.INCIDENT_UPDATE,
        PERMISSIONS.INCIDENT_CLOSE,
        PERMISSIONS.INCIDENT_ASSIGN,
        PERMISSIONS.INCIDENT_UPLOAD_MEDIA,
        PERMISSIONS.INCIDENT_DELETE_MEDIA,
        PERMISSIONS.INCIDENT_EXPORT,
        // Cameras
        PERMISSIONS.CAMERA_VIEW,
        PERMISSIONS.CAMERA_CONTROL,
        PERMISSIONS.CAMERA_REQUEST_INSTALL,
        // Analytics
        PERMISSIONS.ANALYTICS_VIEW,
        PERMISSIONS.ANALYTICS_FILTER,
        PERMISSIONS.ANALYTICS_EXPORT,
    ],

    [ROLES.POLICE_OFFICER]: [
        // Navigation
        PERMISSIONS.NAV_DASHBOARD,
        PERMISSIONS.NAV_ALERTS,
        PERMISSIONS.NAV_INCIDENTS,
        PERMISSIONS.NAV_CAMERAS,
        PERMISSIONS.NAV_MAP,
        PERMISSIONS.NAV_MANUAL_UPLOAD,
        // Alerts
        PERMISSIONS.ALERT_VIEW,
        PERMISSIONS.ALERT_ACKNOWLEDGE,
        // Incidents
        PERMISSIONS.INCIDENT_VIEW,
        PERMISSIONS.INCIDENT_UPDATE,
        PERMISSIONS.INCIDENT_UPLOAD_MEDIA,
        // Cameras
        PERMISSIONS.CAMERA_VIEW,
    ],

    [ROLES.FIRE_ADMIN]: [
        // Navigation
        PERMISSIONS.NAV_DASHBOARD,
        PERMISSIONS.NAV_ALERTS,
        PERMISSIONS.NAV_INCIDENTS,
        PERMISSIONS.NAV_CAMERAS,
        PERMISSIONS.NAV_MAP,
        PERMISSIONS.NAV_ANALYTICS,
        PERMISSIONS.NAV_MANUAL_UPLOAD,
        // Alerts
        PERMISSIONS.ALERT_VIEW,
        PERMISSIONS.ALERT_ACKNOWLEDGE,
        PERMISSIONS.ALERT_ESCALATE,
        PERMISSIONS.ALERT_DISMISS,
        PERMISSIONS.ALERT_ASSIGN,
        // Incidents
        PERMISSIONS.INCIDENT_VIEW,
        PERMISSIONS.INCIDENT_CREATE,
        PERMISSIONS.INCIDENT_UPDATE,
        PERMISSIONS.INCIDENT_CLOSE,
        PERMISSIONS.INCIDENT_ASSIGN,
        PERMISSIONS.INCIDENT_UPLOAD_MEDIA,
        PERMISSIONS.INCIDENT_DELETE_MEDIA,
        PERMISSIONS.INCIDENT_EXPORT,
        // Cameras
        PERMISSIONS.CAMERA_VIEW,
        PERMISSIONS.CAMERA_CONTROL,
        PERMISSIONS.CAMERA_REQUEST_INSTALL,
        // Analytics
        PERMISSIONS.ANALYTICS_VIEW,
        PERMISSIONS.ANALYTICS_FILTER,
        PERMISSIONS.ANALYTICS_EXPORT,
    ],

    [ROLES.FIRE_OPERATOR]: [
        // Navigation
        PERMISSIONS.NAV_DASHBOARD,
        PERMISSIONS.NAV_ALERTS,
        PERMISSIONS.NAV_INCIDENTS,
        PERMISSIONS.NAV_CAMERAS,
        PERMISSIONS.NAV_MAP,
        PERMISSIONS.NAV_MANUAL_UPLOAD,
        // Alerts
        PERMISSIONS.ALERT_VIEW,
        PERMISSIONS.ALERT_ACKNOWLEDGE,
        // Incidents
        PERMISSIONS.INCIDENT_VIEW,
        PERMISSIONS.INCIDENT_UPDATE,
        PERMISSIONS.INCIDENT_UPLOAD_MEDIA,
        // Cameras
        PERMISSIONS.CAMERA_VIEW,
    ],

    [ROLES.HOSPITAL_ADMIN]: [
        // Navigation
        PERMISSIONS.NAV_DASHBOARD,
        PERMISSIONS.NAV_ALERTS,
        PERMISSIONS.NAV_INCIDENTS,
        PERMISSIONS.NAV_CAMERAS,
        PERMISSIONS.NAV_MAP,
        PERMISSIONS.NAV_ANALYTICS,
        PERMISSIONS.NAV_MANUAL_UPLOAD,
        // Alerts
        PERMISSIONS.ALERT_VIEW,
        PERMISSIONS.ALERT_ACKNOWLEDGE,
        PERMISSIONS.ALERT_ASSIGN,
        // Incidents
        PERMISSIONS.INCIDENT_VIEW,
        PERMISSIONS.INCIDENT_CREATE,
        PERMISSIONS.INCIDENT_UPDATE,
        PERMISSIONS.INCIDENT_UPLOAD_MEDIA,
        PERMISSIONS.INCIDENT_EXPORT,
        // Cameras
        PERMISSIONS.CAMERA_VIEW,
        PERMISSIONS.CAMERA_REQUEST_INSTALL,
        // Analytics
        PERMISSIONS.ANALYTICS_VIEW,
        PERMISSIONS.ANALYTICS_FILTER,
        PERMISSIONS.ANALYTICS_EXPORT,
        // System
        PERMISSIONS.SYSTEM_NOTIFICATIONS,
    ],

    [ROLES.HOSPITAL_STAFF]: [
        // Navigation
        PERMISSIONS.NAV_DASHBOARD,
        PERMISSIONS.NAV_ALERTS,
        PERMISSIONS.NAV_INCIDENTS,
        // Alerts
        PERMISSIONS.ALERT_VIEW,
        // Incidents
        PERMISSIONS.INCIDENT_VIEW,
    ],

    [ROLES.MONITORING_OPERATOR]: [
        // Navigation
        PERMISSIONS.NAV_DASHBOARD,
        PERMISSIONS.NAV_ALERTS,
        PERMISSIONS.NAV_INCIDENTS,
        PERMISSIONS.NAV_CAMERAS,
        PERMISSIONS.NAV_MAP,
        // Alerts - View only
        PERMISSIONS.ALERT_VIEW,
        // Incidents - View only
        PERMISSIONS.INCIDENT_VIEW,
        // Cameras - View only
        PERMISSIONS.CAMERA_VIEW,
    ],

    [ROLES.AUDITOR]: [
        // Navigation
        PERMISSIONS.NAV_DASHBOARD,
        PERMISSIONS.NAV_INCIDENTS,
        PERMISSIONS.NAV_AUDIT_LOGS,
        PERMISSIONS.NAV_ANALYTICS,
        // Incidents - Historical only
        PERMISSIONS.INCIDENT_VIEW,
        PERMISSIONS.INCIDENT_EXPORT,
        // Analytics - ALL
        PERMISSIONS.ANALYTICS_VIEW,
        PERMISSIONS.ANALYTICS_FILTER,
        PERMISSIONS.ANALYTICS_EXPORT,
        PERMISSIONS.ANALYTICS_ALL_DEPTS,
        PERMISSIONS.ANALYTICS_HISTORICAL,
        // User Audit
        PERMISSIONS.USER_VIEW_AUDIT,
    ],

    [ROLES.GENERAL_USER]: [
        // Navigation - Minimal
        PERMISSIONS.NAV_DASHBOARD,
    ],
};

// ============================================================================
// PAGE ACCESS CONTROL
// ============================================================================

export const PAGE_ACCESS: Record<string, readonly Permission[]> = {
    dashboard: [PERMISSIONS.NAV_DASHBOARD],
    alerts: [PERMISSIONS.NAV_ALERTS],
    incidents: [PERMISSIONS.NAV_INCIDENTS],
    cameras: [PERMISSIONS.NAV_CAMERAS],
    map: [PERMISSIONS.NAV_MAP],
    analytics: [PERMISSIONS.NAV_ANALYTICS],
    'audit-logs': [PERMISSIONS.NAV_AUDIT_LOGS],
    settings: [PERMISSIONS.NAV_SETTINGS],
    'user-management': [PERMISSIONS.NAV_USER_MGMT],
    'manual-upload': [PERMISSIONS.NAV_MANUAL_UPLOAD],
    approvals: [PERMISSIONS.USER_VIEW], // Legacy
    notifications: [PERMISSIONS.SYSTEM_NOTIFICATIONS], // ✅ Added
};

// ============================================================================
// FEATURE VISIBILITY
// ============================================================================

export const FEATURE_VISIBILITY: Record<string, readonly UserRole[]> = {
    departmentBreakdown: [ROLES.SUPER_ADMIN],
    allZonesView: [ROLES.SUPER_ADMIN, ROLES.MONITORING_OPERATOR, ROLES.AUDITOR],
    cameraControls: [ROLES.POLICE_ADMIN, ROLES.POLICE_OFFICER, ROLES.FIRE_ADMIN, ROLES.FIRE_OPERATOR],
    approveCamera: [ROLES.SUPER_ADMIN],
    dismissAlerts: [ROLES.POLICE_ADMIN, ROLES.FIRE_ADMIN],
    manageUsers: [ROLES.SUPER_ADMIN],
    systemSettings: [ROLES.SUPER_ADMIN],
};

// ============================================================================
// DEPARTMENT MAPPING
// ============================================================================

export const DEPARTMENT_MAP: Record<UserRole, string> = {
    [ROLES.SUPER_ADMIN]: 'system',
    [ROLES.POLICE_ADMIN]: 'police',
    [ROLES.POLICE_OFFICER]: 'police',
    [ROLES.FIRE_ADMIN]: 'fire',
    [ROLES.FIRE_OPERATOR]: 'fire',
    [ROLES.HOSPITAL_ADMIN]: 'hospital',
    [ROLES.HOSPITAL_STAFF]: 'hospital',
    [ROLES.MONITORING_OPERATOR]: 'monitoring',
    [ROLES.AUDITOR]: 'audit',
    [ROLES.GENERAL_USER]: 'public',
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get effective permissions for a user (combines role defaults + toggles)
 */
export const getEffectivePermissions = (user: User | null): Set<Permission> => {
    if (!user) return new Set();

    // 1. Start with role-based defaults
    const rolePermissions = DEFAULT_PERMISSION_TEMPLATES[user.role as UserRole] || [];
    const permissions = new Set<Permission>(rolePermissions);

    // 2. Apply permission toggles (overrides)
    if (user.permissionToggles) {
        // console.log('Applying toggles:', user.permissionToggles);
        Object.entries(user.permissionToggles).forEach(([key, value]) => {
            const permission = key as Permission;
            if (value === true) {
                permissions.add(permission);
            } else if (value === false) {
                permissions.delete(permission);
                // console.log('Removed permission:', permission);
            }
        });
    }

    return permissions;
};

/**
 * Check if user has a specific permission
 */
export const hasPermission = (user: User | null, permission: Permission): boolean => {
    if (!user) return false;

    // Auditor always has full read access
    if (user.role === ROLES.AUDITOR && permission.includes('view')) return true;

    const effectivePermissions = getEffectivePermissions(user);
    return effectivePermissions.has(permission);
};

/**
 * Check if user has ANY of the specified permissions
 */
export const hasAnyPermission = (user: User | null, permissions: Permission[]): boolean => {
    if (!user) return false;
    return permissions.some(permission => hasPermission(user, permission));
};

/**
 * Check if user has ALL of the specified permissions
 */
export const hasAllPermissions = (user: User | null, permissions: Permission[]): boolean => {
    if (!user) return false;
    return permissions.every(permission => hasPermission(user, permission));
};

/**
 * Check if user can access a specific page
 */
export const canAccessPage = (user: User | null, page: string): boolean => {
    if (!user) return false;

    const requiredPermissions = PAGE_ACCESS[page];
    if (!requiredPermissions || requiredPermissions.length === 0) return true;

    return hasAnyPermission(user, requiredPermissions as Permission[]);
};

/**
 * Check if user can see a specific feature
 */
export const canSeeFeature = (user: User | null, feature: string): boolean => {
    if (!user) return false;

    const allowedRoles = FEATURE_VISIBILITY[feature];
    if (!allowedRoles) return false;

    return allowedRoles.includes(user.role as UserRole);
};

/**
 * Check if user has a specific role
 */
export const hasRole = (user: User | null, role: UserRole): boolean => {
    if (!user) return false;
    return user.role === role;
};

/**
 * Check if user has ANY of the specified roles
 */
export const hasAnyRole = (user: User | null, roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role as UserRole);
};

/**
 * Check if user can access a specific zone
 */
export const canAccessZone = (user: User | null, zone: string): boolean => {
    if (!user) return false;

    // Super Admin, Auditor, Monitoring Operator bypass zone restrictions
    const bypassRoles: UserRole[] = [ROLES.SUPER_ADMIN, ROLES.AUDITOR, ROLES.MONITORING_OPERATOR];
    if (bypassRoles.includes(user.role as UserRole)) {
        return true;
    }

    // Check assigned zones
    if (!user.assignedZones || user.assignedZones.length === 0) return false;
    return user.assignedZones.includes(zone);
};

/**
 * Get all accessible zones for a user
 */
export const getAccessibleZones = (user: User | null): string[] => {
    if (!user) return [];

    // Super Admin, Auditor, Monitoring Operator see all zones
    const bypassRoles: UserRole[] = [ROLES.SUPER_ADMIN, ROLES.AUDITOR, ROLES.MONITORING_OPERATOR];
    if (bypassRoles.includes(user.role as UserRole)) {
        return ['all'];
    }

    return user.assignedZones || [];
};

/**
 * Get user's department
 */
export const getUserDepartment = (user: User | null): string => {
    if (!user) return '';
    return DEPARTMENT_MAP[user.role as UserRole] || user.department || '';
};

/**
 * Check if user is Super Admin
 */
export const isSuperAdmin = (user: User | null): boolean => {
    return user?.role === ROLES.SUPER_ADMIN;
};

/**
 * Check if user is a department admin
 */
export const isDepartmentAdmin = (user: User | null): boolean => {
    if (!user) return false;
    const adminRoles: UserRole[] = [ROLES.POLICE_ADMIN, ROLES.FIRE_ADMIN, ROLES.HOSPITAL_ADMIN];
    return adminRoles.includes(user.role as UserRole);
};

/**
 * Get human-readable role name
 */
export const getRoleDisplayName = (role: UserRole): string => {
    const roleNames: Record<UserRole, string> = {
        [ROLES.SUPER_ADMIN]: 'Super Administrator',
        [ROLES.POLICE_ADMIN]: 'Police Administrator',
        [ROLES.POLICE_OFFICER]: 'Police Officer',
        [ROLES.FIRE_ADMIN]: 'Fire Department Administrator',
        [ROLES.FIRE_OPERATOR]: 'Fire Operator',
        [ROLES.HOSPITAL_ADMIN]: 'Hospital Administrator',
        [ROLES.HOSPITAL_STAFF]: 'Hospital Staff',
        [ROLES.MONITORING_OPERATOR]: 'Monitoring Operator',
        [ROLES.AUDITOR]: 'Auditor',
        [ROLES.GENERAL_USER]: 'General User',
    };
    return roleNames[role] || role;
};

/**
 * Get human-readable department name
 */
export const getDepartmentDisplayName = (department: string): string => {
    const deptNames: Record<string, string> = {
        system: 'System Administration',
        police: 'Police Department',
        fire: 'Fire Department',
        hospital: 'Hospital / Medical Services',
        monitoring: 'Monitoring Center',
        audit: 'Audit & Compliance',
        public: 'Public',
    };
    return deptNames[department] || department;
};

/**
 * Get permission display name
 */
export const getPermissionDisplayName = (permission: Permission): string => {
    const permissionNames: Record<string, string> = {
        // Navigation
        [PERMISSIONS.NAV_DASHBOARD]: 'View Dashboard',
        [PERMISSIONS.NAV_ALERTS]: 'View Alerts',
        [PERMISSIONS.NAV_INCIDENTS]: 'View Incidents',
        [PERMISSIONS.NAV_CAMERAS]: 'View Cameras',
        [PERMISSIONS.NAV_MAP]: 'View Map',
        [PERMISSIONS.NAV_ANALYTICS]: 'View Analytics',
        [PERMISSIONS.NAV_AUDIT_LOGS]: 'View Audit Logs',
        [PERMISSIONS.NAV_SETTINGS]: 'View Settings',
        [PERMISSIONS.NAV_USER_MGMT]: 'View User Management',
        [PERMISSIONS.NAV_MANUAL_UPLOAD]: 'View Manual Upload',
        // Alerts
        [PERMISSIONS.ALERT_VIEW]: 'View Alerts',
        [PERMISSIONS.ALERT_ACKNOWLEDGE]: 'Acknowledge Alerts',
        [PERMISSIONS.ALERT_ESCALATE]: 'Escalate Alerts',
        [PERMISSIONS.ALERT_DISMISS]: 'Dismiss Alerts',
        [PERMISSIONS.ALERT_ASSIGN]: 'Assign Responders',
        // Incidents
        [PERMISSIONS.INCIDENT_VIEW]: 'View Incidents',
        [PERMISSIONS.INCIDENT_CREATE]: 'Create Incidents',
        [PERMISSIONS.INCIDENT_UPDATE]: 'Update Incidents',
        [PERMISSIONS.INCIDENT_CLOSE]: 'Close Incidents',
        [PERMISSIONS.INCIDENT_ASSIGN]: 'Assign Responders',
        [PERMISSIONS.INCIDENT_UPLOAD_MEDIA]: 'Upload Media',
        [PERMISSIONS.INCIDENT_DELETE_MEDIA]: 'Delete Media',
        [PERMISSIONS.INCIDENT_EXPORT]: 'Export Incidents',
        // Cameras
        [PERMISSIONS.CAMERA_VIEW]: 'View Cameras',
        [PERMISSIONS.CAMERA_CONTROL]: 'Control Cameras',
        [PERMISSIONS.CAMERA_REQUEST_INSTALL]: 'Request Installation',
        [PERMISSIONS.CAMERA_APPROVE_INSTALL]: 'Approve Installation',
        [PERMISSIONS.CAMERA_DISABLE]: 'Disable Cameras',
        [PERMISSIONS.CAMERA_EXPORT_FOOTAGE]: 'Export Footage',
        // User Management
        [PERMISSIONS.USER_VIEW]: 'View Users',
        [PERMISSIONS.USER_CREATE]: 'Create Users',
        [PERMISSIONS.USER_EDIT]: 'Edit Users',
        [PERMISSIONS.USER_DEACTIVATE]: 'Deactivate Users',
        [PERMISSIONS.USER_ASSIGN_ROLE]: 'Assign Roles',
        [PERMISSIONS.USER_ASSIGN_ZONES]: 'Assign Zones',
        [PERMISSIONS.USER_MODIFY_PERMISSIONS]: 'Modify Permissions',
        [PERMISSIONS.USER_VIEW_AUDIT]: 'View User Audit Logs',
        // Analytics
        [PERMISSIONS.ANALYTICS_VIEW]: 'View Analytics',
        [PERMISSIONS.ANALYTICS_FILTER]: 'Filter Analytics',
        [PERMISSIONS.ANALYTICS_EXPORT]: 'Export Reports',
        [PERMISSIONS.ANALYTICS_ALL_DEPTS]: 'View All Departments',
        [PERMISSIONS.ANALYTICS_HISTORICAL]: 'View Historical Data',
        // System
        [PERMISSIONS.SYSTEM_SETTINGS]: 'Modify Settings',
        [PERMISSIONS.SYSTEM_MAINTENANCE]: 'Maintenance Mode',
        [PERMISSIONS.SYSTEM_NOTIFICATIONS]: 'Configure Notifications',
        [PERMISSIONS.SYSTEM_EMERGENCY_OVERRIDE]: 'Emergency Override',
    };
    return permissionNames[permission] || permission;
};

/**
 * Get permission domain/category
 */
export const getPermissionDomain = (permission: Permission): string => {
    if (permission.startsWith('nav_')) return 'Navigation';
    if (permission.startsWith('alert_')) return 'Alert Management';
    if (permission.startsWith('incident_')) return 'Incident Management';
    if (permission.startsWith('camera_')) return 'Camera Operations';
    if (permission.startsWith('user_')) return 'User Administration';
    if (permission.startsWith('analytics_')) return 'Analytics & Reports';
    if (permission.startsWith('system_')) return 'System Controls';
    return 'Other';
};
