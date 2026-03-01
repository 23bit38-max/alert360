
import React from 'react';
import { useAuth } from '@/core/auth/AuthContext';
import { AccessDenied } from '@/core/auth/AccessDenied';
import { canAccessPage } from '@/shared/utils/rbac';

interface ProtectedPageProps {
    children: React.ReactNode;
    page: string;
}

export const ProtectedPage: React.FC<ProtectedPageProps> = ({ children, page }) => {
    const { user } = useAuth();

    // If user is not logged in, AuthContext usually handles this (app redirects to login),
    // but for safety we check user existence.
    if (!user) {
        return null; // or loading spinner
    }

    if (!canAccessPage(user, page)) {
        return (
            <div className="p-6">
                <AccessDenied
                    message="Access Restricted"
                    reason="You do not have permission to view this page."
                    showUserInfo={true}
                />
            </div>
        );
    }

    return <>{children}</>;
};
