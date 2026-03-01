import { PERMISSIONS, getPermissionDomain, type Permission } from '@/shared/utils/rbac';

// Group permissions by domain
export const groupPermissionsByDomain = (): Record<string, Permission[]> => {
    const grouped: Record<string, Permission[]> = {};

    Object.values(PERMISSIONS).forEach((permission) => {
        const domain = getPermissionDomain(permission as Permission);
        if (!grouped[domain]) {
            grouped[domain] = [];
        }
        grouped[domain].push(permission as Permission);
    });

    return grouped;
};

export const PERMISSION_GROUPS = groupPermissionsByDomain();
