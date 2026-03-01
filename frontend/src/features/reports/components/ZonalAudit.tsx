import React from 'react';
import { MapPin } from 'lucide-react';
import {
    ResponsiveContainer,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Bar,
    Cell,
} from 'recharts';
import { Card } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { zonalData } from '@/features/reports/constants/analytics.constants';

export const ZonalAudit: React.FC = () => {
    return (
        <div className="grid grid-cols-12 gap-6 w-full">
            <Card className="glass col-span-12 lg:col-span-12 rounded-3xl border-white/5 p-6 premium-shadow flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none" />
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <MapPin size={16} className="text-blue-400" />
                        <h3 className="text-[11px] font-black text-white tracking-[0.2em] uppercase">Zonal Accident vs Resolution Distribution</h3>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-[9px] font-black text-white/40 uppercase">
                            <div className="w-3 h-3 rounded-full border border-white/10 bg-white/5" /> Accident Load
                        </div>
                        <Badge className="bg-primary/10 text-primary border-primary/20 text-[8px] font-black tracking-widest">REAL-TIME SECTOR AUDIT</Badge>
                    </div>
                </div>
                <div className="h-[320px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={zonalData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                            <XAxis dataKey="zone" stroke="rgba(255,255,255,0.4)" fontSize={10} fontWeight="900" axisLine={false} tickLine={false} />
                            <YAxis stroke="rgba(255,255,255,0.4)" fontSize={10} axisLine={false} tickLine={false} />
                            <Tooltip
                                cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                                contentStyle={{ backgroundColor: '#0B1220', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                            />
                            <Bar dataKey="accidents" radius={[6, 6, 0, 0]} barSize={48}>
                                {zonalData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} fillOpacity={0.8} />
                                ))}
                            </Bar>
                            <Bar dataKey="resolved" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" radius={[6, 6, 0, 0]} barSize={24} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
    );
};
