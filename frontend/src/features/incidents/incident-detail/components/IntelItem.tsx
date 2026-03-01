import React from 'react';

export const IntelItem = ({ label, val, icon, color, className = "" }: { label: string; val: string | number; icon?: React.ReactNode; color?: string; className?: string }) => (
    <div className={`p-4 rounded-2xl bg-white/[0.02] border border-white/5 transition-all hover:bg-white/[0.04] space-y-1.5 ${className}`}>
        <div className="flex items-center gap-2">
            {icon && icon}
            <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">{label}</span>
        </div>
        <p className={`text-[11px] font-black uppercase tracking-widest ${color || 'text-white/80'}`}>{val}</p>
    </div>
);
