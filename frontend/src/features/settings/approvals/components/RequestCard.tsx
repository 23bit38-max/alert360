import React from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import type { LucideIcon } from 'lucide-react';
import { Eye, Clock, AlertCircle } from 'lucide-react';
import type { UrgencyLevel, ApprovalStatus } from '@/features/settings/approvals/types/index';

interface RequestCardProps {
    id: string;
    title: string;
    subtitle: string;
    status: ApprovalStatus;
    urgency: UrgencyLevel;
    timestamp: string | Date;
    department: string;
    icon: LucideIcon;
    onView: () => void;
    metadata: {
        label: string;
        value: string | number;
        icon: LucideIcon;
    }[];
}

export const RequestCard: React.FC<RequestCardProps> = ({
    title,
    subtitle,
    status,
    urgency,
    timestamp,
    department,
    icon: Icon,
    onView,
    metadata
}) => {
    const getStatusColor = (s: ApprovalStatus) => {
        switch (s) {
            case 'approved': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
            case 'rejected': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
            case 'under_review': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
            default: return 'text-primary bg-primary/10 border-primary/20';
        }
    };

    const getUrgencyColor = (u: UrgencyLevel) => {
        switch (u) {
            case 'critical': return 'bg-rose-500';
            case 'high': return 'bg-amber-600';
            case 'medium': return 'bg-blue-500';
            default: return 'bg-zinc-600';
        }
    };

    return (
        <Card className="glass border-white/5 rounded-[32px] overflow-hidden premium-shadow group hover:bg-white/[0.03] transition-all">
            <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-white/5">
                    {/* Left: Essential Info */}
                    <div className="p-8 lg:w-1/3 bg-gradient-to-br from-white/[0.02] to-transparent">
                        <div className="flex items-start justify-between mb-6">
                            <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-primary transition-colors shadow-2xl">
                                <Icon size={32} />
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <Badge className={`${getStatusColor(status)} text-[9px] font-black uppercase tracking-widest border px-2.5 py-1 rounded-lg`}>
                                    {status.replace('_', ' ')}
                                </Badge>
                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/5 border border-white/10">
                                    <div className={`w-1.5 h-1.5 rounded-full ${getUrgencyColor(urgency)} shadow-[0_0_8px_rgba(255,255,255,0.3)]`} />
                                    <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">{urgency}</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-white tracking-tighter uppercase mb-2 group-hover:text-primary transition-colors">
                                {title}
                            </h3>
                            <p className="text-xs font-bold text-zinc-500 tracking-tight mb-4">{subtitle}</p>
                            <div className="flex items-center gap-2 text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                                <Clock size={12} /> {new Date(timestamp).toLocaleString()}
                            </div>
                        </div>
                    </div>

                    {/* Middle: Secondary Metadata Matrix */}
                    <div className="p-8 flex-1 grid grid-cols-2 gap-6 bg-black/20">
                        {metadata.map((item, i) => (
                            <div key={i} className="space-y-1.5">
                                <div className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <item.icon size={10} className="text-primary/50" /> {item.label}
                                </div>
                                <div className="text-[11px] font-bold text-zinc-200 uppercase truncate">
                                    {item.value}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right: Operational Actions */}
                    <div className="p-8 lg:w-64 flex flex-col justify-between gap-6 bg-white/[0.01]">
                        <div className="space-y-1">
                            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em]">Operational Unit</span>
                            <div className="text-sm font-black text-white tracking-tight flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-primary" />
                                {department}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Button
                                onClick={onView}
                                className="w-full h-12 rounded-xl bg-white/5 hover:bg-primary hover:text-white border border-white/10 text-[10px] font-black uppercase tracking-widest transition-all gap-2"
                            >
                                <Eye size={14} /> View Details
                            </Button>
                            <Button variant="ghost" className="w-full text-[9px] font-black text-zinc-500 hover:text-rose-500 tracking-widest uppercase">
                                <AlertCircle size={12} className="mr-2" /> Report Issue
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
