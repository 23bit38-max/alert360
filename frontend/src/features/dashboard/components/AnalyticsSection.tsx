import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    BarChart,
    Bar,
    Cell
} from 'recharts';
import { motion } from 'framer-motion';
import { Cpu } from 'lucide-react';
import { useTheme } from '@/core/theme';

interface AnalyticsSectionProps {
    accidentTrend: any[];
    departmentBreakdown: any;
    responseTime: any[];
}

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({
    accidentTrend,
    departmentBreakdown,
    responseTime
}) => {
    const { colors } = useTheme();

    return (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            <Card className="xl:col-span-8 glass border-white/5 rounded-[40px] overflow-hidden p-10 shadow-2xl relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none -mr-48 -mt-48" />

                <CardHeader className="flex flex-row items-start justify-between pb-12 px-0 pt-0">
                    <div>
                        <CardTitle className="text-3xl font-black tracking-tight text-white uppercase italic">Temporal Incident Density</CardTitle>
                        <CardDescription className="text-xs font-bold text-muted-foreground mt-2 uppercase tracking-[0.3em] opacity-40">
                            24-Hour Detection Frequency Matrix
                        </CardDescription>
                    </div>
                    <div className="flex gap-3">
                        <Badge className="bg-primary/10 text-primary border border-primary/20 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-xl">
                            Detections
                        </Badge>
                        <Badge variant="outline" className="border-white/10 text-muted-foreground opacity-30 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-xl">
                            Classification
                        </Badge>
                    </div>
                </CardHeader>

                <div className="h-[420px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={accidentTrend}>
                            <defs>
                                <linearGradient id="colorAccidents" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={colors.accent.primary} stopOpacity={0.4} />
                                    <stop offset="95%" stopColor={colors.accent.primary} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                            <XAxis
                                dataKey="time"
                                stroke="rgba(255,255,255,0.2)"
                                fontSize={10}
                                fontWeight="black"
                                axisLine={false}
                                tickLine={false}
                                dy={15}
                            />
                            <YAxis
                                stroke="rgba(255,255,255,0.2)"
                                fontSize={10}
                                fontWeight="black"
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#0B1220',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '24px',
                                    boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
                                    padding: '16px'
                                }}
                                itemStyle={{ color: colors.accent.primary, fontWeight: 'black', fontSize: '11px', textTransform: 'uppercase' }}
                                labelStyle={{ color: 'rgba(255,255,255,0.4)', fontWeight: 'bold', fontSize: '9px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="accidents"
                                stroke={colors.accent.primary}
                                strokeWidth={5}
                                fillOpacity={1}
                                fill="url(#colorAccidents)"
                                animationDuration={2500}
                                activeDot={{ r: 8, stroke: '#0B1220', strokeWidth: 4, fill: colors.accent.primary }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <div className="xl:col-span-4 space-y-8">
                <Card className="glass border-white/5 rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-full bg-primary/5 -mr-12 skew-x-12 pointer-events-none" />
                    <CardHeader className="pb-8 px-0 pt-0">
                        <CardTitle className="text-xs font-black uppercase tracking-[0.4em] text-primary">Emergency Service Allocation</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-10 px-0">
                        {Object.entries(departmentBreakdown).map(([dept, data]: [string, any]) => (
                            <div key={dept} className="group">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2.5 h-2.5 rounded-full ${dept === 'police' ? 'bg-blue-500 shadow-[0_0_10px_#3B82F6]' : dept === 'fire' ? 'bg-red-500 shadow-[0_0_10px_#EF4444]' : 'bg-primary shadow-[0_0_10px_#10B981]'} transition-all group-hover:scale-125`} />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 group-hover:text-white transition-colors">
                                            {dept} RESPONDERS
                                        </span>
                                    </div>
                                    <span className="text-sm font-black text-white">{data.responders} Units</span>
                                </div>
                                <div className="h-2 w-full bg-white/[0.03] rounded-full overflow-hidden border border-white/5">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(100, (data.responders / 15) * 100)}%` }}
                                        transition={{ duration: 1.5, ease: "circOut" }}
                                        className={`h-full rounded-full ${dept === 'police' ? 'bg-blue-500' : dept === 'fire' ? 'bg-red-500' : 'bg-primary'} opacity-70 group-hover:opacity-100 transition-opacity`}
                                    />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="glass border-white/5 rounded-[32px] overflow-hidden p-8 relative shadow-2xl">
                    <div className="absolute -top-4 -right-4 p-8 opacity-5 text-primary">
                        <Cpu size={80} />
                    </div>
                    <CardHeader className="pb-6 px-0 pt-0">
                        <CardTitle className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-40">Detection & Dispatch Latency</CardTitle>
                    </CardHeader>
                    <CardContent className="px-0">
                        <div className="h-[220px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={responseTime}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                                    <XAxis
                                        dataKey="zone"
                                        stroke="rgba(255,255,255,0.2)"
                                        fontSize={9}
                                        fontWeight="black"
                                        axisLine={false}
                                        tickLine={false}
                                        tickFormatter={(val) => val.split(' ')[0]}
                                    />
                                    <Bar dataKey="avgTime" radius={[8, 8, 2, 2]} barSize={24}>
                                        {responseTime.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.avgTime > entry.target ? '#EF4444' : colors.accent.primary}
                                                className="opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
