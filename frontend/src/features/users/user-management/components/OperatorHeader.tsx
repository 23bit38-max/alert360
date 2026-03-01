import { Shield, Plus } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';

interface OperatorHeaderProps {
    totalUsers: number;
    activeSessions: number;
}

export const OperatorHeader: React.FC<OperatorHeaderProps> = ({ totalUsers, activeSessions }) => {
    return (
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5 shrink-0">
            <div className="flex items-center gap-8">
                <div className="flex items-center gap-3 px-4 py-2 bg-primary/5 border border-primary/20 rounded-2xl">
                    <Shield size={16} className="text-primary" />
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-white uppercase tracking-[0.25em]">Personnel Matrix Control</span>
                        <span className="text-[9px] font-bold text-primary uppercase tracking-[0.1em]">Level 4 Super Admin Terminal</span>
                    </div>
                </div>
                <div className="h-8 w-[1px] bg-white/10" />
                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Active Operators</span>
                        <span className="text-sm font-black text-white">{totalUsers}</span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Active Sessions</span>
                        <span className="text-sm font-black text-primary">{activeSessions}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-1 text-[9px] font-black tracking-[0.2em] uppercase rounded-lg">
                    Operational Integrity Verified
                </Badge>
                <Button className="h-10 px-6 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-[0_8px_15px_rgba(16,185,129,0.25)] hover:scale-[1.02] transition-all flex items-center gap-2">
                    <Plus size={14} /> Add New Operator
                </Button>
            </div>
        </div>
    );
};
