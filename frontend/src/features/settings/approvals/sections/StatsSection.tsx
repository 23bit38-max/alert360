import { Users, Camera, Clock, ShieldAlert } from 'lucide-react';
import { ApprovalStatsCard } from '@/features/settings/approvals/components/ApprovalStatsCard';
import { PENDING_USER_APPROVALS, PENDING_CAMERA_APPROVALS } from '@/data/data';

export const StatsSection = () => {
    const userStats = {
        pending: PENDING_USER_APPROVALS.filter(req => req.status === 'pending').length,
        total: PENDING_USER_APPROVALS.length
    };

    const cameraStats = {
        pending: PENDING_CAMERA_APPROVALS.filter(req => req.status === 'pending').length,
        total: PENDING_CAMERA_APPROVALS.length
    };

    const totalReview = PENDING_USER_APPROVALS.filter(req => (req.status as string) === 'under_review').length +
        PENDING_CAMERA_APPROVALS.filter(req => (req.status as string) === 'under_review').length;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <ApprovalStatsCard
                label="Personnel Requests"
                value={userStats.pending}
                total={userStats.total}
                trend="+12%"
                icon={Users}
                color="primary"
                description="Pending authorization"
            />
            <ApprovalStatsCard
                label="Node Deployments"
                value={cameraStats.pending}
                total={cameraStats.total}
                trend="+5%"
                icon={Camera}
                color="blue"
                description="Technical validation"
            />
            <ApprovalStatsCard
                label="Active Reviews"
                value={totalReview}
                total={userStats.total + cameraStats.total}
                icon={Clock}
                color="amber"
                description="Under evaluation"
            />
            <ApprovalStatsCard
                label="Escalations"
                value={0}
                total={0}
                icon={ShieldAlert}
                color="rose"
                description="Requires priority"
            />
        </div>
    );
};
