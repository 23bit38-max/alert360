import React from 'react';

export const SectionHeader = ({ title, icon }: { title: string; icon: React.ReactNode }) => (
    <div className="flex items-center gap-3 pb-3 border-b border-white/5">
        <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center">
            {icon}
        </div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70">{title}</h3>
    </div>
);
