
export const StatusDot = ({ label, active, color }: { label: string; active?: boolean; color: string }) => (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${active ? `bg-${color.replace('bg-', '')}/10 border-${color.replace('bg-', '')}/30 text-white` : 'bg-white/5 border-white/10 text-white/20'}`}>
        <div className={`w-1.5 h-1.5 rounded-full ${active ? `${color} animate-pulse shadow-[0_0_8px_rgba(0,0,0,0.5)]` : 'bg-white/10'}`} />
        <span className="text-[8px] font-black uppercase tracking-widest">{label}</span>
    </div>
);
