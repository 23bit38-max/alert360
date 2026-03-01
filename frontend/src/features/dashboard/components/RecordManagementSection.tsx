import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import {
    FileText,
    Download,
    Eye,
    Archive,
    Search,
    Filter,
    FileVideo,
    FileJson,
    MoreVertical,
    ArrowRight,
    HardDrive,
    ShieldCheck,
    Activity
} from 'lucide-react';

interface Record {
    id: string;
    name: string;
    type: 'report' | 'log' | 'video' | 'data';
    size: string;
    timestamp: string;
    status: 'archived' | 'live' | 'processing';
    category: string;
}

const MOCK_RECORDS: Record[] = [
    { id: 'REC-001', name: 'INCIDENT_REPORT_ALPHA_SECTOR.PDF', type: 'report', size: '2.4 MB', timestamp: '2024-03-28 14:20', status: 'live', category: 'COLLISION' },
    { id: 'REC-002', name: 'SENSOR_DIAGNOSTICS_NODE_04.LOG', type: 'data', size: '850 KB', timestamp: '2024-03-28 13:15', status: 'archived', category: 'SENSOR_DATA' },
    { id: 'REC-003', name: 'EVIDENCE_CLIP_772A.MP4', type: 'video', size: '156 MB', timestamp: '2024-03-28 12:44', status: 'live', category: 'VISUAL_EVIDENCE' },
    { id: 'REC-004', name: 'TELEMETRY_EXPORT_Q1.JSON', type: 'data', size: '12.2 MB', timestamp: '2024-03-28 10:00', status: 'processing', category: 'INFERENCE_LOG' },
    { id: 'REC-005', name: 'DISPATCH_AUDIT_LOG_MAR28.PDF', type: 'report', size: '1.1 MB', timestamp: '2024-03-28 09:30', status: 'live', category: 'DISPATCH_AUDIT' },
];

export const RecordManagementSection: React.FC = () => {
    const getFileIcon = (type: Record['type']) => {
        switch (type) {
            case 'report': return <FileText className="text-blue-400" size={20} />;
            case 'video': return <FileVideo className="text-purple-400" size={20} />;
            case 'data': return <FileJson className="text-amber-400" size={20} />;
            default: return <FileText className="text-slate-400" size={20} />;
        }
    };

    const getStatusStyles = (status: Record['status']) => {
        switch (status) {
            case 'live': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'archived': return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
            case 'processing': return 'bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse';
            default: return 'bg-white/5 text-white/40';
        }
    };

    return (
        <Card className="glass border-white/5 rounded-[32px] overflow-hidden flex flex-col h-full shadow-2xl">
            <CardHeader className="p-8 border-b border-white/5 bg-white/[0.01]">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                            <Archive size={24} />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold tracking-tight text-white uppercase">Record Management</CardTitle>
                            <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60">
                                Centralized Detection Archive
                            </CardDescription>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="h-9 px-4 border-white/10 bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest rounded-xl">
                            <Filter size={14} className="mr-2" /> Filter
                        </Button>
                        <Button variant="outline" size="sm" className="h-9 px-4 border-white/10 bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest rounded-xl">
                            <Search size={14} className="mr-2" /> Search
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-4 px-1">
                    {[
                        { label: 'Total Files', value: '1,280', icon: FileText, color: 'text-blue-400' },
                        { label: 'Storage Used', value: '42.8 GB', icon: HardDrive, color: 'text-emerald-400' },
                        { label: 'Daily Sync', value: '99.9%', icon: Activity, color: 'text-amber-400' },
                        { label: 'Integrity', value: 'VERIFIED', icon: ShieldCheck, color: 'text-primary' }
                    ].map((stat, i) => (
                        <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors group/stat">
                            <div className="flex items-center gap-2 mb-2 opacity-40 group-hover/stat:opacity-60 transition-opacity">
                                <stat.icon size={12} className={stat.color} />
                                <span className="text-[9px] font-black uppercase tracking-[0.15em] text-muted-foreground">{stat.label}</span>
                            </div>
                            <div className="text-sm font-black text-white tracking-tight">{stat.value}</div>
                        </div>
                    ))}
                </div>
            </CardHeader>

            <ScrollArea className="flex-1">
                <div className="p-6 space-y-3">
                    {MOCK_RECORDS.map((record) => (
                        <div
                            key={record.id}
                            className="group p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between hover:bg-white/[0.05] hover:border-white/10 transition-all cursor-pointer"
                        >
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center group-hover:bg-zinc-800 transition-colors">
                                    {getFileIcon(record.type)}
                                </div>
                                <div className="min-w-0">
                                    <h4 className="text-[12px] font-bold text-white uppercase tracking-wide truncate mb-1.5 group-hover:text-primary transition-colors">
                                        {record.name}
                                    </h4>
                                    <div className="flex items-center gap-3">
                                        <Badge className={`text-[8px] font-black uppercase tracking-[0.15em] border px-2 py-0.5 rounded-md ${getStatusStyles(record.status)} shadow-sm`}>
                                            {record.status}
                                        </Badge>
                                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{record.size} • {record.category}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 ml-4">
                                <span className="hidden md:block text-[9px] font-black text-zinc-600 uppercase tracking-widest">{record.timestamp}</span>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg hover:bg-primary/10 text-primary">
                                        <Download size={14} />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg hover:bg-white/5 text-zinc-400">
                                        <Eye size={14} />
                                    </Button>
                                    <div className="h-4 w-px bg-white/10 mx-1" />
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg hover:bg-white/5 text-zinc-500">
                                        <MoreVertical size={14} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>

            <div className="p-6 border-t border-white/5 bg-black/20 flex items-center justify-between">
                <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Showing 5 of 1,280 encrypted records</p>
                <Button variant="link" className="text-[9px] font-black text-primary uppercase tracking-widest p-0 h-auto">
                    Access Master Repository <ArrowRight size={12} className="ml-1" />
                </Button>
            </div>
        </Card>
    );
};
