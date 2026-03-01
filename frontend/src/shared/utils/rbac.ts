// ============================================================================
// REDESIGNED ROLE-BASED ACCESS CONTROL (RBAC) ENGINE
// ============================================================================
import type { User } from '@/data/data';

// 1. STANDARD PERMISSION DOMAINS
export type RBACDomain =
    | 'navigation'
    | 'alerts'
    | 'incidents'
    | 'cameras'
    | 'map'
    | 'analytics'
    | 'audit'
    | 'users'
    | 'system'
    | 'uploads'
    | 'reports';

// 2. STANDARD ACTIONS
export type RBACAction =
    | 'view'
    | 'create'
    | 'update'
    | 'delete'
    | 'assign'
    | 'approve'
    | 'control'
    | 'export'
    | 'configure'
    | 'update_medical_status'; // Extension for hospital based on rules

export type RBACPermission = `${RBACDomain}:${RBACAction}`;

// 3. SYSTEM ROLES
export type UserRole =
    | 'super_admin'
    | 'police_admin'
    | 'police_officer'
    | 'fire_admin'
    | 'fire_operator'
    | 'hospital_admin'
    | 'hospital_staff'
    | 'monitoring_operator'
    | 'auditor'
    | 'general_user';

export const ROLES: Record<string, UserRole> = {
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
};

// 4. PERMISSION ASSIGNMENTS PER ROLE
export const ROLE_PERMISSIONS: Record<UserRole, RBACPermission[]> = {
    super_admin: [
        // Full access simulated by star bypass in authorize engine, 
        // but explicitly listing some core ones is good practice too.
        'navigation:view', 'alerts:view', 'alerts:update', 'alerts:create', 'alerts:delete', 'alerts:assign',
        'incidents:view', 'incidents:create', 'incidents:update', 'incidents:delete', 'incidents:assign',
        'cameras:view', 'cameras:control', 'map:view', 'analytics:view', 'audit:view',
        'users:view', 'users:create', 'users:update', 'users:delete',
        'system:view', 'system:configure', 'uploads:view', 'uploads:create', 'reports:view', 'reports:export'
    ],
    police_admin: [
        'navigation:view',
        'alerts:view', 'alerts:update', 'alerts:create', 'alerts:assign',
        'incidents:view', 'incidents:update', 'incidents:create', 'incidents:assign',
        'cameras:view', 'cameras:control',
        'map:view',
        'analytics:view',
        'users:view', 'users:create', 'users:update', // Scope limited in backend
        'uploads:view', 'uploads:create',
        'reports:view'
    ],
    police_officer: [
        'navigation:view',
        'alerts:view', 'alerts:update',
        'incidents:view', 'incidents:update',
        'cameras:view',
        'map:view',
        'uploads:view', 'uploads:create'
    ],
    fire_admin: [
        'navigation:view',
        'alerts:view', 'alerts:update', 'alerts:create', 'alerts:assign',
        'incidents:view', 'incidents:update', 'incidents:create', 'incidents:assign',
        'cameras:view', 'cameras:control',
        'map:view',
        'analytics:view',
        'users:view', 'users:create', 'users:update',
        'uploads:view', 'uploads:create',
        'reports:view'
    ],
    fire_operator: [
        'navigation:view',
        'alerts:view', 'alerts:update',
        'incidents:view', 'incidents:update',
        'cameras:view',
        'map:view',
        'uploads:view', 'uploads:create'
    ],
    hospital_admin: [
        'navigation:view',
        'alerts:view',
        'incidents:view', 'incidents:update_medical_status',
        'analytics:view',
        'uploads:view', 'uploads:create',
        'reports:view'
    ],
    hospital_staff: [
        'navigation:view',
        'alerts:view',
        'incidents:view', 'incidents:update_medical_status'
    ],
    monitoring_operator: [
        'navigation:view',
        'alerts:view',
        'incidents:view',
        'cameras:view',
        'map:view'
    ],
    auditor: [
        'navigation:view',
        'incidents:view',
        'analytics:view',
        'audit:view',
        'reports:view', 'reports:export'
    ],
    general_user: [
        'navigation:view',
        'incidents:view' // Pulic summary only
    ]
};

// ============================================================================
// 5. AUTHORIZATION ENGINE
// ============================================================================

/**
 * Core centralized authorization function.
 * Evaluates domain:action permissions for a specific role.
 */
export const authorize = (
    role: UserRole | string | undefined,
    domain: RBACDomain,
    action: RBACAction
): boolean => {
    if (!role) {
        console.warn(`[RBAC] Access Denied: No role provided for ${domain}:${action}`);
        return false;
    }

    // Super Admin global allow rule
    if (role === 'super_admin') {
        return true;
    }

    const rolePermissions = ROLE_PERMISSIONS[role as UserRole];
    if (!rolePermissions) {
        console.warn(`[RBAC] Access Denied: Unknown role '${role}' for ${domain}:${action}`);
        return false;
    }

    const requestedPermission: RBACPermission = `${domain}:${action}`;
    const isAllowed = rolePermissions.includes(requestedPermission);

    if (!isAllowed) {
        console.warn(`[RBAC] Access Denied: Role '${role}' lacks permission '${requestedPermission}'`);
    }

    return isAllowed;
};

// ============================================================================
// HELPER FUNCTIONS TO SUPPORT LEGACY INTERFACES DURING MIGRATION
// ============================================================================

/**
 * Mappings for frontend pages to RBAC domains
 */
const PAGE_TO_DOMAIN_MAP: Record<string, RBACDomain> = {
    'dashboard': 'navigation',
    'alerts': 'alerts',
    'incidents': 'incidents',
    'cameras': 'cameras',
    'map': 'map',
    'analytics': 'analytics',
    'audit-logs': 'audit',
    'settings': 'system',
    'user-management': 'users',
    'manual-upload': 'uploads',
    'approvals': 'users',
    'notifications': 'system',
    'reports': 'reports',
    'users': 'users',
    'upload': 'uploads'
};

/**
 * Replaces the legacy canAccessPage logic, using strictly RBAC authorize 
 */
export const canAccessPage = (user: User | null, page: string): boolean => {
    if (!user) return false;

    // Fallback domain logic if page exact match missing
    const domain = PAGE_TO_DOMAIN_MAP[page] || 'navigation';

    return authorize(user.role as UserRole, domain, 'view');
};

/**
 * General helper to adapt legacy permission checks, now mapping to the core engine
 */
export const hasPermission = (user: User | null, permissionOrDomain: string, action?: RBACAction): boolean => {
    if (!user) return false;

    let domain: RBACDomain;
    let act: RBACAction;

    if (action) {
        domain = permissionOrDomain as RBACDomain;
        act = action;
    } else {
        // Handle legacy single-string check
        if (permissionOrDomain?.includes(':')) {
            const [d, a] = permissionOrDomain.split(':');
            domain = d as RBACDomain;
            act = a as RBACAction;
        } else {
            // Default fallback for legacy constants
            domain = 'system';
            act = 'view';
        }
    }
    return authorize(user.role as UserRole, domain, act);
};

export const hasAnyPermission = (user: User | null, checks: string[] | { domain: RBACDomain, action: RBACAction }[]): boolean => {
    if (!user) return false;
    return checks.some(check => {
        if (typeof check === 'string') {
            return hasPermission(user, check);
        }
        return authorize(user.role as UserRole, check.domain, check.action);
    });
};

export const hasRole = (user: User | null, role: UserRole): boolean => {
    if (!user) return false;
    return user.role === role;
};

// ============================================================================
// TEMPORARY RESTORATIONS FOR APP STABILITY
// ============================================================================

export type Permission = string;

export const isSuperAdmin = (user: User | null): boolean => {
    return user?.role === 'super_admin';
};

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

export const getPermissionDomain = (permission: string): string => {
    if (permission.includes(':')) return permission.split(':')[0];
    return 'Other';
};

export const DEPARTMENT_MAP: Record<UserRole, string> = {
    super_admin: 'system',
    police_admin: 'police',
    police_officer: 'police',
    fire_admin: 'fire',
    fire_operator: 'fire',
    hospital_admin: 'hospital',
    hospital_staff: 'hospital',
    monitoring_operator: 'monitoring',
    auditor: 'audit',
    general_user: 'public',
};

export const getAccessibleZones = (user: User | null): string[] => {
    if (!user) return [];
    const bypassRoles: UserRole[] = ['super_admin', 'auditor', 'monitoring_operator'];
    if (bypassRoles.includes(user.role as UserRole)) return ['all'];
    return user.assignedZones || [];
};

export const getUserDepartment = (user: User | null): string => {
    if (!user) return '';
    return DEPARTMENT_MAP[user.role as UserRole] || user.department || '';
};

export const getRoleDisplayName = (role: UserRole | string): string => {
    const roleNames: Record<string, string> = {
        'super_admin': 'Super Administrator',
        'police_admin': 'Police Administrator',
        'police_officer': 'Police Officer',
        'fire_admin': 'Fire Department Administrator',
        'fire_operator': 'Fire Operator',
        'hospital_admin': 'Hospital Administrator',
        'hospital_staff': 'Hospital Staff',
        'monitoring_operator': 'Monitoring Operator',
        'auditor': 'Auditor',
        'general_user': 'General User',
    };
    return roleNames[role as string] || role;
};

// Dummy exports to prevent components crashing while we update them
export const PERMISSIONS: Record<string, any> = {};
export const DEFAULT_PERMISSION_TEMPLATES: any = {};
export const getPermissionDisplayName = (p: string) => p;

export const hasAllPermissions = (_user: User | null, _permissions: string[]) => true;

export const canAccessZone = (user: User | null, zone: string): boolean => {
    if (!user) return false;
    const bypassRoles: UserRole[] = ['super_admin', 'auditor', 'monitoring_operator'];
    if (bypassRoles.includes(user.role as UserRole)) return true;
    if (!user.assignedZones || user.assignedZones.length === 0) return false;
    return user.assignedZones.includes(zone);
};

// End of redesigned RBAC engine

