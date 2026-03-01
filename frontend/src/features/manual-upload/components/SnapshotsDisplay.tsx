
import React from 'react';
import { Radio } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import type { DetectionResult } from '@/features/manual-upload/types/index';

interface SnapshotsDisplayProps {
    detectionResult: DetectionResult | null;
}

export const SnapshotsDisplay: React.FC<SnapshotsDisplayProps> = ({ detectionResult }) => {
    if (!detectionResult?.beforeSnapshotUrl && !detectionResult?.afterSnapshotUrl) {
        return null;
    }

    return (
        <div className="w-full animate-fade-in [animation-delay:300ms]">
            <div className="glass rounded-[32px] border border-white/5 p-8 premium-shadow overflow-hidden relative">
                {/* Decorative background for the section */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full pointer-events-none" />

                <div className="flex items-center justify-between mb-8 relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                            <Radio className="w-5 h-5 text-red-500 animate-pulse" />
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-white tracking-[0.2em] uppercase">Forensic Evidence Log</h4>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Impact Event Snapshots • Channel-A1</p>
                        </div>
                    </div>
                    <Badge variant="outline" className="glass border-white/10 text-[9px] font-black uppercase tracking-widest px-4 py-1.5 text-muted-foreground">
                        Event ID: #{detectionResult?.imageUrl?.split('/').pop()?.split('_')[0] || 'PROC-4492'}
                    </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                    {[
                        {
                            url: detectionResult.beforeSnapshotUrl,
                            label: 'Before Accident',
                            subLabel: 'Raw Evidence • T-Minus 2s',
                            tag: 'BEFORE',
                            color: 'text-blue-400',
                            borderColor: 'border-blue-500/30',
                            bgColor: 'bg-blue-500/10'
                        },
                        {
                            url: detectionResult.afterSnapshotUrl,
                            label: 'After Accident',
                            subLabel: 'AI Processed • Impact Point',
                            tag: 'AFTER',
                            color: 'text-red-500',
                            borderColor: 'border-red-500/30',
                            bgColor: 'bg-red-500/10'
                        }
                    ].map((snapshot, i) => snapshot.url && (
                        <div key={i} className="group relative rounded-[24px] overflow-hidden border border-white/5 bg-black/40 hover:border-white/20 transition-all duration-700 premium-shadow">
                            <div className={`absolute top-4 left-4 z-20 px-3 py-1 ${snapshot.bgColor} backdrop-blur-md rounded-xl text-[9px] font-black ${snapshot.color} border ${snapshot.borderColor} uppercase tracking-[0.2em]`}>
                                {snapshot.tag}
                            </div>

                            <div className="aspect-video overflow-hidden">
                                <img
                                    src={snapshot.url}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    alt={snapshot.label}
                                />
                            </div>

                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent opacity-90 group-hover:opacity-60 transition-opacity duration-700" />

                            <div className="absolute bottom-6 left-6 right-6">
                                <div className="flex flex-col gap-1">
                                    <span className={`text-[10px] font-black ${snapshot.color} uppercase tracking-[0.3em]`}>{snapshot.subLabel}</span>
                                    <h5 className="text-xl font-black text-white tracking-tight uppercase">{snapshot.label}</h5>
                                </div>
                            </div>

                            {/* Corner Accents */}
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                <div className="w-8 h-8 border-t-2 border-r-2 border-white/20 rounded-tr-lg" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
