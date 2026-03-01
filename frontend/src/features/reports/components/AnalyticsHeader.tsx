import React from 'react';
import { RefreshCw, Clock } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';

interface AnalyticsHeaderProps {
    onRefresh: () => void;
}

export const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({ onRefresh }) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
            <div className="space-y-1">
                <div className="flex items-center gap-2">
                </div>
            </div>
            <div className="flex items-center gap-3">
                <div className="hidden lg:flex flex-col items-end mr-4">
                    <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">System Status</span>
                    <span className="text-[10px] font-black text-primary uppercase">All Nodes Operational</span>
                </div>
                <button
                    onClick={onRefresh}
                    className="h-10 w-10 glass rounded-xl border-white/10 flex items-center justify-center hover:bg-white/5 transition-all text-white/60 hover:text-white"
                >
                    <RefreshCw size={16} />
                </button>
                <Badge className="h-10 px-4 glass border-white/10 text-white/80 font-black uppercase text-[10px] tracking-widest flex items-center gap-2">
                    <Clock size={12} className="text-primary" /> Live Feed Synced
                </Badge>
            </div>
        </div>
    );
};
