import React from 'react';
import { Shield } from 'lucide-react';
import {
    ResponsiveContainer,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Bar,
} from 'recharts';
import { Card } from '@/shared/components/ui/card';
import { severityTimeline } from '@/features/reports/constants/analytics.constants';

export const SeverityMatrix: React.FC = () => {
    return (
        <Card className="glass col-span-12 lg:col-span-8 rounded-3xl border-white/5 p-8 premium-shadow relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500/50 via-primary/50 to-orange-500/50" />
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <Shield size={16} className="text-primary" />
                    <h3 className="text-[11px] font-black text-white tracking-[0.2em] uppercase">Weekly Severity Distribution Matrix</h3>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500" /><span className="text-[9px] font-black text-white/40 uppercase tracking-tighter">Critical</span></div>
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-orange-400" /><span className="text-[9px] font-black text-white/40 uppercase tracking-tighter">High</span></div>
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-400" /><span className="text-[9px] font-black text-white/40 uppercase tracking-tighter">Medium</span></div>
                </div>
            </div>
            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={severityTimeline}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                        <XAxis dataKey="date" stroke="rgba(255,255,255,0.2)" fontSize={9} axisLine={false} tickLine={false} />
                        <YAxis stroke="rgba(255,255,255,0.2)" fontSize={9} axisLine={false} tickLine={false} />
                        <Tooltip
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                        />
                        <Bar dataKey="critical" stackId="a" fill="#EF4444" radius={[0, 0, 0, 0]} />
                        <Bar dataKey="high" stackId="a" fill="#F59E0B" />
                        <Bar dataKey="mid" stackId="a" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};
