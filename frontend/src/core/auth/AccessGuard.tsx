import React from 'react';
import type { Permission } from '@/shared/utils/rbac';
import { hasPermission, hasAnyPermission, hasAllPermissions } from '@/shared/utils/rbac';
import { useAuth } from '@/core/auth/AuthContext';

interface AccessGuardProps {
    children: React.ReactNode;
    permission?: Permission;
    anyPermissions?: Permission[];
    allPermissions?: Permission[];
    fallback?: React.ReactNode;
    hideIfDenied?: boolean;
}

/**
 * AccessGuard Component
 * 
 * Conditionally renders children based on user permissions.
 * 
 * Usage:
 * ```tsx
 * <AccessGuard permission={PERMISSIONS.ALERT_ACKNOWLEDGE}>
 *   <Button>Acknowledge Alert</Button>
 * </AccessGuard>
 * 
 * <AccessGuard anyPermissions={[PERMISSIONS.ALERT_VIEW, PERMISSIONS.INCIDENT_VIEW]}>
 *   <DashboardWidget />
 * </AccessGuard>
 * 
 * <AccessGuard 
 *   permission={PERMISSIONS.USER_CREATE} 
 *   fallback={<div>You don't have permission to create users</div>}
 * >
 *   <CreateUserForm />
 * </AccessGuard>
 * ```
 */
export const AccessGuard: React.FC<AccessGuardProps> = ({
    children,
    permission,
    anyPermissions,
    allPermissions,
    fallback = null,
    hideIfDenied = false,
}) => {
    const { user } = useAuth();

    // Check permissions
    let hasAccess = true;

    if (permission) {
        hasAccess = hasPermission(user, permission);
    } else if (anyPermissions && anyPermissions.length > 0) {
        hasAccess = hasAnyPermission(user, anyPermissions);
    } else if (allPermissions && allPermissions.length > 0) {
        hasAccess = hasAllPermissions(user, allPermissions);
    }

    // Render based on access
    if (!hasAccess) {
        return hideIfDenied ? null : <>{fallback}</>;
    }

    return <>{children}</>;
};

export default AccessGuard;
