import React from 'react';
import { CheckCircle, Clock, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { resolutionMetrics } from '@/features/reports/constants/analytics.constants';

export const EfficiencyAnalysis: React.FC = () => {
    return (
        <Card className="glass col-span-12 lg:col-span-7 rounded-3xl border-white/5 p-8 premium-shadow flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <CheckCircle size={16} className="text-primary" />
                    <h3 className="text-[11px] font-black text-white tracking-[0.2em] uppercase">Resolution Efficiency Analysis</h3>
                </div>
                <div className="text-right">
                    <p className="text-[20px] font-black text-white tracking-tighter">92.4%</p>
                    <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Average Clearance Rate</p>
                </div>
            </div>
            <div className="space-y-8 flex-1 flex flex-col justify-center">
                {resolutionMetrics.map((item) => (
                    <div key={item.name} className="space-y-3">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                            <div className="flex items-center gap-3">
                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.fill }} />
                                <span className="text-white/60">{item.name}</span>
                            </div>
                            <span className="text-white">{item.value} EVENTS</span>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-[1px] border border-white/5">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(item.value / 489) * 100}%` }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="h-full rounded-full"
                                style={{ backgroundColor: item.fill, boxShadow: `0 0 10px ${item.fill}40` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-8 pt-8 border-t border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                        <span className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Avg Close Time</span>
                        <div className="flex items-center gap-2">
                            <Clock size={12} className="text-primary" />
                            <span className="text-sm font-black text-white">12.4m</span>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Peak Response</span>
                        <div className="flex items-center gap-2">
                            <TrendingDown size={12} className="text-orange-400" />
                            <span className="text-sm font-black text-white">4.2m</span>
                        </div>
                    </div>
                </div>
                <Badge className="bg-primary/10 text-primary border-primary/20 text-[9px] font-black py-1.5 px-4 rounded-xl">OPTIMAL RANGE VALIDATED</Badge>
            </div>
        </Card>
    );
};
