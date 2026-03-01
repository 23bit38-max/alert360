import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';

interface ApprovalStatsCardProps {
    label: string;
    value: string | number;
    total?: number;
    icon: LucideIcon;
    color: string;
    trend?: string;
    description: string;
}

export const ApprovalStatsCard: React.FC<ApprovalStatsCardProps> = ({
    label,
    value,
    total,
    icon: Icon,
    color,
    trend,
    description
}) => {
    return (
        <Card className="glass border-white/5 rounded-[24px] premium-shadow group hover:bg-white/5 transition-all overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full -mr-16 -mt-16 opacity-20 group-hover:opacity-40 transition-opacity" />
            <CardContent className="p-6 relative">
                <div className="flex items-start justify-between mb-4">
                    <div
                        className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                        style={{ color }}
                    >
                        <Icon size={24} />
                    </div>
                    {trend && (
                        <div className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: color }} />
                            <span className="text-[9px] font-black uppercase tracking-widest text-[#888]">{trend}</span>
                        </div>
                    )}
                </div>
                <div>
                    <div className="flex items-baseline gap-2 mb-2">
                        <div className="text-4xl font-black text-white tracking-tighter leading-none">{value}</div>
                        {total !== undefined && (
                            <div className="text-sm font-black text-white/30 tracking-tighter">/ {total}</div>
                        )}
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">{label}</div>
                    <p className="text-[9px] font-medium text-zinc-500 leading-relaxed uppercase tracking-tight">
                        {description}
                    </p>
                </div>
            </CardContent>
            <div className="absolute bottom-0 left-0 w-full h-[2px] opacity-20" style={{ backgroundColor: color }} />
        </Card>
    );
};
