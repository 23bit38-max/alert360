import React from "react";
import type { ReactNode } from "react";
import { useAuth } from "../auth/AuthContext";
import {
  hasPermission,
  hasAllPermissions,
  hasAnyPermission,
  canAccessZone,
  PERMISSIONS,
} from "../../utils/rbac";

import type { Permission, UserRole } from "../../utils/rbac";


interface RoleBasedComponentProps {
  children: ReactNode;
  // Permission-based access
  requiredPermission?: Permission;
  requiredPermissions?: Permission[]; // ALL permissions required
  anyPermissions?: Permission[]; // ANY permission required

  // Role-based access
  allowedRoles?: UserRole[];
  blockedRoles?: UserRole[];

  // Zone-based access
  requiredZone?: string;

  // Fallback components
  fallback?: ReactNode;
  unauthorized?: ReactNode;

  // Additional check function
  customCheck?: (user: any) => boolean;
}

export const RoleBasedComponent: React.FC<
  RoleBasedComponentProps
> = ({
  children,
  requiredPermission,
  requiredPermissions,
  anyPermissions,
  allowedRoles,
  blockedRoles,
  requiredZone,
  fallback,
  unauthorized,
  customCheck,
}) => {
    const { user } = useAuth();

    // If no user is logged in, show unauthorized
    if (!user) {
      return <>{unauthorized || null}</>;
    }

    // Check role-based access
    if (allowedRoles && !allowedRoles.includes(user.role as UserRole)) {
      return <>{fallback || unauthorized || null}</>;
    }

    if (blockedRoles && blockedRoles.includes(user.role as UserRole)) {
      return <>{fallback || unauthorized || null}</>;
    }

    // Check single permission
    if (
      requiredPermission &&
      !hasPermission(user, requiredPermission)
    ) {
      return <>{fallback || unauthorized || null}</>;
    }

    // Check all required permissions
    if (
      requiredPermissions &&
      !hasAllPermissions(user, requiredPermissions)
    ) {
      return <>{fallback || unauthorized || null}</>;
    }

    // Check any permissions
    if (
      anyPermissions &&
      !hasAnyPermission(user, anyPermissions)
    ) {
      return <>{fallback || unauthorized || null}</>;
    }

    // Check zone access
    if (
      requiredZone &&
      !canAccessZone(user, requiredZone)
    ) {
      return <>{fallback || unauthorized || null}</>;
    }

    // Custom check function
    if (customCheck && !customCheck(user)) {
      return <>{fallback || unauthorized || null}</>;
    }

    // All checks passed, render children
    return <>{children}</>;
  };

// Convenient hooks for component-level permission checking
export const usePermissions = () => {
  const { user } = useAuth();

  return {
    hasPermission: (permission: Permission) =>
      hasPermission(user, permission),

    hasAllPermissions: (permissions: Permission[]) =>
      hasAllPermissions(user, permissions),

    hasAnyPermission: (permissions: Permission[]) =>
      hasAnyPermission(user, permissions),

    hasZoneAccess: (zone: string) =>
      canAccessZone(user, zone),

    isRole: (role: UserRole) => user?.role === role,

    isSuperAdmin: () => user?.role === "super_admin",

    isDepartmentAdmin: () =>
      user &&
      ["police_admin", "fire_admin", "hospital_admin"].includes(
        user.role,
      ),

    // Helper for legacy checks or specific needs
    canRespond: () =>
      hasPermission(user, PERMISSIONS.ALERT_ACKNOWLEDGE),

    canApprove: () =>
      hasPermission(user, PERMISSIONS.CAMERA_APPROVE_INSTALL),

    canManageUsers: () =>
      hasPermission(user, PERMISSIONS.NAV_USER_MGMT),
  };
};

// Higher-order component for page-level permission checks
export const withRoleBasedAccess = <P extends object>(
  Component: React.ComponentType<P>,
  accessConfig: Omit<RoleBasedComponentProps, "children">,
) => {
  return (props: P) => (
    <RoleBasedComponent {...accessConfig}>
      <Component {...props} />
    </RoleBasedComponent>
  );
};