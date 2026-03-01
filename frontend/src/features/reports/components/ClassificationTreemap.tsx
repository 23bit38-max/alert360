import React from 'react';
import { Box } from 'lucide-react';
import {
    ResponsiveContainer,
    Treemap,
    Tooltip,
} from 'recharts';
import { Card } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { categoryData } from '@/features/reports/constants/analytics.constants';

const CustomTreemapContent = (props: any) => {
    const { x, y, width, height, name, color } = props;
    if (width < 30 || height < 20) return null;
    return (
        <g>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                style={{
                    fill: color,
                    fillOpacity: 0.2,
                    stroke: color,
                    strokeWidth: 2,
                    strokeOpacity: 0.5,
                }}
            />
            <text
                x={x + width / 2}
                y={y + height / 2}
                textAnchor="middle"
                fill="#fff"
                fontSize={10}
                fontWeight="900"
                className="uppercase tracking-tighter"
            >
                {name}
            </text>
        </g>
    );
};

export const ClassificationTreemap: React.FC = () => {
    return (
        <Card className="glass col-span-12 lg:col-span-8 rounded-3xl border-white/5 p-6 premium-shadow">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <Box size={16} className="text-primary" />
                    <h3 className="text-[11px] font-black text-white tracking-[0.2em] uppercase">Accident Type Classification Density</h3>
                </div>
                <Badge className="bg-primary/10 text-primary border-primary/20 text-[8px] font-black uppercase px-3 tracking-widest">Detection Stream Data</Badge>
            </div>
            <div className="h-[360px]">
                <ResponsiveContainer width="100%" height="100%">
                    <Treemap
                        data={categoryData}
                        dataKey="value"
                        content={<CustomTreemapContent />}
                    >
                        <Tooltip
                            contentStyle={{ backgroundColor: '#0B1220', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: 10 }}
                        />
                    </Treemap>
                </ResponsiveContainer>
            </div>
            <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-4 border-t border-white/5 pt-8">
                {categoryData.map(c => (
                    <div key={c.name} className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                            <span className="text-[9px] font-black text-white/50 uppercase tracking-widest">{c.name}</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-xl font-black text-white">{c.value}</span>
                            <span className="text-[8px] font-black text-white/20 uppercase">%</span>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};
