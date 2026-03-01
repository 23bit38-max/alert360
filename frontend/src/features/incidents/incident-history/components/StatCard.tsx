import { Card, CardContent } from '@/shared/components/ui/card';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const StatCard = ({ icon: Icon, label, value, trend, color, colors, GlobalStyles, typography }: any) => (
    <Card style={{ ...GlobalStyles.card, position: 'relative', overflow: 'hidden' }}>
        <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100px',
            height: '100px',
            background: `radial-gradient(circle at top right, ${color}15, transparent 70%)`,
            borderRadius: '50%'
        }} />
        <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
                <div style={{ color: color }}>
                    <Icon size={20} />
                </div>
                {trend && (
                    <div className="flex items-center gap-1" style={{ color: trend > 0 ? colors.status.critical.main : colors.status.safe.main }}>
                        {trend > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        <span style={{ fontSize: '10px', fontWeight: 600 }}>{Math.abs(trend)}%</span>
                    </div>
                )}
            </div>
            <p style={{ ...typography.caption, fontSize: '10px', marginBottom: '2px' }}>{label}</p>
            <p style={{ ...typography.h2, fontSize: '24px', lineHeight: 1.2 }}>{value}</p>
        </CardContent>
    </Card>
);
