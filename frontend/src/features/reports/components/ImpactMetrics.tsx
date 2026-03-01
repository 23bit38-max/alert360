import React from 'react';
import { Heart } from 'lucide-react';
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
} from 'recharts';
import { Card } from '@/shared/components/ui/card';
import { casualtyData } from '@/features/reports/constants/analytics.constants';

export const ImpactMetrics: React.FC = () => {
    return (
        <Card className="glass col-span-12 lg:col-span-5 rounded-3xl border-white/5 p-6 premium-shadow flex flex-col">
            <div className="flex items-center gap-3 mb-6">
                <Heart size={16} className="text-red-400" />
                <h3 className="text-[11px] font-black text-white tracking-[0.2em] uppercase">Casualty & Severity Metrics</h3>
            </div>
            <div className="h-[250px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={casualtyData}
                            innerRadius={65}
                            outerRadius={85}
                            paddingAngle={8}
                            dataKey="value"
                            stroke="none"
                        >
                            {casualtyData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} className="hover:opacity-80 transition-opacity outline-none" />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ backgroundColor: '#0B1220', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: 10 }}
                        />
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-black text-white">145</span>
                    <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Total Impacted</span>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6 border-t border-white/5 pt-6">
                {casualtyData.map((item) => (
                    <div key={item.name} className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.fill }} />
                            <span className="text-[9px] font-black text-white/40 uppercase tracking-tighter">{item.name}</span>
                        </div>
                        <span className="text-sm font-black text-white ml-3.5">{item.value} <span className="text-[9px] text-white/20">CASES</span></span>
                    </div>
                ))}
            </div>
        </Card>
    );
};
