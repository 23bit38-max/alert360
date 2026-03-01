import React from 'react';
import { Card } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { ShieldAlert, Lock, Info } from 'lucide-react';
import { useAuth } from '@/core/auth/AuthContext';
import { getRoleDisplayName, getDepartmentDisplayName } from '@/shared/utils/rbac';

interface AccessDeniedProps {
    message?: string;
    reason?: string;
    showUserInfo?: boolean;
    variant?: 'full' | 'inline' | 'minimal';
}

/**
 * AccessDenied Component
 * 
 * Displays a user-friendly access denied message.
 * 
 * Usage:
 * ```tsx
 * <AccessDenied 
 *   message="You don't have permission to view this page"
 *   reason="This page is restricted to Super Administrators only"
 *   showUserInfo={true}
 * />
 * ```
 */
export const AccessDenied: React.FC<AccessDeniedProps> = ({
    message = 'Access Restricted',
    reason,
    showUserInfo = true,
    variant = 'full',
}) => {
    const { user } = useAuth();

    if (variant === 'minimal') {
        return (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Lock className="h-4 w-4" />
                <span>{message}</span>
            </div>
        );
    }

    if (variant === 'inline') {
        return (
            <div className="flex items-center gap-3 p-4 bg-muted/30 border border-muted rounded-lg">
                <Lock className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                    <p className="text-sm font-medium">{message}</p>
                    {reason && <p className="text-xs text-muted-foreground mt-1">{reason}</p>}
                </div>
            </div>
        );
    }

    return (
        <Card className="glass border-neon-red/50 overflow-hidden">
            <div className="p-8">
                {/* Icon and Title */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 rounded-full bg-neon-red/10 border border-neon-red/30">
                        <ShieldAlert className="h-8 w-8 text-neon-red" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">{message}</h2>
                        {reason && (
                            <p className="text-sm text-gray-400 mt-1">{reason}</p>
                        )}
                    </div>
                </div>

                {/* User Info */}
                {showUserInfo && user && (
                    <div className="bg-dark-card/50 border border-electric-blue/20 rounded-lg p-4 space-y-3">
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                            <Info className="h-4 w-4 text-electric-blue" />
                            <span className="font-medium">Your Current Access Level</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Role</p>
                                <Badge variant="outline" className="border-electric-blue/50 text-electric-blue">
                                    {getRoleDisplayName(user.role as any)}
                                </Badge>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500 mb-1">Department</p>
                                <Badge variant="outline" className="border-neon-purple/50 text-neon-purple">
                                    {getDepartmentDisplayName(user.department)}
                                </Badge>
                            </div>

                            {user.assignedZones && user.assignedZones.length > 0 && (
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Zones</p>
                                    <Badge variant="outline" className="border-neon-green/50 text-neon-green">
                                        {user.assignedZones.includes('all')
                                            ? 'All Zones'
                                            : `${user.assignedZones.length} Zone${user.assignedZones.length > 1 ? 's' : ''}`
                                        }
                                    </Badge>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Help Text */}
                <div className="mt-6 p-4 bg-dark-card/30 border border-gray-700 rounded-lg">
                    <p className="text-sm text-gray-400">
                        <strong className="text-white">Need access?</strong> Contact your system administrator or Super Admin to request the necessary permissions.
                    </p>
                </div>
            </div>
        </Card>
    );
};

export default AccessDenied;
