import { FileText, Bookmark, MoreVertical, MapPin, ChevronRight, Camera, Clock, Eye } from 'lucide-react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/shared/components/ui/table';
import { StatusBadge, TypeBadge, SeverityBadge } from '@/features/incidents/incident-history/components/HistoryBadges';
import type { Alert } from '@/features/incidents/incident-history/types/incidentHistory.types';

interface HistoryTableProps {
    filteredIncidents: Alert[];
    analytics: any;
    colors: any;
    typography: any;
    GlobalStyles: any;
    setSelectedIncident: (id: string) => void;
}

export const HistoryTable = ({
    filteredIncidents,
    analytics,
    colors,
    typography,
    GlobalStyles,
    setSelectedIncident
}: HistoryTableProps) => (
    <Card style={{ ...GlobalStyles.card, padding: 0 }}>
        <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: colors.background.border }}>
            <div className="flex items-center gap-2">
                <FileText size={14} color={colors.accent.primary} />
                <span style={typography.label}>INCIDENT LOGS ({filteredIncidents.length})</span>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                    <Bookmark size={14} className="mr-2" /> Save View
                </Button>
                <Button variant="ghost" size="sm">
                    <MoreVertical size={14} />
                </Button>
            </div>
        </div>
        <ScrollArea className="h-[calc(100vh-250px)] lg:h-[calc(100vh-550px)]">
            <div className="block lg:hidden p-4 space-y-4">
                {filteredIncidents.map((incident) => (
                    <div
                        key={incident.id}
                        className="p-5 rounded-[1.5rem] glass border-white/5 space-y-4"
                        onClick={() => setSelectedIncident(incident.id)}
                    >
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <p className="text-sm font-black text-white">{incident.title}</p>
                                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                                    <MapPin size={10} className="text-primary" /> {incident.location}
                                </p>
                            </div>
                            <SeverityBadge severity={incident.type} colors={colors} />
                        </div>

                        <div className="flex items-center justify-between py-3 border-y border-white/5">
                            <div className="flex flex-col gap-1">
                                <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Time</span>
                                <span className="text-[10px] font-bold">{incident.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div className="flex flex-col gap-1 items-end">
                                <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Status</span>
                                <StatusBadge status={incident.status} colors={colors} />
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <TypeBadge type={incident.incidentType} colors={colors} accent={colors.accent} />
                            <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase text-primary">
                                Details <ChevronRight size={14} className="ml-1" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <Table className="hidden lg:table">
                <TableHeader style={{ backgroundColor: colors.background.elevated }}>
                    <TableRow style={{ borderColor: colors.background.border }}>
                        <TableHead style={typography.label}>INCIDENT</TableHead>
                        <TableHead style={typography.label}>TYPE</TableHead>
                        <TableHead style={typography.label}>LOCATION</TableHead>
                        <TableHead style={typography.label}>SEVERITY</TableHead>
                        <TableHead style={typography.label}>STATUS</TableHead>
                        <TableHead style={typography.label}>RESPONSE</TableHead>
                        <TableHead style={typography.label}>UNITS</TableHead>
                        <TableHead style={typography.label} className="text-right">ACTIONS</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredIncidents.map((incident) => (
                        <TableRow
                            key={incident.id}
                            style={{ borderColor: colors.background.border }}
                            className="hover:bg-white/[0.02] cursor-pointer"
                            onClick={() => setSelectedIncident(incident.id)}
                        >
                            <TableCell>
                                <div>
                                    <p style={{ ...typography.body, fontWeight: '700' }}>{incident.title}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Camera size={10} style={{ color: colors.text.muted }} />
                                        <p style={{ ...typography.caption, fontSize: '9px' }}>{incident.cameraId}</p>
                                        <Clock size={10} style={{ color: colors.text.muted }} />
                                        <p style={{ ...typography.caption, fontSize: '9px' }}>{incident.timestamp.toLocaleTimeString()}</p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <TypeBadge type={incident.incidentType} colors={colors} accent={colors.accent} />
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <MapPin size={12} style={{ color: colors.accent.primary }} />
                                    <span style={typography.caption}>{incident.location}</span>
                                </div>
                                {incident.weather && (
                                    <p style={{ ...typography.caption, fontSize: '9px', marginTop: '2px' }}>
                                        {incident.weather} · {incident.roadCondition}
                                    </p>
                                )}
                            </TableCell>
                            <TableCell>
                                <SeverityBadge severity={incident.type} colors={colors} />
                            </TableCell>
                            <TableCell>
                                <StatusBadge status={incident.status} colors={colors} />
                            </TableCell>
                            <TableCell>
                                <div>
                                    <p style={{ ...typography.body, fontWeight: '600' }}>{incident.responseTime}m</p>
                                    <p style={typography.caption}>avg</p>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex -space-x-2">
                                    {incident.assignedUnits.slice(0, 3).map((unit, i) => (
                                        <div
                                            key={i}
                                            style={{
                                                width: '24px',
                                                height: '24px',
                                                borderRadius: '20px',
                                                backgroundColor: colors.accent.primary + '20',
                                                border: `2px solid ${colors.background.sidebar}`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '8px',
                                                fontWeight: 600,
                                                color: colors.accent.primary
                                            }}
                                        >
                                            {unit.split('-')[0]}
                                        </div>
                                    ))}
                                    {incident.assignedUnits.length > 3 && (
                                        <div
                                            style={{
                                                width: '24px',
                                                height: '24px',
                                                borderRadius: '20px',
                                                backgroundColor: colors.background.elevated,
                                                border: `2px solid ${colors.background.sidebar}`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '8px',
                                                fontWeight: 600,
                                                color: colors.text.muted
                                            }}
                                        >
                                            +{incident.assignedUnits.length - 3}
                                        </div>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="sm">
                                    <Eye size={14} />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </ScrollArea>

        {/* Table Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t" style={{ borderColor: colors.background.border }}>
            <p style={typography.caption}>Showing {filteredIncidents.length} of {analytics.totalIncidents} incidents</p>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>Previous</Button>
                <Button variant="outline" size="sm" style={{ backgroundColor: colors.accent.primary + '20', color: colors.accent.primary }}>1</Button>
                <Button variant="outline" size="sm">2</Button>
                <Button variant="outline" size="sm">3</Button>
                <Button variant="outline" size="sm">Next</Button>
            </div>
        </div>
    </Card>
);
