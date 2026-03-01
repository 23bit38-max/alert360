import { TrendingUp, PieChart as PieChartIcon, Clock, Activity } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card';
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { responseTimeByType } from '@/features/incidents/incident-history/constants/incidentHistory.constants';

interface HistoryAnalyticsProps {
    analytics: any;
    colors: any;
    GlobalStyles: any;
    typography: any;
}

export const HistoryAnalytics = ({
    analytics,
    colors,
    GlobalStyles,
    typography
}: HistoryAnalyticsProps) => (
    <div className="space-y-4">
        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card style={GlobalStyles.card}>
                <CardHeader className="pb-2">
                    <CardTitle style={{ ...typography.label, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <TrendingUp size={14} color={colors.accent.primary} />
                        INCIDENT TRENDS (7 DAYS)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div style={{ height: '200px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={analytics.incidentTrends}>
                                <defs>
                                    <linearGradient id="colorCollisions" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={colors.status.warning.main} stopOpacity={0.3} />
                                        <stop offset="95%" stopColor={colors.status.warning.main} stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorFires" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={colors.status.critical.main} stopOpacity={0.3} />
                                        <stop offset="95%" stopColor={colors.status.critical.main} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke={colors.background.border} />
                                <XAxis dataKey="date" stroke={colors.text.muted} fontSize={10} />
                                <YAxis stroke={colors.text.muted} fontSize={10} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: colors.background.elevated,
                                        border: `1px solid ${colors.background.border}`,
                                        borderRadius: '8px'
                                    }}
                                />
                                <Area type="monotone" dataKey="collisions" stroke={colors.status.warning.main} fill="url(#colorCollisions)" />
                                <Area type="monotone" dataKey="fires" stroke={colors.status.critical.main} fill="url(#colorFires)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <Card style={GlobalStyles.card}>
                <CardHeader className="pb-2">
                    <CardTitle style={{ ...typography.label, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <PieChartIcon size={14} color={colors.accent.primary} />
                        SEVERITY DISTRIBUTION
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div style={{ height: '200px', display: 'flex', alignItems: 'center', position: 'relative' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={analytics.severityDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {analytics.severityDistribution.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: colors.background.elevated,
                                        border: `1px solid ${colors.background.border}`,
                                        borderRadius: '8px'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-center">
                                <p style={{ ...typography.h3, fontSize: '24px' }}>{analytics.totalIncidents}</p>
                                <p style={typography.caption}>Total</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card style={GlobalStyles.card}>
                <CardHeader className="pb-2">
                    <CardTitle style={{ ...typography.label, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Clock size={14} color={colors.accent.primary} />
                        RESPONSE TIME BY INCIDENT TYPE
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div style={{ height: '200px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={responseTimeByType}>
                                <CartesianGrid strokeDasharray="3 3" stroke={colors.background.border} />
                                <XAxis dataKey="type" stroke={colors.text.muted} fontSize={10} />
                                <YAxis stroke={colors.text.muted} fontSize={10} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: colors.background.elevated,
                                        border: `1px solid ${colors.background.border}`,
                                        borderRadius: '8px'
                                    }}
                                />
                                <Bar dataKey="time" fill={colors.accent.primary} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <Card style={GlobalStyles.card}>
                <CardHeader className="pb-2">
                    <CardTitle style={{ ...typography.label, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Activity size={14} color={colors.accent.primary} />
                        PERFORMANCE METRICS
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[
                            { label: 'Avg Response Time', value: '3.8 min', target: '< 5 min', progress: 76 },
                            { label: 'Resolution Rate', value: '94%', target: '> 90%', progress: 94 },
                            { label: 'Accuracy Score', value: '97%', target: '> 95%', progress: 97 },
                        ].map((metric, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-center mb-1">
                                    <span style={typography.caption}>{metric.label}</span>
                                    <span style={{ ...typography.body, fontWeight: 600 }}>{metric.value}</span>
                                </div>
                                <div style={{ height: '4px', backgroundColor: colors.background.border, borderRadius: '2px', overflow: 'hidden' }}>
                                    <div style={{
                                        width: `${metric.progress}%`,
                                        height: '100%',
                                        backgroundColor: metric.progress >= 90 ? colors.status.safe.main : colors.status.warning.main,
                                        borderRadius: '2px'
                                    }} />
                                </div>
                                <p style={{ ...typography.caption, fontSize: '8px', marginTop: '2px' }}>Target: {metric.target}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
);
