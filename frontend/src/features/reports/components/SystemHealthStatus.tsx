import React from 'react';
import { Monitor } from 'lucide-react';
import { Card } from '@/shared/components/ui/card';
import { systemHealth } from '@/features/reports/constants/analytics.constants';

export const SystemHealthStatus: React.FC = () => {
    return (
        <div className="col-span-12 lg:col-span-4 grid grid-rows-3 gap-6">
            {systemHealth.map((item, i) => (
                <Card key={i} className="glass rounded-3xl border-white/5 p-6 premium-shadow flex items-center justify-between group hover:bg-white/[0.03] transition-all">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Monitor size={20} style={{ color: item.color }} />
                        </div>
                        <div>
                            <h4 className="text-[10px] font-black text-white/30 uppercase tracking-widest">{item.name}</h4>
                            <p className="text-xl font-black text-white tracking-tighter">{item.value}% <span className="text-[10px] text-white/10 uppercase tracking-widest">Uptime</span></p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="h-2 w-24 bg-white/5 rounded-full overflow-hidden mb-2">
                            <div className="h-full rounded-full" style={{ width: `${item.value}%`, backgroundColor: item.color }} />
                        </div>
                        <span className="text-[8px] font-black uppercase tracking-widest" style={{ color: item.color }}>{item.status}</span>
                    </div>
                </Card>
            ))}
        </div>
    );
};
