import React from 'react';
import { Activity, Clock } from 'lucide-react';
import {
    ResponsiveContainer,
    ComposedChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Area,
    Line,
    ReferenceLine,
} from 'recharts';
import { Card } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { velocityData } from '@/features/reports/constants/analytics.constants';

interface OperationalTrendsProps {
    operatorActiveness: any[];
}

export const OperationalTrends: React.FC<OperationalTrendsProps> = ({ operatorActiveness }) => {
    return (
        <div className="grid grid-cols-12 gap-6">
            <Card className="glass col-span-12 lg:col-span-8 rounded-3xl border-white/5 p-6 premium-shadow">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Activity size={16} className="text-primary" />
                        <h3 className="text-[11px] font-black text-white tracking-[0.2em] uppercase">Detection vs. Verification Frequency</h3>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500" /><span className="text-[9px] font-black text-white/40 uppercase">Automated</span></div>
                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary" /><span className="text-[9px] font-black text-white/40 uppercase">Manual</span></div>
                    </div>
                </div>
                <div className="h-[320px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={velocityData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                            <XAxis dataKey="date" stroke="rgba(255,255,255,0.2)" fontSize={9} axisLine={false} tickLine={false} />
                            <YAxis stroke="rgba(255,255,255,0.2)" fontSize={9} axisLine={false} tickLine={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                itemStyle={{ fontSize: '10px', textTransform: 'uppercase' }}
                            />
                            <Area type="monotone" dataKey="incident" fill="rgba(239, 68, 68, 0.05)" stroke="#EF4444" strokeWidth={2} />
                            <Line type="monotone" dataKey="resolution" stroke="#10B981" strokeWidth={2} dot={{ r: 3, fill: '#10B981' }} />
                            {velocityData.filter(d => d.anomaly).map((d, i) => (
                                <ReferenceLine key={i} x={d.date} stroke="rgba(239, 68, 68, 0.3)" strokeDasharray="3 3" label={{ position: 'top', value: '⚠ ANOMALY', fill: '#EF4444', fontSize: 8, fontWeight: 'black' }} />
                            ))}
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <Card className="glass col-span-12 lg:col-span-4 rounded-3xl border-white/5 p-6 premium-shadow flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <Clock size={16} className="text-orange-400" />
                        <h3 className="text-[11px] font-black text-white tracking-[0.2em] uppercase">Operator Activity</h3>
                    </div>
                    <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/20 text-[8px] font-black uppercase">Responder Readiness</Badge>
                </div>
                <div className="flex-1 grid grid-cols-7 gap-1.5 p-2">
                    {operatorActiveness.map((item) => (
                        <div
                            key={item.day}
                            className="aspect-square rounded-[4px] relative group"
                            style={{
                                backgroundColor: `rgba(16, 185, 129, ${item.value / 100})`,
                                border: item.value > 80 ? '1px solid rgba(16, 185, 129, 0.5)' : 'none'
                            }}
                        >
                            <div className="absolute opacity-0 group-hover:opacity-100 bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-[8px] font-black text-white rounded border border-white/10 z-10 pointer-events-none whitespace-nowrap">
                                {item.month} {item.day}: {item.value}% ACTIVITY
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Heatmap Intensity</span>
                    <div className="flex gap-1">
                        {[0.2, 0.4, 0.6, 0.8, 1].map(v => (
                            <div key={v} className="w-2.5 h-2.5 rounded-[2px]" style={{ backgroundColor: `rgba(16, 185, 129, ${v})` }} />
                        ))}
                    </div>
                </div>
            </Card>
        </div>
    );
};
