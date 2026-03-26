import React from 'react';

export const IntelItem = ({ label, val, icon, color, className = "" }: { label: string; val: string | number; icon?: React.ReactNode; color?: string; className?: string }) => (
    <div className={`group/intel p-5 rounded-[2rem] bg-white/[0.02] border border-white/5 transition-all hover:bg-white/[0.05] hover:border-white/10 space-y-3 relative overflow-hidden ${className}`}>
        <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 blur-2xl rounded-full opacity-0 group-hover/intel:opacity-100 transition-opacity" />
        <div className="flex items-center gap-2.5 relative z-10">
            <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-white/20 group-hover/intel:text-primary/60 transition-colors">
                {icon}
            </div>
            <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">{label}</span>
        </div>
        <p className={`text-[13px] font-black uppercase tracking-widest relative z-10 transition-transform group-hover/intel:translate-x-1 ${color || 'text-white/80'}`}>
            {val || 'N/A'}
        </p>
    </div>
);
