import React from 'react';
import {
    AlertTriangle,
    Bell,
    Users,
    Camera
} from 'lucide-react';
import { useTheme } from '@/core/theme';

interface KPIGridProps {
    data: {
        totalAccidents: number;
        alertsSent: number;
        activeResponders: number;
        liveCameras: number;
    };
}

export const KPIGrid: React.FC<KPIGridProps> = ({ data }) => {
    const { colors } = useTheme();

    const QuickMetric = ({ title, value, change, icon: Icon, color }: any) => {
        const statusColor = color === 'red' ? '#EF4444' :
            color === 'blue' ? '#3B82F6' :
                color === 'green' ? colors.accent.primary :
                    colors.accent.primary;

        return (
            <div className="glass hover-lift premium-shadow group relative overflow-hidden p-6 rounded-[24px]">
                <div
                    className="absolute top-0 right-0 w-32 h-32 bg-current opacity-[0.03] rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"
                    style={{ color: statusColor }}
                />

                <div className="flex items-center justify-between mb-6 relative z-10">
                    <div
                        className="w-14 h-14 flex items-center justify-center rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-2xl"
                        style={{
                            backgroundColor: `${statusColor}15`,
                            color: statusColor,
                            border: `1px solid ${statusColor}30`
                        }}
                    >
                        <Icon size={28} strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase opacity-40">System Readiness</span>
                        <div className="flex items-center gap-2 mt-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/5">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            <span className="text-[9px] font-black text-primary tracking-widest">ACTIVE</span>
                        </div>
                    </div>
                </div>

                <div className="relative z-10">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-2 opacity-60">{title}</p>
                    <div className="flex items-baseline gap-4">
                        <h3 className="text-4xl font-black text-white tracking-tighter leading-none">{value}</h3>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                            <span className="text-[10px] font-black text-emerald-500">{change}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <QuickMetric title="Incidents Logged" value={data.totalAccidents} change="+2.4%" color="red" icon={AlertTriangle} />
            <QuickMetric title="Alerts Dispatched" value={data.alertsSent} change="+14.1%" color="blue" icon={Bell} />
            <QuickMetric title="Responding Units" value={data.activeResponders} change="ACTIVE" color="green" icon={Users} />
            <QuickMetric title="Live Visuals" value={data.liveCameras} change="ONLINE" color="blue" icon={Camera} />
        </div>
    );
};
