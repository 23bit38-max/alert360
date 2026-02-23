import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
    Permission,
    UserRole,
} from '../utils/rbac';
import {
    getEffectivePermissions,
    hasPermission as checkPermission,
    canAccessZone as checkZoneAccess,
    ROLES,
} from '../utils/rbac';

// ============================================================================
// TYPES
// ============================================================================

export interface User {
    id: string;
    email: string;
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
}

export interface AuditLogEntry {
    id: string;
    timestamp: Date;
    performedBy: string;
    performedByName: string;
    action: 'PERMISSION_CHANGE' | 'ROLE_CHANGE' | 'ZONE_CHANGE' | 'USER_CREATE' | 'USER_EDIT' | 'USER_SUSPEND' | 'USER_ACTIVATE' | 'EMERGENCY_OVERRIDE';
    targetUser: string;
    targetUserName: string;
    previousState: any;
    newState: any;
    changes: Record<string, any>;
    reason?: string;
    ipAddress?: string;
    userAgent?: string;
}

interface RBACStore {
    // State
    currentUser: User | null;
    effectivePermissions: Set<Permission>;
    accessibleZones: string[];
    auditLogs: AuditLogEntry[];

    // Actions
    setUser: (user: User | null) => void;
    updatePermissions: (userId: string, permissions: Record<string, boolean>) => void;
    updateZones: (userId: string, zones: string[]) => void;
    updateRole: (userId: string, role: UserRole) => void;
    logout: () => void;

    // Permission checks
    canAccess: (feature: string) => boolean;
    canPerform: (action: Permission) => boolean;
    canViewZone: (zoneId: string) => boolean;
    canAccessWithZone: (permission: Permission, zone: string) => boolean;

    // Audit logging
    logPermissionChange: (change: Omit<AuditLogEntry, 'id' | 'timestamp'>) => void;
    getAuditLogs: () => AuditLogEntry[];
    clearAuditLogs: () => void;
}

// ============================================================================
// STORE
// ============================================================================

export const useRBACStore = create<RBACStore>()(
    persist(
        (set, get) => ({
            // Initial state
            currentUser: null,
            effectivePermissions: new Set(),
            accessibleZones: [],
            auditLogs: [],

            // Set current user and compute effective permissions
            setUser: (user) => {
                if (!user) {
                    set({
                        currentUser: null,
                        effectivePermissions: new Set(),
                        accessibleZones: [],
                    });
                    return;
                }

                const effectivePermissions = getEffectivePermissions(user);
                const accessibleZones = user.assignedZones || [];

                set({
                    currentUser: user,
                    effectivePermissions,
                    accessibleZones,
                });
            },

            // Update user permissions
            updatePermissions: (userId, permissions) => {
                const { currentUser, logPermissionChange } = get();
                if (!currentUser || currentUser.id !== userId) return;

                const previousToggles = currentUser.permissionToggles || {};
                const updatedUser = {
                    ...currentUser,
                    permissionToggles: permissions,
                    lastModified: new Date(),
                };

                // Log the change
                const changes: Record<string, any> = {};
                Object.keys(permissions).forEach(key => {
                    if (previousToggles[key] !== permissions[key]) {
                        changes[key] = { from: previousToggles[key] || false, to: permissions[key] };
                    }
                });

                if (Object.keys(changes).length > 0) {
                    logPermissionChange({
                        performedBy: currentUser.id,
                        performedByName: currentUser.name,
                        action: 'PERMISSION_CHANGE',
                        targetUser: userId,
                        targetUserName: currentUser.name,
                        previousState: previousToggles,
                        newState: permissions,
                        changes,
                    });
                }

                get().setUser(updatedUser);
            },

            // Update user zones
            updateZones: (userId, zones) => {
                const { currentUser, logPermissionChange } = get();
                if (!currentUser || currentUser.id !== userId) return;

                const previousZones = currentUser.assignedZones || [];
                const updatedUser = {
                    ...currentUser,
                    assignedZones: zones,
                    lastModified: new Date(),
                };

                // Log the change
                logPermissionChange({
                    performedBy: currentUser.id,
                    performedByName: currentUser.name,
                    action: 'ZONE_CHANGE',
                    targetUser: userId,
                    targetUserName: currentUser.name,
                    previousState: previousZones,
                    newState: zones,
                    changes: { zones: { from: previousZones, to: zones } },
                });

                get().setUser(updatedUser);
            },

            // Update user role
            updateRole: (userId, role) => {
                const { currentUser, logPermissionChange } = get();
                if (!currentUser || currentUser.id !== userId) return;

                const previousRole = currentUser.role;
                const updatedUser = {
                    ...currentUser,
                    role,
                    lastModified: new Date(),
                };

                // Log the change
                logPermissionChange({
                    performedBy: currentUser.id,
                    performedByName: currentUser.name,
                    action: 'ROLE_CHANGE',
                    targetUser: userId,
                    targetUserName: currentUser.name,
                    previousState: previousRole,
                    newState: role,
                    changes: { role: { from: previousRole, to: role } },
                });

                get().setUser(updatedUser);
            },

            // Logout
            logout: () => {
                set({
                    currentUser: null,
                    effectivePermissions: new Set(),
                    accessibleZones: [],
                });
            },

            // Check if user can access a feature
            canAccess: (_feature) => {
                const { currentUser } = get();
                if (!currentUser) return false;

                // Super Admin can access everything
                if (currentUser.role === ROLES.SUPER_ADMIN) return true;

                // Check feature visibility (legacy)
                return true; // Simplified for now
            },

            // Check if user can perform an action
            canPerform: (action) => {
                const { currentUser } = get();
                return checkPermission(currentUser, action);
            },

            // Check if user can view a zone
            canViewZone: (zoneId) => {
                const { currentUser } = get();
                return checkZoneAccess(currentUser, zoneId);
            },

            // Check if user can perform action in a specific zone
            canAccessWithZone: (permission, zone) => {
                const { currentUser } = get();
                if (!currentUser) return false;

                const hasPermission = checkPermission(currentUser, permission);
                const hasZoneAccess = checkZoneAccess(currentUser, zone);

                return hasPermission && hasZoneAccess;
            },

            // Log permission change
            logPermissionChange: (change) => {
                const newLog: AuditLogEntry = {
                    ...change,
                    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    timestamp: new Date(),
                };

                set((state) => ({
                    auditLogs: [newLog, ...state.auditLogs].slice(0, 1000), // Keep last 1000 entries
                }));
            },

            // Get audit logs
            getAuditLogs: () => {
                return get().auditLogs;
            },

            // Clear audit logs
            clearAuditLogs: () => {
                set({ auditLogs: [] });
            },
        }),
        {
            name: 'rbac-storage',
            partialize: (state) => ({
                currentUser: state.currentUser,
                auditLogs: state.auditLogs.slice(0, 100), // Only persist last 100 logs
            }),
        }
    )
);

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Hook to check if user has a specific permission
 */
export const usePermission = (permission: Permission): boolean => {
    const canPerform = useRBACStore((state) => state.canPerform);
    return canPerform(permission);
};

/**
 * Hook to check if user can access a zone
 */
export const useZoneAccess = (zone: string): boolean => {
    const canViewZone = useRBACStore((state) => state.canViewZone);
    return canViewZone(zone);
};

/**
 * Hook to get current user
 */
export const useCurrentUser = (): User | null => {
    return useRBACStore((state) => state.currentUser);
};

/**
 * Hook to get accessible zones
 */
export const useAccessibleZones = (): string[] => {
    return useRBACStore((state) => state.accessibleZones);
};
