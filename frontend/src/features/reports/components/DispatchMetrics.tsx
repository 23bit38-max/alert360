import React from 'react';
import { Target } from 'lucide-react';
import {
    ResponsiveContainer,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    Radar,
    Tooltip,
} from 'recharts';
import { Card } from '@/shared/components/ui/card';
import { radarData } from '@/features/reports/constants/analytics.constants';

export const DispatchMetrics: React.FC = () => {
    return (
        <Card className="glass col-span-12 lg:col-span-4 rounded-3xl border-white/5 p-6 premium-shadow">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Target size={16} className="text-primary" />
                    <h3 className="text-[11px] font-black text-white tracking-[0.2em] uppercase">Notification Dispatch Metrics</h3>
                </div>
            </div>
            <div className="h-[320px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                        <PolarGrid stroke="rgba(255,255,255,0.05)" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 9, fontWeight: 'bold' }} />
                        <Radar name="Target Model" dataKey="A" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                        <Radar name="Threshold Baseline" dataKey="B" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
            <div className="mt-4 flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Highest Efficiency</span>
                    <span className="text-[10px] font-black text-primary uppercase">Voice Call</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Lowest Latency</span>
                    <span className="text-[10px] font-black text-blue-400 uppercase">On-Site Alarm</span>
                </div>
            </div>
        </Card>
    );
};
