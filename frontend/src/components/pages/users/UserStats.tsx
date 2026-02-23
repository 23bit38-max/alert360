import { Card, CardContent } from '../../ui/card';
import { Users, Shield, Activity, Clock } from 'lucide-react';

interface UserStatsProps {
  users: any[];
}

export const UserStats = ({ users }: UserStatsProps) => {
  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    admins: users.filter(u => u.role.includes('admin')).length,
    recentLogins: users.filter(u => 
      new Date().getTime() - u.lastLogin.getTime() < 24 * 60 * 60 * 1000
    ).length
  };

  const StatCard = ({ title, value, subtitle, icon: Icon, color }: any) => (
    <Card className="glass border-glass-border">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
            {subtitle && (
              <p className="text-xs text-gray-400">{subtitle}</p>
            )}
          </div>
          <Icon className={`w-8 h-8 ${color}`} />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Users"
        value={stats.total}
        subtitle="All registered users"
        icon={Users}
        color="text-blue-400"
      />
      <StatCard
        title="Active Users"
        value={stats.active}
        subtitle={`${((stats.active / stats.total) * 100).toFixed(1)}% of total`}
        icon={Activity}
        color="text-green-400"
      />
      <StatCard
        title="Administrators"
        value={stats.admins}
        subtitle="Admin role users"
        icon={Shield}
        color="text-purple-400"
      />
      <StatCard
        title="Recent Logins"
        value={stats.recentLogins}
        subtitle="Last 24 hours"
        icon={Clock}
        color="text-yellow-400"
      />
    </div>
  );
};