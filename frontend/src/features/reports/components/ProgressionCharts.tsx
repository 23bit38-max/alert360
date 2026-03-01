import React from 'react';
import { Activity } from 'lucide-react';
import {
    ResponsiveContainer,
    AreaChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Area,
} from 'recharts';
import { Card } from '@/shared/components/ui/card';
import { zonalTrendData } from '@/features/reports/constants/analytics.constants';

export const ProgressionCharts: React.FC = () => {
    return (
        <Card className="glass col-span-12 lg:col-span-8 rounded-3xl border-white/5 p-6 premium-shadow">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Activity size={16} className="text-primary" />
                    <h3 className="text-[11px] font-black text-white tracking-[0.2em] uppercase">Weekly Zonal Accident Progression</h3>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#3B82F6]" /><span className="text-[8px] font-black text-white/40 uppercase">North</span></div>
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#8B5CF6]" /><span className="text-[8px] font-black text-white/40 uppercase">Central Hub</span></div>
                </div>
            </div>
            <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={zonalTrendData}>
                        <defs>
                            <linearGradient id="colorNorth" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorCentral" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                        <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={9} axisLine={false} tickLine={false} />
                        <YAxis stroke="rgba(255,255,255,0.2)" fontSize={9} axisLine={false} tickLine={false} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#0B1220', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                        />
                        <Area type="monotone" dataKey="north" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorNorth)" />
                        <Area type="monotone" dataKey="central" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorCentral)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};
