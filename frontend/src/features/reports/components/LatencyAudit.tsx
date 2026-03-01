import React from 'react';
import { Bell } from 'lucide-react';
import {
    ResponsiveContainer,
    BarChart,
    XAxis,
    YAxis,
    Tooltip,
    Bar,
    Cell,
    ReferenceLine,
} from 'recharts';
import { Card } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { notificationLatency } from '@/features/reports/constants/analytics.constants';

export const LatencyAudit: React.FC = () => {
    return (
        <Card className="glass col-span-12 lg:col-span-4 rounded-3xl border-white/5 p-6 premium-shadow flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Bell size={16} className="text-orange-400" />
                    <h3 className="text-[11px] font-black text-white tracking-[0.2em] uppercase">Dispatch Latency</h3>
                </div>
                <Badge variant="outline" className="text-[8px] border-white/10 text-white/40 font-black tracking-widest uppercase px-3 py-1">milli-seconds / ms</Badge>
            </div>
            <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={notificationLatency}>
                        <XAxis dataKey="channel" hide />
                        <YAxis hide domain={[0, 2000]} />
                        <Tooltip
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            contentStyle={{ backgroundColor: '#0B1220', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                        />
                        <Bar dataKey="latency" radius={[6, 6, 0, 0]} barSize={26}>
                            {notificationLatency.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.latency > entry.target ? '#EF4444' : '#10B981'} fillOpacity={0.7} />
                            ))}
                        </Bar>
                        <ReferenceLine y={500} stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3" />
                    </BarChart>
                </ResponsiveContainer>
                <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3">
                    {notificationLatency.slice(0, 4).map(n => (
                        <div key={n.channel} className="flex items-center justify-between border-b border-white/5 pb-1.5">
                            <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">{n.channel}</span>
                            <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-mono font-black ${n.latency > n.target ? 'text-red-400' : 'text-primary'}`}>{n.latency}</span>
                                <span className="text-[8px] text-white/40">ms</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
};
